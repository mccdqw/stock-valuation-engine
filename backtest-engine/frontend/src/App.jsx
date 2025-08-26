import { useState } from 'react';
import BacktestForm from './components/BacktestForm';
import StrategyFormWrapper from './components/StrategyFormWrapper';
import BacktestResults from './components/BacktestResults';
import axios from 'axios';

function App() {
  const [backtestResults, setBacktestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBacktestSubmit = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/backtest', params, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBacktestResults(response.data);
    } catch (err) {
      setError('Failed to run backtest. Please check your inputs or server status.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900">Quant Backtest Engine</h1>
          </div>
        </div>
      </nav>
      
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left side - Form */}
          <div className="w-1/3 flex-shrink-0">
            <StrategyFormWrapper onSubmit={handleBacktestSubmit} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Right side - Results */}
          <div className="w-2/3 flex-grow">
            {backtestResults ? (
              <BacktestResults results={backtestResults} />
            ) : (
              <div className="h-full flex items-center justify-center bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">Run a backtest to see results</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;