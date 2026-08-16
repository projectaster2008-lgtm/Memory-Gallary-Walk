import { MemoryItem } from '../types';

export type MediaType = 'image' | 'video' | 'audio' | 'unknown';

export interface ProcessedMediaInfo {
  mediaType: MediaType;
  isVideo: boolean;
  isImage: boolean;
  driveFileId?: string;
  streamUrl: string;
  thumbnailUrl: string;
  embedUrl?: string;
  downloadUrl?: string;
  directWebLink?: string;
}

const VIDEO_EXTENSIONS = new Set([
  'mp4',
  'webm',
  'mov',
  'mkv',
  'avi',
  'm4v',
  '3gp',
  'ts',
  'ogv',
]);

const IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg',
  'avif',
  'bmp',
  'tiff',
]);

/**
 * Extracts a Google Drive File ID from various URL patterns or raw ID strings.
 */
export function extractDriveFileId(input?: string): string | undefined {
  if (!input) return undefined;
  
  // Clean prefix if present (e.g. "drive-12345")
  if (input.startsWith('drive-')) {
    return input.replace('drive-', '');
  }

  // Already a clean ID (20+ chars, alphanumeric and _ -)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(input.trim())) {
    return input.trim();
  }

  // Match /file/d/{ID}/ or /d/{ID}
  const fileDMatch = input.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Match id={ID} parameter
  const idParamMatch = input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  // Match drive-image/{ID} or drive-video/{ID}
  const apiMatch = input.match(/\/api\/drive-(?:image|video)\/([a-zA-Z0-9_-]+)/);
  if (apiMatch && apiMatch[1]) {
    return apiMatch[1];
  }

  return undefined;
}

/**
 * Robustly inspects an input URL, filename, mimeType, and metadata to determine media type.
 */
export function detectMediaType(
  input: {
    url?: string;
    fileName?: string;
    mimeType?: string;
    isVideo?: boolean;
    tags?: string[];
  } | string
): MediaType {
  if (typeof input === 'string') {
    return detectMediaTypeFromString(input);
  }

  if (input.isVideo === true) {
    return 'video';
  }

  if (input.mimeType) {
    if (input.mimeType.startsWith('video/')) return 'video';
    if (input.mimeType.startsWith('image/')) return 'image';
    if (input.mimeType.startsWith('audio/')) return 'audio';
  }

  if (input.fileName) {
    const ext = getFileExtension(input.fileName);
    if (VIDEO_EXTENSIONS.has(ext)) return 'video';
    if (IMAGE_EXTENSIONS.has(ext)) return 'image';
  }

  if (input.url) {
    const typeFromUrl = detectMediaTypeFromString(input.url);
    if (typeFromUrl !== 'unknown') return typeFromUrl;
  }

  if (input.tags) {
    const lowerTags = input.tags.map((t) => t.toLowerCase());
    if (
      lowerTags.some((t) =>
        ['video', 'videos', 'mp4', 'movie', 'clip', 'footage', 'vlog', 'reels'].includes(t)
      )
    ) {
      return 'video';
    }
  }

  return 'image'; // default fallback for visual gallery
}

function detectMediaTypeFromString(str: string): MediaType {
  const clean = str.toLowerCase().split('?')[0];
  const ext = getFileExtension(clean);

  if (VIDEO_EXTENSIONS.has(ext)) return 'video';
  if (IMAGE_EXTENSIONS.has(ext)) return 'image';

  if (str.includes('youtube.com') || str.includes('youtu.be') || str.includes('vimeo.com')) {
    return 'video';
  }

  return 'unknown';
}

function getFileExtension(path: string): string {
  const parts = path.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()?.toLowerCase().trim() || '';
}

/**
 * Resolves media endpoints, thumbnail, and stream URLs for a memory item.
 */
export function resolveMediaInfo(item: Partial<MemoryItem>): ProcessedMediaInfo {
  const driveId =
    item.driveFileId ||
    extractDriveFileId(item.id) ||
    extractDriveFileId(item.imageUrl) ||
    extractDriveFileId(item.videoUrl) ||
    extractDriveFileId(item.videoEmbedUrl) ||
    extractDriveFileId(item.webViewLink);

  const mediaType = detectMediaType({
    url: item.videoUrl || item.imageUrl,
    fileName: item.name || item.title,
    mimeType: item.mimeType,
    isVideo: item.isVideo,
    tags: item.tags,
  });

  const isVideo = mediaType === 'video';
  const isImage = mediaType === 'image';

  let streamUrl = item.imageUrl || '';
  let thumbnailUrl = item.thumbnailUrl || item.imageUrl || '';
  let embedUrl = item.videoEmbedUrl;
  let downloadUrl = '';
  let directWebLink = item.webViewLink;

  if (driveId) {
    thumbnailUrl = `/api/drive-image/${driveId}?sz=w800`;
    streamUrl = isVideo ? `/api/drive-image/${driveId}?sz=w1200` : `/api/drive-image/${driveId}`;
    embedUrl = `https://drive.google.com/file/d/${driveId}/preview`;
    downloadUrl = `https://drive.usercontent.google.com/download?id=${driveId}&export=download`;
    directWebLink = directWebLink || `https://drive.google.com/file/d/${driveId}/view?usp=drive_web`;
  }

  if (item.videoUrl) {
    streamUrl = item.videoUrl;
  }

  return {
    mediaType,
    isVideo,
    isImage,
    driveFileId: driveId,
    streamUrl,
    thumbnailUrl,
    embedUrl,
    downloadUrl,
    directWebLink,
  };
}

/**
 * Sanitizes and enriches a MemoryItem with complete media detection and URLs.
 */
export function processMemoryItem(raw: Partial<MemoryItem>): MemoryItem {
  const info = resolveMediaInfo(raw);
  const id = raw.id || (info.driveFileId ? `drive-${info.driveFileId}` : `mem-${Date.now()}-${Math.random()}`);

  return {
    id,
    driveFileId: info.driveFileId,
    name: raw.name || raw.title || 'Untitled Memory',
    title: raw.title || raw.name || 'Captured Moment',
    location: raw.location || 'Drive Collection',
    date: raw.date || 'Preserved Memory',
    imageUrl: raw.imageUrl || info.streamUrl,
    thumbnailUrl: raw.thumbnailUrl || info.thumbnailUrl,
    description: raw.description || `Captured memory preserved in the interactive 3D gallery walk.`,
    aiStory: raw.aiStory,
    videoUrl: raw.videoUrl || (info.isVideo ? info.streamUrl : undefined),
    videoEmbedUrl: info.embedUrl,
    isVideo: info.isVideo,
    category: raw.category || (info.isVideo ? 'Videos' : 'Memories'),
    tags: raw.tags && raw.tags.length > 0 ? raw.tags : [info.isVideo ? 'Videos' : 'Photo', 'Memory'],
    width: raw.width,
    height: raw.height,
    mimeType: raw.mimeType || (info.isVideo ? 'video/mp4' : 'image/jpeg'),
    webViewLink: info.directWebLink || raw.webViewLink,
  };
}

/**
 * Batch processes a list of memories.
 */
export function processMemoryList(items: Partial<MemoryItem>[]): MemoryItem[] {
  return items.map((item) => processMemoryItem(item));
}
