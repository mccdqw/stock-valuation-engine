import { useEffect, useState } from 'react';
import axios from 'axios';
import HistoryTable from './HistoryTable';
import MetricCard from './MetricCard';

const API_BASE_URL = 'http://localhost:5000';

const MetricsDisplay = ({ ticker, onlyCards, onlyTables, tableName }) => {
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

  // Render a single table if tableName is provided
  if (tableName) {
    const tableMap = {
      pe_ratio: {
        title: "P/E Ratio History",
        years: metrics.pe_ratio_series.years,
        values: metrics.pe_ratio_series.values,
        valueFormatter: val => (
          <span className="text-blue-700">{isNaN(val) ? 'N/A' : val.toFixed(2)}</span>
        ),
      },
      revenue: {
        title: "Revenue History",
        years: metrics.revenue_series.years,
        values: metrics.revenue_series.values,
        valueFormatter: val => (
          <span className="text-green-700">{isNaN(val) ? 'N/A' : `$${(val / 1e9).toFixed(2)}B`}</span>
        ),
      },
      net_income: {
        title: "Net Income History",
        years: metrics.net_income_series.years,
        values: metrics.net_income_series.values,
        valueFormatter: val => (
          <span className="text-green-700">{isNaN(val) ? 'N/A' : `$${(val / 1e9).toFixed(2)}B`}</span>
        ),
      },
      free_cash_flow: {
        title: "FCF History",
        years: metrics.free_cash_flow_series.years,
        values: metrics.free_cash_flow_series.values,
        valueFormatter: val => (
          <span className="text-green-700">{isNaN(val) ? 'N/A' : `$${(val / 1e9).toFixed(2)}B`}</span>
        ),
      },
      shares_outstanding: {
        title: "Shares Outstanding History",
        years: metrics.shares_outstanding_series.years,
        values: metrics.shares_outstanding_series.values,
        valueFormatter: val => (
          <span className="text-green-700">{isNaN(val) ? 'N/A' : `${(val / 1e9).toFixed(2)}B`}</span>
        ),
      },
    };
    const table = tableMap[tableName];
    if (!table) return null;
    return (
      <HistoryTable
        title={table.title}
        years={table.years}
        values={table.values}
        valueFormatter={table.valueFormatter}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Metrics Cards */}
      {!onlyTables && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricCard
            label="Average P/E Ratio"
            value={metrics.avg_pe_ratio}
            color="text-blue-700"
            isNa={isNaN(metrics.avg_pe_ratio)}
          />
          <MetricCard
            label="Revenue Growth"
            value={metrics.revenue_growth}
            valueSuffix="%"
            color="text-green-600"
            isNa={isNaN(metrics.revenue_growth)}
          />
          <MetricCard
            label="Profit Growth"
            value={metrics.profit_growth}
            valueSuffix="%"
            color="text-green-600"
            isNa={isNaN(metrics.profit_growth)}
          />
          <MetricCard
            label="FCF Growth"
            value={metrics.fcf_growth}
            valueSuffix="%"
            color="text-green-600"
            isNa={isNaN(metrics.fcf_growth)}
          />
          <MetricCard
            label="LTL / Avg FCF Ratio"
            value={metrics.ltl_fcf_ratio}
            color="text-green-600"
            isNa={isNaN(metrics.ltl_fcf_ratio)}
          />
          <MetricCard
            label="Avg P/FCF Ratio"
            value={metrics.avg_p_fcf_ratio}
            color="text-green-600"
            isNa={isNaN(metrics.avg_p_fcf_ratio)}
          />
        </div>
      )}
      {/* History Tables */}
      {!onlyCards && (
        <div className="space-y-8">
          <HistoryTable
            title="P/E Ratio History"
            years={metrics.pe_ratio_series.years}
            values={metrics.pe_ratio_series.values}
            valueFormatter={val => (
              <span className="text-blue-700">{isNaN(val) ? 'N/A' : val.toFixed(2)}</span>
            )}
          />
          <HistoryTable
            title="Revenue History"
            years={metrics.revenue_series.years}
            values={metrics.revenue_series.values}
            valueFormatter={val => (
              <span className="text-green-700">{isNaN(val) ? 'N/A' : `$${(val / 1e9).toFixed(2)}B`}</span>
            )}
          />
          <HistoryTable
            title="Net Income History"
            years={metrics.net_income_series.years}
            values={metrics.net_income_series.values}
            valueFormatter={val => (
              <span className="text-green-700">{isNaN(val) ? 'N/A' : `$${(val / 1e9).toFixed(2)}B`}</span>
            )}
          />
          <HistoryTable
            title="Shares Outstanding History"
            years={metrics.shares_outstanding_series.years}
            values={metrics.shares_outstanding_series.values}
            valueFormatter={val => (
              <span className="text-green-700">{isNaN(val) ? 'N/A' : `${(val / 1e9).toFixed(2)}B`}</span>
            )}
          />
          <HistoryTable
            title="FCF History"
            years={metrics.free_cash_flow_series.years}
            values={metrics.free_cash_flow_series.values}
            valueFormatter={val => (
              <span className="text-green-700">{isNaN(val) ? 'N/A' : `$${(val / 1e9).toFixed(2)}B`}</span>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default MetricsDisplay;