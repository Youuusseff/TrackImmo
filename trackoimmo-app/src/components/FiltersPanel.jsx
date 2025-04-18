import React, { useState } from 'react';
import styles from './FiltersPanel.module.css';

const FiltersPanel = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    type_local: '',
    price_min: '',
    price_max: '',
    surface_min: '',
    surface_max: '',
    rooms: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className={styles.filtersContainer}>
      <select name="type_local" value={filters.type_local} onChange={handleChange} className={styles.select}>
        <option value="">Type de bien</option>
        <option value="Appartement">Appartement</option>
        <option value="Maison">Maison</option>
      </select>

      <input
        type="number"
        name="price_min"
        placeholder="Prix min (€)"
        value={filters.price_min}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price_max"
        placeholder="Prix max (€)"
        value={filters.price_max}
        onChange={handleChange}
      />

      <input
        type="number"
        name="surface_min"
        placeholder="Surface min (m²)"
        value={filters.surface_min}
        onChange={handleChange}
      />
      <input
        type="number"
        name="surface_max"
        placeholder="Surface max (m²)"
        value={filters.surface_max}
        onChange={handleChange}
      />

      <select name="rooms" value={filters.rooms} onChange={handleChange}>
        <option value="">Pièces</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>
    </div>
  );
};

export default FiltersPanel;
