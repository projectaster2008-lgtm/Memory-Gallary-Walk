import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  Video, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Film,
  Image as ImageIcon,
  Tag,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Feather,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryItem } from '../types';
import VideoPlayer from './VideoPlayer';
import SafeImage from './SafeImage';
import { detectMediaType, resolveMediaInfo, processMemoryItem } from '../utils/mediaProcessor';
import { getHardcodedStory, STORY_TONES } from '../utils/narratives';

interface LocationDetailsProps {
  memory: MemoryItem;
  allMemories: MemoryItem[];
  onSelectMemory: (memory: MemoryItem) => void;
  onClose: () => void;
}

export default function LocationDetailsScreen({
  memory: rawMemory,
  allMemories,
  onSelectMemory,
  onClose,
}: LocationDetailsProps) {
  // Ensure processed memory format
  const memory = useMemo(() => processMemoryItem(rawMemory), [rawMemory]);
  const isVideoMemory = memory.isVideo || detectMediaType(memory) === 'video';

  const [activeTab, setActiveTab] = useState<'story' | 'video' | 'media'>(
    isVideoMemory ? 'video' : 'story'
  );
  
  // Story State & In-Memory Cache
  const [selectedTone, setSelectedTone] = useState("Clint's Heart");
  const [aiStory, setAiStory] = useState<string>('');
  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const storyCacheRef = useRef<Record<string, string>>({});

  // Speech Narration State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // AI Video Animation State
  const [videoUrl, setVideoUrl] = useState<string | null>(memory.videoUrl || null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const currentIndex = allMemories.findIndex((m) => m.id === memory.id);
  const prevMemory = currentIndex > 0 ? allMemories[currentIndex - 1] : allMemories[allMemories.length - 1];
  const nextMemory = currentIndex < allMemories.length - 1 ? allMemories[currentIndex + 1] : allMemories[0];

  // Stop speech when closing or changing memory
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Actively Load and Generate Story in Clint's authentic Taglish voice
  const handleGenerateStory = (tone = selectedTone, forceRegenerate = false) => {
    stopSpeech();
    const cacheKey = `${memory.id}_${tone}`;

    // If cached and not forcing, load immediately
    if (!forceRegenerate && storyCacheRef.current[cacheKey]) {
      setAiStory(storyCacheRef.current[cacheKey]);
      memory.aiStory = storyCacheRef.current[cacheKey];
      return;
    }

    setIsStoryLoading(true);

    // Instant local story retrieval from rich bespoke catalog
    setTimeout(() => {
      const story = getHardcodedStory(memory, tone);
      storyCacheRef.current[cacheKey] = story;
      setAiStory(story);
      memory.aiStory = story;
      setIsStoryLoading(false);
    }, 200);
  };

  // Sync and generate story on memory change or tone change
  useEffect(() => {
    stopSpeech();
    handleGenerateStory(selectedTone, false);

    if (isVideoMemory) {
      setActiveTab('video');
    }
  }, [memory.id, selectedTone, isVideoMemory]);

  // Read aloud narration
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    if (!aiStory) return;

    // Clean markdown text for voice utterance
    const plainText = aiStory
      .replace(/##\s+/g, '')
      .replace(/\*\*Atmosphere & Mood\*\*:/g, 'Atmosphere and mood:')
      .replace(/>\s*💡\s*\*Memory Reflection:\s*/g, 'Memory reflection: ')
      .replace(/[*_#`>]/g, '');

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Choose friendly natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechUtteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Copy story text
  const handleCopyStory = () => {
    if (!aiStory) return;
    navigator.clipboard.writeText(aiStory);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle Video Generation via Gemini Omni for static photos
  const handleGenerateVideo = async () => {
    if (videoUrl || isVideoLoading) return;
    setIsVideoLoading(true);
    setVideoError(null);

    try {
      const imageRes = await fetch(memory.imageUrl);
      const blob = await imageRes.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          const response = await fetch('/api/generate-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64data,
              prompt: `A beautiful cinematic panning video of ${memory.title} in ${memory.location}`,
            }),
          });
          const result = await response.json();

          if (!result.success || !result.fileId) {
            throw new Error(result.error || 'Failed to start video generation');
          }

          const fileId = result.fileId;
          const pollInterval = setInterval(async () => {
            try {
              const statusRes = await fetch('/api/video-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileId }),
              });
              const statusResult = await statusRes.json();

              if (statusResult.done) {
                clearInterval(pollInterval);
                const dlUrl = `/api/video-download?fileId=${encodeURIComponent(fileId)}`;
                setVideoUrl(dlUrl);
                memory.videoUrl = dlUrl;
                setIsVideoLoading(false);
              }
            } catch (err) {
              clearInterval(pollInterval);
              setVideoError('Error during video status polling.');
              setIsVideoLoading(false);
            }
          }, 4000);
        } catch (err: any) {
          setVideoError(err.message || 'Could not initiate video generation.');
          setIsVideoLoading(false);
        }
      };

      reader.readAsDataURL(blob);
    } catch (err: any) {
      setVideoError(err.message || 'Failed to convert image for video.');
      setIsVideoLoading(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevMemory) {
        stopSpeech();
        onSelectMemory(prevMemory);
      }
      if (e.key === 'ArrowRight' && nextMemory) {
        stopSpeech();
        onSelectMemory(nextMemory);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSelectMemory, prevMemory, nextMemory]);

  // Video memory object passed to VideoPlayer
  const activeVideoMemory = useMemo(() => {
    if (isVideoMemory) return memory;
    if (videoUrl) {
      return {
        ...memory,
        isVideo: true,
        videoUrl: videoUrl,
      };
    }
    return null;
  }, [isVideoMemory, memory, videoUrl]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/60 backdrop-blur-md"
    >
      {/* Backdrop listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Card */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white w-full max-w-5xl h-full max-h-[88vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 border border-gray-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-950 rounded-full z-30 shadow-md border border-gray-200 transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Video Player or Photo Viewer */}
        <div className="w-full md:w-1/2 h-72 md:h-full bg-gray-950 relative overflow-hidden flex items-center justify-center group flex-shrink-0">
          {activeVideoMemory && (isVideoMemory || activeTab === 'video') ? (
            <VideoPlayer
              memory={activeVideoMemory}
              className="w-full h-full"
              autoPlay={true}
            />
          ) : (
            <SafeImage
              memory={memory}
              src={memory.imageUrl || memory.thumbnailUrl}
              alt={memory.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}

          {/* Quick Prev / Next Overlay Buttons */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                stopSpeech();
                if (prevMemory) onSelectMemory(prevMemory);
              }}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm pointer-events-auto transition-all shadow-md"
              title="Previous memory (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                stopSpeech();
                if (nextMemory) onSelectMemory(nextMemory);
              }}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm pointer-events-auto transition-all shadow-md"
              title="Next memory (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side: Memory Story, Metadata & Media Details */}
        <div className="w-full md:w-1/2 h-full flex flex-col p-6 sm:p-8 overflow-y-auto justify-between bg-white">
          {/* Header & Meta */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{memory.location}</span>
                <span className="text-gray-300">•</span>
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-500 font-normal">{memory.date}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {isVideoMemory && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide flex items-center gap-1">
                    <Film className="w-3 h-3" />
                    <span>Video Clip</span>
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 leading-tight">
                  {memory.title}
                </h2>
              </div>
            </div>

            {/* Tags */}
            {memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {memory.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600"
                  >
                    <Tag className="w-3 h-3 text-gray-400" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Tab Switches */}
            <div className="flex items-center justify-between border-b border-gray-100 pt-2 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('story')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === 'story'
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Feather className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kwento ni Clint (22)</span>
                </button>

                {isVideoMemory ? (
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === 'video'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Video Footage</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveTab('video');
                      if (!videoUrl && !isVideoLoading) {
                        handleGenerateVideo();
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === 'video'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Living Video {videoUrl ? '✓' : ''}</span>
                  </button>
                )}
              </div>

              {/* Story Audio Read-Aloud & Copy Actions */}
              {activeTab === 'story' && aiStory && !isStoryLoading && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleToggleSpeech}
                    className={`p-1.5 rounded-full text-xs transition-colors flex items-center gap-1 ${
                      isSpeaking
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title={isSpeaking ? 'Stop narration' : 'Narrate aloud'}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-semibold hidden sm:inline">Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-semibold hidden sm:inline">Listen</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopyStory}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    title="Copy story markdown"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Tab Content */}
            <div className="py-2">
              {activeTab === 'story' && (
                <div className="space-y-3">
                  {/* Story Tone Selector Pills */}
                  <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mr-1 flex-shrink-0">
                        <Feather className="w-3 h-3" />
                        <span>Tone:</span>
                      </span>
                      {STORY_TONES.map((tone) => (
                        <button
                          key={tone.id}
                          onClick={() => {
                            setSelectedTone(tone.id);
                            handleGenerateStory(tone.id, false);
                          }}
                          disabled={isStoryLoading}
                          className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                            selectedTone === tone.id
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-transparent'
                          }`}
                        >
                          <span>{tone.icon}</span>
                          <span>{tone.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Memory Story Output */}
                  <div className="text-gray-700 text-sm leading-relaxed min-h-[140px] flex flex-col justify-center">
                    {isStoryLoading ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
                        <div className="relative">
                          <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
                          <Feather className="w-3 h-3 text-emerald-500 absolute -top-1 -right-1 animate-bounce" />
                        </div>
                        <p className="text-xs font-semibold text-gray-700">
                          Binubuksan ang kwento...
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Binabalikan ang mga alaala sa {selectedTone.toLowerCase()}
                        </p>
                      </div>
                    ) : aiStory ? (
                      <div className="prose prose-sm max-w-none [&>h2]:text-base [&>h2]:font-bold [&>h2]:text-gray-900 [&>p]:mb-2.5 [&>blockquote]:border-l-2 [&>blockquote]:border-emerald-500 [&>blockquote]:pl-3.5 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:bg-emerald-50/50 [&>blockquote]:py-1 [&>blockquote]:rounded-r-lg">
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold tracking-wide border border-emerald-200">
                            <Feather className="w-3 h-3 text-emerald-600" />
                            <span>Kwento ni Clint • Alaala</span>
                          </span>
                        </div>
                        <Markdown>{aiStory}</Markdown>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        {memory.description || 'Isang mahalagang sandali na nakatago sa memory sphere.'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'video' && !isVideoMemory && (
                <div className="py-4">
                  {isVideoLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3 text-gray-400">
                      <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
                      <p className="text-xs font-medium text-gray-600">Bringing photo to life with Gemini Omni...</p>
                      <p className="text-[11px] text-gray-400">Generating camera motion video</p>
                    </div>
                  ) : videoError ? (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{videoError}</span>
                    </div>
                  ) : videoUrl ? (
                    <div className="text-xs text-gray-600">
                      <p className="font-semibold text-emerald-700 mb-1">Living Video Active</p>
                      <p>View the cinematic motion video on the left player screen.</p>
                    </div>
                  ) : (
                    <button
                      onClick={handleGenerateVideo}
                      className="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <Video className="w-4 h-4" />
                      Generate Living Motion Video
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'video' && isVideoMemory && (
                <div className="py-3 text-xs text-gray-600 space-y-2">
                  <p className="font-semibold text-gray-900">Direct Video Footage</p>
                  <p className="leading-relaxed text-gray-500">
                    {memory.description}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
                    <Film className="w-3.5 h-3.5" />
                    <span>Interactive player active on left preview.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 mt-auto border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {currentIndex + 1} of {allMemories.length} memories
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGenerateStory(selectedTone, true)}
                disabled={isStoryLoading}
                className="px-3 py-1.5 text-xs text-gray-700 hover:text-gray-950 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Feather className={`w-3.5 h-3.5 text-emerald-600 ${isStoryLoading ? 'animate-spin' : ''}`} />
                <span>{isStoryLoading ? 'Sinusulat...' : 'Iba Pang Kwento'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-medium bg-gray-900 hover:bg-black text-white rounded-lg transition-colors cursor-pointer"
              >
                Balik sa Lakad
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

