import React, { useEffect, useRef } from 'react';
import { Marker } from 'react-simple-maps';
import gsap from 'gsap';
import markerIcon from '../assets/map-marker-svgrepo-com.svg';
import styles from './AnimatedMarker.module.css';

const AnimatedMarker = ({ coordinates, item, onSelect, isSelected }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
      gsap.fromTo(
        markerRef.current,
        { scale: 0, y: -20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }
  }, []);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      gsap.to(markerRef.current, {
        scale: 1.2,
        duration: 0.2,
        repeat: 1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, [isSelected]);

  const handleMouseEnter = () => {
    if (markerRef.current) {
      gsap.to(markerRef.current, {
        scale: 1.2,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    if (markerRef.current) {
      gsap.to(markerRef.current, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.inOut'
      });
    }
  };

  const isMobile = window.innerWidth < 768;

  return (
    <Marker coordinates={coordinates}>
      <image
        ref={markerRef}
        href={markerIcon}
        width={isMobile ? 50 : 24}
        height={isMobile ? 56 : 32}
        transform={`translate(-${isMobile ? 10 : 12}, -${isMobile ? 26 : 32})`}
        onClick={() => onSelect(item)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'pointer' }}
      />
      <title>{item.titre}</title>
    </Marker>
  );
};

export default AnimatedMarker;

