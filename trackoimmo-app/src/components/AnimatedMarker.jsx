import React, { useEffect, useRef } from 'react';
import { Marker } from 'react-simple-maps';
import gsap from 'gsap';
import markerIcon from '../assets/map-marker-svgrepo-com.svg';
import styles from './AnimatedMarker.module.css';

const AnimatedMarker = ({ coordinates, item, onSelect }) => {
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

  return (
    <Marker coordinates={coordinates}>
      <image
        ref={markerRef}
        href={markerIcon}
        width={20}
        height={30}
        transform="translate(-10, -30)"
        onClick={() => onSelect(item)}
        style={{ cursor: 'pointer' }}
      />
      <title>{item.titre}</title>
    </Marker>
  );
};

export default AnimatedMarker;
