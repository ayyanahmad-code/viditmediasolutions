import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  FaTrash, FaEdit, FaPlus, 
  FaYoutube, FaTimes, FaSave, 
  FaToggleOn, FaToggleOff 
} from 'react-icons/fa';

const AdminVideos = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'inactive'
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    slider_type: 'slider1',
    status: 'active'
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchVideos();
    }
  }, [isAuthenticated, user]);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/videos/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setVideos(data.data || []);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const requestData = {
        title: formData.title.trim(),
        youtube_url: formData.youtube_url.trim(),
        slider_type: formData.slider_type,
        status: formData.status
      };

      console.log('Sending data:', requestData);

      const url = editingVideo 
        ? `${API_BASE_URL}/videos/${editingVideo.id}`
        : `${API_BASE_URL}/videos/upload`;
      
      const method = editingVideo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      console.log('Response:', data);
      
      if (response.ok && data.success) {
        alert(editingVideo ? 'Video updated successfully!' : 'Video uploaded successfully!');
        setShowModal(false);
        setEditingVideo(null);
        setFormData({ title: '', youtube_url: '', slider_type: 'slider1', status: 'active' });
        fetchVideos();
      } else {
        alert(data.message || 'Failed to save video');
      }
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Failed to save video: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const toggleStatus = async (video) => {
    const newStatus = video.status === 'active' ? 'inactive' : 'active';
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/videos/${video.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Video ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
        fetchVideos();
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status');
    }
  };

  const deleteVideo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert('Video deleted successfully!');
        fetchVideos();
      } else {
        alert(data.message || 'Failed to delete video');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete video');
    }
  };

  const editVideo = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      youtube_url: video.youtube_url,
      slider_type: video.slider_type,
      status: video.status
    });
    setShowModal(true);
  };

  // Filter videos based on active tab
  const getFilteredVideos = () => {
    if (activeTab === 'active') {
      return videos.filter(v => v.status === 'active');
    } else if (activeTab === 'inactive') {
      return videos.filter(v => v.status === 'inactive');
    }
    return videos;
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
      : <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>;
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const filteredVideos = getFilteredVideos();
  const activeCount = videos.filter(v => v.status === 'active').length;
  const inactiveCount = videos.filter(v => v.status === 'inactive').length;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Video Management</h1>
            <p className="text-gray-600 mt-1">Manage videos for both sliders with status control</p>
          </div>
          <button
            onClick={() => { setEditingVideo(null); setShowModal(true); setFormData({ title: '', youtube_url: '', slider_type: 'slider1', status: 'active' }); }}
            className="bg-purple-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-md"
          >
            <FaPlus /> Add New Video
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Videos ({videos.length})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inactive'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Inactive ({inactiveCount})
              </button>
            </nav>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Slider 1 Videos */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Main Slider Videos</h2>
              <p className="text-purple-100 text-sm mt-1">Featured videos on homepage main slider</p>
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {filteredVideos.filter(v => v.slider_type === 'slider1').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaYoutube className="mx-auto text-4xl mb-2 text-gray-300" />
                  <p>No videos in Main Slider</p>
                  <p className="text-sm">Click "Add New Video" to get started</p>
                </div>
              ) : (
                filteredVideos.filter(v => v.slider_type === 'slider1').map(video => (
                  <div key={video.id} className={`border rounded-lg p-4 mb-3 hover:shadow-md transition-shadow ${video.status === 'inactive' ? 'bg-gray-50 opacity-75' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-gray-800">{video.title}</p>
                          {getStatusBadge(video.status)}
                        </div>
                        <p className="text-xs text-gray-500 font-mono">{video.youtube_id}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={() => toggleStatus(video)} 
                          className={`p-2 rounded-lg transition-colors ${
                            video.status === 'active' 
                              ? 'text-green-600 hover:text-green-800 hover:bg-green-50' 
                              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                          }`}
                          title={video.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {video.status === 'active' ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                        </button>
                        <button 
                          onClick={() => editVideo(video)} 
                          className="text-yellow-600 hover:text-yellow-800 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit video"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteVideo(video.id)} 
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete video"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Slider 2 Videos */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Secondary Slider Videos</h2>
              <p className="text-blue-100 text-sm mt-1">Thumbnail slider videos</p>
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {filteredVideos.filter(v => v.slider_type === 'slider2').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaYoutube className="mx-auto text-4xl mb-2 text-gray-300" />
                  <p>No videos in Secondary Slider</p>
                  <p className="text-sm">Click "Add New Video" to get started</p>
                </div>
              ) : (
                filteredVideos.filter(v => v.slider_type === 'slider2').map(video => (
                  <div key={video.id} className={`border rounded-lg p-4 mb-3 hover:shadow-md transition-shadow ${video.status === 'inactive' ? 'bg-gray-50 opacity-75' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-gray-800">{video.title}</p>
                          {getStatusBadge(video.status)}
                        </div>
                        <p className="text-xs text-gray-500 font-mono">{video.youtube_id}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={() => toggleStatus(video)} 
                          className={`p-2 rounded-lg transition-colors ${
                            video.status === 'active' 
                              ? 'text-green-600 hover:text-green-800 hover:bg-green-50' 
                              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                          }`}
                          title={video.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {video.status === 'active' ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                        </button>
                        <button 
                          onClick={() => editVideo(video)} 
                          className="text-yellow-600 hover:text-yellow-800 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit video"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteVideo(video.id)} 
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete video"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingVideo ? 'Edit Video' : 'Add New Video'}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter video title"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  YouTube URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Thumbnail will be automatically fetched from YouTube</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Slider Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="slider_type"
                  value={formData.slider_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="slider1">Main Slider (Large)</option>
                  <option value="slider2">Secondary Slider (Thumbnails)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={submitLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2 shadow-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {editingVideo ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <FaSave /> {editingVideo ? 'Update Video' : 'Upload Video'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideos;