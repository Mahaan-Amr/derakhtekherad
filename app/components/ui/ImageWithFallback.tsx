'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  className = '',
  width = 500,
  height = 300,
  priority = false,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      priority={priority}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}