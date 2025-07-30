import React, { useState } from 'react';
import ValuationForm from './components/ValuationForm';
import MetricsDisplay from './components/MetricsDisplay';

function App() {
    const [ticker, setTicker] = useState(null);
    const [showResults, setShowResults] = useState(false);

    return (
        <div className="App">
            <h1>Stock Valuation App</h1>
            <ValuationForm setTicker={setTicker} setShowResults={setShowResults} />
            {showResults && <MetricsDisplay ticker={ticker} />}
        </div>
    );
}

export default App;
