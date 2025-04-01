import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import MapBoxComponent from '../components/MapBoxComponent';

const MapPage = () => {
  const [showHeader, setShowHeader] = useState(false);
  const headerRef = useRef(null);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Check if mouse is near the top of the page (within 10px)
      if (e.clientY <= 10) {
        setShowHeader(true);
      } else if (headerRef.current) {
        // Check if mouse is over the header element
        const headerRect = headerRef.current.getBoundingClientRect();
        const isOverHeader = 
          e.clientY >= headerRect.top && 
          e.clientY <= headerRect.bottom && 
          e.clientX >= headerRect.left && 
          e.clientX <= headerRect.right;
        
        // Only hide the header if we're not hovering over it
        if (!isOverHeader) {
          setShowHeader(false);
        }
      } else {
        setShowHeader(false);
      }
    };
    
    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <>
      {showHeader && <div ref={headerRef}><Header /></div>}
      <MapBoxComponent />
    </>
  );
};

export default MapPage;