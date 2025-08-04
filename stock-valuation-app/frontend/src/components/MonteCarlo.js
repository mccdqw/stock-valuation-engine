import { useState } from 'react';
import axios from 'axios';
import MonteCarloForm from './MonteCarloForm';
import MonteCarloResults from './MonteCarloResults';

const MonteCarloPage = () => {
  const [values, setValues] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/dcf_monte_carlo', formData);
      setValues(response.data.values || []);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error running simulation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Monte Carlo DCF Simulation</h2>
      <MonteCarloForm onRun={handleRun} loading={loading} />
      <MonteCarloResults values={values} summary={summary} />
    </div>
  );
};

export default MonteCarloPage;
