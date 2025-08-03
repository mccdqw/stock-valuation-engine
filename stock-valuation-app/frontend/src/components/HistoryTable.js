import React from 'react';

const HistoryTable = ({ title, years, values, valueFormatter = (v) => v }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full text-center">
        <thead>
          <tr>
            {years.map((year, i) => (
              <th key={i} className="px-3 py-2 text-gray-600 font-medium">{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {values.map((val, i) => (
              <td key={i} className="px-3 py-2 font-semibold">
                {valueFormatter(val)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default HistoryTable;