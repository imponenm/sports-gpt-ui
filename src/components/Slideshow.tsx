'use client';

import React, { useState, useEffect } from 'react';

interface SlideshowProps {
  images: string[];
  interval?: number;
  className?: string;
  imageClassName?: string;
  showDots?: boolean;
  height?: string;
}

export const Slideshow: React.FC<SlideshowProps> = ({
  images,
  interval = 5000,
  className = '',
  imageClassName = '',
  showDots = true,
  height = '300px'
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const slideTimer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => {
      clearInterval(slideTimer);
    };
  }, [images.length, interval]);

  if (!images || images.length === 0) {
    return null;
  }

  // For debugging
  console.log('Current image:', images[currentImageIndex]);

  return (
    <div 
      className={`relative w-full overflow-hidden rounded-lg ${className}`}
      style={{ 
        minHeight: height,
        aspectRatio: '16/9',
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-pulse text-purple-300">Loading image...</div>
        </div>
      )}
      
      {images.map((src, index) => (
        <div 
          key={index}
          className={`
            absolute inset-0 w-full h-full transition-opacity duration-1000
            ${currentImageIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}
          `}
        >
          <img 
            src={src} 
            alt={`Slideshow image ${index + 1}`} 
            className={`w-full h-full object-contain md:object-contain ${imageClassName}`}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            crossOrigin="anonymous"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              console.error(`Failed to load image: ${src}`);
              setHasError(true);
              setIsLoading(false);
            }}
          />
        </div>
      ))}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-20">
          <div className="text-red-400">Failed to load images. Please check the URLs.</div>
        </div>
      )}
      
      {showDots && images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-30 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentImageIndex === index ? 'bg-purple-500' : 'bg-gray-500 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 