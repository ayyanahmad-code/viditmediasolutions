// src/pages/CareerHiringList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { 
  FaBriefcase, 
  FaEye, 
  FaTrash, 
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaSync,
  FaCalendarAlt,
  FaBuilding,
  FaUserTie,
  FaClock,
  FaSave,
  FaTimes,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';

const CareerHiringList = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'inactive'
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    position: "",
    shift: "",
    work_mode: "",
    keywords: "",
    experience: "",
    status: "",
    message: ""
  });
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
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.shift?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.work_mode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.keywords?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.experience?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter based on active tab
    if (activeTab === 'active') {
      filtered = filtered.filter(app => app.status === 'active');
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter(app => app.status === 'inactive');
    }
    
    setFilteredApps(filtered);
    setCurrentPage(1);
  }, [searchTerm, applications, activeTab]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/career-hiring/all`, {
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
        console.log(`✅ Loaded ${data.data.length} career hiring positions`);
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
    if (!window.confirm('Are you sure you want to delete this position?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/career-hiring/${id}`, {
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
        alert('Position deleted successfully');
      } else {
        alert('Failed to delete: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete position');
    }
  };

  const updateApplication = async (id, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/career-hiring/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        fetchApplications();
        alert('Position updated successfully');
        setIsEditing(false);
        setShowModal(false);
        setSelectedApp(null);
      } else {
        alert('Failed to update: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating:', error);
      alert('Failed to update position');
    }
  };

  // Toggle status function
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const confirmMessage = currentStatus === 'active' 
      ? 'Deactivate this position? It will not be visible on the website.'
      : 'Activate this position? It will become visible on the website.';
    
    if (!window.confirm(confirmMessage)) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/career-hiring/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        fetchApplications();
        alert(`Position ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      } else {
        alert('Failed to update status: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startEdit = (app) => {
    setSelectedApp(app);
    setEditFormData({
      position: app.position || "",
      shift: app.shift || "",
      work_mode: app.work_mode || "",
      keywords: app.keywords || "",
      experience: app.experience || "",
      status: app.status || "active",
      message: app.message || ""
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const saveEdit = () => {
    updateApplication(selectedApp.id, editFormData);
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
    if (status === 'active') {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
          <FaCheckCircle size={10} /> Active
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
          <FaTimesCircle size={10} /> Inactive
        </span>
      );
    }
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredApps.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  // Calculate counts
  const activeCount = applications.filter(app => app.status === 'active').length;
  const inactiveCount = applications.filter(app => app.status === 'inactive').length;

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading career hiring data...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchApplications} className="px-6 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 mx-auto">
            <FaSync /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Career Hiring List</h1>
            <p className="text-gray-600 mt-1">Total Positions: {applications.length}</p>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/create-career"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
            >
              <FaBriefcase /> Add New Position
            </Link>
            <button 
              onClick={fetchApplications} 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
            >
              <FaSync /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Positions</p>
                <p className="text-3xl font-bold text-gray-800">{applications.length}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <FaBriefcase className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Positions</p>
                <p className="text-3xl font-bold text-green-600">{activeCount}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Inactive Positions</p>
                <p className="text-3xl font-bold text-red-600">{inactiveCount}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <FaTimesCircle className="text-2xl text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Shifts</p>
                <p className="text-3xl font-bold text-blue-600">
                  {applications.reduce((sum, app) => sum + (app.shift ? app.shift.split(',').length : 0), 0)}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FaClock className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200 px-4">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'all'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Positions ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'active'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'inactive'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Inactive ({inactiveCount})
              </button>
            </nav>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by position, shift, work mode, skills, or experience..."
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
              <p className="text-gray-500">
                {activeTab === 'all' && 'No career hiring positions found'}
                {activeTab === 'active' && 'No active positions found'}
                {activeTab === 'inactive' && 'No inactive positions found'}
              </p>
              <Link to="/create-career" className="text-purple-600 hover:text-purple-700 mt-2 inline-block">
                Click here to add a new position
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Work Mode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.map((app) => (
                      <tr key={app.id} className={`hover:bg-gray-50 transition-colors ${app.status === 'inactive' ? 'bg-gray-50 opacity-75' : ''}`}>
                        <td className="px-6 py-4 text-sm text-gray-900">#{app.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaUserTie className="text-gray-400" />
                            <span className="font-medium text-gray-900">{app.position}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex flex-wrap gap-1">
                            {app.shift?.split(',').slice(0, 2).map((s, i) => (
                              <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaBuilding className="text-gray-400" />
                            {app.work_mode}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaClock className="text-gray-400" />
                            {app.experience}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {app.keywords?.split(',').slice(0, 2).map((skill, i) => (
                              <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleStatus(app.id, app.status)}
                              className={`p-1 rounded-lg transition-colors ${
                                app.status === 'active' 
                                  ? 'text-green-600 hover:text-green-800 hover:bg-green-50' 
                                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                              }`}
                              title={app.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              {app.status === 'active' ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                            </button>
                            {getStatusBadge(app.status)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            {formatDate(app.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setIsEditing(false);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="View Details"
                            >
                              <FaEye size={18} />
                            </button>
                            <button
                              onClick={() => startEdit(app)}
                              className="text-yellow-600 hover:text-yellow-800 transition-colors"
                              title="Edit"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() => deleteApplication(app.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
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
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal for Viewing/Editing Details */}
        {showModal && selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {isEditing ? 'Edit Position' : 'Position Details'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                  ✕
                </button>
              </div>
              <div className="p-6">
                {isEditing ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-500 text-sm block mb-1">Position</label>
                      <input
                        type="text"
                        name="position"
                        value={editFormData.position}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm block mb-1">Shift</label>
                      <input
                        type="text"
                        name="shift"
                        value={editFormData.shift}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm block mb-1">Work Mode</label>
                      <select
                        name="work_mode"
                        value={editFormData.work_mode}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                      >
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                        <option value="Remote / On-site">Remote / On-site</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm block mb-1">Experience</label>
                      <input
                        type="text"
                        name="experience"
                        value={editFormData.experience}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm block mb-1">Key Skills / Keywords</label>
                      <textarea
                        name="keywords"
                        value={editFormData.keywords}
                        onChange={handleEditChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter skills separated by commas"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm block mb-1">Status</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="status"
                            value="active"
                            checked={editFormData.status === 'active'}
                            onChange={handleEditChange}
                            className="w-4 h-4 text-purple-600"
                          />
                          <span>Active</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="status"
                            value="inactive"
                            checked={editFormData.status === 'inactive'}
                            onChange={handleEditChange}
                            className="w-4 h-4 text-purple-600"
                          />
                          <span>Inactive</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Inactive positions will not be displayed on the website
                      </p>
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm block mb-1">Additional Message</label>
                      <textarea
                        name="message"
                        value={editFormData.message}
                        onChange={handleEditChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Additional message..."
                      />
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={saveEdit}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaSave /> Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Details
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-gray-500 text-sm block">Position</label>
                      <p className="font-medium text-gray-900">{selectedApp.position}</p>
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm block">Work Mode</label>
                      <p className="text-gray-900">{selectedApp.work_mode}</p>
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm block">Shift</label>
                      <div className="flex flex-wrap gap-1">
                        {selectedApp.shift?.split(',').map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm block">Experience</label>
                      <p className="text-gray-900">{selectedApp.experience}</p>
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm block">Status</label>
                      <div>{getStatusBadge(selectedApp.status)}</div>
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm block">Created Date</label>
                      <p className="text-gray-600">{formatDate(selectedApp.created_at)}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-gray-500 text-sm block">Key Skills / Keywords</label>
                      <div className="bg-gray-50 p-3 rounded-lg mt-1">
                        <div className="flex flex-wrap gap-2">
                          {selectedApp.keywords?.split(',').map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-gray-500 text-sm block">Additional Message</label>
                      <div className="bg-gray-50 p-3 rounded-lg mt-1">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.message || 'No message provided'}</p>
                      </div>
                    </div>
                    <div className="col-span-2 pt-4 border-t">
                      <button
                        onClick={() => startEdit(selectedApp)}
                        className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaEdit /> Edit Position
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerHiringList;