import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function BacktestResults({ results }) {
  if (!results || !results.metrics || !results.equity_curve || !results.trades) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No results to display.</p>
      </div>
    );
  }

  const chartData = {
    labels: results.equity_curve.map(point => point.timestamp),
    datasets: [
      {
        label: 'Portfolio Value',
        data: results.equity_curve.map(point => point.equity),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Equity Curve'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `$${value.toLocaleString()}`
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Backtest Results</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Sharpe Ratio</p>
            <p className="text-2xl font-semibold text-gray-900">
              {results.metrics.sharpe_ratio !== undefined
                ? results.metrics.sharpe_ratio.toFixed(2)
                : 'N/A'}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Return</p>
            <p className="text-2xl font-semibold text-gray-900">
              {results.metrics.total_return !== undefined
                ? (results.metrics.total_return * 100).toFixed(2) + '%'
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div>
        <h3 className="text-md font-medium text-gray-900 mb-2">Trade History</h3>
        <div className="max-h-60 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.trades.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-400">No trades executed.</td>
                </tr>
              ) : (
                results.trades.map((trade, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        trade.action === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {trade.action.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trade.price !== undefined ? `$${trade.price.toFixed(2)}` : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BacktestResults;