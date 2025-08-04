import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MonteCarloResults = ({ summary }) => {
  if (!summary) {
    return (
      <div className="mt-6 text-gray-500 italic text-center">
        Run a simulation to see results.
      </div>
    );
  }

  const data = [
    { name: '10th %ile', value: summary.percentile10 },
    { name: 'Median', value: summary.median },
    { name: 'Mean', value: summary.mean },
    { name: '90th %ile', value: summary.percentile90 },
  ];

  return (
    <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-blue-600">Simulation Results</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <span className="font-medium">Mean:</span> ${summary.mean.toFixed(2)}
        </div>
        <div>
          <span className="font-medium">Median:</span> ${summary.median.toFixed(2)}
        </div>
        <div>
          <span className="font-medium">10th Percentile:</span> ${summary.percentile10.toFixed(2)}
        </div>
        <div>
          <span className="font-medium">90th Percentile:</span> ${summary.percentile90.toFixed(2)}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Bar dataKey="value" fill="#3b82f6" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonteCarloResults;
