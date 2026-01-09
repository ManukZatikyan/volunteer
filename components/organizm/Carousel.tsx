"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface CarouselProps<T = any> {
  testimonials: T[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  slidesToShow?: number;
  showNavigationArrows?: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export const Carousel = <T = any,>({
  testimonials,
  autoPlay = false,
  autoPlayInterval = 5000,
  slidesToShow = 1,
  showNavigationArrows = false,
  renderItem,
  className,
}: CarouselProps<T>) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (after duplicate last slide)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);

  // Calculate slide width based on slidesToShow
  const slideWidth = 100 / slidesToShow;
  
  // Create infinite loop by duplicating first and last slides
  const infiniteTestimonials = testimonials.length > 0 
    ? [testimonials[testimonials.length - 1], ...testimonials, testimonials[0]]
    : [];

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        // If we're at the last duplicate slide, jump to the first real slide (index 1)
        if (next >= infiniteTestimonials.length - 1) {
          setIsTransitioning(true);
          setTimeout(() => {
            setIsTransitioning(false);
            // Jump instantly without transition
            if (slidesContainerRef.current) {
              slidesContainerRef.current.style.transition = 'none';
              setCurrentIndex(1);
              // Re-enable transition after a brief moment
              setTimeout(() => {
                if (slidesContainerRef.current) {
                  slidesContainerRef.current.style.transition = 'transform 0.5s ease-in-out';
                }
              }, 50);
            }
          }, 500);
          return next;
        }
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 500);
        return next;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, testimonials.length, infiniteTestimonials.length]);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    // Add 1 because of the duplicate slide at the beginning
    setCurrentIndex(index + 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const next = prev + 1;
      // If we're at the last duplicate slide, jump to the first real slide (index 1) without animation
      if (next >= infiniteTestimonials.length - 1) {
        setTimeout(() => {
          setIsTransitioning(false);
          // Jump instantly without transition
          if (slidesContainerRef.current) {
            slidesContainerRef.current.style.transition = 'none';
            setCurrentIndex(1);
            // Re-enable transition after a brief moment
            setTimeout(() => {
              if (slidesContainerRef.current) {
                slidesContainerRef.current.style.transition = 'transform 0.5s ease-in-out';
              }
            }, 50);
          }
        }, 500);
        return next;
      }
      return next;
    });
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const next = prev - 1;
      // If we're at the first duplicate slide, jump to the last real slide without animation
      if (next <= 0) {
        setTimeout(() => {
          setIsTransitioning(false);
          // Jump instantly without transition
          if (slidesContainerRef.current) {
            slidesContainerRef.current.style.transition = 'none';
            setCurrentIndex(infiniteTestimonials.length - 2);
            // Re-enable transition after a brief moment
            setTimeout(() => {
              if (slidesContainerRef.current) {
                slidesContainerRef.current.style.transition = 'transform 0.5s ease-in-out';
              }
            }, 50);
          }
        }, 500);
        return next;
      }
      return next;
    });
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Drag/Swipe handlers
  const handleDragStart = (clientX: number) => {
    if (isTransitioning || infiniteTestimonials.length <= 1) return;
    setDragStart(clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || dragStart === null) return;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging || dragStart === null) return;
    
    const threshold = containerRef.current?.clientWidth ? containerRef.current.clientWidth * 0.2 : 100;
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        // Dragging right - go to previous
        setIsTransitioning(true);
        setCurrentIndex((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            // Jump to last real slide
            setTimeout(() => {
              if (slidesContainerRef.current) {
                slidesContainerRef.current.style.transition = 'none';
                setCurrentIndex(infiniteTestimonials.length - 2);
                setTimeout(() => {
                  if (slidesContainerRef.current) {
                    slidesContainerRef.current.style.transition = 'transform 0.5s ease-in-out';
                  }
                  setIsTransitioning(false);
                }, 50);
              }
            }, 500);
            return next;
          }
          setTimeout(() => setIsTransitioning(false), 500);
          return next;
        });
      } else {
        // Dragging left - go to next
        setIsTransitioning(true);
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (next >= infiniteTestimonials.length - 1) {
            // Jump to first real slide
            setTimeout(() => {
              if (slidesContainerRef.current) {
                slidesContainerRef.current.style.transition = 'none';
                setCurrentIndex(1);
                setTimeout(() => {
                  if (slidesContainerRef.current) {
                    slidesContainerRef.current.style.transition = 'transform 0.5s ease-in-out';
                  }
                  setIsTransitioning(false);
                }, 50);
              }
            }, 500);
            return next;
          }
          setTimeout(() => setIsTransitioning(false), 500);
          return next;
        });
      }
    } else {
      // Reset to current position if threshold not met
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
    
    setDragStart(null);
    setDragOffset(0);
    setIsDragging(false);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return;
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleDragMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isTransitioning) return;
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (!isDragging || dragStart === null) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const offset = e.clientX - dragStart;
      setDragOffset(offset);
    };

    const handleGlobalMouseUp = () => {
      const threshold = containerRef.current?.clientWidth ? containerRef.current.clientWidth * 0.2 : 100;
      
      if (Math.abs(dragOffset) > threshold) {
        if (dragOffset > 0) {
          // Dragging right - go to previous
          setIsTransitioning(true);
          setCurrentIndex((prev) => {
            const next = prev - 1;
            if (next <= 0) {
              setTimeout(() => {
                if (slidesContainerRef.current) {
                  slidesContainerRef.current.style.transition = 'none';
                  setCurrentIndex(infiniteTestimonials.length - 2);
                  setTimeout(() => {
                    if (slidesContainerRef.current) {
                      slidesContainerRef.current.style.transition = 'transform 0.5s ease-in-out';
                    }
                    setIsTransitioning(false);
                  }, 50);
                }
              }, 500);
              return next;
            }
            setTimeout(() => setIsTransitioning(false), 500);
            return next;
          });
        } else {
          // Dragging left - go to next
          setIsTransitioning(true);
          setCurrentIndex((prev) => {
            const next = prev + 1;
            if (next >= infiniteTestimonials.length - 1) {
              setTimeout(() => {
                if (slidesContainerRef.current) {
                  slidesContainerRef.current.style.transition = 'none';
                  setCurrentIndex(1);
                  setTimeout(() => {
                    if (slidesContainerRef.current) {
                      slidesContainerRef.current.style.transition = 'transform 0.5s ease-in-out';
                    }
                    setIsTransitioning(false);
                  }, 50);
                }
              }, 500);
              return next;
            }
            setTimeout(() => setIsTransitioning(false), 500);
            return next;
          });
        }
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }
      
      setDragStart(null);
      setDragOffset(0);
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, dragOffset, infiniteTestimonials.length]);

  const getTransform = () => {
    if (!containerRef.current) {
      return '0%';
    }
    
    const containerWidth = containerRef.current.clientWidth;
    
    if (containerWidth === 0) {
      return '0%';
    }
    
    // Calculate gap size: 24px on desktop, 8px on mobile
    const gapSizePx = containerWidth >= 768 ? 24 : 8;
    const gapCount = slidesToShow > 1 ? slidesToShow - 1 : 0;
    
    // Calculate actual slide width accounting for gaps
    const slideWidthPx = (containerWidth - gapCount * gapSizePx) / slidesToShow;
    
    // Transform: move by (slideWidth + gap) for each slide moved
    const baseTransformPx = -currentIndex * (slideWidthPx + gapSizePx);
    
    const baseTransformPercent = (baseTransformPx / containerWidth) * 100;
    
    if (!isDragging || dragOffset === 0) {
      return `${baseTransformPercent}%`;
    }
    
    // Account for drag offset
    // Drag should be proportional to the slide width + gap
    const slideWidthWithGap = slideWidthPx + gapSizePx;
    const dragRatio = dragOffset / slideWidthWithGap;
    const dragPercent = dragRatio * ((slideWidthWithGap / containerWidth) * 100);
    
    // Drag right (positive) = visually move right (less negative) = show previous slide
    // Drag left (negative) = visually move left (more negative) = show next slide
    return `${baseTransformPercent + dragPercent}%`;
  };

  // Get the real index for dots (subtract 1 because of duplicate at beginning)
  const getRealIndex = () => {
    if (currentIndex === 0) return testimonials.length - 1;
    if (currentIndex >= infiniteTestimonials.length - 1) return 0;
    return currentIndex - 1;
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col items-center gap-6 md:gap-8 w-full", className)}>
      {/* Carousel Container */}
      <div className="relative w-full max-w-7xl">
        {/* Navigation Arrows */}
        {showNavigationArrows && infiniteTestimonials.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              disabled={isTransitioning}
              className={cn(
                "absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 md:w-12 md:h-12 rounded-full",
                "bg-white/20 hover:bg-white/40 backdrop-blur-sm",
                "flex items-center justify-center",
                "transition-all duration-300 ease-in-out",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "hover:scale-110 active:scale-95"
              )}
              aria-label="Previous slide"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              disabled={isTransitioning}
              className={cn(
                "absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 md:w-12 md:h-12 rounded-full",
                "bg-white/20 hover:bg-white/40 backdrop-blur-sm",
                "flex items-center justify-center",
                "transition-all duration-300 ease-in-out",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "hover:scale-110 active:scale-95"
              )}
              aria-label="Next slide"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Cards Container */}
        <div
          ref={containerRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div
            ref={slidesContainerRef}
            className="flex"
            style={{
              gap: containerRef.current && containerRef.current.clientWidth >= 768 ? '24px' : '8px',
              transform: `translateX(${getTransform()})`,
              transition: isDragging ? 'none' : 'transform 0.5s ease-in-out',
            }}
          >
            {infiniteTestimonials.map((testimonial, index) => {
              // Calculate slide width accounting for gap
              // For n slides with gap g, each slide width = (100% - (n-1)*g) / n
              const containerWidth = containerRef.current?.clientWidth || 0;
              const gapSizePx = containerWidth >= 768 ? 24 : 8;
              const gapCount = slidesToShow > 1 ? slidesToShow - 1 : 0;
              
              // Calculate actual slide width in percentage
              // Formula: (containerWidth - gapCount * gapSize) / slidesToShow
              const slideWidthPx = containerWidth > 0 
                ? (containerWidth - gapCount * gapSizePx) / slidesToShow 
                : containerWidth / slidesToShow;
              const slideWidthPercent = containerWidth > 0 
                ? (slideWidthPx / containerWidth) * 100 
                : slideWidth;
              
              return (
                <div
                  key={`carousel-item-${index}`}
                  className="shrink-0 select-none"
                  style={{ 
                    userSelect: 'none',
                    width: `${slideWidthPercent}%`,
                    minWidth: 0,
                    flexShrink: 0,
                  }}
                >
                  {renderItem(testimonial, index)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      {testimonials.length > 1 && (
        <div className="flex items-center" style={{ gap: '6px' }}>
          {testimonials.map((_, index) => {
            const realIndex = getRealIndex();
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out",
                  index === realIndex
                    ? "scale-110"
                    : "bg-transparent border hover:opacity-70"
                )}
                style={{
                  backgroundColor: index === realIndex ? '#CBCBCB' : 'transparent',
                  borderColor: '#CBCBCB',
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
