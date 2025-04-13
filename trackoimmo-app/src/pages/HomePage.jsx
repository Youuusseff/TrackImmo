import React from 'react';
import Navbar from '../components/Navbar';
import ChartBlock from '../components/ChartBlock';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.chartsContainer}>
        <ChartBlock title="Top Growing Regions" type="top_growing_regions" />
        <ChartBlock title="Price Trends" type="national_price_trends" />
      </div>
    </div>
  );
};

export default HomePage;

