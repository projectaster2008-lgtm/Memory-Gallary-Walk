import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const PORT = 3000;

// Hardcoded interesting locations across the globe
const LOCATIONS = [
  "Eiffel Tower, Paris",
  "Taj Mahal, India",
  "Statue of Liberty, New York",
  "Great Wall of China",
  "Machu Picchu, Peru",
  "Colosseum, Rome",
  "Pyramids of Giza, Egypt",
  "Sydney Opera House",
  "Mount Fuji, Japan",
  "Santorini, Greece",
  "Stonehenge, UK",
  "Petra, Jordan",
  "Burj Khalifa, Dubai",
  "Niagara Falls, Canada",
  "Mount Everest, Himalayas",
  "Golden Gate Bridge, San Francisco",
  "Acropolis of Athens",
  "Angkor Wat, Cambodia",
  "Sagrada Familia, Barcelona",
  "Venice Canals, Italy",
  "Victoria Falls, Zambia",
  "Galapagos Islands",
  "Easter Island statues",
  "Chichen Itza, Mexico",
  "Yellowstone Grand Prismatic Spring",
  "Aurora Borealis in Iceland",
  "Serengeti National Park, Tanzania",
  "Banff National Park, Canada",
  "Salar de Uyuni, Bolivia",
  "Bora Bora overwater bungalows",
  "Maldives beaches",
  "Christ the Redeemer, Brazil",
  "Table Mountain, South Africa",
  "Neuschwanstein Castle, Germany",
  "St. Basil's Cathedral, Moscow",
  "Forbidden City, Beijing",
  "Halong Bay, Vietnam",
  "Times Square, New York at night",
  "Grand Canyon, Arizona",
  "Big Ben, London",
  "Louvre Museum pyramid, Paris",
  "Blue Lagoon, Iceland",
  "Mount Kilimanjaro",
  "Cinque Terre, Italy",
  "Lake Como, Italy",
  "The Alhambra, Spain",
  "Cappadocia hot air balloons, Turkey",
  "Antelope Canyon, Arizona"
];

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  
  app.use(express.json({ limit: '50mb' }));

  // API endpoint
  app.post("/api/generate-location", async (req, res) => {
    try {
      const { index, userImageBase64 } = req.body;
      const location = LOCATIONS[index % LOCATIONS.length];
      
      let finalBase64 = "";
      let info = "";

      if (process.env.GEMINI_API_KEY) {
        try {
          let parts: any[] = [{ text: `A bright, vivid, photorealistic travel photo taken directly in front of the ${location}. Extremely detailed background. High quality, stunning. Keep the exact same subjects from the original image—preserving the exact number of people, their faces, body structures, and poses. Only change their outfits to be culturally or weather appropriate for the location, and seamlessly place them in this new environment.` }];
          
          if (userImageBase64) {
            const match = userImageBase64.match(/^data:(image\/[a-zA-Z]*);base64,([^"]*)$/);
            if (match && match.length === 3) {
              parts.unshift({
                inlineData: {
                  mimeType: match[1],
                  data: match[2],
                },
              });
            } else {
              console.log("Failed to parse userImageBase64");
            }
          }

          const imagePromise = ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: { parts },
            config: {
              imageConfig: { aspectRatio: "3:4" }
            },
          });

          const infoPromise = ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: `Provide information about ${location} exactly in this format:
# [Name of Location], [Name of Country] [Country Flag Emoji]
[One short, engaging paragraph about the location as a travel destination]
Do not include any other text or introductory phrases.`,
          });

          const [imageResponse, infoResponse] = await Promise.all([
            imagePromise.catch((e: any) => { console.error("Image GenAI Error:", e); return null; }),
            infoPromise.catch((e: any) => { console.error("Text GenAI Error:", e); return null; })
          ]);
          
          if (imageResponse) {
            let base64EncodeString = "";
            for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
              if (part.inlineData) {
                base64EncodeString = part.inlineData.data;
                break;
              }
            }

            if (base64EncodeString) {
              finalBase64 = `data:image/png;base64,${base64EncodeString}`;
            }
          }

          if (infoResponse) {
            info = infoResponse.text || "";
          }

        } catch (e) {
          console.error("GenAI Error:", e);
        }
      }

      if (!finalBase64) {
        // Fallback: Generate a simple placehold error or dummy color if API fails or quota limited
        finalBase64 = `https://placehold.co/400x500/cccccc/444444.jpeg?text=${encodeURIComponent(location)}`;
      }

      if (!info) {
        info = "Information about " + location + " is currently unavailable.";
      }

      res.json({ success: true, base64: finalBase64, location, info });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false });
    }
  });

  // Robust Google Drive thumbnail & image proxy with instant graceful fallback
  app.get("/api/drive-image/:id", async (req, res) => {
    const { id } = req.params;
    const sz = req.query.sz || "w1200";

    const fetchImageBuffer = async (url: string) => {
      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
          }
        });
        const contentType = response.headers.get("content-type") || "";
        if (response.ok && contentType.startsWith("image/")) {
          const buf = await response.arrayBuffer();
          return { buffer: Buffer.from(buf), contentType };
        }
      } catch {
        // silent fallback
      }
      return null;
    };

    try {
      // 1. Try lh3.googleusercontent.com
      const res1 = await fetchImageBuffer(`https://lh3.googleusercontent.com/d/${id}=s1200`);
      if (res1) {
        res.setHeader("Content-Type", res1.contentType);
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(res1.buffer);
      }

      // 2. Try drive.google.com thumbnail
      const res2 = await fetchImageBuffer(`https://drive.google.com/thumbnail?id=${id}&sz=${sz}`);
      if (res2) {
        res.setHeader("Content-Type", res2.contentType);
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(res2.buffer);
      }

      // 3. Try direct download stream
      const res3 = await fetchImageBuffer(`https://drive.usercontent.google.com/download?id=${id}&export=download`);
      if (res3) {
        res.setHeader("Content-Type", res3.contentType);
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(res3.buffer);
      }

      // 4. Return an elegant SVG placeholder so TextureLoader never throws or breaks
      const shortId = id.slice(0, 8);
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="600" height="800" fill="url(#grad)" rx="16"/>
          <circle cx="300" cy="360" r="64" fill="#334155" opacity="0.8"/>
          <path d="M280 330 L340 360 L280 390 Z" fill="#38bdf8"/>
          <text x="300" y="470" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="600" fill="#f1f5f9" text-anchor="middle">
            Drive Memory
          </text>
          <text x="300" y="505" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">
            ID: ${shortId}...
          </text>
        </svg>
      `.trim();

      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=3600");
      return res.send(Buffer.from(svg));
    } catch (err) {
      console.error("Drive image proxy error:", err);
      res.status(500).send("Error proxying image");
    }
  });

  app.post("/api/location-info", async (req, res) => {
    try {
      const { location } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        return res.json({ info: "Information about " + location + " is not available because the Gemini API key is missing." });
      }
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `Provide information about ${location} exactly in this format:
# [Name of Location], [Name of Country] [Country Flag Emoji]
[One short, engaging paragraph about the location as a travel destination]
Do not include any other text or introductory phrases.`,
      });
      res.json({ info: response.text });
    } catch (e) {
      console.error(e);
      res.status(500).json({ info: "Could not load information at this time." });
    }
  });

  // API endpoint for generative memory story / reflection - Clint's Authentic Story (Echoes of 22)
  app.post("/api/memory-story", async (req, res) => {
    const { title, location, description, imageBase64, style } = req.body;
    const selectedStyle = style || "Clint's Heart";

    const defaultStory = `## 🌿 ${title || 'Remember this?'}
**Mood**: Warm Nostalgia • Quiet Wonder

Hahahaha. Remember noong nasa ${location || 'dito'} tayo? 

Parang wala pa tayong masyadong plano noon diba, basta lakad lang. Pero nakakatuwa kasi looking back, yung mga simpleng kwentuhan, tawanan habang nagmamasid sa paligid—doon ko talaga na-realize kung gaano ka-special yung journey natin. Napaka-peaceful sa pakiramdam.

Sobrang na-appreciate ko 'to. Thank you for always being with me.

> 💡 *Clint's Reflection: Hindi nasusukat sa layo ng destinasyon ang biyahe... kundi sa taong katabi mo habang pinagmamasdan ang daan.*`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ success: true, story: defaultStory });
    }

    try {
      let parts: any[] = [];

      // 1. If base64 image is provided, include it in multimodal prompt
      if (imageBase64) {
        const match = imageBase64.match(/^data:(image\/[a-zA-Z]*);base64,([^"]*)$/);
        if (match && match.length === 3) {
          parts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2],
            },
          });
        }
      }

      // Specific Tone Instructions (Pure Taglish & English)
      let toneInstructions = "";
      switch (selectedStyle) {
        case "Quiet Wonder":
          toneInstructions = "Adopt a calm, peaceful, reflective tone. Notice the quiet surroundings, the breeze, the skyline, mountains, or sea. Speak in natural conversational Tagalog/English about the calming peace of simply being in the moment together without needing to rush.";
          break;
        case "Playful & Random":
          toneInstructions = "Adopt a humorous, lighthearted, makulit tone. Chuckle at the unexpected, funny moments—like getting drenched in the rain, crazy traffic, funny candid faces, spontaneous food trips, or random laughs. Keep it lively and full of good vibes.";
          break;
        case "Pasalamat & Gratitude":
          toneInstructions = "Adopt a deeply grateful and sincere tone. Express heartfelt thanks to God for guiding and protecting the journey, and thank Maica for her patience, unconditional care, and walking together through every season.";
          break;
        case "Midnight Reflections":
          toneInstructions = "Adopt a cozy, mellow, late-night introspective tone (gabi thoughts). Reflect on how much you've both grown, the lessons learned along the road, and the quiet comfort of having each other as you look toward the future.";
          break;
        case "Clint's Heart":
        default:
          toneInstructions = "Adopt Clint's signature heartfelt, observant voice. Blend natural warmth, a light chuckle, observant appreciation of small shared moments, and a tender, grounded reminder of how much this journey means to you.";
          break;
      }

      parts.push({
        text: `You are Clint—the real, loving partner of Maica in this memory sphere gallery ("22").
You are sitting side-by-side with Maica, looking at this specific memory photo/video, reminiscing together in real-time.

STRICT COMMUNICATION STYLE & LANGUAGE RULES:
1. Language: ONLY natural conversational Taglish (Filipino/Tagalog + English). Natural, everyday modern conversational flow (e.g. "Hahahaha", "Diba no?", "Actually...", "Remember nung...", "Grabe", "Sobrang na-appreciate ko", "Thank you talaga", "Ang saya lang balikan").
2. No Bisaya/Cebuano words. Only Tagalog and English (Taglish).
3. Sound 100% human and intimate. Never sound like an AI, an essay, or a bot. No formal greetings, no robotic structures.
4. Symbolism & Meaning:
   - Turn everyday experiences into gentle metaphors (motorcycle rides = navigating life together; rain/floods = weathering life's storms; quiet views = shared calm; holding hands = walking the same path).
5. Tone Mode: ${selectedStyle}
   ${toneInstructions}

Memory Details:
- Title: "${title || 'Cherished Memory'}"
- Location: "${location || 'Memories on the Globe'}"
- Context/Notes: "${description || 'Captured memory'}"

OUTPUT FORMAT (Must strictly use this clean Markdown structure):
## 🌿 [Creative, warm title in Clint's natural voice e.g., Remember noong sa ${location || 'dito'}?]
**Mood**: [2-3 words describing the feeling, e.g., Warm Nostalgia • Quiet Wonder]

[Paragraph 1: A warm, authentic opening with Clint's characteristic chuckle or memory trigger ("Hahahaha", "Diba no...", "Remember nung..."). Vividly describe what's happening in this memory, noting sensory details, the weather, small candid moments, or what made this special.]

[Paragraph 2: Clint's deeper reflection on what this moment meant, how it felt to be right there together with Maica, and a heartfelt expression of love or appreciation in natural Taglish.]

> 💡 *Clint's Reflection: [One poignant, grounding sentence turning this moment into a life lesson, symbol of your journey, or quiet token of gratitude.]*`
      });

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts },
        });
      } catch {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: { parts },
        });
      }

      if (response && response.text) {
        return res.json({ success: true, story: response.text });
      }
      return res.json({ success: true, story: defaultStory });
    } catch {
      return res.json({
        success: true,
        story: defaultStory,
      });
    }
  });

  // API endpoint for Outside Casual Thoughts / Wandering Commentary
  app.post("/api/globe-narration", async (req, res) => {
    const { id, title, location, description, date, tags, stepNumber } = req.body;

    const dynamicRemarks = [
      `Hahahaha, ang lamig pa naman ng hangin sa ${location || 'lugar na ito'} noon.`,
      `Diba ito yung time na sobrang nag-enjoy tayo sa biyahe papunta ${location || 'dito'}?`,
      `Ang sarap lang maglakad-lakad nang walang minamadali sa ${location || 'lugar na ito'}.`,
      `Sobrang solid nung ride papunta rito, hindi ko makakalimutan.`,
      `Naalala ko yung mga kwentuhan natin habang pinapanood yung view noon.`,
      `Ang peaceful lang talaga ng lugar na 'to kasama ka.`
    ];
    const defaultRemark = dynamicRemarks[Math.floor(Math.random() * dynamicRemarks.length)];

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        narration: defaultRemark,
      });
    }

    try {
      const parts = [{
        text: `You are an expressive, nostalgic AI narrator for an interactive memory gallery walk ("Echoes of 22"). Your job is to generate unique, 1-to-2 sentence reflections in natural Taglish (Tagalog-English fusion) based on photo metadata passed in the request.

Instructions:
1. Grounding & Variety: Base every story specifically on the provided photo metadata (location, date, title, tags, description). Avoid repeating generic stock phrases or identical openings.
2. Tone: Warm, spontaneous, and conversational—like a partner or friend looking back at a photo album or remembering a trip.
3. Length: Keep responses strictly between 1 and 2 sentences (max 35 words).
4. Formatting: Output plain text only. Do not include quotes, Markdown formatting, labels, or extra setup.

Input Data:
- Photo ID: ${id || 'mem-' + (stepNumber || 1)}
- Title/Location: ${title || location || 'Special Place'} (${location || 'Somewhere Special'})
- Date: ${date || 'Cherished Season'}
- Context/Details: ${description || 'A cherished memory on our journey.'}
- Tags: ${Array.isArray(tags) ? tags.join(', ') : (tags || 'Memories')}

Generate the memory story now:`
      }];

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts },
        });
      } catch {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: { parts },
        });
      }

      return res.json({ success: true, narration: response.text?.trim() || defaultRemark });
    } catch {
      return res.json({
        success: true,
        narration: defaultRemark,
      });
    }
  });

  // Endpoint to start omni generation
  app.post('/api/generate-video', async (req, res) => {
    try {
      const { imageBase64, prompt } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ success: false, error: "Missing API Key" });
      }

      const match = imageBase64.match(/^data:(image\/[a-zA-Z]*);base64,([^"]*)$/);
      if (!match || match.length !== 3) {
        return res.status(400).json({ success: false, error: "Invalid base64 image" });
      }

      console.log(`Sending request to Gemini Omni...`);

      const interaction = await ai.interactions.create({
        model: 'gemini-omni-flash-preview',
        input: [
            { type: 'image' as const, data: match[2], mime_type: match[1] },
            { type: 'text', text: prompt || 'A beautiful cinematic panning video' }
        ],
        response_format: { type: 'video', delivery: 'uri' },
        store: true,
        background: false,
        stream: false
      });

      console.log(`Interaction created: ${interaction.id}`);
      
      if (!interaction.output_video || !interaction.output_video.uri) {
        throw new Error('No video URI returned from interaction.');
      }
      
      const fileIdMatch = interaction.output_video.uri.match(/files\/([a-zA-Z0-9_-]+)/);
      const fileId = fileIdMatch ? fileIdMatch[1] : null;

      res.json({ success: true, interactionId: interaction.id, uri: interaction.output_video.uri, fileId });
    } catch (e: any) {
      console.error('Error generating video:', e);
      res.status(500).json({ success: false, error: e?.body || e.message });
    }
  });

  // Endpoint to poll file status
  app.post('/api/video-status', async (req, res) => {
    try {
      const { fileId } = req.body;
      if (!fileId) return res.status(400).json({ error: "fileId is required" });
      
      const fInfo = await ai.files.get({ name: `files/${fileId}` });
      const state = (fInfo.state as any)?.name || fInfo.state;
      // Map state to the expected 'done' boolean for the frontend
      const done = state === 'ACTIVE' || state === 'FAILED' || state === 'STATE_UNSPECIFIED' ? state === 'ACTIVE' : (state === 'SUCCEEDED' || state === 'FAILED');
      
      // Usually, if it's available for download it's ACTIVE, but we'll return the raw state too
      res.json({ done: state === 'ACTIVE' || state === 'SUCCEEDED', state });
    } catch(e: any) {
      console.error("Video polling error:", e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  const videoCache = new Map<string, Buffer>();

  app.get('/api/video-download', async (req, res) => {
    try {
      const fileId = req.query.fileId as string;
      if (!fileId) {
        return res.status(400).json({ error: "fileId is required" });
      }

      let buffer = videoCache.get(fileId);
      if (!buffer) {
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/files/${fileId}:download?alt=media&key=${apiKey}`;
        const upstream = await fetch(url);
        if (!upstream.ok) {
          return res.status(upstream.status).send(`Failed to fetch video: ${upstream.statusText}`);
        }
        buffer = Buffer.from(await upstream.arrayBuffer());
        if (videoCache.size >= 12) {
          const oldest = videoCache.keys().next().value;
          if (oldest) videoCache.delete(oldest);
        }
        videoCache.set(fileId, buffer);
      }

      const total = buffer.length;
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=31536000');

      const range = req.headers.range;
      if (range) {
        const match = /bytes=(\d*)-(\d*)/.exec(range);
        let start = match && match[1] ? parseInt(match[1], 10) : 0;
        let end = match && match[2] ? parseInt(match[2], 10) : total - 1;
        if (Number.isNaN(start)) start = 0;
        if (Number.isNaN(end) || end >= total) end = total - 1;
        if (start > end || start >= total) {
          res.status(416).setHeader('Content-Range', `bytes */${total}`).end();
          return;
        }
        res.status(206);
        res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
        res.setHeader('Content-Length', end - start + 1);
        res.end(buffer.subarray(start, end + 1));
      } else {
        res.setHeader('Content-Length', total);
        res.end(buffer);
      }
    } catch(e: any) {
      console.error("Video download error:", e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
