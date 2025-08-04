import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ValuationForm from './components/ValuationForm';
import MetricsDisplay from './components/MetricsDisplay';
import MonteCarloPage from './components/MonteCarlo';

function Home({ ticker, setTicker, showResults, setShowResults }) {
  return (
    <>
      {/* Centered Valuation Form */}
      <div className="flex justify-center mb-10">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <ValuationForm setTicker={setTicker} setShowResults={setShowResults} large />
        </div>
      </div>
      {/* Bottom: Metrics Cards (left) and History Tables (right) */}
      {showResults && (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Metrics Cards */}
          <div className="w-full lg:w-1/2">
            <MetricsDisplay ticker={ticker} onlyCards />
          </div>
          {/* History Tables in a 2x3 grid */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-3 grid-rows-2 gap-6">
              {/* Top row */}
              <div>
                <MetricsDisplay ticker={ticker} tableName="pe_ratio" />
              </div>
              <div></div>
              <div>
                <MetricsDisplay ticker={ticker} tableName="revenue" />
              </div>
              {/* Bottom row */}
              <div>
                <MetricsDisplay ticker={ticker} tableName="net_income" />
              </div>
              <div className="flex items-center justify-center">
                <MetricsDisplay ticker={ticker} tableName="shares_outstanding" />
              </div>
              <div>
                <MetricsDisplay ticker={ticker} tableName="free_cash_flow" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  const [ticker, setTicker] = useState(null);
  const [showResults, setShowResults] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 font-sans">
        {/* Navbar */}
        <nav className="bg-white shadow mb-6">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-blue-700 hover:text-blue-900">Stock Valuation App</Link>
            <div>
              <Link
                to="/monte-carlo"
                className="ml-6 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Monte Carlo DCF
              </Link>
            </div>
          </div>
        </nav>
        <header className="w-full py-10 bg-gradient-to-r from-blue-600 to-blue-400 shadow-md mb-10">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <div className="flex items-center mb-2">
              <svg className="w-10 h-10 text-white mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
              </svg>
              <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
                Stock Valuation App
              </h1>
            </div>
            <p className="text-blue-100 text-lg font-medium mt-2 text-center">
              Analyze stocks, visualize key metrics, and calculate intrinsic value with ease.
            </p>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  ticker={ticker}
                  setTicker={setTicker}
                  showResults={showResults}
                  setShowResults={setShowResults}
                />
              }
            />
            <Route path="/monte-carlo" element={<MonteCarloPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
