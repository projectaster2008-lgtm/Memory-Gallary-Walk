export interface WorldDefinition {
  id: string;
  name: string;
  title: string;
  tagline: string;
  description: string;
  destinationsCount?: number;
  status: 'active' | 'upcoming';
  accentColor: string;
  theme: string;
  tags: string[];
  bannerImage: string;
}

export const AVAILABLE_WORLDS: WorldDefinition[] = [
  {
    id: 'globe-world',
    name: 'World 01',
    title: 'The Living Memory Globe',
    tagline: '53 Global Destinations & Heartfelt Memories',
    description: 'An interactive 3D spherical sanctuary featuring 53 curated destinations across the world. Explore the celestial dome walk, atmospheric day-night cycles, and intimate Taglish narratives.',
    destinationsCount: 53,
    status: 'active',
    accentColor: '#f59e0b',
    theme: 'Golden Hour & Twilight',
    tags: ['Interactive Globe', '53 Destinations', 'Dome Walk', 'Soundscapes'],
    bannerImage: '/reference-lobby-bg.jpg',
  },
  {
    id: 'vault-world',
    name: 'World 02',
    title: 'The Constellation Vault',
    tagline: 'Starlit Archival Chambers (Coming Soon)',
    description: 'A subterranean observatory mapped to celestial coordinates. Designed to house intimate journal entries, handwritten notes, and starlit soundscapes.',
    status: 'upcoming',
    accentColor: '#38bdf8',
    theme: 'Midnight & Stardust',
    tags: ['Star Map', 'Audio Notes', 'Archival', 'In Development'],
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'coastal-world',
    name: 'World 03',
    title: 'Echoes of Pangilatan',
    tagline: 'Coastal Horizons & Tidal Reverie (Coming Soon)',
    description: 'An expansive oceanside corridor where waves interact with dynamic memory nodes and reflective tidal shores.',
    status: 'upcoming',
    accentColor: '#34d399',
    theme: 'Emerald Tide & Seafoam',
    tags: ['Ocean Shore', 'Tidal Echoes', 'Ambient', 'In Development'],
    bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
];
