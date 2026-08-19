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
 * Rich, bespoke stories written uniquely for each individual photo and memory in the collection.
 * Keyed by Google Drive fileId.
 */
export const BESPOKE_STORIES: Record<string, Record<string, string>> = {
  // 1. Pangilatan Reconciliation Moment Video
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
    'Midnight Reflections': `## 🌙 Tahimik na Gabi Pagkatapos ng Pangilatan
**Mood**: Midnight Stillness • Deep Truth

Tuwing gabi kapag tahimik ang paligid, itong alaala sa Pangilatan ang nagpapaalala sa akin kung gaano kasuwerte ang puso ko na may kasamang handang magpakumbaba at umunawa.

Napakasarap matulog nang mapayapa ang kalooban dahil alam mong buo kayo sa bawat pagsubok.

> 💡 *Clint's Reflection: Ang kapayapaan sa gabi ay bunga ng pagpapatawad sa araw.*`,
  },

  // 2. Flood Moment 1
  '1t0B57lu98Q3anDBd47IMfiXekfeOPOEJ': {
    "Clint's Heart": `## 🌧️ Wild Weather & Torrential Flood Ride
**Mood**: Adrenaline • Resilient Bond

Hahahaha! Naalala mo ba nung biglang bumuhos ang malakas na ulan at rumagasa ang baha habang nasa biyahe tayo? Grabe yung kaba pero noong nakita kong kalmado ka sa likod, nawala yung takot ko.

Basang-basa ang sapatos at gamit natin pero paglingon ko, nakangiti ka pa rin. Doon ko napatunayan na kahit anong unos ang dumating, basta magkaagapay tayo, kayang-kaya lusungin.

> 💡 *Clint's Reflection: Hindi lahat ng bagyo ay dumarating para manira... minsan dumarating ito para patatagin ang kapit natin sa isa't isa.*`,
    'Playful & Random': `## 🌊 Swimming with the Motor Moments!
**Mood**: Basang-Basa • Pure Tawanan

Hahahaha! Akala ko motor lang dala natin, biglang naging jet ski pala sa lalim ng baha! Grabe yung tawa natin nung pumasok na yung tubig sa medyas.

Kahit mukha na tayong basang sisiw noon, proud pa rin ako na hindi tayo nag-panic. One for the books talaga 'tong ride na 'to!

> 💡 *Clint's Reflection: Kapag basang-basa ka na, wala ka nang choice kundi tawanan na lang ang bagyo.*`,
    'Quiet Wonder': `## 🌧️ The Roar of Falling Rain
**Mood**: Raw Nature • Unspoken Trust

Listening to the torrents of rain rushing across the tarmac that afternoon was both humbling and unforgettable. In the midst of nature's relentless power, our little bubble remained warm and safe.

> 💡 *Clint's Reflection: In the wildest storms, a trusted companion is the only anchor you will ever need.*`,
    'Pasalamat & Gratitude': `## ✨ Ligtas sa Gitna ng Bagyo
**Mood**: Safe Arrival • Pure Thanks

Salamat sa Diyos dahil ligtas Niya tayong inuwi mula sa mapanganib na daan noong araw na 'yon. Isang patunay na palagi tayong may gabay saan man tayo magtungo.

> 💡 *Clint's Reflection: Ang kaligtasan sa bawat biyahe ay biyayang hindi dapat kalimutan ipagpasalamat.*`,
    'Midnight Reflections': `## 🌙 Memories of the Storm
**Mood**: Midnight Reminiscence • Warm Heart

Kapag umuulan sa gabi, palagi kong naaalala yung baha ride natin. Yung lamig ng ulan at yung init ng yakap mo habang nagmamaneho ako pauwi.

> 💡 *Clint's Reflection: The coldest rains bring out the warmest memories.*`,
  },

  // 3. Flood Moment 2
  '1Ia4E1bQxsPltOIZFz_JFnQXD6W-0OjGT': {
    "Clint's Heart": `## 🌊 Rising Currents & Teamwork
**Mood**: Courage • Togetherness

Hahahaha! Ito yung part na tumataas na talaga yung tubig sa kalsada. Sabi ko sa sarili ko, kailangan dahan-dahan lang ang silinyador para hindi pumasok ang tubig sa tambutso.

Napakagaling mo kasi imbes na magreklamo, nag-navigate ka pa at binabantayan mo yung mga lubak sa gilid. Teamwork talaga!

> 💡 *Clint's Reflection: Kapag malalim ang tubig, ang tiwala sa kasama ang nagsisilbing tulay.*`,
    'Playful & Random': `## 🛵 Baha Grand Prix!
**Mood**: Hahaha • Survivor Mode

Hahaha! Yung itsura natin dito parang sasali sa underwater obstacle course! Sobrang kabado sa makina pero tawa nang tawa sa isa't isa.

> 💡 *Clint's Reflection: Mas masaya ang adventure kapag may kaunting thrill at maraming tawanan.*`,
    'Quiet Wonder': `## 🌿 The Strength in Shared Silence
**Mood**: Steady Resolve • Calm Focus

Navigating through rising currents required absolute focus. Yet between us, there was an effortless synchrony—a steady rhythm born from understanding and shared resolve.

> 💡 *Clint's Reflection: Courage isn't the absence of fear, but pressing forward together despite the depth.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa Lakas ng Loob
**Mood**: Deep Sincerity • Grateful Soul

Nagpapasalamat ako sa tapang at tiwala na ibinigay mo sa akin noong lumulusong tayo sa tubig. Salamat sa pagiging kalmado mo palagi.

> 💡 *Clint's Reflection: Ang tiwala ng taong mahal mo ang pinakamalaking lakas na maaari mong tanganan.*`,
    'Midnight Reflections': `## 🌙 Gabay sa Gitna ng Dilim
**Mood**: Quiet Contemplation

Naalala ko nung makalagpas tayo sa bahaging ito, parang gumaan ang buong mundo. Ganito rin sa buhay—basta tuloy lang ang andar, makakarating din sa tuyong lupa.

> 💡 *Clint's Reflection: Walang baha na hindi humuhupa, walang dilim na hindi nagliliwanag.*`,
  },

  // 4. Flood Moment 3
  '1FttW1UtcHqF0H0fbrCly3fBRDZVD4F5t': {
    "Clint's Heart": `## 🌤️ Aftermath & Safe Passage
**Mood**: Relief • Sweet Victory

Hahahaha! Sa wakas, nakalagpas din tayo sa pinakamalalim na parte ng baha! Yung relief noong makakita tayo ng tuyong semento, grabe, parang nanalo tayo sa karera.

Nung huminto tayo para magpagpag ng tubig, doon tayo nagsimulang magtawanan nang todo. Ang sarap balikan nung pakiramdam na nalampasan natin nang sama-sama.

> 💡 *Clint's Reflection: Ang pinakamasarap na pakiramdam ay ang lumingon sa pinagdaanan at makitang buo pa rin kayo pagkatapos ng bagyo.*`,
    'Playful & Random': `## 🧦 Tuyong Medyas sa Wakas!
**Mood**: Kulit • Big Smiles

Hahaha! Yung sapatos natin noon literal na tumutulo pa ng tubig pero yung ngiti abot hanggang tainga! Sabi ko sa'yo kaya natin eh.

> 💡 *Clint's Reflection: Ang pinakamagandang souvenir mula sa bagyo ay ang kwentong matatawanan niyo habang buhay.*`,
    'Quiet Wonder': `## 🌿 The Still Air After Rain
**Mood**: Fresh Ozone • Peaceful Earth

The smell of wet asphalt and cool mountain mist following the heavy storm was intoxicatingly pure. The sky opened up, offering a gentle glimpse of soft afternoon light.

> 💡 *Clint's Reflection: The sweetest clarity always follows the fiercest downpour.*`,
    'Pasalamat & Gratitude': `## ✨ Salamat sa Bawat Ligtas na Pag-uwi
**Mood**: Humble Prayer • Thankful Heart

Taos-pusong pasasalamat sa bawat ligtas na biyahe. Ang bawat pag-uwi natin nang walang galos ay patunay ng walang sawang pag-iingat sa atin ng Maykapal.

> 💡 *Clint's Reflection: Ang pinakamagandang destinasyon sa bawat biyahe ay ang makauwi nang ligtas.*`,
    'Midnight Reflections': `## 🌙 Panatag na Puso
**Mood**: Restful Solace

Sa bawat pag-alala ko sa flood ride na 'to, napapangiti ako. Kasi napatunayan natin na matibay tayo at walang makakatibag sa samahan natin.

> 💡 *Clint's Reflection: True companionship is forged in the storms we brave together.*`,
  },

  // 5. Gullas Mountain Hangout 1
  '1qYVjeokub4tqES8a5xWSJP8tUc4S7UpS': {
    "Clint's Heart": `## ⛰️ Gullas Mountain Heights & Cold Winds
**Mood**: Mountain Freedom • Breezy Peace

Hahahaha. Ibang klase talaga yung hangin sa Gullas Mountain, ang sarap sa pakiramdam! Pagdating natin sa tuktok, parang naiwan sa baba lahat ng ingay at alalahanin ng city.

Nakaupo lang tayo noon, tahimik na nakatingin sa malawak na horizon. Yung simpleng pagpahinga na may malamig na simoy, doon ko naramdaman kung gaano kaganda at ka-peaceful ang buhay kasama ka.

> 💡 *Clint's Reflection: Sa tuktok ng bundok, mas malinaw mong makikita kung ano ang totoong mahalaga sa iyong puso.*`,
    'Quiet Wonder': `## 🌿 High Above the Clouds at Gullas
**Mood**: Ethereal Vista • Whispering Pine

From these heights, the world below turns into a soft tapestry of green and stone. The cool mountain air breathes fresh life into tired spirits.

> 💡 *Clint's Reflection: Climb mountains not so the world can see you, but so you can see the beauty of the world with the one you love.*`,
    'Playful & Random': `## 🌬️ Nilalamig Pero Ayaw Pang Umuwi!
**Mood**: Ginaw • Good Vibes

Hahaha grabe yung ginaw dito! Nanginginig na yung kamay natin pero ayaw pa rin nating umalis kasi ang ganda ng view. Sobrang sulit ng akyat!

> 💡 *Clint's Reflection: Minsan mas masarap tiisin ang lamig kapag masarap ang kwentuhan.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa Katahimikan ng Bundok
**Mood**: Quiet Blessing • Grateful Soul

Salamat sa pagkakataon na makahinga at makapagpahinga sa mga bundok tulad ng Gullas. Sa gitna ng trabaho at pagod, ang mga sandaling ito ang nagpapalakas sa ating dalawa.

> 💡 *Clint's Reflection: Ang katahimikan ng kalikasan ay gamot sa pagod na puso.*`,
    'Midnight Reflections': `## 🌙 Alaala sa Tuktok ng Gullas
**Mood**: Starry Skyline • Deep Peace

Kapag tinitignan ko ang mga ilaw ng lungsod mula sa malayo, naaalala ko yung katahimikan sa Gullas. Isang alaala na mananatiling sariwa sa isipan ko.

> 💡 *Clint's Reflection: The highest places teach us how to walk with humility and peace.*`,
  },

  // 6. Gullas Mountain Hangout 2
  '1b2acsY_0FGG60gzYedDQlyjmFH1rBTb1': {
    "Clint's Heart": `## ⛰️ Panorama Views & Heartfelt Talks
**Mood**: Open Vistas • Deep Connection

Hahahaha! Dito sa spot na 'to ng Gullas Mountain, nagtagal talaga tayo kasi ang sarap lang mag-kwentuhan habang nakatitig sa malalayong bundok.

Yung mga pangarap natin, yung mga plano sa susunod na mga buwan—lahat 'yon napag-usapan natin nang walang pressure. Napaka-special ng ganitong bonding.

> 💡 *Clint's Reflection: Ang pinakamagandang tanawin ay hindi lang ang nakikita ng mata, kundi ang hinaharap na binubuo ninyong dalawa.*`,
    'Playful & Random': `## 📸 Pose Muna Bago Lamigin!
**Mood**: Picture-Picture • Tawanan

Hahaha! Ang dami nating kuha rito bago nakuha yung tamang angle! Kahit lipad-lipad ang buhok sa lakas ng hangin, ang ganda pa rin ng kinalabasan.

> 💡 *Clint's Reflection: Ang pinakamagandang litrato ay yung kitang-kita ang totoong saya.*`,
    'Quiet Wonder': `## 🌿 Endless Ridgelines
**Mood**: Serenity • Boundless Horizon

Rolling green ridges stretch toward the edge of the sky. Standing on the precipice, you feel both small and completely fulfilled.

> 💡 *Clint's Reflection: Nature gives freely to those who know how to pause and receive it.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa mga Lakad at Kaibigan
**Mood**: Heartfelt Joy • Thankful Spirit

Nagpapasalamat ako sa bawat pagkakataong makapunta sa matataas na lugar kasama ka. Bawat tanawin ay biyaya mula sa itaas.

> 💡 *Clint's Reflection: Ang bawat magandang tanawin ay paalala ng kadakilaan ng Diyos.*`,
    'Midnight Reflections': `## 🌙 Pagmumuni-muni sa Gullas
**Mood**: Calm Twilight • Fond Memory

Gusto kong balikan ulit ang lugar na 'to kapag may pagkakataon. Walang kapantay ang simoy ng hangin at ang payapang pakiramdam.

> 💡 *Clint's Reflection: Hangin sa bundok, kapayapaan sa puso.*`,
  },

  // 7. Beach Coastal Hangout
  '1pHq63-BgmAGal8kEkl33kmFSKteWdLNB': {
    "Clint's Heart": `## 🏖️ Baybayin, Alon at Gintong Araw
**Mood**: Golden Coast • Warm Solace

Hahahaha. Ang beach talaga ang pinaka-relaxing na tambayan natin diba? Yung tunog ng mga alon at ang init ng buhangin sa ating mga paa, parang pinapatigil ang oras.

Wala tayong ginawang engrande, naglakad-lakad lang tayo at nagpahangin. Pero itong mga simpleng araw na 'to ang madalas kong naaalala kapag napapagod ako.

> 💡 *Clint's Reflection: Tulad ng alon na laging bumabalik sa dalampasigan, ang puso ay laging nakakahanap ng kapayapaan sa piling ng taong mahalaga dito.*`,
    'Quiet Wonder': `## 🌊 The Symphony of Coastal Waves
**Mood**: Gentle Tides • Ocean Breeze

The soft rhythm of the incoming waves carries a hypnotic calm. Golden sunlight dances across the crest of the sea, inviting the soul to rest.

> 💡 *Clint's Reflection: Let the ocean wash away yesterday's dust, and let the horizon inspire tomorrow's hope.*`,
    'Playful & Random': `## 🐚 Hanap Shells at Lakad sa Buhangin
**Mood**: Chill Beach • Kulitan

Hahaha! Naalala mo nung naglakad tayo sa buhangin tapos biglang may malaking alon na umabot sa tsinelas natin? Muntik pang maanod!

> 💡 *Clint's Reflection: Ang buhangin sa dalampasigan ay mawawalis ng alon, pero ang masasayang alaala ay hinding-hindi mabubura.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa Bawat Sandali sa Dagat
**Mood**: Grateful Wonder • Peaceful Coast

Salamat sa Panginoon sa kapayapaan ng karagatan. Ang bawat hampas ng alon ay paalala na may kagandahan sa bawat simpleng sandali ng buhay.

> 💡 *Clint's Reflection: Sa tabi ng dagat, mas madaling magpasalamat sa bawat biyayang natatanggap.*`,
    'Midnight Reflections': `## 🌙 Alon sa Karimlan
**Mood**: Midnight Coast • Soft Lullaby

Ang tunog ng dagat ay tulad ng isang banayad na awit na nagpapatulog sa mga pagod na isip. Isang alaalang laging nagbibigay ng kapanatagan.

> 💡 *Clint's Reflection: Ang kapayapaan ng dagat ay nananatili sa puso kahit malayo na sa dalampasigan.*`,
  },

  // 8. Long Rides 1
  '1Or8orG13J4pw6-gmoZjDibGDVSCfjclb': {
    "Clint's Heart": `## 🏍️ Scenic Highway Long Ride - Part I
**Mood**: Open Road Freedom • Two Hearts Moving

Hahahaha! Yung pakiramdam habang tumatakbo ang motor sa open highway, malakas ang hangin sa helmet tapos naka-yakap ka sa likod—sobrang peaceful talaga!

Hindi naman importante kung saan tayo eksaktong pupunta nung ride na 'yon, ang masarap doon ay yung mismong biyahe at yung safe na paglalakbay natin. Marami pa tayong long rides na pupuntahan!

> 💡 *Clint's Reflection: Ang motor ay hindi lang sasakyan... simbolo ito ng tuloy-tuloy nating pag-abante sa buhay, magkaagapay saanman patungo ang daan.*`,
    'Playful & Random': `## 💨 Full Throttle sa Mahabang Kalsada!
**Mood**: Brrrm Brrrm • Super Saya

Hahaha! Yung feeling na lumilipad ang damit sa hangin tapos bawat kurbada parang nasa action movie tayo! Sobrang solid ng ride na 'to.

> 💡 *Clint's Reflection: Walang tatalo sa hangin ng open road kapag kasama mo ang paborito mong backride.*`,
    'Quiet Wonder': `## 🛣️ The Ribbon of Highway Ahead
**Mood**: Flow State • Wind and Horizon

Miles of tarmac unfolding under open skies. In the steady hum of the engine, all unnecessary thoughts vanish into the wind.

> 💡 *Clint's Reflection: Life is best experienced moving forward, one honest mile at a time.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa Ligtas na Paglalakbay
**Mood**: Guardian Grace • Heartfelt Thanks

Nagpapasalamat ako sa Panginoon sa bawat ligtas na kilometro sa kalsada. Salamat Maica sa tiwala mo sa bawat pagmamaneho ko.

> 💡 *Clint's Reflection: Ang ligtas na biyahe ay bunga ng pag-iingat at gabay ng Maykapal.*`,
    'Midnight Reflections': `## 🌙 Pagninilay sa Mahabang Biyahe
**Mood**: Night Rider • Deep Calm

Tuwing gabi kapag nakikita ko ang kalsada, naaalala ko yung mga long rides natin. Ang sarap sa pakiramdam na marami na tayong narating na magkasama.

> 💡 *Clint's Reflection: Ang bawat kilometro ay may kwentong mananatili sa ating puso.*`,
  },

  // 9. Long Rides 2
  '1HSmweBarLFZ92UVT0ECxvOZQH6Nl2nmi': {
    "Clint's Heart": `## 🏍️ Scenic Open Road Ride - Part II
**Mood**: Golden Curves • Pure Joy

Hahahaha! Dito sa parteng ito ng kalsada, sobrang ganda ng mga puno sa paligid at napakalamig ng hangin. Masarap magpatakbo nang chill lang habang pinagmamasdan ang paligid.

Bawat kurbada may bagong tanawin. Ito yung mga ride na hindi mo gugustuhing matapos agad kasi sobrang sarap sa pakiramdam.

> 💡 *Clint's Reflection: Hindi sa bilis ng takbo nasusukat ang biyahe, kundi sa ganda ng mga alaalang nabubuo sa bawat kilometro.*`,
    'Playful & Random': `## 🏞️ Chill Ride & Sightseeing
**Mood**: Cruising • Good Energy

Hahaha! Turo ka nang turo sa mga magagandang tanawin sa gilid habang nagmamaneho ako! Buti na lang alerto tayo palagi sa daan.

> 💡 *Clint's Reflection: Ang pinakamasarap na navigator ay yung laging masaya sa bawat nadaanang tanawin.*`,
    'Quiet Wonder': `## 🌿 Winding Trails in the Mountains
**Mood**: Mountain Solace • Rolling Green

Gentle curves hugging mountain slopes, shaded by ancient trees. The rhythmic hum of the ride creates a meditation in motion.

> 💡 *Clint's Reflection: Allow the curves of the journey to teach you balance and patience.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa Kalayaan ng Paglalakbay
**Mood**: Sincere Thanks • Blessed Path

Salamat sa biyayang makapaglakbay at makakita ng iba't ibang sulok ng ating probinsya. Tunay na mayaman ang buhay dahil sa mga ganitong alaala.

> 💡 *Clint's Reflection: Ang bawat bagong daan ay regalong dapat ipagdiwang nang may buong pasasalamat.*`,
    'Midnight Reflections': `## 🌙 Ang Daan Patungo sa Bukas
**Mood**: Serene Night • Hopeful Heart

Bawat kalsada na ating binagtas ay hakbang patungo sa mas magandang kinabukasan. Tuloy lang tayo sa pag-abante.

> 💡 *Clint's Reflection: Sa bawat kurbada ng buhay, may bagong pag-asa na naghihintay.*`,
  },

  // 10. Pangilatan Trail Vista 15:50 (20260531_155029.jpg)
  '16Y45AClQV-QPJFJopdeHItKZjuIiWhyQ': {
    "Clint's Heart": `## 🌿 Pangilatan Trail Vista 15:50
**Mood**: Golden Ridge • May 31 Trek

Hahahaha. Naalala ko noong 3:50 PM na nung May 31, papunta na tayo sa dulo ng ridge sa Pangilatan. Yung liwanag ng araw noon, medyo pahilig na kaya ang ganda ng kulay ng mga damo at bundok.

Hingal na hingal tayo pero worth it nung makarating tayo rito. Sobrang sarap huminga ng sariwang hangin nang walang polusyon at walang ingay ng sasakyan.

> 💡 *Clint's Reflection: Ang ganda ng kalikasan ay paalala na hindi kailangan ng mamahaling bagay para maging masaya—minsan isang simpleng lakad lang sa bundok, sapat na.*`,
    'Playful & Random': `## 🥾 Hiking Hits sa Pangilatan!
**Mood**: Pawis pero Masaya • May 31

Hahaha! Sabi mo noon "malapit na ba tayo?" pero nung nakita mo yung view, bigla kang nag-pose para magpa-picture! Galing talaga magtiis sa ahon!

> 💡 *Clint's Reflection: Kahit gaano katirik ang trail, nagiging flat ang daan kapag may kasama kang masarap kausap.*`,
    'Quiet Wonder': `## 🌿 Afternoon Radiance on Pangilatan Heights
**Mood**: Golden Amber • Silent Valley

At 3:50 PM, the late May afternoon sunlight blankets the Pangilatan highlands in warm amber hues. The mountain winds whisper gently through tall grasses.

> 💡 *Clint's Reflection: Standing upon high ridges teaches the heart to let go of small worries and embrace vast horizons.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa Pangilatan Hapon
**Mood**: Sincere Peace • Deep Blessing

Maraming salamat Panginoon sa malinis na hangin at sa ganda ng Pangilatan na ibinahagi Niyo sa amin. Ang araw na ito ay mananatiling kayamanan sa aming alaala.

> 💡 *Clint's Reflection: Ang kalikasan ay patunay ng walang hanggang kabutihan ng Lumikha.*`,
    'Midnight Reflections': `## 🌙 Alaala ng May 31 sa Pangilatan
**Mood**: Gentle Rest • Nostalgic Night

Tuwing gabi kapag naaalala ko itong May 31 trek natin, nararamdaman ko ulit yung lamig ng simoy ng hangin sa Pangilatan.

> 💡 *Clint's Reflection: Peaceful memories are lights that guide us through quiet nights.*`,
  },

  // 11. Pangilatan Natural Flora (20260531_151821.jpg)
  '1e9tm3i8Ay1Mtog8BQ9F4gucB08rFCGzz': {
    "Clint's Heart": `## 🌿 Pangilatan Natural Flora 15:18
**Mood**: Green Sanctuary • Nature's Details

Hahahaha. Tignan mo itong mga halaman sa Pangilatan, sobrang lunti at presko! Bandang 3:18 PM nung huminto tayo para pagmasdan 'tong bahaging 'to ng gubat.

Madalas sa bilis ng buhay nakakalimutan nating pansinin yung mga maliliit na detalye tulad ng dahon at bulaklak. Pero nung araw na 'yon, nagkaroon tayo ng time mag-slow down.

> 💡 *Clint's Reflection: Tulad ng mga halaman na tahimik na lumalago sa lilim, ang pagmamahal ay lumalalim sa mga tahimik at simpleng pagkakataon.*`,
    'Quiet Wonder': `## 🍃 The Emerald Microcosm of Pangilatan
**Mood**: Botanical Wonder • Quiet Haven

Lush foliage thriving in quiet balance under the canopy. Every shade of green reflects life in its most undisturbed, tranquil state.

> 💡 *Clint's Reflection: Even in the smallest leaf, the universe reveals its infinite design.*`,
    'Playful & Random': `## 🌿 Spot the Leaf!
**Mood**: Hahaha • Nature Trip

Hahaha! Huminto tayo rito akala ko may nakita kang kakaiba, nagandahan ka lang pala sa dahon! Pero totoo naman, pang-aesthetic talaga yung kulay!

> 💡 *Clint's Reflection: Ang taong marunong mag-appreciate ng simpleng dahon ay may pusong marunong magpasalamat sa lahat ng bagay.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa Buhay ng Kalikasan
**Mood**: Pure Thanks • Green Blessing

Salamat sa buhay at sigla na nakikita natin sa kalikasan. Nagpapaalala ito na ang bawat bagong araw ay may dalang pag-asa.

> 💡 *Clint's Reflection: Ang berde ng kalikasan ay sagisag ng walang sawang pag-asa.*`,
    'Midnight Reflections': `## 🌙 Luntiang Alaala sa Dilim
**Mood**: Midnight Stillness • Fresh Thought

Sa bawat pag-alala ko sa gubat ng Pangilatan, parang naaamoy ko ulit ang sariwang lupa at dahon pagkatapos ng ambon.

> 💡 *Clint's Reflection: Fresh memories bring sweet rest to a weary mind.*`,
  },

  // 12. Pangilatan Forest Sanctuary (20260531_151736.jpg)
  '1smj64ajtPckAIyyWY5oqHY8RkzgKl7pB': {
    "Clint's Heart": `## 🌲 Pangilatan Forest Sanctuary 15:17
**Mood**: Sacred Forest • Deep Solace

Hahahaha. Dito sa trail na 'to ng Pangilatan, parang pumasok tayo sa isang sagradong lugar dahil sa katahimikan ng mga matatayog na puno.

Bumubulong lang ang hangin sa mga sanga tapos tumatagos ang sinag ng araw. Sobrang sarap maglakad nang magkahawak-kamay habang dinaramdam ang kapayapaan ng paligid.

> 💡 *Clint's Reflection: Ang tunay na santuwaryo ay hindi laging gawa sa bato... minsan ito ay isang tahimik na daan sa gubat kasama ang taong mahalaga sa iyo.*`,
    'Quiet Wonder': `## 🌲 Beneath the High Canopy
**Mood**: Cathedral of Pines • Gentle Sunbeams

Sunlight filters through towering trunks, creating corridors of gold amidst the emerald shade. The forest breathes in eternal, calm cycles.

> 💡 *Clint's Reflection: Walk gently beneath tall trees, for they have witnessed centuries of grace.*`,
    'Playful & Random': `## 🌳 Tree Hugger Moments sa Pangilatan!
**Mood**: Kulit • Fresh Oxygen

Hahaha! Halos mapayakap tayo sa laki ng mga puno rito sa Pangilatan! Literal na unli-oxygen ang nalanghap natin noon.

> 💡 *Clint's Reflection: Masarap huminga nang malalim kapag alam mong libre at sagana ang sariwang hangin.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa Lilim at Proteksyon
**Mood**: Grateful Heart • Forest Peace

Salamat sa Panginoon sa lilim at kapayapaan na binigay sa atin sa gubat na ito. Isang paalala na palagi tayong may masisilungan sa oras ng pangangailangan.

> 💡 *Clint's Reflection: Ang lilim ng puno ay paalala ng Kanyang proteksyon sa ating buhay.*`,
    'Midnight Reflections': `## 🌙 Katahimikan ng Gubat sa Gabi
**Mood**: Midnight Echoes • Peaceful Sleep

Kapag tinitignan ko itong kuha sa Pangilatan, napupuno ng kapayapaan ang isip ko. Handa na sa panibagong bukas.

> 💡 *Clint's Reflection: Forest peace brings sound slumber.*`,
  },

  // 13. Pangilatan Pathway (20260531_151529.jpg)
  '10Vv9RMxrD42ZHfnfC5xvw7o-34IXNcb_': {
    "Clint's Heart": `## 🚶‍♂️ Pangilatan Pathway 15:15
**Mood**: Stepping Forward • May 31 Trail

Hahahaha! Dito nagsimula ang paglalakad natin sa trail ng Pangilatan noong 3:15 PM. Malinis ang daan at napapaligiran ng matataas na damo at puno.

Bawat hakbang natin doon, puro tawanan at kwentuhan lang. Walang nagmamadali, walang traffic, purong saya lang ng pagtuklas sa daan.

> 💡 *Clint's Reflection: Hindi mahalaga kung gaano kahaba ang daan, ang mahalaga ay masaya ang bawat hakbang dahil magkasama kayo.*`,
    'Quiet Wonder': `## 🌿 The Winding Trail of Pangilatan
**Mood**: Gentle Progression • Unfolding Path

A humble gravel path weaving through nature's bounty. Each bend holds the promise of quiet discovery.

> 💡 *Clint's Reflection: The journey of a thousand memories begins with a single shared step.*`,
    'Playful & Random': `## 🏃‍♂️ Sino Mauuna sa Tuktok?
**Mood**: Paunahan • Good Vibes

Hahaha! Sabi mo wag kitang iiwan sa trail pero ikaw pa nga yung nangungunang lumakad! Ang liksi mo noon ah!

> 💡 *Clint's Reflection: Ang pinakamasayang lakad ay yung may halong karera at tawanan.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa mga Bagong Daan
**Mood**: Thankful Journey • Blessed Steps

Salamat sa lakas ng katawan at sa mga pagkakataong makapaglakbay nang sama-sama sa mga magagandang trail tulad nito.

> 💡 *Clint's Reflection: Ang bawat landas na binubuksan sa atin ay patunay ng Kanyang patnubay.*`,
    'Midnight Reflections': `## 🌙 Ang Daanan sa Isipan
**Mood**: Serene Mind • Midnight Reflection

Kapag nakapikit ako sa gabi, naiisip ko pa rin ang mga hakbang natin sa pathway na 'to. Isang magandang alaala na hindi mawawala.

> 💡 *Clint's Reflection: Paths walked with love remain forever paved in the memory.*`,
  },

  // 14. November Twilight Atmosphere (IMG_20251127_173543_265.jpg)
  '1VepSI-NLip_Db2N0jEfD2NXfmlx3HJ-v': {
    "Clint's Heart": `## 🌆 November Twilight Atmosphere
**Mood**: Late November Dusk • Soft Skies

Hahahaha. November 27, bandang 5:35 PM nung makunan 'tong takipsilim na 'to. Yung lamig ng simoy ng hangin sa pagtatapos ng taon, ramdam na ramdam na rito.

Mabilis magbago ang kulay ng langit mula kahel hanggang maging lila at asul. Tinitigan lang natin ang paglubog ng araw habang nagpapasalamat sa isa na namang makabuluhang araw.

> 💡 *Clint's Reflection: Ang takipsilim ay patunay na kahit paano nagtatapos ang araw, maaari pa rin itong maging napakaganda.*`,
    'Quiet Wonder': `## 🌌 Velvet Skies of Late November
**Mood**: Indigo Horizon • Evening Calm

As day yields gently to dusk, shades of violet and soft crimson paint the cool November skyline. The world settles into peaceful rest.

> 💡 *Clint's Reflection: Sunset is nature's way of whispering that rest is earned and tomorrow is a fresh canvas.*`,
    'Playful & Random': `## 🌙 Golden Hour Snaps!
**Mood**: Hahaha • Dusk Vibes

Hahaha! Naghabol pa tayo sa huling sinag ng araw para lang makuha 'tong lighting na 'to! Buti umabot bago tuluyang magdilim!

> 💡 *Clint's Reflection: Kahit 5 minutes na lang ang natitirang liwanag, basta mabilis pumindot, panalo pa rin ang shot!*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa Pagtatapos ng Araw
**Mood**: Grateful Twilight • Peaceful Heart

Salamat sa isa na namang ligtas at masayang araw. Sa bawat paglubog ng araw, nawa'y mapuspos ng pasasalamat ang ating mga puso.

> 💡 *Clint's Reflection: Ang gabi ay regalo para magpasalamat sa mga biyaya ng maghapon.*`,
    'Midnight Reflections': `## 🌙 Dilim na May Kapayapaan
**Mood**: Deep Night • Calm Spirit

Ang dilim ng gabi ay hindi nakakatakot kapag alam mong bukas ay may panibagong umaga na puno ng liwanag.

> 💡 *Clint's Reflection: Twilight brings the peace that our souls seek.*`,
  },

  // 15. October Afternoon Radiance (IMG_20251020_162226_822.jpg)
  '1_SxoGSwgKXHnEghGlFVG4NxoH2Ermgue': {
    "Clint's Heart": `## ☀️ October Afternoon Radiance 16:22
**Mood**: October Gold • Warm Sunshine

Hahahaha! Naalala mo nung October 20 bandang 4:22 PM? Napakaganda ng sikat ng araw dito, mainit pero hindi nakakapaso, parang ginto na bumabalot sa paligid.

Ito yung mga karaniwang araw na nagiging hindi karaniwan dahil sa mga simpleng kwentuhan natin. Ang gaan sa pakiramdam ng ganitong hapon.

> 💡 *Clint's Reflection: Minsan ang kailangan mo lang sa buhay ay isang payapang hapon at isang taong handang makinig sa iyong mga kwento.*`,
    'Quiet Wonder': `## 🌾 October Sunlight in Quiet Harmony
**Mood**: Golden Amber • Autumn Warmth

Warm amber rays streaming across the afternoon landscape, creating long gentle shadows and golden highlights.

> 💡 *Clint's Reflection: In the gentle warmth of October light, ordinary moments become extraordinary treasures.*`,
    'Playful & Random': `## 🕶️ Hanap Shades Moment!
**Mood**: Silaw • Kulitan

Hahaha! Sobrang silaw nung araw dito kaya halos nakapikit tayo habang tumatawa! Pero ang ganda ng lighting diba!

> 💡 *Clint's Reflection: Ang pinakamasarap na silaw ay yung nanggagaling sa masayang araw kasama ka.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa Liwanag ng Buhay
**Mood**: Blessed Afternoon • Grateful Soul

Nagpapasalamat ako sa liwanag at init na patuloy na gumagabay sa ating bawat hakbang araw-araw.

> 💡 *Clint's Reflection: Ang liwanag ng araw ay paalala ng pag-asa na hindi nauubos.*`,
    'Midnight Reflections': `## 🌙 Ginintuang Alaala
**Mood**: Warm Thoughts • Midnight Comfort

Kahit lumipas na ang October, ang init at ligaya ng araw na ito ay nananatili sa aking puso.

> 💡 *Clint's Reflection: Warm days keep our hearts bright even during long nights.*`,
  },

  // 16. July 4th Dawn Awakening (20260704_054251.jpg)
  '1FUhX2lJkqllKKNmr_thz18c4Uz_5DQgQ': {
    "Clint's Heart": `## 🌅 July 4th Dawn Awakening 05:42
**Mood**: Morning Horizon • July 4 Sunrise

Hahahaha! 5:42 AM nung July 4, ang aga nating gumising para lang maabutan ang pagsikat ng araw! Antok na antok pa tayo pero nung unti-unting lumiwanag ang langit, nawala lahat ng antok.

Napakalamig pa ng hangin at napakatahimik ng buong paligid. Ganitong mga sandali ang nagpapaalala sa akin kung gaano kasuwerte ang bawat bagong umaga.

> 💡 *Clint's Reflection: Ang pagsikat ng araw ay patunay na bawat umaga ay may dalang bagong simula at panibagong pag-asa.*`,
    'Quiet Wonder': `## 🌄 The First Light of July 4th
**Mood**: Dawn Whispers • Crisp Morning Air

Crisp morning light breaking over the horizon at 5:42 AM. The world is reborn in pastel tones of peach, gold, and cool blue.

> 💡 *Clint's Reflection: Dawn is a sacred reminder that every darkness is temporary, and light always returns.*`,
    'Playful & Random': `## ☕ Kape Muna Bago Lahat!
**Mood**: Antok pero Game • Sunrise

Hahaha! Yung itsura natin dito naghahanap pa ng mainit na kape habang naghihintay lumabas si Haring Araw! Worth it naman ang paggising nang maaga!

> 💡 *Clint's Reflection: Walang tatalo sa umagang may magandang view at mainit na kape kasama ka.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa Bagong Umaga
**Mood**: Morning Praise • Fresh Blessings

Salamat Panginoon sa panibagong araw na ito. Bawat pagsikat ng araw ay paalala ng Iyong walang hanggang biyaya at pag-iingat.

> 💡 *Clint's Reflection: Ang bagong umaga ay regalong dapat tanggapin nang may buong pasasalamat.*`,
    'Midnight Reflections': `## 🌙 Paghahanda sa Bukas na Liwanag
**Mood**: Hopeful Dusk • Restful Night

Sa pagtulog ko ngayong gabi, alam kong may panibagong bukang-liwayway na naghihintay bukas.

> 💡 *Clint's Reflection: Night brings the promise of another glorious sunrise.*`,
  },

  // 17. Summer Evening Glow (20260722_171913.jpg)
  '1NFvjCnB-JQut88nD7gKe5tdyvMcYXbY3': {
    "Clint's Heart": `## 🌇 Summer Evening Glow 17:19
**Mood**: July 22 Magic • Golden Sunset

Hahahaha. July 22, bandang 5:19 PM nung kinuha 'to. Ang sarap ng kulay ng langit noong hapon na 'yon sa tag-init—parang pintura na kumakalat sa ulap.

Naglakad-lakad lang tayo habang lumalamig ang simoy ng hangin. Yung mga ganitong simpleng lakad sa tag-araw, ito talaga yung nag-iiwan ng pinakamatamis na alaala.

> 💡 *Clint's Reflection: Ang pinakamagandang palamuti ng isang hapon ay ang mapayapang kalooban habang kasama ang taong mahalaga sa iyo.*`,
    'Quiet Wonder': `## 🌆 Midsummer Solstice Glow
**Mood**: Golden Amber • Summer Serenity

At 5:19 PM in late July, the summer horizon glows in rich, layered warmth. The gentle breeze brings relief to a sun-drenched day.

> 💡 *Clint's Reflection: Let the warmth of summer days linger in your soul long after the sun has set.*`,
    'Playful & Random': `## 🍦 Ice Cream Time Pagkatapos ng Lakad!
**Mood**: Summer Fun • Chill Vibes

Hahaha! Naalala mo nung naghahanap tayo ng malamig na maiinom pagkatapos maglakad dito? Sobrang sarap magpahinga sa tag-init!

> 💡 *Clint's Reflection: Ang tag-araw ay mas masaya kapag may kasamang ice cream at maraming tawanan.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa Mainit na Tag-araw
**Mood**: Summer Grace • Thankful Heart

Nagpapasalamat ako sa masaganang araw at sa mga masasayang alaala na nabuo natin nitong nakaraang tag-araw.

> 💡 *Clint's Reflection: Ang tag-araw ay paalala ng sigla at ligaya na ibinibigay ng buhay.*`,
    'Midnight Reflections': `## 🌙 Alaala ng Tag-araw sa Karimlan
**Mood**: Summer Nights • Sweet Solace

Kahit lumipas na ang hapon ng July 22, ang liwanag ng araw na ito ay mananatiling buhay sa aking puso.

> 💡 *Clint's Reflection: Summer memories warm the heart through all seasons.*`,
  },

  // 18. Mid-July Exploration (20260714_160548.jpg)
  '1f3oBBoyh3T63C9W8iUw8U4iK3-cMKfbu': {
    "Clint's Heart": `## 🧭 Mid-July Exploration 16:05
**Mood**: July 14 Journey • Discovery Trail

Hahahaha! Naalala ko nung July 14 bandang 4:05 PM, kung saan-saan tayo nakarating dahil lang sa pagka-curious natin sa daan! 

Hindi natin alam kung saan pupunta pero tuloy lang tayo sa pag-usad. Ang saya lang nung feeling na malaya kang mag-explore nang walang hinahabol na oras kasama ka.

> 💡 *Clint's Reflection: Ang pinakamasarap na paglalakbay ay yung hindi mo kabisado ang daan pero tiwala ka sa iyong kasama.*`,
    'Quiet Wonder': `## 🌿 The Quiet Corners of July
**Mood**: Afternoon Serenity • Serendipity

Mid-afternoon stillness on July 14th, revealing hidden perspectives along the roadside.

> 💡 *Clint's Reflection: The world is full of quiet miracles for those who choose to wander with an open heart.*`,
    'Playful & Random': `## 🗺️ Sino ang Navigator Dito?
**Mood**: Hahaha • Ligaw-Ligawan

Hahaha! Sabi mo alam mo yung shortcut pero umikot pala tayo ng tatlong beses! Pero mas masaya kasi mas marami tayong nakitang magagandang spot!

> 💡 *Clint's Reflection: Walang tinatawag na ligaw kapag nag-e-enjoy ka sa bawat kanto.*`,
    'Pasalamat & Gratitude': `## ✨ Pasasalamat sa mga Bagong Tuklas
**Mood**: Grateful Explorer • Blessed Roads

Salamat sa Panginoon sa bawat pagkakataong makakita ng mga bagong lugar at makaranas ng iba't ibang ganda ng ating bayan.

> 💡 *Clint's Reflection: Ang bawat pagtuklas ay patunay ng lawak ng Kanyang mga likha.*`,
    'Midnight Reflections': `## 🌙 Alaala ng Paglalakbay
**Mood**: Restful Thoughts • Midnight Wonder

Tuwing gabi kapag naaalala ko ang July 14, napapangiti ako sa tapang at saya ng ating mga lakad.

> 💡 *Clint's Reflection: Wandering with you will always be my favorite adventure.*`,
  },
};

/**
 * Curated casual roaming remarks for 3D sphere walk mode (instant, zero rate-limit, rich variety)
 */
export const CASUAL_ROAMING_REMARKS: string[] = [
  "Hahahaha grabe, ang lamig pa naman ng hangin dito noon.",
  "Diba ito yung time na nagutom tayo sa biyahe pero ang saya pa rin?",
  "Ang peaceful lang talaga ng lugar na 'to, sarap balikan.",
  "Sobrang solid nung ride papunta rito, hindi ko makakalimutan.",
  "Naalala ko yung tawa mo rito nung muntik tayong maligaw.",
  "Ang ganda ng lighting dito sa picture, parang eksena sa pelikula.",
  "Isa 'to sa mga paborito kong lakad kasama ka.",
  "Kahit gaano kalayo ang biyahe, ang bilis ng oras kapag magkasama tayo.",
  "Sarap magkape habang pinapanood yung view noon.",
  "Dito ko na-realize kung gaano kasarap maglakad-lakad nang walang minamadali.",
  "Tignan mo yung ulap dito sa May 31, ang ganda ng kulay.",
  "Ang saya balikan ng mga simpleng araw na 'to nitong nakaraang tag-init.",
  "Napakalinis ng hangin sa Pangilatan ridge noon, walang kapantay.",
  "Yung basang-basa tayo sa baha pero tawa pa rin tayo nang tawa!",
  "Malamig ang simoy ng hangin sa Gullas Mountain habang nakatanaw sa malayo.",
  "Open highway, malakas na hangin sa helmet, at yakap mo sa likod habang umaandar.",
  "Ang ganda ng takipsilim dito nung November, gintong-ginto ang kalangitan.",
  "5:42 AM sunrise sa July 4—antok pa pero sobrang sulit nung sumikat ang araw!",
];

export function getQuickRoamingRemark(memory: Partial<MemoryItem>): string {
  const loc = (memory.location || '').toLowerCase();
  const title = (memory.title || '').toLowerCase();
  const tags = (memory.tags || []).map((t) => t.toLowerCase());

  if (loc.includes('pangilatan') || title.includes('pangilatan') || tags.includes('pangilatan')) {
    const list = [
      "Hahahaha sarap ng simoy ng hangin sa Pangilatan, napaka-peaceful.",
      "Sobrang ganda ng view dito sa ridge ng Pangilatan, walang kapantay.",
      "Isa sa pinakamakabuluhang araw natin sa Pangilatan 'to.",
      "Naalala ko yung mga trails dito sa Pangilatan, napakasariwa ng gubat.",
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

  if (loc.includes('july 4') || title.includes('july 4') || title.includes('dawn')) {
    return "Ang aga nating gumising nung July 4 para sa sunrise pero sobrang sulit!";
  }

  if (loc.includes('july 22') || title.includes('july 22')) {
    return "Napakaganda ng kulay ng langit nung hapon ng July 22 sa tag-araw.";
  }

  if (loc.includes('october') || loc.includes('november')) {
    return "Gintong-ginto ang liwanag ng araw noong hapon na 'to, napaka-peaceful.";
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
  if (fileId && BESPOKE_STORIES[fileId]) {
    if (BESPOKE_STORIES[fileId][tone]) {
      return BESPOKE_STORIES[fileId][tone];
    }
    if (BESPOKE_STORIES[fileId]["Clint's Heart"]) {
      return BESPOKE_STORIES[fileId]["Clint's Heart"];
    }
  }

  const title = memory.title || 'Special Moment';
  const location = memory.location || 'Echoes Memory';
  const date = memory.date || 'Our Journey';
  const isVideo = memory.isVideo;

  // 2. Location specific tailored defaults
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

Hahahaha! Remember nung umakyat tayo rito sa Pangilatan? Parang hingal na hingal tayo sa ahon, pero pagdating sa tuktok nawala lahat ng pagod kasi sobrang ganda ng view!

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
    if (tone === 'Midnight Reflections') {
      return `## 🌙 Tahimik na Gabi at Alaala ng Pangilatan
**Mood**: Midnight Stillness • Deep Peace

Tuwing gabi kapag tahimik ang paligid, ang simoy ng hangin sa Pangilatan ang nagpapaalala sa akin kung gaano kagaan sa pakiramdam ang maglakad nang may kasamang tunay na nagmamahal.

> 💡 *Clint's Reflection: Ang tunay na kapayapaan ay nananatili sa puso kahit lumipas na ang araw.*`;
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

Hahahaha. Ang Gullas Mountain ride talaga natin ang isa sa pinaka-relaxing na escape. Yung malamig na simoy habang nakatingin tayo sa horizon mula sa itaas, parang napakalayo sa lahat ng ingay at alalahanin.

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

  if (location.toLowerCase().includes('july 4') || title.toLowerCase().includes('july 4') || date.toLowerCase().includes('july 4')) {
    return `## 🌅 ${title}
**Mood**: July 4 Sunrise • Fresh Horizon

Hahahaha! Naalala mo nung July 4? Ang aga nating gumising noon para sa sunrise. Yung kulay ng langit mula madilim hanggang maging ginto at kahel, sobrang ganda pagmasdan.

Kahit medyo antok pa tayo, nawala agad nung naramdaman natin yung simoy ng hangin sa umaga. Ang sarap simulan ng araw kasama ka.

> 💡 *Clint's Reflection: Ang bawat pagsikat ng araw ay paalala na laging may bagong pag-asa at bagong simula na naghihintay.*`;
  }

  if (location.toLowerCase().includes('july 22') || title.toLowerCase().includes('july 22') || date.toLowerCase().includes('july 22')) {
    return `## 🌇 ${title}
**Mood**: Midsummer Glow • July 22 Memories

Hahahaha! Nung July 22 nung tag-init, sobrang ganda ng sikat ng araw at ng hangin nung hapon. Naglakad-lakad tayo habang pinapanood yung mga ulap.

Walang minamadali, purong relaxing lang. Ang sarap balikan ng mga ganitong araw na puno ng tawanan at kwentuhan.

> 💡 *Clint's Reflection: Ang pinakamagandang hapon ay yung lumilipas nang payapa kasama ang taong mahalaga sa iyo.*`;
  }

  if (location.toLowerCase().includes('july 14') || title.toLowerCase().includes('july 14') || date.toLowerCase().includes('july 14')) {
    return `## 🧭 ${title}
**Mood**: Mid-July Adventure • July 14 Discovery

Hahahaha! July 14 nung nag-explore tayo rito sa daan. Walang eksaktong plano pero kung saan-saan tayo dinala ng ating paglalakad.

Ang dami nating nadiskubreng magagandang tanawin na hindi natin inaasahan. Solid talaga kapag kasama ka sa mga lakad!

> 💡 *Clint's Reflection: Ang pinakamasarap na paglalakbay ay yung kusa mong natutuklasan kasama ang taong nagpapasaya sa iyo.*`;
  }

  // Universal fallbacks in Clint's natural Taglish
  if (tone === 'Quiet Wonder') {
    return `## 🌿 ${title}
**Mood**: Quiet Wonder • Timeless Grace

There is an unspoken beauty in this moment captured in ${location}. The light falls softly across the frame, preserving a memory that now lives forever in our hearts.

Moments like these remind us to be still, to look around, and to cherish the quiet blessings that surround our path every single day.

> 💡 *Clint's Reflection: Sometimes the quietest moments echo the loudest in the chambers of our hearts.*`;
  }

  if (tone === 'Playful & Random') {
    return `## 🌿 ${title}
**Mood**: Random Laughs • Candid Snapshot

Hahahaha! Naalala mo pa ba kung ano yung pinag-uusapan natin dito sa ${location}? Medyo nakalimutan ko na yung eksaktong detalye pero alam kong sobrang nag-enjoy tayo noon!

Ito talaga ang maganda sa mga candid pictures—hindi scripted, hindi pilit, natural na natural lang ang good vibes.

> 💡 *Clint's Reflection: Ang pinaka-cute na memories ay yung mga simpleng tawanan na hindi pinlano.*`;
  }

  if (tone === 'Pasalamat & Gratitude') {
    return `## 🌿 ${title}
**Mood**: Heartfelt Gratitude • Deep Appreciation

Salamat sa Panginoon sa bawat pagkakataon at alaala dito sa ${location}. Ang bawat litrato ay patunay ng biyaya ng buhay, pagmamahalan, at pagsasama.

Sobrang na-appreciate ko ang bawat lakad, bawat kwentuhan, at bawat araw na magkasama tayo. Maraming salamat Maica.

> 💡 *Clint's Reflection: Ang pasasalamat ay nagpapakita na ang lahat ng meron tayo ay sapat at higit pa sa sapat.*`;
  }

  if (tone === 'Midnight Reflections') {
    return `## 🌙 ${title}
**Mood**: Midnight Stillness • Deep Peace

Tuwing gabi kapag tinitignan ko itong kuha sa ${location}, napupuno ng kapayapaan ang isip ko. Isang magandang paalala kung gaano kasuwerte ang puso ko sa bawat biyahe natin.

> 💡 *Clint's Reflection: Ang mga payapang alaala ay nagbibigay ng kapanatagan sa puso sa gitna ng katahimikan ng gabi.*`;
  }

  // Standard Clint's Heart Default
  return `## 🌿 ${title}
**Mood**: Warm Nostalgia • Clint's Story

Hahahaha. Remember noong nasa ${location} tayo? 

Parang wala pa tayong masyadong plano noon diba, basta lakad lang tayo. Pero nakakatuwa kasi looking back, yung mga simpleng kwentuhan at tawanan habang pinagmamasdan ang paligid—doon ko talaga na-realize kung gaano ka-special ang journey natin. Napaka-peaceful sa pakiramdam.

Sobrang na-appreciate ko 'to. Thank you for always being by my side.

> 💡 *Clint's Reflection: Hindi nasusukat sa layo ng destinasyon ang biyahe... kundi sa taong katabi mo habang pinagmamasdan ang daan.*`;
}
