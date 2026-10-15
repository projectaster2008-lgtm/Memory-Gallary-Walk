import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HARDCODED_MEMORIES } from './memoriesData';
import { MemoryItem } from './types';
import GalleryGlobe from './components/GalleryGlobe';
import LocationDetailsScreen from './components/LocationDetailsScreen';
import LobbyScreen from './components/Lobby/LobbyScreen';

export default function App() {
  const [memories] = useState<MemoryItem[]>(HARDCODED_MEMORIES);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [currentView, setCurrentView] = useState<'lobby' | 'globe'>('lobby');

  return (
    <div className="w-full h-full relative bg-neutral-950 overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {currentView === 'lobby' ? (
          <motion.div
            key="lobby-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <LobbyScreen
              onEnterGlobe={() => setCurrentView('globe')}
              memoriesCount={memories.length}
            />
          </motion.div>
        ) : (
          <motion.div
            key="globe-view"
            initial={{ opacity: 0 }}
            animate={{
              opacity: selectedMemory ? 0.25 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className={`absolute inset-0 ${selectedMemory ? 'pointer-events-none' : ''}`}
          >
            <GalleryGlobe
              memories={memories}
              folderName="Drive Photo Memories"
              onSelect={(memory) => setSelectedMemory(memory)}
              onResetView={() => setSelectedMemory(null)}
              onBackToLobby={() => {
                setSelectedMemory(null);
                setCurrentView('lobby');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Details Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <LocationDetailsScreen
            key={selectedMemory.id}
            memory={selectedMemory}
            allMemories={memories}
            onSelectMemory={(mem) => setSelectedMemory(mem)}
            onClose={() => setSelectedMemory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
