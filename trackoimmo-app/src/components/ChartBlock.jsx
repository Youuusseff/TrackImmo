import React from 'react';
import styles from './ChartBlock.module.css';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';
import { postalCodeToRegion } from '../utils/postalCodeToRegion';

const ChartBlock = ({ title, type }) => {
  // 🔹 Sample data for bar chart
  const sampleBarData = [
    { code_postal: "75001", avg_growth: 12.5 },
    { code_postal: "69002", avg_growth: 10.2 },
    { code_postal: "13001", avg_growth: 9.8 },
    { code_postal: "34000", avg_growth: 8.4 },
    { code_postal: "33000", avg_growth: 7.6 }
  ];

  // 🔹 Sample data for line chart
  const sampleLineData = [
    { annee_mutation: 2019, avg_price: 2600 },
    { annee_mutation: 2020, avg_price: 2750 },
    { annee_mutation: 2021, avg_price: 2900 },
    { annee_mutation: 2022, avg_price: 3100 },
    { annee_mutation: 2023, avg_price: 3300 },
    { annee_mutation: 2024, avg_price: 3550 }
  ];

  // Select data based on type
  const data =
    type === "top_growing_regions"
      ? sampleBarData.map(item => ({
          ...item,
          region: postalCodeToRegion(item.code_postal)
        }))
      : sampleLineData;

  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        {type === "top_growing_regions" ? (
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 22 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region"
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 10 }}
                    className='x' />
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

