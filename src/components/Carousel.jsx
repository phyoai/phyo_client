'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeftLine, ChevronRightLine } from '@phyoofficial/phyo-icon-library';

/**
 * Carousel Component - Display items in a rotating carousel
 * Supports automatic play, manual navigation
 */

const Carousel = React.forwardRef(({
  items = [],
  autoPlay = true,
  autoPlayDelay = 5000,
  showControls = true,
  showIndicators = true,
  onSlideChange,
  className = '',
  itemClassName = '',
  ...props
}, ref) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % items.length);
    }, autoPlayDelay);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDelay, items.length]);

  useEffect(() => {
    onSlideChange?.(currentSlide);
  }, [currentSlide, onSlideChange]);

  const goToSlide = (index) => {
    setCurrentSlide(index % items.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
  };

  if (!items.length) return null;

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden rounded-lg group ${className}`}
      {...props}
    >
      {/* Slides */}
      <div className="relative w-full bg-neutral-muted">
        {items.map((item, index) => (
          <div
            key={index}
            className={`
              absolute w-full h-full transition-opacity duration-500
              ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}
              ${itemClassName}
            `}
          >
            {typeof item === 'string' ? (
              <img src={item} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
            ) : (
              item
            )}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {showControls && items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-brand-base transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeftLine width={24} height={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-brand-base transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRightLine width={24} height={24} />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-2 h-2 rounded-full transition-all
                ${index === currentSlide
                  ? 'bg-white w-6'
                  : 'bg-white/60 hover:bg-white/80'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

Carousel.displayName = 'Carousel';

export default Carousel;
