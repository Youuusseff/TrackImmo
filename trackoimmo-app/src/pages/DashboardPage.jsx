import React from 'react';
import Navbar from '../components/Navbar';
import { TopGrowingRegionsChart, PriceTrendsChart, RegionalPriceMap, PropertyTypeDistributionChart, InvestmentOpportunityChart } from '../components/Charts';

import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.dashboardWrapper}>
        <h1 className={styles.dashboardTitle}>Tableau de Bord Immobilier</h1>
        <div className={styles.chartsGrid}>
          <TopGrowingRegionsChart />
          <PriceTrendsChart />
          <RegionalPriceMap />
          <PropertyTypeDistributionChart />
          <InvestmentOpportunityChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

