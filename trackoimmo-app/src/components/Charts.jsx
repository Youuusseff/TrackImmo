import React from "react";
import styles from "./Charts.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

const sampleTopRegions = [
  { region: "Île-de-France", avg_growth: 12.5 },
  { region: "Provence-Alpes-Côte d'Azur", avg_growth: 10.2 },
  { region: "Occitanie", avg_growth: 9.1 },
  { region: "Nouvelle-Aquitaine", avg_growth: 8.7 },
  { region: "Auvergne-Rhône-Alpes", avg_growth: 7.4 },
];

const samplePriceTrends = [
  { annee_mutation: 2019, avg_price: 2600 },
  { annee_mutation: 2020, avg_price: 2750 },
  { annee_mutation: 2021, avg_price: 2900 },
  { annee_mutation: 2022, avg_price: 3100 },
  { annee_mutation: 2023, avg_price: 3300 },
  { annee_mutation: 2024, avg_price: 3550 },
];

const sampleRegionalPrices = [
  { region: "Île-de-France", avg_price: 4800 },
  { region: "Occitanie", avg_price: 2700 },
  { region: "PACA", avg_price: 3200 },
  { region: "Grand Est", avg_price: 2100 },
  { region: "Bretagne", avg_price: 2600 },
];

const samplePropertyTypes = [
  { type: "Appartement", count: 64 },
  { type: "Maison", count: 36 },
];

const sampleInvestmentScores = [
  { region: "Île-de-France", avg_opportunity_score: 80 },
  { region: "PACA", avg_opportunity_score: 76 },
  { region: "Bretagne", avg_opportunity_score: 71 },
  { region: "Occitanie", avg_opportunity_score: 69 },
  { region: "Grand Est", avg_opportunity_score: 65 },
];

export const TopGrowingRegionsChart = ({ data = sampleTopRegions }) => (
  <div className={styles.chartCard}>
    <h3>📈 Top Growing Regions</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="region" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="avg_growth" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const PriceTrendsChart = ({ data = samplePriceTrends }) => (
  <div className={styles.chartCard}>
    <h3>📊 Price Trends Over Time</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="annee_mutation" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="avg_price" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const RegionalPriceMap = ({ data = sampleRegionalPrices }) => (
  <div className={styles.chartCard}>
    <h3>🗺️ Price Distribution by Region</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="region" type="category" tick={{ fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="avg_price" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const PropertyTypeDistributionChart = ({ data = samplePropertyTypes }) => (
  <div className={styles.chartCard}>
    <h3>🏘️ Property Type Distribution</h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80} label>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export const InvestmentOpportunityChart = ({ data = sampleInvestmentScores }) => (
  <div className={styles.chartCard}>
    <h3>💡 Investment Opportunity Scores</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="region" tick={{ fontSize: 10 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="avg_opportunity_score" fill="#ff8042" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
