import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HistoryTable from './HistoryTable';

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
        {/* Profit Growth */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-1">Profit Growth</span>
          <span className="text-3xl font-bold text-green-600">
            {isNaN(metrics.profit_growth) ? 'N/A' : `${metrics.profit_growth}%`}
          </span>
        </div>
      </div>

      {/* PE Ratio History Table */}
      <HistoryTable
        title="P/E Ratio History"
        years={metrics.pe_ratio_series.years}
        values={metrics.pe_ratio_series.values}
        valueFormatter={val => (
          <span className="text-blue-700">{isNaN(val) ? 'N/A' : val.toFixed(2)}</span>
        )}
      />

      {/* Revenue History Table */}
      <HistoryTable
        title="Revenue History"
        years={metrics.revenue_series.years}
        values={metrics.revenue_series.values}
        valueFormatter={val => (
          <span className="text-green-700">{isNaN(val) ? 'N/A' : `$${(val / 1e9).toFixed(2)}B`}</span>
        )}
      />
      {/* Net Income History Table */}
      <HistoryTable
        title="Net Income History"
        years={metrics.net_income_series.years}
        values={metrics.net_income_series.values}
        valueFormatter={val => (
          <span className="text-green-700">{isNaN(val) ? 'N/A' : `$${(val / 1e9).toFixed(2)}B`}</span>
        )}
      />
      {/* Shares Outstanding History Table */}
      <HistoryTable
        title="Shares Outstanding History"
        years={metrics.shares_outstanding_series.years}
        values={metrics.shares_outstanding_series.values}
        valueFormatter={val => (
          <span className="text-green-700">{isNaN(val) ? 'N/A' : `${(val / 1e9).toFixed(2)}B`}</span>
        )}
      />
    </div>
  );
};

export default MetricsDisplay;