import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardMedia } from '@mui/material';
import { useSwipeable } from 'react-swipeable';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './HomeHighlightBanner.scss';

export interface BannerItem {
  img_src: string;
  inner_url?: string;
  external_url?: string;
  alt?: string;
}

export interface HomeHighlightBannerProps {
  items: BannerItem[];
  duration?: number; // Duración en milisegundos (default: 5000)
  autoPlay?: boolean; // Si se debe reproducir automáticamente (default: true)
}

const HomeHighlightBanner = ({ items, duration = 5000, autoPlay = true }: HomeHighlightBannerProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || isPaused || items.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, duration);

    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, isPaused, duration, items.length]);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
      setIsTransitioning(false);
    }, 300); // Duración de la transición
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
      setIsTransitioning(false);
    }, 300); // Duración de la transición
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true, // También funciona con mouse drag
    preventScrollOnSwipe: true,
  });

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleBannerClick = () => {
    const currentItem = items[currentIndex];

    if (currentItem.external_url) {
      window.open(currentItem.external_url, '_blank', 'noopener,noreferrer');
    } else if (currentItem.inner_url) {
      navigate(currentItem.inner_url);
    }
  };

  const hasNavigation = items.length > 1;
  const isClickable = items[currentIndex]?.inner_url || items[currentIndex]?.external_url;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      className="home-highlight-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="banner-container" {...swipeHandlers}>
        {/* Previous Button */}
        {hasNavigation && (
          <button className="banner-nav-button banner-nav-button--prev" onClick={handlePrev} aria-label="Anterior">
            <DynamicIcons iconName="MdChevronLeft" size={32} color="white" />
          </button>
        )}

        {/* Banner Image */}
        <CardMedia
          component="img"
          image={items[currentIndex].img_src}
          alt={items[currentIndex].alt || `Banner ${currentIndex + 1}`}
          className={`banner-image ${isClickable ? 'banner-image--clickable' : ''} ${isTransitioning ? 'banner-image--transitioning' : ''}`}
          onClick={isClickable ? handleBannerClick : undefined}
          sx={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
        />

        {/* Next Button */}
        {hasNavigation && (
          <button className="banner-nav-button banner-nav-button--next" onClick={handleNext} aria-label="Siguiente">
            <DynamicIcons iconName="MdChevronRight" size={32} color="white" />
          </button>
        )}
      </div>

      {/* Dots Navigation */}
      {hasNavigation && (
        <div className="banner-dots">
          {items.map((_, index) => (
            <button
              key={index}
              className={`banner-dot ${index === currentIndex ? 'banner-dot--active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Ir a banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeHighlightBanner;
