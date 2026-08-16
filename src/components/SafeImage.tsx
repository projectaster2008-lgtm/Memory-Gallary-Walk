import React, { useState, useEffect } from 'react';
import { MemoryItem } from '../types';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  memory?: Partial<MemoryItem>;
  src?: string;
  alt?: string;
  fallbackIcon?: React.ReactNode;
}

export default function SafeImage({
  memory,
  src: initialSrc,
  alt = 'Memory photo',
  className = '',
  ...rest
}: SafeImageProps) {
  const fileId =
    memory?.driveFileId ||
    (memory?.id || '').replace('drive-', '') ||
    (initialSrc || '').match(/drive-image\/([^/?]+)/)?.[1] ||
    (initialSrc || '').match(/\/d\/([^/?=]+)/)?.[1];

  // Derive initial candidate URL
  const candidateUrl =
    initialSrc ||
    (fileId ? `https://lh3.googleusercontent.com/d/${fileId}=s800` : '') ||
    memory?.imageUrl ||
    memory?.thumbnailUrl ||
    '';

  const [currentSrc, setCurrentSrc] = useState<string>(candidateUrl);
  const [failCount, setFailCount] = useState(0);

  useEffect(() => {
    const freshUrl =
      initialSrc ||
      (fileId ? `https://lh3.googleusercontent.com/d/${fileId}=s800` : '') ||
      memory?.imageUrl ||
      memory?.thumbnailUrl ||
      '';
    setCurrentSrc(freshUrl);
    setFailCount(0);
  }, [initialSrc, fileId, memory?.imageUrl, memory?.thumbnailUrl]);

  const handleError = () => {
    if (!fileId) {
      // Fallback SVG data URI for non-drive items
      setCurrentSrc(
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231e293b"/><text x="200" y="200" fill="%2394a3b8" font-size="20" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">Memory Photo</text></svg>`
      );
      return;
    }

    if (failCount === 0) {
      setFailCount(1);
      setCurrentSrc(`https://drive.google.com/thumbnail?id=${fileId}&sz=w800`);
    } else if (failCount === 1) {
      setFailCount(2);
      setCurrentSrc(`https://drive.usercontent.google.com/download?id=${fileId}&export=download`);
    } else if (failCount === 2) {
      setFailCount(3);
      setCurrentSrc(`/api/drive-image/${fileId}`);
    } else {
      // Elegant stylized SVG fallback so it NEVER looks broken
      const label = encodeURIComponent((memory?.title || 'Memory').slice(0, 18));
      setCurrentSrc(
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%230f172a"/><circle cx="200" cy="180" r="48" fill="%231e293b"/><polygon points="190,165 220,180 190,195" fill="%2338bdf8"/><text x="200" y="270" fill="%23f1f5f9" font-size="18" font-weight="bold" font-family="sans-serif" text-anchor="middle">${label}</text></svg>`
      );
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      loading="lazy"
      onError={handleError}
      className={className}
      {...rest}
    />
  );
}
