import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChartBlock from '../components/ChartBlock';
import styles from './HomePage.module.css';
import SearchBar from '../components/SearchBar';
import FiltersPanel from '../components/FiltersPanel';
import FeaturedListings from '../components/FeaturedListings';

const HomePage = () => {
  const [filters, setFilters] = useState({
    type_local: '',
    price_min: '',
    price_max: '',
    surface_min: '',
    surface_max: '',
    rooms: ''
  });
  
  useEffect(() => {
    console.log("Window width:", window.innerWidth);
  }, []);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };
  
  return (
    <div>
      <Navbar />
      <div className={styles.chartsContainer}>
        <ChartBlock title="Top Growing Regions" type="top_growing_regions" />
        <ChartBlock title="Price Trends" type="national_price_trends" />
      </div>
      <SearchBar filters={filters} />
      <FiltersPanel onFilterChange={handleFilterChange} />
      <FeaturedListings />
    </div>
  );
};

export default HomePage;
