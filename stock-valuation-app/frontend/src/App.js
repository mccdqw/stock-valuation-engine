import React, { useState } from 'react';
import ValuationForm from './components/ValuationForm';
import MetricsDisplay from './components/MetricsDisplay';

function App() {
  const [ticker, setTicker] = useState(null);
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 font-sans">
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
        {/* Centered Valuation Form */}
        <div className="flex justify-center mb-10">
          <div className="w-full md:w-2/3 lg:w-1/2">
            <ValuationForm setTicker={setTicker} setShowResults={setShowResults} large />
          </div>
        </div>
        {/* Bottom: Metrics Cards (left) and History Tables (right) */}
        {showResults && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Metrics Cards */}
            <div className="w-full lg:w-1/2 flex flex-col h-full">
              <MetricsDisplay ticker={ticker} onlyCards />
            </div>
            {/* History Tables */}
            <div className="w-full lg:w-1/2 flex flex-col h-full">
              {/* 2x2 grid for 4 tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <MetricsDisplay ticker={ticker} tableName="pe_ratio" />
                <MetricsDisplay ticker={ticker} tableName="revenue" />
                <MetricsDisplay ticker={ticker} tableName="net_income" />
                <MetricsDisplay ticker={ticker} tableName="free_cash_flow" />
              </div>
              {/* Centered Shares Outstanding table */}
              <div className="flex justify-center">
                <div className="w-full md:w-2/3 lg:w-1/2">
                  <MetricsDisplay ticker={ticker} tableName="shares_outstanding" />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
