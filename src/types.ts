export interface MemoryItem {
  id: string;
  driveFileId?: string;
  name: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  thumbnailUrl: string;
  description?: string;
  aiStory?: string;
  videoUrl?: string;
  videoEmbedUrl?: string;
  isVideo?: boolean;
  category?: string;
  tags: string[];
  width?: number;
  height?: number;
  mimeType?: string;
  webViewLink?: string;
}

export interface DriveFolderInfo {
  id: string;
  name: string;
  itemCount: number;
}

export type ViewMode = 'sphere' | 'inside_dome' | 'orbit';
