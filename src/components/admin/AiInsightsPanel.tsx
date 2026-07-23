import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', bookings: 4000 },
  { name: 'Tue', bookings: 3000 },
  { name: 'Wed', bookings: 5000 },
];

export const AiInsightsPanel = () => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6">AI Insights</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="bookings" stroke="#C19A6B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6">
        <h3 className="font-bold text-gray-800">Recommendation</h3>
        <p className="text-gray-600 text-sm mt-1">Promote Tipaza for summer.</p>
      </div>
    </div>
  );
};
