import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const MetricsDisplay = ({ ticker }) => {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticker) {
      setMetrics(null);
      return;
    }

    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/key_metrics/${ticker}`);
        console.log(response.data)
        setMetrics(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load metrics.');
        setMetrics(null);
      }
    };

    fetchMetrics();
  }, [ticker]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Avg PE Ratio */}
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="font-semibold">Avg PE Ratio</h3>
        <p className="text-lg">{metrics.avg_pe_ratio}</p>
      </div>

      {/* Revenue Growth */}
      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="font-semibold">Revenue Growth (%)</h3>
        <p className="text-lg">{isNaN(metrics.revenue_growth) ? 'N/A' : `${metrics.revenue_growth}%`}</p>
      </div>

      {/* PE Ratio History Table */}
      <div className="col-span-2">
        <h3 className="text-xl font-bold mt-6 mb-2">PE Ratio History</h3>
        <table className="min-w-full border">
          <thead>
            <tr>
              {metrics.pe_ratio_series.years.map((year, i) => (
                <th key={i} className="border px-2 py-1">{year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {metrics.pe_ratio_series.values.map((val, i) => (
                <td key={i} className="border px-2 py-1">{val.toFixed(2)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Revenue History Table */}
      <div className="col-span-2">
        <h3 className="text-xl font-bold mt-6 mb-2">Revenue History</h3>
        <table className="min-w-full border">
          <thead>
            <tr>
              {metrics.revenue_series.years.map((year, i) => (
                <th key={i} className="border px-2 py-1">{year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {metrics.revenue_series.values.map((val, i) => (
                <td key={i} className="border px-2 py-1">
                  {isNaN(val) ? 'N/A' : `$${(val / 1e9).toFixed(2)}B`}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsDisplay;
