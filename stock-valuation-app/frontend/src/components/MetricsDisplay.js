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
        setMetrics(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load metrics.');
        setMetrics(null);
      }
    };

    fetchMetrics();
  }, [ticker]);

  if (error) return <div className="text-red-600 text-center mt-4">{error}</div>;
  if (!metrics) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Avg PE Ratio */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-1">Average P/E Ratio</span>
          <span className="text-3xl font-bold text-blue-700">{metrics.avg_pe_ratio}</span>
        </div>
        {/* Revenue Growth */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-1">Revenue Growth</span>
          <span className="text-3xl font-bold text-green-600">
            {isNaN(metrics.revenue_growth) ? 'N/A' : `${metrics.revenue_growth}%`}
          </span>
        </div>
      </div>

      {/* PE Ratio History Table */}
      <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">P/E Ratio History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-center">
            <thead>
              <tr>
                {metrics.pe_ratio_series.years.map((year, i) => (
                  <th key={i} className="px-3 py-2 text-gray-600 font-medium">{year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {metrics.pe_ratio_series.values.map((val, i) => (
                  <td key={i} className="px-3 py-2 text-blue-700 font-semibold">{val.toFixed(2)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue History Table */}
      <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Revenue History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-center">
            <thead>
              <tr>
                {metrics.revenue_series.years.map((year, i) => (
                  <th key={i} className="px-3 py-2 text-gray-600 font-medium">{year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {metrics.revenue_series.values.map((val, i) => (
                  <td key={i} className="px-3 py-2 text-green-700 font-semibold">
                    {isNaN(val) ? 'N/A' : `$${(val / 1e9).toFixed(2)}B`}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;