import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FilterSidebar from '../components/FilterSidebar';
import styles from './ListingsPage.module.css';
import sampleData from '../utils/sampleListings.json';
import MapPanel from '../components/MapPanel';

const ListingsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const filtersFromURL = {
    city: queryParams.get('city') || '',
    type_local: queryParams.get('type_local') || '',
    rooms: queryParams.get('rooms') || '',
    price_min: queryParams.get('price_min') || '',
    price_max: queryParams.get('price_max') || '',
  };

  const [filters, setFilters] = useState(filtersFromURL);
  const [filteredListings, setFilteredListings] = useState([]);

  useEffect(() => {
    let filtered = sampleData;

    if (filters.city) {
      filtered = filtered.filter((item) =>
        item.code_postal && item.code_postal.startsWith(filters.city)
      );
    }

    if (filters.type_local) {
      filtered = filtered.filter((item) => item.type_local === filters.type_local);
    }

    if (filters.rooms) {
      filtered = filtered.filter(
        (item) => item.nombre_pieces_principales >= parseInt(filters.rooms)
      );
    }

    if (filters.price_min) {
      filtered = filtered.filter(
        (item) => item.valeur_fonciere >= parseInt(filters.price_min)
      );
    }

    if (filters.price_max) {
      filtered = filtered.filter(
        (item) => item.valeur_fonciere <= parseInt(filters.price_max)
      );
    }

    setFilteredListings(filtered);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <FilterSidebar filters={filters} onChange={handleFilterChange} />
        {console.log("Filtered listings sample:", filteredListings[0])}
        <MapPanel listings={filteredListings} />
      </div>
    </div>
  );
};

export default ListingsPage;

