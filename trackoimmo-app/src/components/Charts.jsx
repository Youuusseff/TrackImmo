import React, { useEffect, useState } from "react";
import styles from "./Charts.module.css";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, PieChart, Pie, Cell
} from "recharts";
import { fetchStatByType } from "../services/api";
import { postalCodeToRegion } from "../utils/postalCodeToRegion";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

export const TopGrowingRegionsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatByType("top_growing_regions")
      .then((rawData) => {
        const transformed = rawData.map((item) => ({
          ...item,
          region: postalCodeToRegion(item.code_postal),
        }));
        setData(transformed);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`${styles.chartCard} ${styles.bottomChart} ${styles.topGrowingRegions}`}>
      <h3>📈 Top Growing Regions</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="region"
              tick={{ fontSize: 10 }}
              angle={-30}
              textAnchor="end"
              interval={0}
            />
            <YAxis tickFormatter={(value) => `${(value / 100000).toFixed(1)}%`} />
            <Tooltip formatter={(value) => [`${(value / 100000).toFixed(2)} %`, 'avg_growth']} />

            <Bar dataKey="avg_growth" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export const PriceTrendsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetchStatByType("national_price_trends")
    .then((res) => {
      const yearlyAvg = {};
      res.forEach((item) => {
        const year = item.annee_mutation;
        if (!yearlyAvg[year]) {
          yearlyAvg[year] = { year, total: item.avg_price, count: 1 };
        } else {
          yearlyAvg[year].total += item.avg_price;
          yearlyAvg[year].count += 1;
        }
      });
      const averaged = Object.values(yearlyAvg).map((y) => ({
        annee_mutation: y.year,
        avg_price: y.total / y.count
      }));
      const sorted = averaged.sort((a, b) => a.annee_mutation - b.annee_mutation);
      setData(sorted);
    })
    .finally(() => setLoading(false));
}, []);


  return (
    <div className={`${styles.chartCard} ${styles.priceTrend}`}>
      <h3>📊 Price Trends Over Time</h3>
      {loading ? <p>Loading...</p> : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 10" />
            <XAxis dataKey="annee_mutation" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avg_price" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export const RegionalPriceMap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatByType("regional_price_distribution")
      .then((rawData) => {
        const transformed = rawData.map((item) => ({
          region: postalCodeToRegion(item.code_postal),
          avg_price: item.avg_price
        }));
        setData(transformed);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`${styles.chartCard} ${styles.bottomChart}`}>
      <h3>🗺️ Price Distribution by Region</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="region" type="category" tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="avg_price" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export const PropertyTypeDistributionChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatByType("property_type_distribution")
      .then((res) => {
        const transformed = res.map(item => ({
          type: item.type_local,
          count: item.property_count
        }));
        setData(transformed);
      })
      .finally(() => setLoading(false));
  }, []);
  

  return (
    <div className={styles.chartCard}>
      <h3>🏘️ Property Type Distribution</h3>
      {loading ? <p>Loading...</p> : (
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
      )}
    </div>
  );
};

export const InvestmentOpportunityChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatByType("investment_opportunity_scores")
      .then((res) => {
        const normalized = res
        .map(item => {
          const region = postalCodeToRegion(item.code_postal);
          const score = Math.round(item.avg_opportunity_score / (item.property_count || 1));
          return {
            region,
            avg_opportunity_score: Math.min(score, 100),
          };
        })
        .filter(item => item.region !== "Inconnu");

        setData(normalized);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`${styles.chartCard} ${styles.bottomChart} ${styles.investmentOpportunity}`}>
      <h3>💡 Investment Opportunity Scores</h3>
      {loading ? <p>Loading...</p> : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => `${value} pts`} />
            <Bar dataKey="avg_opportunity_score" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

