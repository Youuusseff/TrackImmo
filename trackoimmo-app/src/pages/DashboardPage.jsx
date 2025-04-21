import React from 'react';
import Navbar from '../components/Navbar';
import { TopGrowingRegionsChart, PriceTrendsChart, RegionalPriceMap, PropertyTypeDistributionChart, InvestmentOpportunityChart } from '../components/Charts';

import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  return (
    <div>
      <Navbar />
      <h1 className={styles.dashboardTitle}>Tableau de Bord Immobilier</h1>
      <div className={styles.dashboardWrapper}>
        <div className={styles.chartsGrid}>
          <PropertyTypeDistributionChart />
          <PriceTrendsChart />
          <div></div>
          <div></div>
          <div></div>
          <TopGrowingRegionsChart/>
          <div></div>
          <RegionalPriceMap />
          <div></div>
          <InvestmentOpportunityChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

