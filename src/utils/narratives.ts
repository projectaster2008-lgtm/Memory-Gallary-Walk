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
];

/**
 * Curated hardcoded stories tailored to specific moments, videos, and locations.
 */
export const BESPOKE_STORIES: Record<string, Record<string, string>> = {
  // Pangilatan Reconciliation Moment Video
  '1ax70qLbZOM0ktjUXIf2Hsc3AbWD83WL_': {
    "Clint's Heart": `## 🌿 Pangilatan Reconciliation Moment
**Atmosphere & Mood**: Heartfelt Peace • Pure Gratitude

Hahahaha. Bitaw no, kanang makatan-aw ko ani nga video, murag mubalik jud tanan ang gibati ato nga adlaw sa Pangilatan. Kahibalo ka nang usahay naay mga dili pagsinabtanay, pero sa tinuod lang, kadtong pagkita ug pag-istorya nato didto, nawala tanan ang bug-at sa dughan.

Grabe ka special ani nga higayon. Dili lalim pero worth it kaayo kay kahibalo ko unsa ka importante ka para nako. Na appreciate jud nako imong pagsabot ug pagpaminaw ato.

> 💡 *Clint's Reflection: Ang tinuod nga panag-uban dili masukod sa walay away, kundi sa kasingkasing nga andam mopasaylo ug maglakaw pag-usab nga magkauban.*`,
    'Quiet Wonder': `## 🌿 The Quiet Path of Healing
**Atmosphere & Mood**: Serene Horizon • Gentle Grace

There is a quiet stillness in the mountains of Pangilatan that makes the loudest worries simply fade away. Watching this moment brings back the fresh breeze and the quiet realization of what truly endures.

Sometimes life asks us to slow down, listen to the silent spaces between words, and choose love all over again.

> 💡 *Clint's Reflection: In the quiet sanctuary of nature, hearts always find their way back home.*`,
    'Playful & Random': `## 🌿 Hahaha Remember Pagkahuman sa Away?
**Atmosphere & Mood**: Kulitan • Good Vibes Only

Hahaha grabe jud to nga drama pero tan-awa ra, pag-abot sa Pangilatan nanga-okay ra diay gihapon ta. Murag nadala ra sa kabugnaw sa hangin ug sa kalami sa talan-awon ba!

Cute kaayo tan-awon karon kay makatawa nalang ta. At least naa tay resibo nga maski unsa pay mahitabo, solid gihapon ta.

> 💡 *Clint's Reflection: Bisan unsa pa kalubog ang sabaw, magka-clear ra gihapon basta magka-storya ug tarong.*`,
    'Pasalamat & Gratitude': `## 🌿 Pasalamat sa Pangilatan
**Atmosphere & Mood**: Sacred Grace • Undying Appreciation

Salamat kaayo Ginoo sa higayon nga natagaan ta ug peace ato nga adlaw. Sa Pangilatan, na-remind ko unsa ka bililhon ang panag-uban nato ni Maica.

Salamat sa imong pasensya, sa imong kasingkasing, ug sa pagpili nga mag-uban gihapon ta sa unahan. Dili nako ni makalimtan.

> 💡 *Clint's Reflection: Ang matag higayon nga magkauli ang kasingkasing, usa ka gasa nga angay ipasalamat adlaw-adlaw.*`,
  },

  // Flood Adventures 1
  '1t0B57lu98Q3anDBd47IMfiXekfeOPOEJ': {
    "Clint's Heart": `## 🌿 Wild Weather & Torrential Waters
**Atmosphere & Mood**: Adrenaline • Resilient Bond

Hahahaha! Remember tong baha samtang nagbyahe ta? Grabe to nga uwan, murag halos dili na makita ang dalan sa kakusog sa agas sa tubig. 

Pero kahibalo ka unsa ang pinaka-memorable ato? Bisan basa na kaayo ta ug medyo kuyaw ang dalan, wala jud ta nagkabalaka kay magkauban man ta. Na-enjoy pa gani nato ang kalisod sa byahe.

> 💡 *Clint's Reflection: Dili tanang uwan nagdalag unos... usahay gasa kini aron testingan ug palig-unon ang atong panaw.*`,
  },

  // Gullas Mountain Heights
  '1qYVjeokub4tqES8a5xWSJP8tUc4S7UpS': {
    "Clint's Heart": `## 🌿 Gullas Mountain Breeze & High Views
**Atmosphere & Mood**: Mountain Freedom • Breezy Peace

Hahahaha. Kanang hangin sa Gullas Mountain jud ba, lahi ra kaayo ang freshness! Pag-abot nato sa ibabaw, murag nahibilin sa ubos ang tanang kapoy ug huna-huna.

Naglingkod ra ta ato, nagtan-aw sa layo nga horizon. Kanang simpleng pagpahuway nga naay kape ug bugnaw nga hangin, dira nako na-feel unsa ka nindot ang kinabuhi.

> 💡 *Clint's Reflection: Sa kinatumyan sa bukid, imong maamgohan nga ang pinakanindot nga view mao kadtong naay kauban ka nga magpabilin bisan unsa pa katungas ang dalan.*`,
  },

  // Beach Hangout
  '1pHq63-BgmAGal8kEkl33kmFSKteWdLNB': {
    "Clint's Heart": `## 🌿 Baybayon, Balod ug Bulawanong Adlaw
**Atmosphere & Mood**: Golden Coast • Warm Solace

Hahahaha. Ang beach jud ang pinaka-relaxing nga tambayan no? Kadtong tingog sa balod ug ang init sa balas sa atong mga tiil, murag nagpahunong sa oras.

Wala tay gibuhat nga grand, naglakaw-lakaw ra ta ug nagpabugnaw. Pero kanang mga ing-ani nga adlaw ang pirmi nako hinumduman kung kapoyon ko sa adlaw-adlaw nga trabaho.

> 💡 *Clint's Reflection: Sama sa balod nga mubalik kanunay sa baybayon, ang kasingkasing kanunay makakaplag og kalinaw sa lugar diin kini gipangga.*`,
  },

  // Long Rides 1
  '1Or8orG13J4pw6-gmoZjDibGDVSCfjclb': {
    "Clint's Heart": `## 🌿 Scenic Highway Long Ride
**Atmosphere & Mood**: Open Road Freedom • Two Hearts Moving

Hahahaha! Kanang feeling samtang nagdagan ang motor sa open highway, kusog ang hangin sa helmet unya gakos ka sa likod—grabe ka peaceful!

Dili man importante asa ta padulong jud ato nga ride, ang lami ato kay ang dalan mismo ug ang kahapsay sa atong byahe. Fast forward ta sa daghan pa nga long rides sa unahan!

> 💡 *Clint's Reflection: Ang motor dili lang sakyanan... simbolo kini sa atong pagpadayon sa unahan, abaga sa abaga, bisan asa pa padulong ang dalan.*`,
  },
};

/**
 * Returns a rich, tailored default story in Clint's conversational voice
 * for any given memory and tone.
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

  // 2. Category & Location specific tailored generation
  if (location.toLowerCase().includes('pangilatan') || title.toLowerCase().includes('pangilatan')) {
    if (tone === 'Quiet Wonder') {
      return `## 🌿 The Quiet Sanctuary of Pangilatan
**Atmosphere & Mood**: Mountain Serenity • Pure Solace

High in the verdant ridges of Pangilatan, sunlight filters through the canopy in delicate rays. Every leaf and trail feels untouched, holding a quiet stillness that invites you to breathe deeply.

Standing here together, surrounded by the expanse of emerald hills, you realize how precious these tranquil pauses in life truly are.

> 💡 *Clint's Reflection: Nature does not hurry, yet everything is accomplished. Some places teach us how to simply be present together.*`;
    }
    if (tone === 'Playful & Random') {
      return `## 🌿 Hahaha Katkat Moments sa Pangilatan!
**Atmosphere & Mood**: Adventure Vibes • Good Laughs

Hahahaha! Remember tong pagsaka nato diri? Murag hapit na ta mahutdan ug hangin sa tungas, pero pag-abot sa taas nawala tanang kapoy kay pwerting nindota sa view!

Pang-picture kaayo ang lighting ato no. Abi nakog mag-reklamo ka sa kalayo, pero game kaayo ka. Idol jud!

> 💡 *Clint's Reflection: Bisan kapoy ang tungason, dali ra kaayo ang lakaw basta naay kauban nga sige'g pakatawa.*`;
    }
    if (tone === 'Pasalamat & Gratitude') {
      return `## 🌿 Pasalamat sa mga Lakaw sa Pangilatan
**Atmosphere & Mood**: Sincere Thanks • Peaceful Sanctuary

Dako kaayo akong pasalamat sa Ginoo sa kalinaw nga atong nasinati diri sa Pangilatan. Sa tunga sa ka-busy sa kinabuhi, kining mga adlawa ang naghatag nato ug kusog ug kalinaw.

Salamat Maica sa pag-uban pirmi sa akong mga lakaw ug rides. Na appreciate jud nako ni ug dako kaayo.

> 💡 *Clint's Reflection: Ang kalinaw sa kinaiyahan usa ka pahinumdom nga gipangga ug giyahan kita sa matag lakang sa atong panaw.*`;
    }
    return `## 🌿 ${title}
**Atmosphere & Mood**: Pangilatan Ridge • Warm Memories

Hahahaha. Remember tong pag-adto nato diri sa ${location}? Nindot kaayo ang hangin ato unya hayag ang adlaw pero dili init sa panit kay bugnaw ang palibot.

Bisan naglakaw-lakaw ra ta sa trail, kanang mga simpleng estorya nato samtang nagtan-aw sa bukid, dira jud nako na-realize unsa ka nindot ning mga panahona. Na appreciate jud nako imong company ato.

> 💡 *Clint's Reflection: Ang pinakanindot nga adventure dili kadtong pinakalayo, kundi kadtong lugar diin magkauban ta nga malinawon.*`;
  }

  if (location.toLowerCase().includes('gullas') || title.toLowerCase().includes('gullas')) {
    return `## 🌿 ${title}
**Atmosphere & Mood**: Cool Mountain Ridge • Fresh Air

Hahahaha. Ang Gullas Mountain ride jud nato pirmi ang pinaka-relaxing nga escape. Kadtong bugnaw nga hangin samtang nagtan-aw ta sa syudad gikan sa ibabaw, murag layo kaayo sa tanang kagul-anan.

Lami kaayo mag-relax diri samtang nagpaminaw sa acoustic songs ug nag-estorya sa atong mga plano sa unahan.

> 💡 *Clint's Reflection: Sa kinatas-ang dapit, mas klaro nimong makita kung unsa ang tinuod nga bililhon sa imong kasingkasing.*`;
  }

  if (location.toLowerCase().includes('flood') || title.toLowerCase().includes('flood')) {
    return `## 🌿 ${title}
**Atmosphere & Mood**: Wild Adventure • Wet & Wild Journey

Hahaha! Grabe to nga baha ato nga adlaw! Bisan basa na kaayo atong mga sapatos ug nag-ulan ug kusog, sige ra gihapon tag katawa kay murag salida sa sine atong sitwasyon.

Resilient kaayo ta ato. Maski unsa pay agian nga baha o unos, basta magtinabangay, malutsan ra jud tanan.

> 💡 *Clint's Reflection: Ang baha mulabay ra, apan ang kaisog ug katawa samtang nilabang ta sa tubig magpabilin sa kasingkasing.*`;
  }

  if (location.toLowerCase().includes('ride') || title.toLowerCase().includes('ride') || isVideo) {
    return `## 🌿 ${title}
**Atmosphere & Mood**: Open Highway • Moving Forward

Hahahaha. Lami jud kaayo ang feeling sa long ride no? Ang tunog sa tambutso, ang hangin, ug ang open highway sa atong atubangan.

Murag timailhan jud ni sa atong kinabuhi—padayon lang sa pagbiyahe, enjoyon ang matag kurbada sa dalan, ug dili kalimtan ang paglingi sa kaanindot sa palibot.

> 💡 *Clint's Reflection: Dili sa katulin sa dagan masukod ang byahe, kundi sa kalinaw sa imong kasingkasing samtang nagtan-aw sa unahan.*`;
  }

  // Summer, Twilight, November & Random Moments
  if (title.toLowerCase().includes('twilight') || title.toLowerCase().includes('sunset') || title.toLowerCase().includes('dusk')) {
    return `## 🌿 ${title}
**Atmosphere & Mood**: Twilight Glow • Golden Horizon

Hahahaha. Tan-awa ra ang kolor sa langit ato nga higayon—kanang orange nga nisagol sa purpura samtang nagkaduol ang gabii.

Makapahinumdom jud nga bisan matapos ang adlaw, naay kaanindot nga mahabilin. Salamat sa pagtan-aw sa sunset kauban nako.

> 💡 *Clint's Reflection: Ang pagsalop sa adlaw usa ka pahalipay sa usa ka adlaw nga gihatag kanato, ug saad sa bag-ong buntag ugma damlag.*`;
  }

  // Default universal warm Clint's voice
  if (tone === 'Quiet Wonder') {
    return `## 🌿 ${title}
**Atmosphere & Mood**: Quiet Wonder • Timeless Grace

There is an unspoken beauty in this moment. The light falls softly across the frame, capturing a fleeting second in time that now lives forever in our memories.

Moments like these remind us to be still, to look around, and to cherish the quiet blessings that surround our path every single day.

> 💡 *Clint's Reflection: Sometimes the quietest moments echo the loudest in the chambers of our hearts.*`;
  }

  if (tone === 'Playful & Random') {
    return `## 🌿 ${title}
**Atmosphere & Mood**: Random Laughs • Candid Snapshot

Hahahaha! Unsa gani to atong gi-estoryahan diri? Nakalimot na ko sa detalye pero kahibalo ko nga nalingaw jud ta ato!

Mao jud ni ang nindot sa candid photos—dili scripted, dili pilit, natural ra jud kaayo nga good vibes.

> 💡 *Clint's Reflection: Ang pinakacute nga memories mao kadtong mga ginagmayng katawa nga wala gi-plano.*`;
  }

  if (tone === 'Pasalamat & Gratitude') {
    return `## 🌿 ${title}
**Atmosphere & Mood**: Heartfelt Gratitude • Deep Appreciation

Salamat sa Ginoo sa matag higayon ug panumduman nga gitugot kanato. Ang matag hulagway nagrepresentar sa gasa sa kinabuhi, gugma, ug panag-uban.

Na appreciate jud nako ang matag lakaw, matag estorya, ug matag adlaw nga magkauban ta. Daghang salamat Maica.

> 💡 *Clint's Reflection: Ang pasalamat naghimo sa kung unsa ang anaa kanato nga mahimong igo ug labaw pa sa igo.*`;
  }

  // Standard Clint's Heart Default
  return `## 🌿 ${title}
**Atmosphere & Mood**: Warm Nostalgia • Clint's Voice

Hahahaha. Remember tong sa ${location}? 

Murag wala pa jud tay klarong plan ato no, naglakaw-lakaw ra ta. Pero funny kaayo kay looking back, kanang gagmay nga moments—kanang mga simpleng estorya ug katawa samtang nagtan-aw ta sa palibot—dira jud nako na-realize unsa ka special ang journey nato. Ka-peaceful jud kaayo sa feeling.

Na appreciate jud nako ni ug maayo. Thank you sa pag-uban pirmi.

> 💡 *Clint's Reflection: Dili man sa destination masukod ang lakaw... naa jud sa tawo nga imong kauban nagtan-aw sa dalan.*`;
}
