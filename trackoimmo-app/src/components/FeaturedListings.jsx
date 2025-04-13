import React, { useEffect, useRef } from 'react';
import styles from './FeaturedListings.module.css';
import gsap from 'gsap';

const sampleListings = [
  {
    titre: "Maison 7 pièces 152 m²",
    type_local: "Maison",
    surface_reelle_bati: 152.2,
    valeur_fonciere: 288000,
    price_discount_pct: 47.8,
    potential_5y_growth_pct: 78.6,
    url: "https://www.bienici.com/annonce/vente/saint-lubin-de-la-haye/maison/7pieces/era-2-56175643"
  },
  {
    titre: "Appartement 4 pièces 80 m²",
    type_local: "Appartement",
    surface_reelle_bati: 80.2,
    valeur_fonciere: 199500,
    price_discount_pct: 30.3,
    potential_5y_growth_pct: 80.9,
    url: "https://www.bienici.com/annonce/vente/bois-d-arcy/appartement/4pieces/era-2-53962000"
  },
  {
    titre: "Appartement 2 pièces 39 m²",
    type_local: "Appartement",
    surface_reelle_bati: 39.2,
    valeur_fonciere: 123625,
    price_discount_pct: -15.6,
    potential_5y_growth_pct: 24,
    url: "https://www.bienici.com/annonce/vente/lormont/appartement/2pieces/immo-facile-57461478"
  },
  {
    titre: "Maison 6 pièces 193 m²",
    type_local: "Maison",
    surface_reelle_bati: 193.2,
    valeur_fonciere: 682500,
    price_discount_pct: 9.3,
    potential_5y_growth_pct: 26.5,
    url: "https://www.bienici.com/annonce/vente/mios/maison/6pieces/immo-facile-57473222"
  },
  {
    titre: "Maison 5 pièces 141 m²",
    type_local: "Maison",
    surface_reelle_bati: 141.2,
    valeur_fonciere: 212000,
    price_discount_pct: 61,
    potential_5y_growth_pct: 100,
    url: "https://www.bienici.com/annonce/vente/saint-donan/maison/5pieces/square-habitat-immo-facile-43058053"
  },
];

const FeaturedListings = () => {
  const tickerRef = useRef(null);

  useEffect(() => {
    const cards = gsap.utils.toArray('.listingCard');
    const totalWidth = cards.length * 280; // approx card width + margin

    gsap.set(tickerRef.current, { width: `${totalWidth}px` });

    gsap.to(tickerRef.current, {
      xPercent: -50,
      duration: 20,
      ease: 'linear',
      repeat: -1,
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>🔥 Investment Picks</h2>
      <div className={styles.scroller}>
        <div className={styles.ticker} ref={tickerRef}>
          {[...sampleListings, ...sampleListings].map((listing, index) => (
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
              <p><strong>Prix:</strong> €{listing.valeur_fonciere.toLocaleString()}</p>
              <p><strong>Discount:</strong> {listing.price_discount_pct}%</p>
              <p><strong>5Y Growth:</strong> {listing.potential_5y_growth_pct}%</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedListings;

