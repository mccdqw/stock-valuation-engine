import React, { useState } from "react";

export default function BacktestForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    symbol: "SPY",
    startDate: "2020-08-11",
    endDate: "2025-07-31",
    shortWindow: "50",
    longWindow: "200",
    initialCapital: "100000",
    custom_file: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({ ...prev, custom_file: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const submitData = new FormData();
      submitData.append('params', JSON.stringify({
          symbol: formData.symbol,
          start_date: formData.startDate,
          end_date: formData.endDate,
          initial_capital: parseFloat(formData.initialCapital),
          strategy: {
              type: 'ma_crossover',
              short_window: parseInt(formData.shortWindow),
              long_window: parseInt(formData.longWindow)
          }
      }));

      if (formData.custom_file) {
          submitData.append('file', formData.custom_file);
      }

      // Call the parent's handler to update results
      await onSubmit(submitData);

      setSuccessMsg("Backtest submitted successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.detail || "Failed to submit backtest.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Symbol:</label>
        <input
          type="text"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>End Date:</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Short Window:</label>
        <input
          type="number"
          name="shortWindow"
          value={formData.shortWindow}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Long Window:</label>
        <input
          type="number"
          name="longWindow"
          value={formData.longWindow}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Initial Capital:</label>
        <input
          type="number"
          name="initialCapital"
          value={formData.initialCapital}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Upload CSV file (optional):</label>
        <input type="file" name="file" onChange={handleChange} />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Run Backtest"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
    </form>
  );
}
