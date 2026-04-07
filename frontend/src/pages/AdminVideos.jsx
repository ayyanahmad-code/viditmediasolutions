// src/pages/AdminVideos.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  FaUpload, FaTrash, FaEdit, FaSync, FaPlus, 
  FaYoutube, FaImage, FaTimes, FaSave 
} from 'react-icons/fa';

const AdminVideos = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    slider_type: 'slider1',
    display_order: 0,
    thumbnail: null
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

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, thumbnail: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('youtube_url', formData.youtube_url);
      formDataToSend.append('slider_type', formData.slider_type);
      formDataToSend.append('display_order', formData.display_order);
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }

      const url = editingVideo 
        ? `${API_BASE_URL}/videos/${editingVideo.id}`
        : `${API_BASE_URL}/videos/upload`;
      
      const method = editingVideo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      if (data.success) {
        alert(editingVideo ? 'Video updated!' : 'Video uploaded!');
        setShowModal(false);
        setEditingVideo(null);
        setFormData({ title: '', youtube_url: '', slider_type: 'slider1', display_order: 0, thumbnail: null });
        fetchVideos();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Failed to save video');
    }
  };

  const deleteVideo = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert('Video deleted!');
        fetchVideos();
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
      display_order: video.display_order,
      thumbnail: null
    });
    setShowModal(true);
  };

  if (loading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Video Management</h1>
          <button
            onClick={() => { setEditingVideo(null); setShowModal(true); }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <FaPlus /> Add New Video
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider 1 Videos */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Main Slider Videos</h2>
            {videos.filter(v => v.slider_type === 'slider1').map(video => (
              <div key={video.id} className="border rounded-lg p-4 mb-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{video.title}</p>
                  <p className="text-sm text-gray-500">{video.youtube_id}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editVideo(video)} className="text-yellow-600 hover:text-yellow-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteVideo(video.id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Slider 2 Videos */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Secondary Slider Videos</h2>
            {videos.filter(v => v.slider_type === 'slider2').map(video => (
              <div key={video.id} className="border rounded-lg p-4 mb-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{video.title}</p>
                  <p className="text-sm text-gray-500">{video.youtube_id}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editVideo(video)} className="text-yellow-600 hover:text-yellow-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteVideo(video.id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingVideo ? 'Edit Video' : 'Add New Video'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">YouTube URL *</label>
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Slider Type *</label>
                <select
                  name="slider_type"
                  value={formData.slider_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="slider1">Main Slider (Large)</option>
                  <option value="slider2">Secondary Slider (Thumbnails)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Thumbnail Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">JPEG, PNG, JPG, WEBP (Max 5MB)</p>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <FaSave /> {editingVideo ? 'Update Video' : 'Upload Video'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideos;