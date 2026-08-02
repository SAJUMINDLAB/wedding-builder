import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import ParticlesOverlay from './ParticlesOverlay';
import FadeUp from './FadeUp';
import Calendar from './Calendar';
import { X, Play, Menu } from 'lucide-react';

// Extracted Modals
import RsvpModal from './RsvpModal';
import GuestbookWriteModal from './GuestbookWriteModal';
import GuestbookListModal from './GuestbookListModal';
import AdminLoginModal from './AdminLoginModal';

// Extracted Sections
import MainCover from './sections/MainCover';
import IntroArea from './sections/IntroArea';
import HostArea from './sections/HostArea';
import StoryArea from './sections/StoryArea';
import GalleryArea from './sections/GalleryArea';
import LocationArea from './sections/LocationArea';
import AccountArea from './sections/AccountArea';
import GuestbookArea from './sections/GuestbookArea';
import RsvpArea from './sections/RsvpArea';
import RsvpEmphasis from './sections/RsvpEmphasis';
import ShareArea from './sections/ShareArea';

const themeStyles = {
  'cream-beige': { bg: '#FDFBF7', text: '#333333', accent: '#B0946E', fontTitle: 'var(--font-en-serif)', fontBody: 'var(--font-kr-serif)' },
  'epure': { bg: '#ffffff', text: '#222222', accent: '#aaaaaa', fontTitle: 'var(--font-en-sans)', fontBody: 'var(--font-kr-sans)' },
  'vanilla-cream': { bg: '#fdfbf7', text: '#4a4036', accent: '#dcae78', fontTitle: 'var(--font-en-serif)', fontBody: 'var(--font-kr-serif)' },
  'royal-navy': { bg: '#141E30', text: '#F9F9F9', accent: '#E0C097', fontTitle: 'var(--font-en-serif)', fontBody: 'var(--font-kr-serif)' },
  'golden-hour': { bg: '#fffdfa', text: '#332211', accent: '#8B2500', fontTitle: 'var(--font-en-serif)', fontBody: 'var(--font-kr-serif)' },
  'sage-green': { bg: '#F4F5F2', text: '#3D4C41', accent: '#849C8D', fontTitle: 'var(--font-en-serif)', fontBody: 'var(--font-kr-serif)' },
  'lavender-blush': { bg: '#FBF9FA', text: '#4A3B42', accent: '#B497A6', fontTitle: 'var(--font-en-serif)', fontBody: 'var(--font-kr-serif)' },
  'classic-charcoal': { bg: '#F9F9F9', text: '#333333', accent: '#555555', fontTitle: 'var(--font-en-serif)', fontBody: 'var(--font-kr-serif)' },
  'warm-terracotta': { bg: '#FFF9F5', text: '#4A352F', accent: '#C47D68', fontTitle: 'var(--font-en-serif)', fontBody: 'var(--font-kr-serif)' },
  'sunset-breeze': { bg: '#FFF7F2', text: '#4A332A', accent: '#E86A41', fontTitle: 'var(--font-en-serif)', fontBody: 'var(--font-kr-serif)' },
  'midnight-orange': { bg: '#1A1817', text: '#F2EFEB', accent: '#F37021', fontTitle: 'var(--font-en-serif)', fontBody: 'var(--font-kr-serif)' },
  'default': { bg: '#FDFBF7', text: '#333333', accent: '#8C9B90', title: '#333', fontTitle: 'var(--font-en-serif)', fontBody: 'var(--font-kr-serif)' }
};

const InvitationPreview = () => {
  const selectedTheme = useBuilderStore(state => state.selectedTheme);
  const selectedFont = useBuilderStore(state => state.selectedFont);
  const selectedFontEn = useBuilderStore(state => state.selectedFontEn);
  const mainInfo = useBuilderStore(state => state.mainInfo);
  const optionInfo = useBuilderStore(state => state.optionInfo);
  const customColors = useBuilderStore(state => state.customColors);
  const sectionOrder = useBuilderStore(state => state.sectionOrder);
  
  // States that were needed for modals and modals display
  const rsvpInfo = useBuilderStore(state => state.rsvpInfo);
  const guestbookInfo = useBuilderStore(state => state.guestbookInfo);
  const addGuestbookEntry = useBuilderStore(state => state.addGuestbookEntry);
  const removeGuestbookEntry = useBuilderStore(state => state.removeGuestbookEntry);
  const bgmInfo = useBuilderStore(state => state.bgmInfo);

  const [fullscreenImage, setFullscreenImage] = React.useState(null);
  const [showRsvpModal, setShowRsvpModal] = React.useState(false);
  const [showGuestbookModal, setShowGuestbookModal] = React.useState(false);
  const [showGuestbookListModal, setShowGuestbookListModal] = React.useState(false);
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);

  // BGM 상태 및 오디오 제어
  const [isPlaying, setIsPlaying] = React.useState(bgmInfo.autoPlay);
  const audioRef = React.useRef(null);

  // 시네마틱 인트로 상태
  const [showIntro, setShowIntro] = React.useState(optionInfo.cinematicIntro);
  const [fadeIntro, setFadeIntro] = React.useState(false);

  React.useEffect(() => {
    if (optionInfo.cinematicIntro) {
      const timer1 = setTimeout(() => setFadeIntro(true), 3500); // 3.5초 후 페이드아웃 시작 (기존 2.5초에서 연장)
      const timer2 = setTimeout(() => setShowIntro(false), 4500); // 4.5초 후 DOM에서 제거 (기존 3.5초에서 연장)
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  }, [optionInfo.cinematicIntro]);

  const audioTracks = {
    'track1': 'https://www.mfiles.co.uk/mp3-downloads/pachelbel-canon-in-d.mp3',
    'track2': 'https://www.mfiles.co.uk/mp3-downloads/mendelssohn-wedding-march.mp3',
    'track3': 'https://www.mfiles.co.uk/mp3-downloads/chopin-nocturne-op9-no2.mp3'
  };

  React.useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.warn('자동 재생이 브라우저 정책에 의해 차단되었습니다.', e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, bgmInfo.selectedTrack]);

  const fontRatioList = { 'S': 0.9, 'M': 1, 'L': 1.15, 'XL': 1.3 };
  const fontRatio = fontRatioList[optionInfo.fontSize] || 1;
  const baseFontSize = '1rem';
  const particlesType = optionInfo.particlesEffect ? (optionInfo.particleType || 'snow') : 'none';

  React.useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    if (optionInfo.pageZoom) {
      meta.content = 'width=device-width, initial-scale=1.0';
    } else {
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
    }
  }, [optionInfo.pageZoom]);

  // Helper to get text color based on background luminance
  const getContrastTextColor = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#222222' : '#FFFFFF';
  };

  const theme = selectedTheme === 'custom'
    ? { 
        id: 'custom',
        bg: customColors.bg, 
        text: getContrastTextColor(customColors.bg), 
        accent: customColors.accent, 
        title: getContrastTextColor(customColors.bg),
        fontTitle: `'${selectedFontEn}', sans-serif`, 
        fontBody: `'${selectedFont}', sans-serif` 
      }
    : { id: selectedTheme, ...(themeStyles[selectedTheme] || themeStyles['default']) };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '480px', 
      margin: '0 auto', 
      backgroundColor: theme.bg, 
      color: theme.text,
      '--font-kr-serif': `'${selectedFont}', serif`,
      '--font-kr-sans': `'${selectedFont}', sans-serif`,
      '--font-en-serif': `'${selectedFontEn === 'Cormorant Italic' ? 'Cormorant Garamond' : selectedFontEn}', serif`,
      '--font-en-sans': `'${selectedFontEn === 'Cormorant Italic' ? 'Cormorant Garamond' : selectedFontEn}', sans-serif`,
      '--font-en-style': selectedFontEn === 'Cormorant Italic' ? 'italic' : 'normal',
      minHeight: '100%',
      paddingBottom: '100px',
      overflowX: 'hidden',
      position: 'relative',
      '--base-font-size': baseFontSize,
      '--font-ratio': fontRatio,
      fontSize: 'calc(var(--base-font-size) * var(--font-ratio))',
      fontFamily: `'${selectedFont}', sans-serif`
    }}>
      
      {/* 4. Cinematic Intro */}
      {showIntro && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100dvh',
          backgroundColor: theme.id === 'midnight-orange' ? '#1A1817' : '#ffffff',
          zIndex: 99999,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          opacity: fadeIntro ? 0 : 1,
          transition: 'opacity 1s ease-in-out',
          pointerEvents: 'none'
        }}>
          <div style={{ fontFamily: 'var(--font-en-serif)', fontSize: '1.2rem', letterSpacing: '0.3em', marginBottom: '20px', color: theme.accent, animation: 'fadeInUp 1s ease-out' }}>
            WEDDING INVITATION
          </div>
          <div style={{ fontFamily: 'var(--font-kr-serif)', fontSize: '1.5rem', color: theme.text, animation: 'fadeInUp 1s ease-out 0.3s backwards' }}>
            {mainInfo.groomNameKo} & {mainInfo.brideNameKo}
          </div>
          <style>{`
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          `}</style>
        </div>
      )}
      
      {/* 3. Film Grain Effect */}
      {optionInfo.texture && <div className="film-grain" />}
      
      {/* 2. Particles Overlay */}
      {particlesType !== 'none' && <ParticlesOverlay type={particlesType} />}

      <div id="section-home">
        <MainCover theme={theme} onAdminAccess={() => setShowAdminLogin(true)} />
      </div>
      
      {sectionOrder.map((section) => {
        switch (section.id) {
          case 'intro': return <IntroArea key="intro" theme={theme} />;
          case 'host': return <HostArea key="host" theme={theme} />;
          case 'calendar': return (
            <FadeUp key="calendar" active={optionInfo.motionEffect}>
              <Calendar 
                dateString={mainInfo.date} 
                themeAccent={theme.accent} 
                themeText={theme.text}
                groomName={mainInfo.groomNameKo} 
                brideName={mainInfo.brideNameKo} 
              />
            </FadeUp>
          );
          case 'story': return <StoryArea key="story" theme={theme} />;
          case 'gallery': 
            if (!useBuilderStore.getState().galleryInfo.useGallery) return null;
            return <div id="section-gallery" key="gallery"><GalleryArea theme={theme} setFullscreenImage={setFullscreenImage} /></div>;
          case 'location': return <LocationArea key="location" theme={theme} />;
          case 'account': return <AccountArea key="account" theme={theme} />;
          case 'guestbook': return (
            <div id="section-guestbook" key="guestbook">
              <GuestbookArea 
                theme={theme} 
                setShowGuestbookModal={setShowGuestbookModal} 
                setShowGuestbookListModal={setShowGuestbookListModal} 
              />
            </div>
          );
          case 'rsvp': return <div id="section-rsvp" key="rsvp"><RsvpArea theme={theme} setShowRsvpModal={setShowRsvpModal} /></div>;
          default: return null;
        }
      })}
      
      {/* Lightbox Modal */}
      {fullscreenImage && (
        <div 
          onClick={() => setFullscreenImage(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: '#000000', zIndex: 10000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            cursor: 'zoom-out', animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={28} />
          </button>
          <img src={fullscreenImage} alt="fullscreen" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', animation: 'scaleIn 0.2s ease-out' }} />
        </div>
      )}

      <ShareArea theme={theme} />

      {/* Modals */}
      {showAdminLogin && (
        <AdminLoginModal theme={theme} onClose={() => setShowAdminLogin(false)} />
      )}

      <RsvpEmphasis theme={theme} setShowRsvpModal={setShowRsvpModal} />

      {showRsvpModal && (
        <RsvpModal theme={theme} rsvpInfo={rsvpInfo} onClose={() => setShowRsvpModal(false)} />
      )}

      {showGuestbookModal && (
        <GuestbookWriteModal 
          theme={theme} 
          onClose={() => setShowGuestbookModal(false)} 
          addGuestbookEntry={addGuestbookEntry}
        />
      )}

      {showGuestbookListModal && (
        <GuestbookListModal 
          theme={theme} 
          guestbookInfo={guestbookInfo} 
          onClose={() => setShowGuestbookListModal(false)} 
          removeGuestbookEntry={removeGuestbookEntry}
        />
      )}

      {/* Floating BGM Player */}
      {bgmInfo.useBgm && (
        <>
          <audio 
            ref={audioRef} 
            src={bgmInfo.selectedTrack === 'custom' ? bgmInfo.customTrackUrl : (audioTracks[bgmInfo.selectedTrack] || audioTracks['track1'])} 
            loop 
          />
          <div 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ 
              position: 'fixed', bottom: '30px', right: '20px', zIndex: 50,
              width: '44px', height: '44px', borderRadius: '50%',
              backgroundColor: '#fff', border: `1px solid ${theme.border || 'rgba(0,0,0,0.1)'}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              cursor: 'pointer', transition: 'all 0.3s ease',
              animation: isPlaying ? 'pulse 2s infinite' : 'none'
            }}
          >
            {isPlaying ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '16px' }}>
                <div style={{ width: '4px', backgroundColor: theme.text, borderRadius: '2px', animation: 'eq 0.8s ease-in-out infinite alternate' }} />
                <div style={{ width: '4px', backgroundColor: theme.text, borderRadius: '2px', animation: 'eq 1.2s ease-in-out infinite alternate-reverse', animationDelay: '0.2s' }} />
                <div style={{ width: '4px', backgroundColor: theme.text, borderRadius: '2px', animation: 'eq 0.9s ease-in-out infinite alternate', animationDelay: '0.4s' }} />
              </div>
            ) : (
              <Play size={20} color={theme.text} style={{ marginLeft: '2px' }} />
            )}
            
            <style>{`
              @keyframes eq { 0% { height: 4px; } 100% { height: 16px; } }
              @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(0,0,0,0.1); } 70% { box-shadow: 0 0 0 10px rgba(0,0,0,0); } 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); } }
            `}</style>
          </div>
        </>
      )}
    </div>
  );
};

export default InvitationPreview;
