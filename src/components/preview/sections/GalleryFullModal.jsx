import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const GalleryFullModal = ({ theme, images, onClose, setFullscreenImage }) => {
  // 모달이 열렸을 때 배경 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.bg,
      zIndex: 9999, // 다른 요소보다 위에 오도록 설정
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* 헤더 영역 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        backgroundColor: theme.bg,
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ width: '24px' }}></div>
        <h3 style={{
          fontFamily: 'var(--font-en-serif)',
          fontSize: 'calc(1.2rem * var(--font-ratio))',
          color: theme.accent,
          margin: 0,
          letterSpacing: 'calc(0.1rem * var(--font-ratio))'
        }}>
          Gallery
        </h3>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: theme.text,
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={24} />
        </button>
      </div>

      {/* 이미지 그리드 영역 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '4px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '4px',
        alignContent: 'start'
      }}>
        {images.map((img, idx) => (
          <div 
            key={img.id || idx} 
            onClick={() => {
              // 썸네일 클릭 시 기존 풀스크린(스와이프) 모달 띄우기
              setFullscreenImage(img.url);
            }} 
            style={{ 
              aspectRatio: '1', 
              overflow: 'hidden', 
              cursor: 'pointer' 
            }}
          >
            <img 
              src={img.url} 
              alt={`gallery-full-${idx}`} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryFullModal;
