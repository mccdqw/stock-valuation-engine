import React, { useState } from 'react';
import ValuationForm from './components/ValuationForm';
import MetricsDisplay from './components/MetricsDisplay';

function App() {
    const [ticker, setTicker] = useState(null);
    const [showResults, setShowResults] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
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
            <main className="max-w-3xl mx-auto px-4">
                <ValuationForm setTicker={setTicker} setShowResults={setShowResults} />
                {showResults && <MetricsDisplay ticker={ticker} />}
            </main>
        </div>
    );
}

export default App;
