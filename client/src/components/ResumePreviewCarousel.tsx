import React, { useState, useRef } from 'react';

interface ResumePreviewCarouselProps {
  title: string;
  images: string[];
  colorClass?: string;
  points: string[];
}

const ResumePreviewCarousel: React.FC<ResumePreviewCarouselProps> = ({ title, images, colorClass = "text-green-500", points }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < images.length - 1) setCurrentPage(currentPage + 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const delta = touchStartX.current - touchEndX.current;
      if (delta > 50) handleNext();
      if (delta < -50) handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="relative w-full border rounded-xl p-6 shadow-lg bg-white dark:bg-neutral-900">
      <h3 className={`text-lg font-semibold mb-4 text-center ${colorClass}`}>
        {title} (Page {currentPage + 1} of {images.length})
      </h3>

      <div
        className="relative w-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentPage]}
          alt={`Resume Page ${currentPage + 1}`}
          className="rounded-xl max-h-[1000px] w-full object-contain"
        />

        {currentPage > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:text-green-500 p-2 rounded-full shadow-md"
            aria-label="Previous Page"
          >
            &#8592;
          </button>
        )}

        {currentPage < images.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:text-green-500 p-2 rounded-full shadow-md"
            aria-label="Next Page"
          >
            &#8594;
          </button>
        )}
      </div>

      <ul className="text-sm text-neutral-700 dark:text-neutral-200 list-disc list-inside mt-6">
        {points.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResumePreviewCarousel;
