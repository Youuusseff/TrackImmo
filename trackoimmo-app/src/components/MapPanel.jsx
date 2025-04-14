import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { postalToCoords } from '../utils/postalToCoords';
import AnimatedMarker from './AnimatedMarker';
import styles from './MapPanel.module.css';

const geoUrl = "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson";

const MapPanel = ({ listings }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className={styles.mapWrapper}>
      <ComposableMap
        projection="geoConicConformal"
        projectionConfig={{ center: [2.5, 46.6], scale: 2500 }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} fill="#f3f3f3" stroke="#aaa" />
            ))
          }
        </Geographies>

        {listings.map((item, index) => {
          const department = item.code_postal?.substring(0, 2);
          const coords = postalToCoords[department];
          if (!coords) return null;

          const offset = (Math.random() - 0.5) * 0.3;

          return (
            <AnimatedMarker
              key={index}
              coordinates={[coords[0] + offset, coords[1] + offset]}
              item={item}
              onSelect={setSelectedItem}
            />
          );
        })}
      </ComposableMap>

      {selectedItem && (
        <div className={styles.detailsCard}>
          <h2>{selectedItem.titre}</h2>
          <p><strong>Type:</strong> {selectedItem.type_local}</p>
          <p><strong>Surface:</strong> {selectedItem.surface_reelle_bati} m²</p>
          <p><strong>Pièces:</strong> {selectedItem.nombre_pieces_principales}</p>
          <p><strong>Code postal:</strong> {selectedItem.code_postal}</p>
          <p><strong>Prix:</strong> €{selectedItem.valeur_fonciere.toLocaleString()}</p>
          <p><strong>Prix/m²:</strong> €{selectedItem.prix_m2?.toFixed(2)}</p>
          <p><strong>Prix moyen m²:</strong> €{selectedItem.avg_market_price_m2?.toFixed(2)}</p>
          <p><strong>Réduction:</strong> {selectedItem.price_discount_pct}%</p>
          <p><strong>Croissance 1 an:</strong> {selectedItem.yoy_growth_pct}%</p>
          <p><strong>Croissance 5 ans:</strong> {selectedItem.potential_5y_growth_pct}%</p>
          <a href={selectedItem.url} target="_blank" rel="noopener noreferrer">Voir l'annonce</a>
        </div>
      )}
    </div>
  );
};

export default MapPanel;


