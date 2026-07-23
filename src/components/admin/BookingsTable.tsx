import React from 'react';

const bookings = [
  { id: '1', client: 'John Doe', destination: 'Casbah', date: '2026-07-25', status: 'Confirmed', revenue: '15,000 DA' },
  { id: '2', client: 'Jane Smith', destination: 'Sahara', date: '2026-07-28', status: 'Pending', revenue: '25,000 DA' },
];

export const BookingsTable = () => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6">Recent Bookings</h2>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-4">ID</th>
            <th className="pb-4">Client</th>
            <th className="pb-4">Destination</th>
            <th className="pb-4">Date</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-4">{booking.id}</td>
              <td className="py-4">{booking.client}</td>
              <td className="py-4">{booking.destination}</td>
              <td className="py-4">{booking.date}</td>
              <td className="py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {booking.status}
                </span>
              </td>
              <td className="py-4">{booking.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
