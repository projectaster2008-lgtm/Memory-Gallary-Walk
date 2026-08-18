import { MemoryItem } from '../types';

export interface StoryTone {
  id: string;
  label: string;
  icon: string;
}

export const STORY_TONES: StoryTone[] = [
  { id: "Clint's Heart", label: "Kwento ni Clint", icon: '💬' },
  { id: 'Quiet Wonder', label: 'Quiet Wonder', icon: '🌿' },
  { id: 'Playful & Random', label: 'Hahaha / Random', icon: '😄' },
  { id: 'Pasalamat & Gratitude', label: 'Pasalamat', icon: '✨' },
  { id: 'Midnight Reflections', label: 'Gabi Reflections', icon: '🌙' },
];

/**
 * Curated hardcoded default stories in pure conversational Taglish (Tagalog + English)
 */
export const BESPOKE_STORIES: Record<string, Record<string, string>> = {
  // Pangilatan Reconciliation Moment Video
  '1ax70qLbZOM0ktjUXIf2Hsc3AbWD83WL_': {
    "Clint's Heart": `## 🌿 Pangilatan Reconciliation Moment
**Mood**: Heartfelt Peace • Pure Gratitude

Hahahaha. Diba no, kapag napapanood ko itong video na 'to, bumabalik talaga lahat ng naramdaman ko noong araw na 'yon sa Pangilatan. Alam mo naman minsan may mga hindi pagkakaintindihan, pero sa totoo lang, nung nagkita at nag-usap tayo doon, nawala lahat ng bigat sa dibdib.

Grabe ka-special ng moment na 'to. Hindi madali pero worth it talaga kasi alam ko kung gaano ka kahalaga sa akin. Sobrang na-appreciate ko yung pag-intindi at pakikinig mo noon.

> 💡 *Clint's Reflection: Ang tunay na pagsasama hindi nasusukat sa kawalan ng tampuhan, kundi sa pusong handang magpatawad at maglakad muli nang magkasama.*`,
    'Quiet Wonder': `## 🌿 The Quiet Path of Healing
**Mood**: Serene Horizon • Gentle Grace

There is a quiet stillness in the mountains of Pangilatan that makes the loudest worries simply fade away. Looking at this moment brings back the cool fresh breeze and the peaceful realization of what truly matters.

Sometimes life asks us to slow down, listen to the silent spaces between words, and choose love all over again.

> 💡 *Clint's Reflection: In the quiet sanctuary of nature, hearts always find their way back home.*`,
    'Playful & Random': `## 🌿 Hahaha Remember Noong Pagkatapos Magtampo?
**Mood**: Kulitan • Good Vibes

Hahaha grabe yung drama noon pero tignan mo naman, pagdating sa Pangilatan naging okay din tayo agad. Parang nadala lang sa simoy ng hangin at sa ganda ng view eh!

Ang cute lang tignan ngayon kasi natatawa na lang tayo. At least may resibo tayo na kahit ano pa mangyari, solid pa rin tayo.

> 💡 *Clint's Reflection: Kahit gaano kalabo minsan, lumilinaw din ang lahat basta maayos na nag-uusap.*`,
    'Pasalamat & Gratitude': `## 🌿 Pasalamat sa Pangilatan
**Mood**: Sacred Grace • Heartfelt Gratitude

Salamat sa Panginoon sa kapayapaan na binigay sa atin noong araw na 'yon. Sa Pangilatan, na-remind ako kung gaano kahalaga ang bawat araw na magkasama tayo ni Maica.

Salamat sa pasensya mo, sa puso mo, at sa pagpiling magpatuloy kasama ako. Hinding-hindi ko 'to makakalimutan.

> 💡 *Clint's Reflection: Ang bawat sandali ng muling paglalapit ng puso ay isang regalong dapat ipagpasalamat araw-araw.*`,
  },

  // Flood Adventures 1
  '1t0B57lu98Q3anDBd47IMfiXekfeOPOEJ': {
    "Clint's Heart": `## 🌿 Wild Weather & Flood Ride
**Mood**: Adrenaline • Resilient Bond

Hahahaha! Remember nung naipit tayo sa baha habang nagbi-byahe? Grabe yung ulan noon, halos hindi na makita ang daan sa lakas ng tubig.

Pero alam mo kung ano ang pinaka-memorable doon? Kahit basang-basa na tayo at medyo delikado ang daan, hindi tayo nataranta kasi magkasama tayo. Na-enjoy pa nga natin yung adventure.

> 💡 *Clint's Reflection: Hindi lahat ng bagyo ay dumarating para manira... minsan dumarating ito para subukin at patatagin ang ating pagsasama.*`,
  },

  // Gullas Mountain Heights
  '1qYVjeokub4tqES8a5xWSJP8tUc4S7UpS': {
    "Clint's Heart": `## 🌿 Gullas Mountain Breeze & High Views
**Mood**: Mountain Freedom • Breezy Peace

Hahahaha. Ibang klase talaga yung hangin sa Gullas Mountain, ang sarap sa pakiramdam! Pagdating natin sa tuktok, parang naiwan sa baba lahat ng pagod at alalahanin.

Upo lang tayo noon, tahimik na nakatingin sa malawak na horizon. Yung simpleng pagpahinga na may mainit na kape at malamig na simoy, doon ko naramdaman kung gaano kaganda ang buhay.

> 💡 *Clint's Reflection: Sa tuktok ng bundok, mas malinaw mong makikita kung ano ang totoong mahalaga sa iyong puso.*`,
  },

  // Beach Hangout
  '1pHq63-BgmAGal8kEkl33kmFSKteWdLNB': {
    "Clint's Heart": `## 🌿 Baybayin, Alon at Gintong Araw
**Mood**: Golden Coast • Warm Solace

Hahahaha. Ang beach talaga ang pinaka-relaxing na tambayan natin diba? Yung tunog ng mga alon at ang init ng buhangin sa ating mga paa, parang pinapatigil ang oras.

Wala tayong ginawang engrande, naglakad-lakad lang tayo at nagpahangin. Pero itong mga simpleng araw na 'to ang madalas kong naaalala kapag napapagod ako.

> 💡 *Clint's Reflection: Tulad ng alon na laging bumabalik sa dalampasigan, ang puso ay laging nakakahanap ng kapayapaan sa piling ng taong mahalaga dito.*`,
  },

  // Long Rides 1
  '1Or8orG13J4pw6-gmoZjDibGDVSCfjclb': {
    "Clint's Heart": `## 🌿 Scenic Highway Long Ride
**Mood**: Open Road Freedom • Two Hearts Moving

Hahahaha! Yung pakiramdam habang tumatakbo ang motor sa open highway, malakas ang hangin sa helmet tapos naka-yakap ka sa likod—sobrang peaceful talaga!

Hindi naman importante kung saan tayo eksaktong pupunta nung ride na 'yon, ang masarap doon ay yung mismong biyahe at yung safe na paglalakbay natin. Marami pa tayong long rides na pupuntahan!

> 💡 *Clint's Reflection: Ang motor ay hindi lang sasakyan... simbolo ito ng tuloy-tuloy nating pag-abante sa buhay, magkaagapay saanman patungo ang daan.*`,
  },
};

/**
 * Curated casual roaming remarks for 3D sphere walk mode (instant, zero rate-limit)
 */
export const CASUAL_ROAMING_REMARKS: string[] = [
  "Hahahaha grabe, ang lamig pa naman ng hangin dito noon.",
  "Diba ito yung time na nagutom tayo sa biyahe pero ang saya pa rin?",
  "Ang peaceful lang talaga ng lugar na 'to, sarap balikan.",
  "Sobrang solid nung ride papunta rito, hindi ko makakalimutan.",
  "Naalala ko yung tawa mo rito nung muntik tayong maligaw.",
  "Ang ganda ng lighting dito sa picture, parang pelikula.",
  "Isa 'to sa mga paborito kong lakad kasama ka.",
  "Kahit gaano kalayo ang biyahe, ang bilis ng oras kapag magkasama tayo.",
  "Sarap magkape habang pinapanood yung view noon.",
  "Dito ko na-realize kung gaano kasarap maglakad-lakad nang walang minamadali.",
  "Tignan mo yung ulap dito, ang ganda ng hugis.",
  "Ang saya balikan ng mga simpleng araw na 'to.",
];

export function getQuickRoamingRemark(memory: Partial<MemoryItem>): string {
  const loc = (memory.location || '').toLowerCase();
  const title = (memory.title || '').toLowerCase();

  if (loc.includes('pangilatan') || title.includes('pangilatan')) {
    const list = [
      "Hahahaha sarap ng simoy ng hangin sa Pangilatan, napaka-peaceful.",
      "Sobrang ganda ng view dito sa ridge ng Pangilatan, walang kapantay.",
      "Isa sa pinakamakabuluhang araw natin sa Pangilatan 'to.",
    ];
    return list[Math.floor(Math.random() * list.length)];
  }

  if (loc.includes('gullas') || title.includes('gullas')) {
    return "Malamig ang hangin sa Gullas Mountain, sarap magpahinga habang nakatanaw sa malayo.";
  }

  if (loc.includes('flood') || title.includes('flood')) {
    return "Hahaha grabe yung baha noon! Basang-basa tayo pero tawa pa rin tayo nang tawa.";
  }

  if (loc.includes('ride') || title.includes('ride') || memory.isVideo) {
    return "Sobrang sarap ng pakiramdam sa open highway habang umaandar ang motor.";
  }

  if (loc.includes('beach') || loc.includes('coast') || title.includes('beach')) {
    return "Yung tunog ng mga alon at hangin sa dagat, sobrang nakaka-relax talaga.";
  }

  return CASUAL_ROAMING_REMARKS[Math.floor(Math.random() * CASUAL_ROAMING_REMARKS.length)];
}

/**
 * Returns a rich, tailored default story in Clint's conversational Taglish voice
 */
export function getHardcodedStory(memory: Partial<MemoryItem>, tone = "Clint's Heart"): string {
  const fileId =
    memory.driveFileId ||
    (memory.id || '').replace('drive-', '') ||
    (memory.imageUrl || '').match(/drive-image\/([^/?]+)/)?.[1] ||
    (memory.imageUrl || '').match(/\/d\/([^/?=]+)/)?.[1] ||
    '';

  // 1. Check bespoke exact match
  if (fileId && BESPOKE_STORIES[fileId] && BESPOKE_STORIES[fileId][tone]) {
    return BESPOKE_STORIES[fileId][tone];
  }
  if (fileId && BESPOKE_STORIES[fileId] && BESPOKE_STORIES[fileId]["Clint's Heart"]) {
    return BESPOKE_STORIES[fileId]["Clint's Heart"];
  }

  const title = memory.title || 'Special Moment';
  const location = memory.location || 'Echoes Memory';
  const isVideo = memory.isVideo;

  // 2. Location specific defaults
  if (location.toLowerCase().includes('pangilatan') || title.toLowerCase().includes('pangilatan')) {
    if (tone === 'Quiet Wonder') {
      return `## 🌿 The Quiet Sanctuary of Pangilatan
**Mood**: Mountain Serenity • Pure Solace

High in the ridges of Pangilatan, sunlight filters through the canopy in delicate rays. Every trail holds a quiet stillness that invites you to take a deep breath.

Standing here together, surrounded by the emerald landscape, you realize how precious these peaceful moments truly are.

> 💡 *Clint's Reflection: Nature does not hurry, yet everything is accomplished. Some places teach us how to simply be present together.*`;
    }
    if (tone === 'Playful & Random') {
      return `## 🌿 Hahaha Adventure Moments sa Pangilatan!
**Mood**: Adventure Vibes • Good Laughs

Hahahaha! Remember nung umakyat tayo rito? Parang hingal na hingal tayo sa ahon, pero pagdating sa tuktok nawala lahat ng pagod kasi sobrang ganda ng view!

Pang-wallpaper yung lighting noon diba? Akala ko magrereklamo ka sa layo, pero game na game ka. Galing talaga!

> 💡 *Clint's Reflection: Kahit nakakapagod ang ahon, nagiging madali ang lakad basta may kasama kang palaging nagpapatawa.*`;
    }
    if (tone === 'Pasalamat & Gratitude') {
      return `## 🌿 Pasalamat sa mga Lakad sa Pangilatan
**Mood**: Sincere Thanks • Peaceful Sanctuary

Sobrang nagpapasalamat ako sa Panginoon sa kapayapaan na naramdaman natin dito sa Pangilatan. Sa gitna ng busy nating buhay, ang mga ganitong araw ang nagbibigay sa atin ng bagong lakas.

Salamat Maica sa pagsama palagi sa mga lakad at rides ko. Sobrang na-appreciate ko 'to.

> 💡 *Clint's Reflection: Ang kapayapaan sa kalikasan ay paalala na pinangangalagaan at ginagabayan tayo sa bawat hakbang ng ating paglalakbay.*`;
    }
    return `## 🌿 ${title}
**Mood**: Pangilatan Ridge • Warm Memories

Hahahaha. Remember nung pumunta tayo rito sa ${location}? Napakasarap ng hangin noon tapos maliwanag ang araw pero hindi mainit sa balat kasi malamig ang paligid.

Kahit naglalakad-lakad lang tayo sa trail, yung mga simpleng kwentuhan natin habang pinagmamasdan ang bundok, doon ko talaga na-realize kung gaano kaganda ang mga ganitong panahon. Sobrang na-appreciate ko ang company mo.

> 💡 *Clint's Reflection: Ang pinakamagandang adventure hindi yung pinakamalayo, kundi yung lugar kung saan tahimik at payapa kayong magkasama.*`;
  }

  if (location.toLowerCase().includes('gullas') || title.toLowerCase().includes('gullas')) {
    return `## 🌿 ${title}
**Mood**: Cool Mountain Ridge • Fresh Air

Hahahaha. Ang Gullas Mountain ride talaga natin ang isa sa pinaka-relaxing na escape. Yung malamig na simoy habang nakatingin tayo sa city lights mula sa itaas, parang napakalayo sa lahat ng ingay at alalahanin.

Ang sarap mag-unwind dito habang nagpapatugtog ng acoustic songs at nag-uusap tungkol sa mga pangarap natin sa hinaharap.

> 💡 *Clint's Reflection: Sa pinakamataas na lugar, mas malinaw mong makikita kung ano ang totoong mahalaga sa iyong puso.*`;
  }

  if (location.toLowerCase().includes('flood') || title.toLowerCase().includes('flood')) {
    return `## 🌿 ${title}
**Mood**: Wild Adventure • Wet & Wild Journey

Hahaha! Grabe yung baha noong araw na 'yon! Kahit basang-basa na ang sapatos natin at malakas ang ulan, tawa pa rin tayo nang tawa kasi parang eksena sa pelikula.

Sobrang tibay natin noon. Kahit anong dumaan na baha o unos, basta nagtutulungan tayo, nalalampasan natin ang lahat.

> 💡 *Clint's Reflection: Lilipas din ang baha, ngunit ang tapang at tawanan habang lumulusong tayo ay mananatili magpakailanman.*`;
  }

  if (location.toLowerCase().includes('ride') || title.toLowerCase().includes('ride') || isVideo) {
    return `## 🌿 ${title}
**Mood**: Open Highway • Moving Forward

Hahahaha. Ang sarap talaga ng pakiramdam sa long ride diba? Yung tunog ng makina, yung simoy ng hangin, at yung malawak na kalsada sa ating harapan.

Simbolo talaga 'to ng buhay natin—tuloy-tuloy lang sa pagbiyahe, i-enjoy ang bawat kurbada ng daan, at huwag kalimutang pahalagahan ang ganda ng paligid.

> 💡 *Clint's Reflection: Hindi sa bilis ng takbo nasusukat ang biyahe, kundi sa kapayapaan ng puso habang nakatingin sa hinaharap.*`;
  }

  // Universal fallback in Clint's natural Taglish
  if (tone === 'Quiet Wonder') {
    return `## 🌿 ${title}
**Mood**: Quiet Wonder • Timeless Grace

There is an unspoken beauty in this moment. The light falls softly across the frame, capturing a fleeting second in time that now lives forever in our memories.

Moments like these remind us to be still, to look around, and to cherish the quiet blessings that surround our path every single day.

> 💡 *Clint's Reflection: Sometimes the quietest moments echo the loudest in the chambers of our hearts.*`;
  }

  if (tone === 'Playful & Random') {
    return `## 🌿 ${title}
**Mood**: Random Laughs • Candid Snapshot

Hahahaha! Ano nga ulit yung pinag-uusapan natin dito? Medyo nakalimutan ko na yung eksaktong detalye pero alam kong sobrang nag-enjoy tayo noon!

Ito talaga ang maganda sa mga candid pictures—hindi scripted, hindi pilit, natural na natural lang ang good vibes.

> 💡 *Clint's Reflection: Ang pinaka-cute na memories ay yung mga simpleng tawanan na hindi pinlano.*`;
  }

  if (tone === 'Pasalamat & Gratitude') {
    return `## 🌿 ${title}
**Mood**: Heartfelt Gratitude • Deep Appreciation

Salamat sa Panginoon sa bawat pagkakataon at alaala na ipinagkaloob sa atin. Ang bawat litrato ay patunay ng biyaya ng buhay, pagmamahalan, at pagsasama.

Sobrang na-appreciate ko ang bawat lakad, bawat kwentuhan, at bawat araw na magkasama tayo. Maraming salamat Maica.

> 💡 *Clint's Reflection: Ang pasasalamat ay nagpapakita na ang lahat ng meron tayo ay sapat at higit pa sa sapat.*`;
  }

  // Standard Clint's Heart Default
  return `## 🌿 ${title}
**Mood**: Warm Nostalgia • Clint's Story

Hahahaha. Remember noong nasa ${location} tayo? 

Parang wala pa tayong masyadong plano noon diba, basta lakad lang tayo. Pero nakakatuwa kasi looking back, yung mga simpleng kwentuhan at tawanan habang pinagmamasdan ang paligid—doon ko talaga na-realize kung gaano ka-special ang journey natin. Napaka-peaceful sa pakiramdam.

Sobrang na-appreciate ko 'to. Thank you for always being by my side.

> 💡 *Clint's Reflection: Hindi nasusukat sa layo ng destinasyon ang biyahe... kundi sa taong katabi mo habang pinagmamasdan ang daan.*`;
}
