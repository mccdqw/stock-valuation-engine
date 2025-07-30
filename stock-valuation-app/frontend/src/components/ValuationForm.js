import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const ValuationForm = ({ setTicker, setShowResults }) => {
    const [localTicker, setLocalTicker] = useState('');
    const [years, setYears] = useState(5);
    const [growth, setGrowth] = useState(8);
    const [discount, setDiscount] = useState(10);
    const [terminalGrowth, setTerminalGrowth] = useState(2);
    const [intrinsicValue, setIntrinsicValue] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/valuation`, {
                ticker: localTicker,
                years,
                growth: growth / 100,
                discount: discount / 100,
                terminalGrowth: terminalGrowth / 100,
            });

            setIntrinsicValue(response.data.intrinsicValuePerShare);
            setTicker(localTicker);
            setShowResults(true);
        } catch (err) {
            setError('Error fetching data. Please check the ticker and try again.');
            setShowResults(false);
        }
    };

    return (
        <div>
            <h2>DCF Valuation</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Ticker:</label>
                    <input
                        type="text"
                        value={localTicker}
                        onChange={(e) => setLocalTicker(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Years of Projection:</label>
                    <input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        min="1"
                        max="20"
                    />
                </div>
                <div>
                    <label>FCF Growth Rate (%):</label>
                    <input
                        type="number"
                        value={growth}
                        onChange={(e) => setGrowth(e.target.value)}
                    />
                </div>
                <div>
                    <label>Discount Rate (%):</label>
                    <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                    />
                </div>
                <div>
                    <label>Terminal Growth Rate (%):</label>
                    <input
                        type="number"
                        value={terminalGrowth}
                        onChange={(e) => setTerminalGrowth(e.target.value)}
                    />
                </div>
                <button type="submit">Calculate Intrinsic Value</button>
            </form>
            {intrinsicValue && (
                <h3>Intrinsic Value per Share: ${intrinsicValue.toFixed(2)}</h3>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ValuationForm;
