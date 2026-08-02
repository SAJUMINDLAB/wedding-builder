import React, { useRef, useState } from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import FadeUp from '../FadeUp';
import { ChevronDown } from 'lucide-react';
import GalleryFullModal from './GalleryFullModal';

const dummyImages = [
  { id: 'd1', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80' },
  { id: 'd2', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80' },
  { id: 'd3', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80' },
  { id: 'd4', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80' },
  { id: 'd5', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=400&q=80' },
  { id: 'd6', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80' },
  { id: 'd7', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80' },
  { id: 'd8', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80' },
  { id: 'd9', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=80' }
];

const GalleryArea = ({ theme, setFullscreenImage }) => {
  const optionInfo = useBuilderStore(state => state.optionInfo);
  const galleryInfo = useBuilderStore(state => state.galleryInfo);
  const [showFullGallery, setShowFullGallery] = useState(false);

  // Carousel Drag-to-Scroll Logic
  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
    carouselRef.current.style.cursor = 'grabbing';
    carouselRef.current.style.scrollSnapType = 'none';
  };
  
  const handleMouseLeave = () => {
    isDragging.current = false;
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
      carouselRef.current.style.scrollSnapType = 'x mandatory';
    }
  };
  
  const handleMouseUp = () => {
    isDragging.current = false;
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
      carouselRef.current.style.scrollSnapType = 'x mandatory';
    }
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current);
    if (Math.abs(walk) > 5) hasDragged.current = true;
    carouselRef.current.scrollLeft = scrollLeft.current - walk * 1.5;
  };

  const handleImageClick = (url) => {
    if (hasDragged.current) return; // Prevent click if dragging
    setFullscreenImage(url);
  };

  if (!galleryInfo.useGallery) return null;

  const displayImages = galleryInfo.images.length > 0 ? galleryInfo.images : dummyImages;
  const visibleGridImages = galleryInfo.layout === 'grid' ? displayImages.slice(0, 9) : displayImages;
  const hasMore = galleryInfo.layout === 'grid' && displayImages.length > 9;

  return (
    <>
      <FadeUp active={optionInfo.motionEffect}>
        <div style={{ padding: '60px 20px', position: 'relative', zIndex: 10 }}>
          <h3 style={{ 
            fontFamily: 'var(--font-en-serif)', 
            fontSize: 'calc(1.5rem * var(--font-ratio))', 
            textAlign: 'center', 
            marginBottom: '30px', 
            color: theme.accent,
            letterSpacing: 'calc(0.1rem * var(--font-ratio))'
          }}>
            Gallery
          </h3>
          
          {galleryInfo.layout === 'grid' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                {visibleGridImages.map((img, idx) => (
                  <div key={img.id} onClick={() => setFullscreenImage(img.url)} style={{ aspectRatio: '1', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
                    <img src={img.url} alt={`gallery-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} className="hover-scale" />
                    
                    {/* +N 더보기 오버레이 (마지막 이미지에만) */}
                    {hasMore && idx === 8 && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation(); // 썸네일(스와이프 모달) 안 뜨게 막기
                          setShowFullGallery(true);
                        }}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 'calc(1.4rem * var(--font-ratio))', fontFamily: 'var(--font-kr-sans)' }}
                      >
                        +{displayImages.length - 9}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {hasMore && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                  <button 
                    onClick={() => setShowFullGallery(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: `1px solid ${theme.text}`, color: theme.text, padding: '10px 24px', borderRadius: '24px', fontFamily: 'var(--font-kr-sans)', fontSize: 'calc(0.9rem * var(--font-ratio))', cursor: 'pointer', transition: 'all 0.2s', opacity: 0.8 }}
                  >
                    더보기 <ChevronDown size={16} />
                  </button>
                </div>
              )}
            </>
          )}

          {galleryInfo.layout === 'carousel' && (
            <div 
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              style={{ display: 'flex', overflowX: 'auto', gap: '12px', paddingBottom: '10px', scrollSnapType: 'x mandatory', cursor: 'grab' }} 
              className="hide-scrollbar"
            >
              {displayImages.map((img, idx) => (
                <div key={img.id} onClick={() => handleImageClick(img.url)} style={{ width: '85%', flex: '0 0 85%', scrollSnapAlign: 'center', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', aspectRatio: '4/5' }}>
                  <img src={img.url} draggable={false} alt={`gallery-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeUp>

      {/* 갤러리 9장 초과 시 보여줄 풀 모달 화면 */}
      {showFullGallery && (
        <GalleryFullModal 
          theme={theme} 
          images={displayImages} 
          onClose={() => setShowFullGallery(false)}
          setFullscreenImage={setFullscreenImage}
        />
      )}
    </>
  );
};

export default GalleryArea;
