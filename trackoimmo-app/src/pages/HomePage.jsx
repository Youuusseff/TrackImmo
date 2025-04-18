import React from 'react';
import Navbar from '../components/Navbar';
import ChartBlock from '../components/ChartBlock';
import styles from './HomePage.module.css';
import SearchBar from '../components/SearchBar';
import FiltersPanel from '../components/FiltersPanel';
import FeaturedListings from '../components/FeaturedListings';
import { useEffect } from 'react';

const HomePage = () => {
  const handleSearch = (query) => {
    console.log('Search triggered for:', query);
    // TODO: fetch listings based on query
  };
  const handleFilterChange = (filters) => console.log('Filters:', filters);
  useEffect(() => {
    console.log("Window width:", window.innerWidth);
  }, []);
  
  return (
    <div>
      <Navbar />
      <div className={styles.chartsContainer}>
        <ChartBlock title="Top Growing Regions" type="top_growing_regions" />
        <ChartBlock title="Price Trends" type="national_price_trends" />
      </div>
      <SearchBar onSearch={handleSearch} />
      <FiltersPanel onFilterChange={handleFilterChange} />
      <FeaturedListings />
    </div>
  );
};

export default HomePage;

