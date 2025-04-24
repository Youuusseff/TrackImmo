import React, { useEffect, useRef, useState } from 'react';
import styles from './FeaturedListings.module.css';
import gsap from 'gsap';
import { fetchListings } from '../services/api'; 

const FeaturedListings = () => {
  const tickerRef = useRef(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const allListings = await fetchListings();
        const topPicks = allListings
          .filter(l => l.prediction === 1.0 && l.potential_5y_growth_pct !== null)
          .sort((a, b) => b.potential_5y_growth_pct - a.potential_5y_growth_pct)
          .slice(0, 5);

        setListings(topPicks);
      } catch (error) {
        console.error("Error loading featured listings:", error);
      }
    };

    loadFeatured();
  }, []);

  useEffect(() => {
    if (listings.length === 0) return;

    const cards = gsap.utils.toArray('.listingCard');
    const totalWidth = cards.length * 280;

    gsap.set(tickerRef.current, { width: `${totalWidth}px` });

    gsap.to(tickerRef.current, {
      xPercent: -50,
      duration: 20,
      ease: 'linear',
      repeat: -1,
    });
  }, [listings]);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>🔥 Investment Picks</h2>
      <div className={styles.scroller}>
        <div className={styles.ticker} ref={tickerRef}>
          {[...listings, ...listings].map((listing, index) => (
            <a
              key={index}
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.card} listingCard`}
            >
              <h4>{listing.titre}</h4>
              <p><strong>Type:</strong> {listing.type_local}</p>
              <p><strong>Surface:</strong> {listing.surface_reelle_bati} m²</p>
              <p><strong>Prix:</strong> €{listing.valeur_fonciere?.toLocaleString() ?? 'N/A'}</p>
              <p><strong>Discount:</strong> {listing.price_discount_pct ?? 'N/A'}%</p>
              <p><strong>5Y Growth:</strong> {listing.potential_5y_growth_pct ?? 'N/A'}%</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedListings;


