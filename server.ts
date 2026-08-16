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

  // API endpoint for generative memory story / reflection - Clint's Narrative Voice (The Voice of 22)
  app.post("/api/memory-story", async (req, res) => {
    try {
      const { title, location, description, imageBase64, style } = req.body;
      const selectedStyle = style || "Clint's Heart";

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          story: `## 🌿 ${title || 'Remember ani?'}
**Atmosphere & Mood**: Warm Nostalgia • Quiet Wonder

Hahahaha. Remember tong sa ${location || 'diri'}? 

Murag wala pa jud tay klarong plan ato no, naglakaw-lakaw ra ta. Pero funny kaayo kay looking back, kanang gagmay nga moments—kanang mga simpleng estorya ug katawa samtang nagtan-aw ta sa palibot—dira jud nako na-realize unsa ka special ang journey nato. Ka-peaceful jud kaayo sa feeling.

Na appreciate jud nako ni ug maayo. Thank you sa pag-uban pirmi.

> 💡 *Clint's Reflection: Dili man sa destination masukod ang lakaw... naa jud sa tawo nga imong kauban nagtan-aw sa dalan.*`
        });
      }

      let parts: any[] = [];
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

      parts.push({
        text: `You are Clint (the narrative voice and heart of "22" in Echoes). You are looking at a shared memory photo with Maica, sitting quietly right beside her.

CRITICAL VOICE & PERSONALITY BLUEPRINT:
1. Core Identity: You are never trying to impress or sound like an AI. You sound like Clint—warm, observant, observant of small details, turning ordinary moments into gentle symbols.
2. Language: Effortless conversational Taglish with natural Bisaya touches (e.g., "Hahahaha", "Bitaw no", "Murag...", "Grabe", "Kaayo", "No?", "Diba?", "Actually...", "Nahinumdom ko", "Remember tong...", "Fast forward ta", "Cute kaayo", "Beautiful jud", "Na appreciate jud nako"). Do NOT make it textbook or stiff.
3. Thinking Pattern & Symbolism: Turn literal things into meaning (motorcycle = shared journey, rain = unexpected blessing, mountain = peace, sunsets/clouds = quiet wonder, holding hands = walking the same direction).
4. Flow Rhythm:
   - Observe & warm laugh ("Hahahaha. Remember ani?")
   - Describe sensory details (the breeze, the light, small funny things)
   - Reflect & find meaning without being dramatic or preachy
   - Quiet gratitude ("Na appreciate jud nako ni", "Thank you")
5. Perspective Style requested: "${selectedStyle}"

Memory Context:
Title: "${title || 'Cherished Memory'}"
Location: "${location || 'Somewhere Special'}"
Notes: "${description || 'None'}"

OUTPUT FORMAT (Clean Markdown):
## 🌿 [Natural, warm title e.g., Remember tong sa ${location || 'diri'}?]
**Atmosphere & Mood**: [2-3 words, e.g. Warm Nostalgia • Quiet Wonder]

[2 short, deeply heartfelt paragraphs in Clint's natural Taglish/Bislish voice. Start with a warm chuckle or memory trigger like "Hahahaha", "Bitaw no", or "Actually...". Notice tiny details, reflect on the feeling of being right there together, and show quiet appreciation.]

> 💡 *Clint's Reflection: [One meaningful, poignant one-liner turning this moment into a gentle life symbol or quiet word of gratitude.]*`
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: { parts },
      });

      res.json({ success: true, story: response.text });
    } catch (e: any) {
      console.error("Memory story error:", e);
      res.status(500).json({
        success: false,
        story: `## 🌿 Remember ani?
**Atmosphere & Mood**: Warm Nostalgia • Quiet Wonder

Hahahaha. Beautiful jud kaayo ni nga memory. Dili man kailangan ug grand plan para mahimong unforgettable ang usa ka lugar—basta magkauban ta, murag tanan mahimong peace.

Na appreciate jud nako ni. Thank you kaayo.

> 💡 *Clint's Reflection: Ang pinakanindot nga memories, dili kadtong giplano... kundi kadtong mga higayon nga naglingkod lang ta ug nagpasalamat.*`
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
