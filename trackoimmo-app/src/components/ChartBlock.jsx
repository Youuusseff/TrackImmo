import React, { useEffect, useState } from 'react';
import styles from './ChartBlock.module.css';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';
import { postalCodeToRegion } from '../utils/postalCodeToRegion';
import { fetchStatByType } from '../services/api';

const ChartBlock = ({ title, type }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const apiData = await fetchStatByType(type);

        if (type === "top_growing_regions") {
          const mapped = apiData.map(item => ({
            ...item,
            region: postalCodeToRegion(item.code_postal)
          }));
          setData(mapped);
        } else {
          setData(apiData);
        }

      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };

    loadStats();
  }, [type]);

  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        {type === "top_growing_regions" ? (
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 22 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avg_growth" fill="#82ca9d" />
          </BarChart>
        ) : type === "national_price_trends" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="annee_mutation" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avg_price" stroke="#8884d8" />
          </LineChart>
        ) : (
          <p>No chart for this type.</p>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartBlock;


