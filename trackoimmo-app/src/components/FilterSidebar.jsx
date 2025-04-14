import React from 'react';
import styles from './FilterSidebar.module.css';

const FilterSidebar = ({ filters, onChange }) => {
  const handleInput = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <div className={styles.sidebar}>
      <h3>Filtrer</h3>
      <select name="type_local" value={filters.type_local} onChange={handleInput}>
        <option value="">Type de bien</option>
        <option value="Maison">Maison</option>
        <option value="Appartement">Appartement</option>
      </select>

      <select name="rooms" value={filters.rooms} onChange={handleInput}>
        <option value="">Nombre de pièces</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>

      <input
        type="number"
        name="price_min"
        placeholder="Prix min"
        value={filters.price_min}
        onChange={handleInput}
      />

      <input
        type="number"
        name="price_max"
        placeholder="Prix max"
        value={filters.price_max}
        onChange={handleInput}
      />
    </div>
  );
};

export default FilterSidebar;
