import { useState } from "react";

export default function MonteCarloForm({ onRun, loading  }) {
  const [inputs, setInputs] = useState({
    ticker: "GOOGL",
    iterations: 1000,
    revenue_growth_mean: 0.08,
    revenue_growth_std: 0.02,
    margin_std: 0.03,
    discount_rate_mean: 0.10,
    discount_rate_std: 0.02,
    years: 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onRun(inputs);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.entries(inputs).map(([key, val]) => (
        <div key={key} className="flex flex-col">
          <label htmlFor={key} className="capitalize">{key.replace(/_/g, ' ')}</label>
          <input
            id={key}
            name={key}
            type={typeof val === 'number' ? 'number' : 'text'}
            value={val}
            onChange={handleChange}
            step="any"
            className="border p-2 rounded"
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? 'Running...' : 'Run Monte Carlo'}
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
      </button>
    </form>
  );
}
