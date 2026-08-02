import React, { useRef, useEffect, useState } from 'react';

const FadeUp = ({ children, active, delay = '0s' }) => {
  const [isVisible, setIsVisible] = useState(!active);
  const domRef = useRef();

  useEffect(() => {
    if (!active) {
      setIsVisible(true);
      return;
    }
    
    setIsVisible(false); // reset
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    return () => observer.disconnect();
  }, [active]);

  return (
    <div 
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}, transform 1s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

export default FadeUp;
