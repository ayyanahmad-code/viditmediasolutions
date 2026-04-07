// src/pages/CareerApplications.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  FaBriefcase, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaEye, 
  FaTrash, 
  FaClock, 
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaSync,
  FaFileAlt,
  FaDownload
} from 'react-icons/fa';

const CareerApplications = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = [...applications];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredApps(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, applications]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/career/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.data || []);
        setFilteredApps(data.data || []);
        console.log(`✅ Loaded ${data.data.length} career applications`);
      } else {
        throw new Error(data.message || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/career/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setApplications(applications.filter(app => app.id !== id));
        if (selectedApp?.id === id) setShowModal(false);
      } else {
        alert('Failed to delete: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete application');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/career/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setApplications(applications.map(app => 
          app.id === id ? { ...app, status } : app
        ));
        if (selectedApp?.id === id) {
          setSelectedApp({ ...selectedApp, status });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: <FaHourglassHalf size={10} />, text: 'Pending' },
      reviewed: { color: 'bg-blue-100 text-blue-700', icon: <FaEye size={10} />, text: 'Reviewed' },
      rejected: { color: 'bg-red-100 text-red-700', icon: <FaTimesCircle size={10} />, text: 'Rejected' },
      hired: { color: 'bg-green-100 text-green-700', icon: <FaCheckCircle size={10} />, text: 'Hired' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredApps.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchApplications} className="px-6 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 mx-auto">
            <FaSync /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Career Applications</h1>
            <p className="text-gray-600 mt-1">Total: {applications.length} applications</p>
          </div>
          <button onClick={fetchApplications} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2">
            <FaSync /> Refresh
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <FaBriefcase className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No career applications found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">#{app.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-gray-400" />
                            <span className="font-medium text-gray-900">{app.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" />
                            {app.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-gray-400" />
                            {app.phone || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaBriefcase className="text-gray-400" />
                            {app.position}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{app.experience || 'N/A'}</td>
                        <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(app.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="View Details"
                            >
                              <FaEye size={18} />
                            </button>
                            <button
                              onClick={() => deleteApplication(app.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <FaTrash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage(p => p - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Application Details</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-gray-500 text-sm block">Name</label>
                    <p className="font-medium text-gray-900">{selectedApp.name}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm block">Email</label>
                    <p className="text-gray-900">{selectedApp.email}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm block">Phone</label>
                    <p className="text-gray-900">{selectedApp.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm block">Position</label>
                    <p className="text-gray-900">{selectedApp.position}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm block">Experience</label>
                    <p className="text-gray-900">{selectedApp.experience || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm block">Status</label>
                    <div>{getStatusBadge(selectedApp.status)}</div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-500 text-sm block">Reference ID</label>
                    <p className="text-gray-900 font-mono">{selectedApp.reference_id || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-500 text-sm block">Cover Letter / Message</label>
                    <div className="bg-gray-50 p-4 rounded-lg mt-1">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.message || 'No message provided'}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-500 text-sm block">Resume/CV</label>
                    {selectedApp.resume_path ? (
                      <a 
                        href={`http://localhost:5000/${selectedApp.resume_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-1 text-purple-600 hover:text-purple-700"
                      >
                        <FaDownload /> Download Resume
                      </a>
                    ) : (
                      <p className="text-gray-600">No resume uploaded</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-500 text-sm block">Applied On</label>
                    <p className="text-gray-600">{formatDate(selectedApp.createdAt)}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <select
                      value={selectedApp.status}
                      onChange={(e) => updateStatus(selectedApp.id, e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                    <button
                      onClick={() => deleteApplication(selectedApp.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FaTrash className="inline mr-2" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerApplications;