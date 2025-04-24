import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FilterSidebar from '../components/FilterSidebar';
import MapPanel from '../components/MapPanel';
import styles from './ListingsPage.module.css';
import { fetchListings } from '../services/api';

const ListingsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const filtersFromURL = {
    city: queryParams.get('city') || '',
    type_local: queryParams.get('type_local') || '',
    rooms: queryParams.get('rooms') || '',
    price_min: queryParams.get('price_min') || '',
    price_max: queryParams.get('price_max') || '',
    surface_min: queryParams.get('surface_min') || '',
    surface_max: queryParams.get('surface_max') || ''
  };

  const [filters, setFilters] = useState(filtersFromURL);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 1000;
      setIsMobile(isNowMobile);
      if (!isNowMobile) setShowSidebar(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {
      city: params.get('city') || '',
      type_local: params.get('type_local') || '',
      rooms: params.get('rooms') || '',
      price_min: params.get('price_min') || '',
      price_max: params.get('price_max') || '',
      surface_min: params.get('surface_min') || '',
      surface_max: params.get('surface_max') || ''
    };
    setFilters(newFilters);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listings = await fetchListings(filters);
        setFilteredListings(listings);
        console.log("Fetched listings:", listings);
      } catch (error) {
        console.error("Error loading listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        {isMobile && (
          <button
            className={styles.sidebarToggleBtn}
            onClick={() => setShowSidebar((prev) => !prev)}
          >
            {showSidebar ? '✖' : '☰'}
          </button>
        )}

        <div
          className={`${styles.sidebar} ${
            isMobile ? (showSidebar ? styles.sidebarVisible : styles.sidebarHidden) : ''
          }`}
        >
          <FilterSidebar filters={filters} onChange={handleFilterChange} />
        </div>

        <div className={styles.mapWrapper}>
          {loading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.spinner}></div>
            </div>
          ) : (
            <MapPanel listings={filteredListings} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;





