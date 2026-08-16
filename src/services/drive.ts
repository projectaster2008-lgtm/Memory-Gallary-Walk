import { MemoryItem } from '../types';

export const DEFAULT_FOLDER_ID = '1GiWF-RbQLKGgUK54_JUfFz5421ms9r8F';
export const DEFAULT_FOLDER_URL = 'https://drive.google.com/drive/folders/1GiWF-RbQLKGgUK54_JUfFz5421ms9r8F?usp=drive_link';

export function extractFolderId(input: string): string {
  if (!input) return DEFAULT_FOLDER_ID;
  const folderMatch = input.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];
  const idMatch = input.match(/id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  return input.trim();
}

// Fallback high-definition curated photography dataset for sample preview & demo modes
export const SAMPLE_MEMORIES: MemoryItem[] = [
  {
    id: 'sample-1',
    name: 'Santorini Sunset Vista.jpg',
    title: 'Santorini Golden Twilight',
    location: 'Oia, Santorini, Greece 🇬🇷',
    date: '2024-07-14',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=70',
    description: 'White-washed cliffside villas overlooking the azure Aegean Sea during a glowing Mediterranean sunset.',
    tags: ['Travel', 'Architecture', 'Sunset', 'Mediterranean'],
  },
  {
    id: 'sample-2',
    name: 'Kyoto Bamboo Grove.jpg',
    title: 'Arashiyama Bamboo Forest',
    location: 'Kyoto, Japan 🇯🇵',
    date: '2024-04-20',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=70',
    description: 'Towering green bamboo stalks filtering morning sunlight along a serene walking path in Kyoto.',
    tags: ['Nature', 'Peaceful', 'Japan', 'Forest'],
  },
  {
    id: 'sample-3',
    name: 'Dolomites Alpine Peaks.jpg',
    title: 'Tre Cime di Lavaredo',
    location: 'Dolomites, Italy 🇮🇹',
    date: '2024-09-03',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=70',
    description: 'Jagged limestone peaks rising majestically above morning clouds in the northern Italian Alps.',
    tags: ['Mountain', 'Adventure', 'Alps', 'Hiking'],
  },
  {
    id: 'sample-4',
    name: 'Amalfi Coast Harbor.jpg',
    title: 'Positano Cliffside Glow',
    location: 'Positano, Amalfi Coast, Italy 🇮🇹',
    date: '2024-06-18',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=70',
    description: 'Vibrant pastel houses cascading down sheer cliffs toward glistening turquoise waters.',
    tags: ['Coast', 'Summer', 'Italy', 'Sea'],
  },
  {
    id: 'sample-5',
    name: 'Iceland Aurora Borealis.jpg',
    title: 'Celestial Northern Lights',
    location: 'Kirkjufell, Iceland 🇮🇸',
    date: '2024-11-08',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=400&q=70',
    description: 'Emerald curtains of auroral light dancing across the Arctic night sky above frozen waterfalls.',
    tags: ['Aurora', 'Night', 'Iceland', 'Winter'],
  },
  {
    id: 'sample-6',
    name: 'Banff Moraine Lake.jpg',
    title: 'Glacial Reflections',
    location: 'Banff National Park, Canada 🇨🇦',
    date: '2024-08-22',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=70',
    description: 'Intense turquoise glacial waters mirroring the rugged Valley of the Ten Peaks.',
    tags: ['Lakes', 'Wilderness', 'Canada', 'Reflection'],
  },
  {
    id: 'sample-7',
    name: 'Cappadocia Balloon Sunrise.jpg',
    title: 'Hot Air Balloons over Goreme',
    location: 'Cappadocia, Turkey 🇹🇷',
    date: '2024-05-12',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=70',
    description: 'Hundreds of colorful hot air balloons ascending above mystical fairy chimney rock formations.',
    tags: ['Sunrise', 'HotAirBalloon', 'Turkey', 'Dreamy'],
  },
  {
    id: 'sample-8',
    name: 'Swiss Alpine Valley.jpg',
    title: 'Lauterbrunnen Valley',
    location: 'Bernese Oberland, Switzerland 🇨🇭',
    date: '2024-07-29',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=400&q=70',
    description: 'Lush green valley framed by steep cliffs and the famous Staubbach Waterfall.',
    tags: ['Switzerland', 'Waterfalls', 'Mountains', 'Scenic'],
  },
  {
    id: 'sample-9',
    name: 'Kyoto Torii Gates.jpg',
    title: 'Fushimi Inari Pathways',
    location: 'Kyoto, Japan 🇯🇵',
    date: '2024-04-15',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=70',
    description: 'Endless vermilion torii gates winding up the wooded sacred mountain of Inari.',
    tags: ['Culture', 'Torii', 'Japan', 'Heritage'],
  },
  {
    id: 'sample-10',
    name: 'Grand Canyon Vista.jpg',
    title: 'Desert Sun on Ancient Strata',
    location: 'Arizona, United States 🇺🇸',
    date: '2024-10-04',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=70',
    description: 'Vast canyon expanses carved over millions of years glowing under late afternoon desert sun.',
    tags: ['Canyon', 'Desert', 'USA', 'Panoramic'],
  },
  {
    id: 'sample-11',
    name: 'Yosemite Valley Sunbeam.jpg',
    title: 'Valley of El Capitan',
    location: 'Yosemite National Park, California 🇺🇸',
    date: '2024-06-02',
    imageUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=400&q=70',
    description: 'Towering granite monoliths and pristine pine forests bathed in pure morning light.',
    tags: ['Yosemite', 'Granite', 'Nature', 'NationalPark'],
  },
  {
    id: 'sample-12',
    name: 'Machu Picchu Citadel.jpg',
    title: 'Citadel in the Clouds',
    location: 'Cusco Region, Peru 🇵🇪',
    date: '2024-08-11',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=400&q=70',
    description: 'Ancient Incan stone terraces perched precariously among emerald Andean cloud forests.',
    tags: ['Inca', 'Archaeology', 'Peru', 'Andes'],
  }
];

export async function fetchDriveFolderPhotos(
  folderId: string,
  accessToken: string
): Promise<{ items: MemoryItem[]; folderName: string }> {
  try {
    // 1. Fetch Folder Metadata
    let folderName = 'Google Drive Memory Folder';
    try {
      const folderRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${folderId}?fields=id,name`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (folderRes.ok) {
        const folderData = await folderRes.json();
        if (folderData.name) {
          folderName = folderData.name;
        }
      }
    } catch (err) {
      console.warn('Could not fetch folder metadata:', err);
    }

    // 2. Query files inside the folder
    // Support image types, photos, or all files in folder if specific query fails
    const query = `'${folderId}' in parents and trashed = false`;
    const filesUrl = new URL('https://www.googleapis.com/drive/v3/files');
    filesUrl.searchParams.set('q', query);
    filesUrl.searchParams.set(
      'fields',
      'files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink, createdTime, description, imageMediaMetadata, size)'
    );
    filesUrl.searchParams.set('pageSize', '100');
    filesUrl.searchParams.set('orderBy', 'createdTime desc');

    const res = await fetch(filesUrl.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `Google Drive API error (${res.status}): ${res.statusText}`
      );
    }

    const data = await res.json();
    const rawFiles: any[] = data.files || [];

    // Filter image files
    const imageFiles = rawFiles.filter((f) => {
      const mime = (f.mimeType || '').toLowerCase();
      const name = (f.name || '').toLowerCase();
      return (
        mime.startsWith('image/') ||
        mime.includes('photo') ||
        /\.(jpg|jpeg|png|webp|gif|bmp|heic|svg)$/i.test(name)
      );
    });

    const targetFiles = imageFiles.length > 0 ? imageFiles : rawFiles;

    if (targetFiles.length === 0) {
      return { items: [], folderName };
    }

    // Convert into MemoryItem array
    const memoryItems: MemoryItem[] = await Promise.all(
      targetFiles.map(async (file, idx) => {
        // High-res thumbnail link replacement
        let thumb = file.thumbnailLink || '';
        if (thumb) {
          // Drive thumbnails support size parameter like =s800 or =s1600
          thumb = thumb.replace(/=s\d+/, '=s1200');
        }

        // Clean name into nice title
        const cleanTitle = file.name
          ? file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
          : `Memory #${idx + 1}`;

        // Format date
        const dateStr = file.createdTime
          ? new Date(file.createdTime).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : 'Preserved Memory';

        // Check EXIF or location if available
        let location = 'Google Drive Archive';
        if (file.imageMediaMetadata?.location) {
          const loc = file.imageMediaMetadata.location;
          location = `${loc.latitude.toFixed(2)}°, ${loc.longitude.toFixed(2)}°`;
        }

        // Tags
        const tags = ['Drive Photo'];
        if (file.imageMediaMetadata?.cameraMake) {
          tags.push(file.imageMediaMetadata.cameraMake);
        }

        // Generate full image URL or fetch blob URL for instant crisp rendering
        let imageUrl = thumb || file.webContentLink || '';

        // If thumbnail is missing or we want direct authenticated stream
        if (!imageUrl) {
          imageUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
        }

        return {
          id: file.id,
          driveFileId: file.id,
          name: file.name || `Photo ${idx + 1}`,
          title: cleanTitle,
          location,
          date: dateStr,
          imageUrl,
          thumbnailUrl: thumb || imageUrl,
          description: file.description || '',
          tags,
          width: file.imageMediaMetadata?.width,
          height: file.imageMediaMetadata?.height,
          mimeType: file.mimeType,
          webViewLink: file.webViewLink,
        };
      })
    );

    return { items: memoryItems, folderName };
  } catch (err: any) {
    console.error('Error fetching Google Drive folder photos:', err);
    throw err;
  }
}

// Helper to fetch an image as a secure Blob Object URL with Bearer token
const blobCache = new Map<string, string>();

export async function fetchAuthenticatedImageBlob(
  fileId: string,
  accessToken: string
): Promise<string> {
  if (blobCache.has(fileId)) {
    return blobCache.get(fileId)!;
  }

  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to download image blob: ${res.status}`);
    }

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    blobCache.set(fileId, objectUrl);
    return objectUrl;
  } catch (error) {
    console.warn(`Could not load blob for ${fileId}, using fallback`, error);
    return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  }
}
