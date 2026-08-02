import React from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import FadeUp from '../FadeUp';

const getMainImageShapeStyle = (shape) => {
  switch(shape) {
    case 'full': return { borderRadius: '0' };
    case 'rectangle': return { borderRadius: '0' };
    case 'rounded': return { borderRadius: '24px' };
    case 'circle': return { borderRadius: '50%' };
    case 'arch': 
    default: 
      return { borderRadius: '160px 160px 0 0' };
  }
};

const MainCover = ({ theme, onAdminAccess }) => {
  const mainInfo = useBuilderStore(state => state.mainInfo);
  const optionInfo = useBuilderStore(state => state.optionInfo);
  const scrollY = useBuilderStore(state => state.scrollY);
  const timerRef = React.useRef(null);

  const handlePointerDown = () => {
    timerRef.current = setTimeout(() => {
      if (onAdminAccess) onAdminAccess();
    }, 5000); // 5초
  };

  const handlePointerUpOrLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const dateObj = new Date(mainInfo.date);
  const formattedDate = isNaN(dateObj) ? '' : `${dateObj.getFullYear()}. ${dateObj.getMonth() + 1}. ${dateObj.getDate()}.`;
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayName = isNaN(dateObj) ? '' : days[dateObj.getDay()];

  return (
    <>
      {/* 프리미엄 헤더 영역 */}
      <FadeUp active={optionInfo.motionEffect}>
        <div style={{ 
          padding: theme.id === 'midnight-orange' ? '80px 20px 60px 20px' : '60px 20px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
          backgroundColor: theme.id === 'midnight-orange' ? theme.accent : 'transparent',
          color: theme.id === 'midnight-orange' ? theme.bg : theme.text,
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          marginBottom: theme.id === 'midnight-orange' ? '-30px' : '0'
        }}>
          <p 
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUpOrLeave}
            onPointerLeave={handlePointerUpOrLeave}
            onTouchStart={handlePointerDown}
            onTouchEnd={handlePointerUpOrLeave}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); return false; }}
            style={{ 
              fontFamily: 'var(--font-en-serif)', fontStyle: 'var(--font-en-style)', 
              fontSize: 'calc(0.85rem * var(--font-ratio))', letterSpacing: 'calc(0.2rem * var(--font-ratio))', 
              marginBottom: '30px', color: theme.id === 'midnight-orange' ? 'rgba(0,0,0,0.4)' : theme.accent, 
              textTransform: 'uppercase',
              userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none', cursor: 'default'
            }}
          >
            Wedding Invitation
          </p>
          
          <div style={{ fontFamily: 'var(--font-en-serif)', fontSize: 'calc(3.2rem * var(--font-ratio))', lineHeight: '1.2', marginBottom: '20px' }}>
            <div style={{ fontWeight: '500', fontStyle: 'var(--font-en-style)' }}>{mainInfo.groomNameEn}</div>
            <div style={{ fontSize: 'calc(1.5rem * var(--font-ratio))', margin: '8px 0', color: theme.id === 'midnight-orange' ? theme.bg : theme.accent }}>&amp;</div>
            <div style={{ fontWeight: '500', fontStyle: 'var(--font-en-style)' }}>{mainInfo.brideNameEn}</div>
          </div>

          <p style={{ fontFamily: 'var(--font-kr-sans)', fontSize: 'calc(0.9rem * var(--font-ratio))', letterSpacing: 'calc(0.1rem * var(--font-ratio))', marginTop: '40px', fontWeight: theme.id === 'midnight-orange' ? '500' : '300' }}>
            {formattedDate} {dayName}. {mainInfo.timeHour}:{mainInfo.timeMinute} {mainInfo.timeAmPm}
          </p>
          <p style={{ fontFamily: 'var(--font-kr-serif)', fontSize: 'calc(1rem * var(--font-ratio))', marginTop: '12px', color: theme.id === 'midnight-orange' ? theme.bg : theme.text, opacity: theme.id === 'midnight-orange' ? 0.8 : 1 }}>
            {mainInfo.location}
          </p>
        </div>
      </FadeUp>

      {/* 프리미엄 메인 이미지 (Parallax) */}
      <FadeUp active={optionInfo.motionEffect}>
        <div style={{ padding: mainInfo.mainImageShape === 'full' ? '0' : '0 20px', display: 'flex', justifyContent: 'center', marginBottom: '70px', position: 'relative', zIndex: 10 }}>
          {mainInfo.mainImageShape === 'full' ? (
            <img 
              src={mainInfo.mainImage} 
              alt="Main Cover" 
              style={{ width: '100%', height: 'auto', display: 'block' }} 
            />
          ) : (
            <div style={{ 
              overflow: 'hidden', width: '100%', maxWidth: '320px', 
              height: mainInfo.mainImageShape === 'circle' ? '320px' : '420px', 
              backgroundColor: '#EBEBEB', 
              ...getMainImageShapeStyle(mainInfo.mainImageShape) 
            }}>
              <div style={{ 
                width: '100%', 
                height: '130%', 
                backgroundImage: mainInfo.mainImage ? `url(${mainInfo.mainImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: optionInfo.parallaxEffect ? `translateY(-${scrollY * 0.15}px)` : 'none',
                transition: 'transform 0.1s ease-out'
              }}>
              </div>
            </div>
          )}
        </div>
      </FadeUp>
    </>
  );
};

export default MainCover;
