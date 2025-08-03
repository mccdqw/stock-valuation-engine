import React from 'react';

const MetricCard = ({ label, value, color = 'text-green-600', valuePrefix = '', valueSuffix = '', isNa = false }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
    <span className="text-gray-500 text-sm mb-1">{label}</span>
    <span className={`text-3xl font-bold ${color}`}>
      {isNa ? 'N/A' : `${valuePrefix}${value}${valueSuffix}`}
    </span>
  </div>
);

export default MetricCard;