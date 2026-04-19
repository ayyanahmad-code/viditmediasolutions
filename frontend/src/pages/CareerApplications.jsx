// src/pages/CareerApplications.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  FaBriefcase, FaUser, FaEnvelope, FaPhone, FaEye, FaTrash, 
  FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf,
  FaSearch, FaChevronLeft, FaChevronRight, FaExclamationTriangle,
  FaSync, FaHistory, FaCalendarAlt, FaFileAlt, FaExpand, FaCompress,
  FaInfoCircle, FaChartLine, FaCalendarCheck, FaCalendarTimes
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
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [interviewDateTime, setInterviewDateTime] = useState('');
  const modalRef = useRef(null);
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

  const updateStatus = async (id, status, reason = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/career/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, reason })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchApplications();
        if (selectedApp?.id === id) {
          setSelectedApp({ ...selectedApp, status });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const scheduleInterview = async (isReschedule = false) => {
    if (!interviewDateTime) {
      alert('Please select interview date and time');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        interview_datetime: interviewDateTime,
        is_reschedule: isReschedule
      };
      
      const response = await fetch(`${API_BASE_URL}/career/${selectedApp.id}/schedule-interview`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchApplications();
        setShowInterviewModal(false);
        setInterviewDateTime('');
        alert(isReschedule ? `Interview rescheduled! (Attempt #${data.data.reschedule_count})` : 'Interview scheduled successfully!');
      } else {
        alert('Failed to schedule interview: ' + data.message);
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Failed to schedule interview');
    }
  };

  const viewHistory = async (app) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/career/${app.id}/interview-details`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setSelectedApp({ ...app, ...data.data });
        setShowHistoryModal(true);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return 'Not scheduled';
    try {
      const date = new Date(datetime);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: <FaHourglassHalf size={10} />, text: 'Pending' },
      reviewed: { color: 'bg-blue-100 text-blue-700', icon: <FaEye size={10} />, text: 'Reviewed' },
      interview_scheduled: { color: 'bg-purple-100 text-purple-700', icon: <FaClock size={10} />, text: 'Interview Scheduled' },
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

  const toggleFullScreen = () => {
    if (!modalRef.current) return;
    
    if (!isFullScreen) {
      if (modalRef.current.requestFullscreen) {
        modalRef.current.requestFullscreen();
      } else if (modalRef.current.webkitRequestFullscreen) {
        modalRef.current.webkitRequestFullscreen();
      } else if (modalRef.current.msRequestFullscreen) {
        modalRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('msfullscreenchange', handleFullScreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('msfullscreenchange', handleFullScreenChange);
    };
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredApps.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  // Calculate detailed statistics based on original_interview_date
  const totalApplications = applications.length;
  
  // Interview Statistics - Based on original_interview_date
  const totalOriginalInterviews = applications.filter(a => a.original_interview_date !== null && a.original_interview_date !== undefined).length;
  const totalReschedules = applications.reduce((sum, app) => sum + (app.reschedule_count || 0), 0);
  const totalScheduleCount = totalOriginalInterviews + totalReschedules;
  
  // Rejection Statistics
  const totalRejected = applications.filter(a => a.status === 'rejected').length;
  
  // Reject AFTER interview (applications that had original_interview_date set before rejection)
  const rejectAfterInterview = applications.filter(a => 
    a.status === 'rejected' && a.original_interview_date !== null && a.original_interview_date !== undefined
  ).length;
  
  // Reject WITHOUT interview (applications that were rejected without ever having original_interview_date)
  const rejectWithoutInterview = applications.filter(a => 
    a.status === 'rejected' && (!a.original_interview_date || a.original_interview_date === null)
  ).length;
  
  // Hired Statistics
  const totalHired = applications.filter(a => a.status === 'hired').length;
  const hiredAfterInterview = applications.filter(a => 
    a.status === 'hired' && a.original_interview_date !== null
  ).length;
  
  // Pending/Reviewed Statistics
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const reviewedCount = applications.filter(a => a.status === 'reviewed').length;
  
  // Current Interview Scheduled (active interviews)
  const currentInterviewScheduled = applications.filter(a => a.status === 'interview_scheduled').length;

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
            <p className="text-gray-600 mt-1">
              Total: {totalApplications} applications
            </p>
          </div>
          <button onClick={fetchApplications} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2">
            <FaSync /> Refresh
          </button>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Interview Stats Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Interview Statistics</h3>
              <FaCalendarCheck className="text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{totalOriginalInterviews}</div>
            <div className="text-sm text-gray-600">Original Interviews</div>
            <div className="mt-2 pt-2 border-t">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Total Schedule Count:</span>
                <span className="font-medium text-green-600">{totalScheduleCount}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-500">Total Reschedules:</span>
                <span className="font-medium text-orange-600">{totalReschedules}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-500">Active Interviews:</span>
                <span className="font-medium text-purple-600">{currentInterviewScheduled}</span>
              </div>
            </div>
          </div>

          {/* Rejection Stats Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Rejection Statistics</h3>
              <FaTimesCircle className="text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">{totalRejected}</div>
            <div className="text-sm text-gray-600">Total Rejected</div>
            <div className="mt-2 pt-2 border-t">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">After Interview:</span>
                <span className="font-medium text-red-600">{rejectAfterInterview}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-500">Without Interview:</span>
                <span className="font-medium text-orange-600">{rejectWithoutInterview}</span>
              </div>
            </div>
          </div>

          {/* Hiring Stats Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Hiring Statistics</h3>
              <FaCheckCircle className="text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">{totalHired}</div>
            <div className="text-sm text-gray-600">Total Hired</div>
            <div className="mt-2 pt-2 border-t">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">After Interview:</span>
                <span className="font-medium text-green-600">{hiredAfterInterview}</span>
              </div>
            </div>
          </div>

          {/* Pipeline Stats Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Pipeline</h3>
              <FaHourglassHalf className="text-yellow-500" />
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Pending:</span>
              <span className="font-medium text-yellow-600">{pendingCount}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Reviewed:</span>
              <span className="font-medium text-blue-600">{reviewedCount}</span>
            </div>
            <div className="flex justify-between pt-2 border-t mt-1">
              <span className="text-sm text-gray-600">Interview Stage:</span>
              <span className="font-medium text-purple-600">{currentInterviewScheduled}</span>
            </div>
          </div>
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
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PAN Card</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Original Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reschedules</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">#{app.id}</td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900 flex items-center gap-1">
                              <FaUser size={12} className="text-gray-400" /> {app.name}
                            </div>
                            <div className="text-xs text-gray-500">{app.email}</div>
                            <div className="text-xs text-gray-500">{app.phone || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{app.pan_card || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{app.position}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{app.experience || 'N/A'}</td>
                        <td className="px-4 py-3">{getStatusBadge(app.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {app.original_interview_date ? formatDateTime(app.original_interview_date) : 'Not scheduled'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {app.interview_date ? formatDateTime(app.interview_date) : 'Not scheduled'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {app.reschedule_count > 0 ? (
                            <button
                              onClick={() => viewHistory(app)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs hover:bg-orange-200"
                            >
                              <FaHistory size={10} /> {app.reschedule_count}
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() => {
                                if (app.status === 'pending') {
                                  updateStatus(app.id, 'reviewed');
                                }
                                setSelectedApp(app);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="View Resume"
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setInterviewDateTime('');
                                setShowInterviewModal(true);
                              }}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Schedule/Reschedule Interview"
                            >
                              <FaClock size={16} />
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, 'hired')}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Mark as Hired"
                            >
                              <FaCheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Enter rejection reason (optional):');
                                updateStatus(app.id, 'rejected', reason);
                              }}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Reject Application"
                            >
                              <FaTimesCircle size={16} />
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

        {/* Application Details Modal - Only Resume/CV */}
        {showModal && selectedApp && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => !isFullScreen && setShowModal(false)}
          >
            <div
              ref={modalRef}
              className={`bg-white rounded-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden ${isFullScreen ? 'fixed inset-0 rounded-none' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <div>
                  <h2 className="text-lg font-semibold">Resume / CV - {selectedApp.name}</h2>
                  <p className="text-sm text-gray-500">{selectedApp.position}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={toggleFullScreen}
                    className="text-blue-600 hover:text-blue-800"
                    title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                  >
                    {isFullScreen ? <FaCompress size={18} /> : <FaExpand size={18} />}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {selectedApp.resume_path ? (
                  <iframe
                    src={`http://localhost:5000/${selectedApp.resume_path}`}
                    title="Resume Viewer"
                    className="w-full h-full min-h-[600px] rounded-lg border"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p>No resume uploaded</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t p-4 bg-gray-50 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setInterviewDateTime('');
                    setShowInterviewModal(true);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {selectedApp.interview_date ? 'Reschedule Interview' : 'Schedule Interview'}
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Enter rejection reason (optional):');
                    updateStatus(selectedApp.id, 'rejected', reason);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule/Reschedule Interview Modal */}
        {showInterviewModal && selectedApp && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInterviewModal(false)}
          >
            <div
              className="bg-white rounded-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedApp.interview_date ? 'Reschedule Interview' : 'Schedule Interview'}
                </h2>
                <button onClick={() => setShowInterviewModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500">Candidate</p>
                <p className="font-medium text-gray-800">{selectedApp.name}</p>
                <p className="text-sm text-gray-600">{selectedApp.position}</p>
              </div>

              {selectedApp.original_interview_date && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <FaCalendarAlt size={14} />
                    Original Schedule (First Interview): {formatDateTime(selectedApp.original_interview_date)}
                  </p>
                  {selectedApp.reschedule_count > 0 && (
                    <p className="text-sm text-orange-600 mt-1">
                      This interview has been rescheduled {selectedApp.reschedule_count} time(s)
                    </p>
                  )}
                </div>
              )}

              {selectedApp.interview_date && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700 flex items-center gap-2">
                    <FaInfoCircle size={14} />
                    Current interview: {formatDateTime(selectedApp.interview_date)}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">
                  {selectedApp.interview_date ? 'New Interview Date & Time' : 'Interview Date & Time'}
                </label>
                <input
                  type="datetime-local"
                  value={interviewDateTime}
                  onChange={(e) => setInterviewDateTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowInterviewModal(false)}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => scheduleInterview(!!selectedApp.interview_date)}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {selectedApp.interview_date ? 'Confirm Reschedule' : 'Schedule Interview'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistoryModal && selectedApp && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowHistoryModal(false)}
          >
            <div
              className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Interview & Reschedule History</h2>
                <button onClick={() => setShowHistoryModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800">Candidate: {selectedApp.name}</h3>
                <p className="text-sm text-gray-600">Position: {selectedApp.position}</p>
                <p className="text-sm text-gray-600">Total Reschedules: {selectedApp.reschedule_count || 0}</p>
              </div>

              {selectedApp.original_interview_date && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-medium text-green-800">Original Schedule (First Interview)</p>
                  <p className="text-sm text-green-700">{formatDateTime(selectedApp.original_interview_date)}</p>
                </div>
              )}

              {selectedApp.interview_date && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="font-medium text-purple-800">Current Schedule</p>
                  <p className="text-sm text-purple-700">{formatDateTime(selectedApp.interview_date)}</p>
                </div>
              )}

              {selectedApp.reschedule_history && selectedApp.reschedule_history.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Reschedule History</h3>
                  <div className="space-y-3">
                    {selectedApp.reschedule_history.map((history, idx) => (
                      <div key={idx} className="border-l-4 border-orange-300 pl-4 py-2 bg-orange-50 rounded-r-lg">
                        <p className="font-medium text-orange-800">Reschedule Attempt #{history.attempt_number}</p>
                        <p className="text-sm mt-1">
                          <span className="text-gray-600">Previous:</span> {formatDateTime(history.previous_date)}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-600">New:</span> {formatDateTime(history.new_date)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Rescheduled on: {formatDateTime(history.rescheduled_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!selectedApp.reschedule_history || selectedApp.reschedule_history.length === 0) && (
                <p className="text-gray-500 text-center py-4">No reschedule history found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerApplications;