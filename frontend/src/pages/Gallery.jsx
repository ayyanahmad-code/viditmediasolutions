import React, { useState, useEffect, useCallback } from 'react';
import { FaHeart, FaEye, FaCalendar, FaPlay, FaImage } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import Modal from '../components/Modal';
import VideoPlayer from '../components/VideoPlayer';
import ImageViewer from '../components/ImageViewer';

const API_BASE_URL = "http://localhost:5000/api";

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchGalleryItems = useCallback(async () => {
    try {
      setLoading(true);
      const url = selectedType === 'all' 
        ? `${API_BASE_URL}/gallery/all?limit=100`
        : `${API_BASE_URL}/gallery/all?type=${selectedType}&limit=100`;
      
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setItems(data.data);
      } else {
        setError('Failed to load gallery items');
      }
    } catch (err) {
      setError('Server error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]);

  const handleLike = async (id, index) => {
    try {
      const res = await fetch(`${API_BASE_URL}/gallery/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      
      if (data.success) {
        const updatedItems = [...items];
        updatedItems[index].likes = data.likes;
        setItems(updatedItems);
      }
    } catch (err) {
      console.error('Error liking item:', err);
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const categories = [
    { value: 'all', label: 'All', icon: null },
    { value: 'image', label: 'Photos', icon: <FaImage className="inline mr-2" /> },
    { value: 'video', label: 'Videos', icon: <FaPlay className="inline mr-2" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={fetchGalleryItems}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Gallery
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore memorable moments from our events and celebrations
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedType(cat.value)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedType === cat.value
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => openModal(item)}
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-video bg-gray-200">
                {item.type === 'video' ? (
                  <>
                    <video 
                      src={`http://localhost:5000${item.media_url}`}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <FaPlay className="text-white text-4xl" />
                    </div>
                  </>
                ) : (
                  <img
                    src={`http://localhost:5000${item.media_url}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Type Badge */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs">
                  {item.type === 'video' ? 'Video' : 'Photo'}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <FaHeart 
                        className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(item._id, index);
                        }}
                      />
                      <span>{item.likes}</span>
                    </div>
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
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found</p>
          </div>
        )}

        {/* Modal for viewing media */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          {selectedItem && (
            selectedItem.type === 'video' ? (
              <VideoPlayer 
                src={`http://localhost:5000${selectedItem.media_url}`}
                title={selectedItem.title}
              />
            ) : (
              <ImageViewer 
                src={`http://localhost:5000${selectedItem.media_url}`}
                title={selectedItem.title}
                description={selectedItem.description}
              />
            )
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Gallery;