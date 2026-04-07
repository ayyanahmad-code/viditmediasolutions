// src/pages/CompanyDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaBriefcase,
  FaEnvelope,
  FaEye,
  FaUserPlus,
  FaChartLine,
  FaCalendarAlt,
  FaDownload,
  FaFilter,
  FaSearch,
  FaStar,
  FaUserCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaBell,
  FaCog,
  FaChartPie,
  FaChartBar,
  FaChartArea
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CompanyDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fake data for dashboard
  const statsData = {
    totalUsers: 1247,
    newUsersThisMonth: 89,
    totalApplications: 456,
    pendingApplications: 23,
    totalContacts: 789,
    unreadContacts: 45,
    activeJobs: 12,
    totalRevenue: 125000,
    growth: 15.6
  };

  // Chart data - User Registrations
  const userRegistrationData = {
    weekly: [
      { name: 'Mon', users: 24, applications: 12, contacts: 18 },
      { name: 'Tue', users: 32, applications: 18, contacts: 22 },
      { name: 'Wed', users: 45, applications: 25, contacts: 31 },
      { name: 'Thu', users: 38, applications: 22, contacts: 28 },
      { name: 'Fri', users: 52, applications: 30, contacts: 35 },
      { name: 'Sat', users: 28, applications: 15, contacts: 20 },
      { name: 'Sun', users: 18, applications: 8, contacts: 12 }
    ],
    monthly: [
      { name: 'Week 1', users: 156, applications: 89, contacts: 124 },
      { name: 'Week 2', users: 189, applications: 102, contacts: 156 },
      { name: 'Week 3', users: 234, applications: 134, contacts: 189 },
      { name: 'Week 4', users: 201, applications: 118, contacts: 167 }
    ],
    yearly: [
      { name: 'Jan', users: 456, applications: 234, contacts: 345 },
      { name: 'Feb', users: 523, applications: 267, contacts: 398 },
      { name: 'Mar', users: 612, applications: 312, contacts: 456 },
      { name: 'Apr', users: 589, applications: 298, contacts: 423 },
      { name: 'May', users: 678, applications: 345, contacts: 512 },
      { name: 'Jun', users: 723, applications: 367, contacts: 545 }
    ]
  };

  // Recent Applications Data
  const recentApplications = [
    { id: 1, name: 'John Doe', position: 'SEO Expert', experience: '3 years', status: 'pending', date: '2024-03-30', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', position: 'Web Developer', experience: '5 years', status: 'reviewed', date: '2024-03-29', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', position: 'Social Media Manager', experience: '2 years', status: 'pending', date: '2024-03-28', email: 'mike@example.com' },
    { id: 4, name: 'Sarah Williams', position: 'Content Writer', experience: '4 years', status: 'hired', date: '2024-03-27', email: 'sarah@example.com' },
    { id: 5, name: 'Robert Brown', position: 'App Developer', experience: '3 years', status: 'rejected', date: '2024-03-26', email: 'robert@example.com' },
    { id: 6, name: 'Emily Davis', position: 'UI/UX Designer', experience: '2 years', status: 'pending', date: '2024-03-25', email: 'emily@example.com' }
  ];

  // Recent Contacts Data
  const recentContacts = [
    { id: 1, name: 'Alice Cooper', email: 'alice@example.com', subject: 'Business Inquiry', message: 'Interested in your services...', status: 'unread', date: '2024-03-30' },
    { id: 2, name: 'Bob Wilson', email: 'bob@example.com', subject: 'Partnership', message: 'Looking for collaboration...', status: 'read', date: '2024-03-29' },
    { id: 3, name: 'Carol Martinez', email: 'carol@example.com', subject: 'Support', message: 'Need help with...', status: 'unread', date: '2024-03-28' },
    { id: 4, name: 'David Lee', email: 'david@example.com', subject: 'Feedback', message: 'Great service!...', status: 'read', date: '2024-03-27' }
  ];

  // Job Positions Data for Pie Chart
  const jobDistributionData = [
    { name: 'SEO Expert', value: 35, color: '#8B5CF6' },
    { name: 'Web Developer', value: 28, color: '#EC4899' },
    { name: 'Social Media', value: 22, color: '#06B6D4' },
    { name: 'Content Writer', value: 15, color: '#10B981' }
  ];

  // Performance Metrics
  const performanceData = [
    { month: 'Jan', revenue: 85000, growth: 5 },
    { month: 'Feb', revenue: 92000, growth: 8 },
    { month: 'Mar', revenue: 108000, growth: 12 },
    { month: 'Apr', revenue: 115000, growth: 15 },
    { month: 'May', revenue: 125000, growth: 18 },
    { month: 'Jun', revenue: 142000, growth: 22 }
  ];

  // Top Performing Jobs
  const topJobs = [
    { title: 'Web Developer', applications: 145, hired: 12 },
    { title: 'SEO Expert', applications: 128, hired: 8 },
    { title: 'Social Media', applications: 98, hired: 6 },
    { title: 'App Developer', applications: 87, hired: 5 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'reviewed': return 'text-blue-600 bg-blue-100';
      case 'hired': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'unread': return 'text-red-600 bg-red-100';
      case 'read': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{statsData.totalUsers}</p>
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <FaArrowUp className="mr-1" /> +{statsData.newUsersThisMonth} this month
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-4">
                <FaUsers className="text-3xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Applications</p>
                <p className="text-3xl font-bold text-gray-800">{statsData.totalApplications}</p>
                <p className="text-yellow-600 text-sm mt-2 flex items-center">
                  <FaClock className="mr-1" /> {statsData.pendingApplications} pending
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-4">
                <FaBriefcase className="text-3xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Contact Messages</p>
                <p className="text-3xl font-bold text-gray-800">{statsData.totalContacts}</p>
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <FaEnvelope className="mr-1" /> {statsData.unreadContacts} unread
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <FaEnvelope className="text-3xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Our video</p>
                <p className="text-3xl font-bold text-gray-800">${statsData.totalRevenue.toLocaleString()}</p>
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <FaArrowUp className="mr-1" /> +{statsData.growth}% growth
                </p>
              </div>
              <div className="bg-pink-100 rounded-full p-4">
                <FaChartLine className="text-3xl text-pink-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Performing Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Top Performing Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topJobs.map((job, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">{job.title}</h3>
                <div className="flex justify-between mt-2">
                  <div>
                    <p className="text-sm text-gray-600">Applications</p>
                    <p className="text-xl font-bold text-purple-600">{job.applications}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hired</p>
                    <p className="text-xl font-bold text-green-600">{job.hired}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Applications Table */}
        {(selectedTab === 'overview' || selectedTab === 'applications') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Applications</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaDownload className="inline mr-2" /> Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Position</th>
                    <th className="text-left py-3 px-4">Experience</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{app.name}</p>
                          <p className="text-sm text-gray-500">{app.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{app.position}</td>
                      <td className="py-3 px-4">{app.experience}</td>
                      <td className="py-3 px-4">{app.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-purple-600 hover:text-purple-700 mr-2">View</button>
                        <button className="text-blue-600 hover:text-blue-700">Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Recent Contacts Table */}
        {(selectedTab === 'overview' || selectedTab === 'contacts') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Contact Messages</h2>
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Email: {contact.email}</p>
                      <p className="text-sm text-gray-600 mb-1">Subject: {contact.subject}</p>
                      <p className="text-gray-700">{contact.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{contact.date}</p>
                    </div>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;