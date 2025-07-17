import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

const BeforeAfterSlider = ({
  beforeImage = "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
  afterImage = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  beforeAlt = "Before renovation",
  afterAlt = "After renovation",
  className = "",
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    if ("touches" in e) {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  };

  const handleMouseUp = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDragging(false);
    setTouchStart(null);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (!containerRef.current) return;

    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;

      // If we have a touch start position, check if this is primarily vertical scrolling
      if (touchStart && !isDragging) {
        const deltaX = Math.abs(clientX - touchStart.x);
        const deltaY = Math.abs(clientY - touchStart.y);

        // If vertical movement is greater than horizontal, allow normal scrolling
        if (deltaY > deltaX) {
          return;
        }

        // If horizontal movement is significant, start dragging
        if (deltaX > 10) {
          setIsDragging(true);
        }
      }

      // Only prevent default if we're actively dragging
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    } else {
      // Mouse event - always handle
      clientX = e.clientX;
      if (!isDragging) return;
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isDragging) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const containerWidth = rect.width;

    const newPosition = Math.max(0, Math.min(100, (x / containerWidth) * 100));
    setSliderPosition(newPosition);
  };

  const handleBeforeClick = () => {
    setSliderPosition(100);
  };

  const handleAfterClick = () => {
    setSliderPosition(0);
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      setIsDragging(false);
      setTouchStart(null);
    };

    window.addEventListener("mouseup", handleMouseUpGlobal);
    window.addEventListener("touchend", handleMouseUpGlobal);

    return () => {
      window.removeEventListener("mouseup", handleMouseUpGlobal);
      window.removeEventListener("touchend", handleMouseUpGlobal);
    };
  }, []);

  return (
    <div
      className={`relative w-full aspect-video overflow-hidden bg-background ${className}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onTouchStart={(e) => {
        if (e.touches.length === 1) {
          setTouchStart({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          });
        }
      }}
    >
      {/* After image (full width) */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={afterImage}
          alt={afterAlt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeAlt}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>

      {/* Slider handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 1.1 }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-1 h-3 sm:h-4 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </motion.div>

      {/* Labels */}
      <div
        className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium cursor-pointer hover:bg-black/70 transition-colors"
        onClick={handleBeforeClick}
      >
        Before
      </div>
      <div
        className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium cursor-pointer hover:bg-black/70 transition-colors"
        onClick={handleAfterClick}
      >
        After
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
