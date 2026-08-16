import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HARDCODED_MEMORIES } from './memoriesData';
import { MemoryItem } from './types';
import GalleryGlobe from './components/GalleryGlobe';
import LocationDetailsScreen from './components/LocationDetailsScreen';

export default function App() {
  const [memories] = useState<MemoryItem[]>(HARDCODED_MEMORIES);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);

  return (
    <div className="w-full h-full relative bg-white overflow-hidden select-none">
      {/* 3D Gallery Walk Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{
          scale: selectedMemory ? 0.85 : 1,
          opacity: selectedMemory ? 0.35 : 1,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute inset-0 ${selectedMemory ? 'pointer-events-none' : ''}`}
      >
        <GalleryGlobe
          memories={memories}
          folderName="Drive Photo Memories"
          onSelect={(memory) => setSelectedMemory(memory)}
          onResetView={() => setSelectedMemory(null)}
        />
      </motion.div>

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

