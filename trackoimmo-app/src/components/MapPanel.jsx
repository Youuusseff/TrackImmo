import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { postalToCoords } from '../utils/postalToCoords';
import AnimatedMarker from './AnimatedMarker';
import styles from './MapPanel.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const geoUrl = "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson";

const MapPanel = ({ listings }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const markers = useMemo(() => {
  const grouped = {};

  listings.forEach((item) => {
    const department = item.code_postal?.substring(0, 2);
    const coords = postalToCoords[department];
    if (!coords) return;

    if (!grouped[department]) {
      grouped[department] = [];
    }

    grouped[department].push({ ...item, baseCoords: coords });
  });

  const finalMarkers = [];
  Object.values(grouped).forEach((group) => {
    const total = group.length;
    const [cx, cy] = group[0].baseCoords;

    const radius = 0.15; // rayon d’éparpillement fixe
    const minAngle = (2 * Math.PI) / Math.max(total, 1); // espacement angulaire

    group.forEach((item, index) => {
      const angle = index * minAngle;

      // on décale doucement autour du centre du département
      const dx = radius * Math.cos(angle);
      const dy = radius * Math.sin(angle);

      // clamp pour éviter les débordements
      finalMarkers.push({
        ...item,
        coords: [
          clamp(cx + dx, -5, 9),
          clamp(cy + dy, 41, 52),
        ],
      });
    });
  });

  return finalMarkers;
}, [listings]);



  return (
    <div className={styles.mapWrapper}>
      <ComposableMap
        projection="geoConicConformal"
        projectionConfig={{ center: [2.5, 46.6], scale: 2500 }}
        style={{ width: "100%", height: "100%" ,maxWidth: '100vw',maxHeight: '100vh'}}  // <- THIS IS CRUCIAL
      >

        <ZoomableGroup zoom={1} center={[2.5, 46.6]}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} fill="#f3f3f3" stroke="#aaa" />
              ))
            }
          </Geographies>

          {markers.map((item, index) => {
            if (!item) return null;
            return (
              <AnimatedMarker
                key={index}
                coordinates={item.coords}
                item={item}
                onSelect={setSelectedItem}
                isSelected={selectedItem?.url === item.url}
              />
            );
          })}
        </ZoomableGroup>
      </ComposableMap>


      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className={styles.detailsCard}
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <button className={styles.closeBtn} onClick={() => setSelectedItem(null)}>✖</button>

            <h2 className={styles.title}>{selectedItem.titre}</h2>

            <div className={styles.detailsGrid}>
              <span><strong>🏠 Type:</strong> {selectedItem.type_local}</span>
              <span><strong>📏 Surface:</strong> {selectedItem.surface_reelle_bati} m²</span>
              <span><strong>🛋️ Pièces:</strong> {selectedItem.nombre_pieces_principales || 'N/A'}</span>
              <span><strong>📍 Code postal:</strong> {selectedItem.code_postal}</span>
              <span><strong>💰 Prix:</strong> €{selectedItem.valeur_fonciere?.toLocaleString() || 'N/A'}</span>
              <span><strong>📐 Prix/m²:</strong> €{selectedItem.prix_m2?.toFixed(2) || 'N/A'}</span>
              <span><strong>📊 Prix moyen m²:</strong> €{selectedItem.avg_market_price_m2?.toFixed(2) || 'N/A'}</span>
              <span><strong>🧾 Réduction:</strong> <span className={styles.badge}>{selectedItem.price_discount_pct ?? 'N/A'}%</span></span>
              <span><strong>📈 Croissance 1 an:</strong> <span className={styles.badge}>{selectedItem.yoy_growth_pct ?? 'N/A'}%</span></span>
              <span><strong>🚀 Croissance 5 ans:</strong> <span className={styles.badge}>{selectedItem.potential_5y_growth_pct ?? 'N/A'}%</span></span>
            </div>

            <a
              href={selectedItem.url}
              className={styles.ctaBtn}
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir l'annonce 🔎
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapPanel;



