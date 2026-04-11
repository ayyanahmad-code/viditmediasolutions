// frontend/src/pages/AdminGalleryList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaEye, FaEdit, FaTrash, FaPlus, FaSpinner, 
  FaImage, FaVideo, FaHeart, FaCalendar, 
  FaSearch, FaFilter, FaTimes, FaCheck,
  FaExclamationTriangle, FaBuilding
} from 'react-icons/fa';

const API_BASE_URL = "http://localhost:5000/api";

const AdminGalleryList = ({ onEdit, onAddNew }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, title: '' });
  const [viewModal, setViewModal] = useState({ show: false, item: null });
  const [successMessage, setSuccessMessage] = useState('');

  const fetchGalleryItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 20,
        ...(filters.type !== 'all' && { type: filters.type }),
        ...(filters.category !== 'all' && { category: filters.category })
      });
      
      const response = await fetch(`${API_BASE_URL}/gallery/all?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setItems(data.data);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }));
      } else {
        setError('Failed to load gallery items');
      }
    } catch (err) {
      setError('Server error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters.type, filters.category]);

  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/${deleteModal.id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Gallery item deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchGalleryItems();
        setDeleteModal({ show: false, id: null, title: '' });
      } else {
        setError('Failed to delete item');
      }
    } catch (err) {
      setError('Server error');
      console.error(err);
    }
  };

  const handleLike = async (id, index) => {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/${id}/like`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        const updatedItems = [...items];
        updatedItems[index].likes = data.likes;
        setItems(updatedItems);
      }
    } catch (err) {
      console.error('Error liking item:', err);
    }
  };

  const categories = [
    'all', 'General', 'Wedding', 'Corporate', 'Birthday', 
    'Festival', 'Conference', 'Product Launch', 'Exhibition', 
    'Award Ceremony', 'Behind the Scenes'
  ];

  const mediaTypes = ['all', 'image', 'video'];

  // View Modal Component
  const ViewModal = () => {
    if (!viewModal.show || !viewModal.item) return null;
    
    const item = viewModal.item;
    const mediaUrls = item.media_urls || [item.media_url];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            <button
              onClick={() => setViewModal({ show: false, item: null })}
              className="text-white hover:text-gray-200"
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
            {/* Media Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {mediaUrls.map((url, idx) => (
                <div key={idx} className="relative">
                  {item.type === 'video' ? (
                    <video 
                      src={`http://localhost:5000${url}`}
                      controls
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <img 
                      src={`http://localhost:5000${url}`}
                      alt={`${item.title} - ${idx + 1}`}
                      className="w-full rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
            
            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  {item.type === 'video' ? <FaVideo className="text-purple-600" /> : <FaImage className="text-purple-600" />}
                  {item.type === 'video' ? 'Video' : 'Image'}
                </span>
                <span className="flex items-center gap-1">
                  <FaCalendar className="text-purple-600" />
                  {new Date(item.event_date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <FaHeart className="text-red-500" />
                  {item.likes} likes
                </span>
              </div>
              
              {item.description && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Description</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Category</h4>
                <p className="text-gray-600">{item.category}</p>
              </div>
              
              {item.partner_company_name && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Partner Company</h4>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaBuilding />
                    <span>{item.partner_company_name}</span>
                  </div>
                </div>
              )}
              
              {item.featured && (
                <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  Featured Item
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteModal = () => {
    if (!deleteModal.show) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <FaExclamationTriangle size={24} />
            <h3 className="text-xl font-bold">Delete Gallery Item</h3>
          </div>
          
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete "<span className="font-semibold">{deleteModal.title}</span>"? 
            This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteModal({ show: false, id: null, title: '' })}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1>
              <p className="text-gray-600 mt-1">Manage all media items in your gallery</p>
            </div>
            <button
              onClick={onAddNew}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <FaPlus />
              Add New Item
            </button>
          </div>
          
          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <FaCheck />
              {successMessage}
            </div>
          )}
          
          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value, page: 1 }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {mediaTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type === 'image' ? 'Images' : 'Videos'}
                </option>
              ))}
            </select>
            
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-4xl text-purple-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
            <FaExclamationTriangle className="inline mr-2" />
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Gallery Items Found</h3>
            <p className="text-gray-500 mb-4">Start by adding your first gallery item</p>
            <button
              onClick={onAddNew}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 inline-flex items-center gap-2"
            >
              <FaPlus />
              Add New Item
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => {
                const mediaUrls = item.media_urls || [item.media_url];
                const thumbnail = mediaUrls[0];
                
                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                    {/* Media Thumbnail */}
                    <div className="relative aspect-video bg-gray-200 cursor-pointer group">
                      {item.type === 'video' ? (
                        <>
                          <video 
                            src={`http://localhost:5000${thumbnail}`}
                            className="w-full h-full object-cover"
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FaVideo className="text-white text-3xl" />
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={`http://localhost:5000${thumbnail}`}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FaEye className="text-white text-3xl" />
                          </div>
                        </>
                      )}
                      
                      {/* Media Count Badge */}
                      {mediaUrls.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs">
                          +{mediaUrls.length} items
                        </div>
                      )}
                      
                      {/* Type Badge */}
                      <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-lg text-xs">
                        {item.type === 'video' ? 'Video' : 'Image'}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description || 'No description'}
                      </p>
                      
                      {/* Partner Info */}
                      {item.partner_company_name && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <FaBuilding size={10} />
                          <span>{item.partner_company_name}</span>
                        </div>
                      )}
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleLike(item.id, index)}
                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                          >
                            <FaHeart className="text-red-500" />
                            <span>{item.likes}</span>
                          </button>
                          <div className="flex items-center gap-1">
                            <FaEye />
                            <span>{item.views}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaCalendar />
                          <span>{new Date(item.event_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Featured Badge */}
                      {item.featured && (
                        <div className="mb-3">
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Featured
                          </span>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => setViewModal({ show: true, item })}
                          className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-1"
                        >
                          <FaEye size={12} />
                          View
                        </button>
                        <button
                          onClick={() => onEdit && onEdit(item)}
                          className="flex-1 bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-1"
                        >
                          <FaEdit size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteModal({ show: true, id: item.id, title: item.title })}
                          className="flex-1 bg-red-600 text-white py-1.5 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-1"
                        >
                          <FaTrash size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modals */}
      <ViewModal />
      <DeleteModal />
    </div>
  );
};

export default AdminGalleryList;