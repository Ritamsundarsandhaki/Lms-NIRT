import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../components/Axios';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

function FacultyAnalytics() {
  const { facultyId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!facultyId) return;
    axios.get(`/api/librarian/faculty-details/${facultyId}`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching faculty analytics:', error);
        setLoading(false);
      });
  }, [facultyId]);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-semibold text-blue-500 animate-pulse">
        ⏳ Loading faculty analytics...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-lg font-semibold text-red-500">
        ❌ No faculty data found.
      </div>
    );
  }

  const { faculty, analytics, issuedBooksHistory } = data;

  const monthWiseData = analytics.monthWiseData;
  const monthWiseCounts = monthWiseData.reduce((acc, { month, issuedCount }) => {
    acc[month] = (acc[month] || 0) + issuedCount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(monthWiseCounts),
    datasets: [
      {
        label: 'Books Issued',
        data: Object.values(monthWiseCounts),
        fill: false,
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.4,
      },
    ],
  };

  const pieData = analytics.typeWiseAnalytics;
  const pieChartData = {
    labels: Object.keys(pieData),
    datasets: [
      {
        data: Object.values(pieData),
        backgroundColor: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa'],
        hoverOffset: 6,
      },
    ],
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">📊 Faculty Analytics</h2>

      {/* Faculty Details */}
      <div className="mb-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-100 shadow-2xl rounded-2xl transition-all hover:scale-[1.02]">
        <h3 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
          🧑‍🏫 {faculty.name}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-700">
          <div className="space-y-3">
            <p><span className="font-semibold text-gray-800">Email:</span> {faculty.email}</p>
            <p><span className="font-semibold text-gray-800">Faculty ID:</span> {faculty.facultyId}</p>
            <p><span className="font-semibold text-gray-800">Mobile:</span> {faculty.mobile}</p>
          </div>
          <div className="space-y-3">
            <p><span className="font-semibold text-gray-800">Department:</span> {faculty.department}</p>
            <p><span className="font-semibold text-gray-800">Branch:</span> {faculty.branch}</p>
            <p><span className="font-semibold text-gray-800">Account Created:</span> {new Date(faculty.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-700 mb-8">📋 Analytics Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="p-6 text-center bg-green-100 rounded-xl hover:bg-green-200 transition">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Total Books Issued</h4>
            <p className="text-3xl font-bold text-green-800">{analytics.totalIssued}</p>
          </div>
          <div className="p-6 text-center bg-blue-100 rounded-xl hover:bg-blue-200 transition">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Total Books Returned</h4>
            <p className="text-3xl font-bold text-blue-800">{analytics.totalReturned}</p>
          </div>
          <div className="p-6 text-center bg-yellow-100 rounded-xl hover:bg-yellow-200 transition">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Total Books Pending</h4>
            <p className="text-3xl font-bold text-yellow-800">{analytics.totalPending}</p>
          </div>
        </div>
      </div>

      {/* Issued Books History Table */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-700 mb-8">📚 Issued Books History</h3>
        <TableContainer component={Paper} className="shadow-2xl rounded-2xl overflow-hidden">
          <Table>
            <TableHead className="bg-gradient-to-r from-blue-100 to-indigo-100">
              <TableRow>
                <TableCell className="font-bold text-gray-800 text-md py-4 px-6">Faculty Name</TableCell>
                <TableCell className="font-bold text-gray-800 text-md py-4 px-6">Book ID</TableCell>
                <TableCell className="font-bold text-gray-800 text-md py-4 px-6">Issue Date</TableCell>
                <TableCell className="font-bold text-gray-800 text-md py-4 px-6">Returned</TableCell>
                <TableCell className="font-bold text-gray-800 text-md py-4 px-6">Return Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issuedBooksHistory.map((book, index) => (
                <TableRow
                  key={book._id}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-all duration-300`}
                >
                  <TableCell className="py-4 px-6">{faculty.name}</TableCell>
                  <TableCell className="py-4 px-6">{book.bookId}</TableCell>
                  <TableCell className="py-4 px-6">{new Date(book.issueDate).toLocaleString()}</TableCell>
                  <TableCell className="py-4 px-6">{book.returned ? '✅ Yes' : '❌ No'}</TableCell>
                  <TableCell className="py-4 px-6">{book.returned ? new Date(book.returnDate).toLocaleString() : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Charts */}
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">📈 Month-wise Books Issued</h3>
            <Line data={chartData} />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">🥧 Type-wise Book Issued</h3>
            <Pie data={pieChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyAnalytics;
