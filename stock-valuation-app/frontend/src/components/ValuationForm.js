import { useState } from 'react';
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
        <div className="max-w-lg mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">DCF Valuation</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Ticker</label>
                    <input
                        type="text"
                        value={localTicker}
                        onChange={(e) => setLocalTicker(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="e.g. AAPL"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Years of Projection</label>
                        <input
                            type="number"
                            value={years}
                            onChange={(e) => setYears(e.target.value)}
                            min="1"
                            max="20"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">FCF Growth Rate (%)</label>
                        <input
                            type="number"
                            value={growth}
                            onChange={(e) => setGrowth(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Discount Rate (%)</label>
                        <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Terminal Growth Rate (%)</label>
                        <input
                            type="number"
                            value={terminalGrowth}
                            onChange={(e) => setTerminalGrowth(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-150"
                >
                    Calculate Intrinsic Value
                </button>
            </form>
            {intrinsicValue && (
                <div className="mt-6 text-center">
                    <h3 className="text-xl font-semibold text-green-700">
                        Intrinsic Value per Share: <span className="font-bold">${intrinsicValue.toFixed(2)}</span>
                    </h3>
                </div>
            )}
            {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        </div>
    );
};

export default ValuationForm;
