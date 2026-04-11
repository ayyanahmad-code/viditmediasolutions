import React, { useState, useEffect } from 'react';
import {
  FaInstagram, FaYoutube, FaVideo, FaImage, FaHeart, FaEye,
  FaCalendar, FaBuilding, FaPlay, FaTimes, FaChevronLeft,
  FaChevronRight, FaSpinner, FaBuilding as FaCompany,
  FaPhotoVideo, FaExclamationTriangle, FaImages
} from 'react-icons/fa';

const API_BASE_URL = "http://localhost:5000/api";

const CompanyGallery = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentImageSet, setCurrentImageSet] = useState([]);
  
  // YouTube video modal state
  const [activeYouTubeVideo, setActiveYouTubeVideo] = useState(null);
  const [activeInstagramVideo, setActiveInstagramVideo] = useState(null);
  
  // Filter states - using single active filter instead of multiple checkboxes
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'photos', 'reels', 'youtube', 'events'

  // Fetch all companies
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/gallery/partners-with-gallery`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCompanies(data.data);
        if (data.data.length > 0 && !selectedCompany) {
          handleCompanySelect(data.data[0]);
        }
      } else {
        setError(data.message || 'Failed to load companies');
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Unable to connect to server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch gallery items when company changes
  const fetchCompanyGallery = async (companyId) => {
    try {
      setLoadingItems(true);
      setError(null);
      
      const url = `${API_BASE_URL}/gallery/partner/${companyId}/gallery/category/all`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setGalleryItems(data.data || []);
      } else {
        setError(data.message || 'Failed to load gallery');
        setGalleryItems([]);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError('Failed to load gallery items');
      setGalleryItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  // Handle company selection
  const handleCompanySelect = async (company) => {
    setSelectedCompany(company);
    setActiveFilter('all'); // Reset filter when company changes
    await fetchCompanyGallery(company.id);
  };

  // Filter gallery items based on active filter
  const getFilteredItems = () => {
    if (activeFilter === 'all') {
      return galleryItems;
    }
    if (activeFilter === 'photos') {
      return galleryItems.filter(item => item.category === 'images');
    }
    if (activeFilter === 'reels') {
      return galleryItems.filter(item => item.category === 'instagram_video');
    }
    if (activeFilter === 'youtube') {
      return galleryItems.filter(item => item.category === 'youtube_video');
    }
    if (activeFilter === 'events') {
      return galleryItems.filter(item => item.category === 'event_video');
    }
    return galleryItems;
  };

  const filteredGalleryItems = getFilteredItems();

  // Get counts for each category
  const getCounts = () => {
    return {
      all: galleryItems.length,
      photos: galleryItems.filter(item => item.category === 'images').length,
      reels: galleryItems.filter(item => item.category === 'instagram_video').length,
      youtube: galleryItems.filter(item => item.category === 'youtube_video').length,
      events: galleryItems.filter(item => item.category === 'event_video').length
    };
  };

  const counts = getCounts();

  // Separate items by category for display (only show categories that have items)
  const images = filteredGalleryItems.filter(item => item.category === 'images');
  const instagramReels = filteredGalleryItems.filter(item => item.category === 'instagram_video');
  const youtubeVideos = filteredGalleryItems.filter(item => item.category === 'youtube_video');
  const eventVideos = filteredGalleryItems.filter(item => item.category === 'event_video');

  // Helper function to get full image URL
  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return `http://localhost:5000/${url}`;
  };

  // Extract YouTube ID
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/
    ];
    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Extract Instagram ID
  const extractInstagramId = (url) => {
    if (!url) return null;
    const patterns = [
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/p\/([A-Za-z0-9_-]+)/
    ];
    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Get all media URLs from an item
  const getAllMediaUrls = (item) => {
    if (item.media_urls && Array.isArray(item.media_urls) && item.media_urls.length > 0) {
      return item.media_urls;
    }
    if (item.media_url && typeof item.media_url === 'string') {
      return [item.media_url];
    }
    if (item.media && Array.isArray(item.media) && item.media.length > 0) {
      return item.media;
    }
    return [];
  };

  // Open lightbox with all images from a post
  const openLightbox = (imageUrls, startIndex = 0, title = '') => {
    setCurrentImageSet(imageUrls);
    setCurrentMediaIndex(startIndex);
    setSelectedItem({ title, media_urls: imageUrls });
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedItem(null);
    setCurrentImageSet([]);
    setCurrentMediaIndex(0);
  };

  const nextMedia = () => {
    if (currentImageSet.length > 0) {
      setCurrentMediaIndex((prev) => (prev + 1) % currentImageSet.length);
    }
  };

  const prevMedia = () => {
    if (currentImageSet.length > 0) {
      setCurrentMediaIndex((prev) => (prev - 1 + currentImageSet.length) % currentImageSet.length);
    }
  };

  // Render YouTube Video Card with modal on click - w-20 h-20 size
  const renderYouTubeCard = (item) => {
    const youtubeId = extractYouTubeId(item.youtube_urls?.[0]);
    if (!youtubeId) return null;
    
    return (
      <div 
        className="relative w-20 h-20 bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => setActiveYouTubeVideo(youtubeId)}
      >
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
          alt={item.title}
          className="w-20 h-20 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <FaPlay className="text-white text-lg" />
        </div>
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] px-1 py-0.5 rounded-bl flex items-center gap-0.5">
          <FaYoutube size={8} />
          YT
        </div>
      </div>
    );
  };

  // Render Instagram Reel Card with modal on click - w-20 h-20 size
  const renderInstagramCard = (item) => {
    const instaId = extractInstagramId(item.instagram_urls?.[0]);
    
    return (
      <div 
        className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => instaId && setActiveInstagramVideo(instaId)}
      >
        <div className="w-20 h-20 flex items-center justify-center">
          <FaInstagram className="text-white text-2xl" />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <FaPlay className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute top-0 right-0 bg-pink-600 text-white text-[8px] px-1 py-0.5 rounded-bl flex items-center gap-0.5">
          <FaInstagram size={8} />
          IG
        </div>
      </div>
    );
  };

  // Render Event Video Card - w-20 h-20 size
  const renderEventVideoCard = (item) => {
    const mediaUrls = getAllMediaUrls(item);
    const thumbnailUrl = mediaUrls.length > 0 ? getFullImageUrl(mediaUrls[0]) : null;
    
    return (
      <div 
        className="relative w-20 h-20 bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => openLightbox(mediaUrls.map(url => getFullImageUrl(url)), 0, item.title)}
      >
        {thumbnailUrl ? (
          <>
            <video src={thumbnailUrl} className="w-20 h-20 object-cover" preload="metadata" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FaPlay className="text-white text-lg" />
            </div>
          </>
        ) : (
          <div className="w-20 h-20 bg-blue-600 flex items-center justify-center">
            <FaVideo className="text-white text-2xl" />
          </div>
        )}
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] px-1 py-0.5 rounded-bl flex items-center gap-0.5">
          <FaVideo size={8} />
          Video
        </div>
        {mediaUrls.length > 1 && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-70 text-white text-[8px] px-1 py-0.5 rounded-br">
            +{mediaUrls.length}
          </div>
        )}
      </div>
    );
  };

  // Render Image Card - Clean version with just images (80x80)
  const renderImageCard = (item) => {
    const mediaUrls = getAllMediaUrls(item);
    const imageCount = mediaUrls.length;
    const fullImageUrls = mediaUrls.map(url => getFullImageUrl(url));
    
    return (
      <div className="flex flex-wrap gap-2">
        {fullImageUrls.map((url, idx) => (
          <div 
            key={idx} 
            className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(fullImageUrls, idx, item.title)}
          >
            <img 
              src={url} 
              alt={`${item.title} - ${idx + 1}`} 
              className="w-20 h-20 object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <FaEye className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {imageCount > 1 && (
              <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white text-[8px] px-1 py-0.5 rounded-tr rounded-bl">
                {idx + 1}/{imageCount}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-purple-600" />
      </div>
    );
  }

  if (error && companies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center max-w-md">
          <FaExclamationTriangle className="text-3xl mx-auto mb-2" />
          <p>{error}</p>
          <button onClick={fetchCompanies} className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Company Gallery</h1>
          <p className="text-center text-purple-100 mt-2">Browse through our partners' collections</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDEBAR - Company List */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-4">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3">
                <h2 className="text-white font-semibold flex items-center gap-2"><FaCompany />Companies ({companies.length})</h2>
              </div>
              <div className="divide-y divide-gray-100 max-h-[calc(100vh-200px)] overflow-y-auto">
                {companies.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No companies found</div>
                ) : (
                  companies.map((company) => (
                    <div key={company.id} onClick={() => handleCompanySelect(company)} className={`p-4 cursor-pointer transition-all duration-200 hover:bg-purple-50 ${selectedCompany?.id === company.id ? 'bg-purple-50 border-l-4 border-purple-600' : 'border-l-4 border-transparent'}`}>
                      <div className="flex items-center gap-3">
                        {company.company_logo ? (
                          <img src={getFullImageUrl(company.company_logo)} alt={company.company_name} className="w-12 h-12 rounded-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=Logo'; }} />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center"><FaCompany className="text-purple-600 text-xl" /></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">{company.company_name}</h3>
                          <div className="flex gap-2 text-xs text-gray-500 mt-1">
                            <span>📷 {company.gallery?.counts?.images || 0}</span>
                            <span>📱 {company.gallery?.counts?.instagram_video || 0}</span>
                            <span>▶️ {company.gallery?.counts?.youtube_video || 0}</span>
                            <span>🎥 {company.gallery?.counts?.event_video || 0}</span>
                          </div>
                        </div>
                        {selectedCompany?.id === company.id && <div className="w-2 h-2 bg-purple-600 rounded-full"></div>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT - Gallery Display */}
          <div className="flex-1">
            {/* Selected Company Header */}
            {selectedCompany && (
              <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    {selectedCompany.company_logo ? (
                      <img src={getFullImageUrl(selectedCompany.company_logo)} alt={selectedCompany.company_name} className="w-12 h-12 rounded-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=Logo'; }} />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center"><FaCompany className="text-xl text-purple-600" /></div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{selectedCompany.company_name}</h2>
                      <p className="text-gray-500 text-xs">{selectedCompany.contact_person || 'Contact available'}</p>
                    </div>
                  </div>
                  <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">Total: {filteredGalleryItems.length} items</div>
                </div>
              </div>
            )}

            {/* Filter Buttons - Replacing Checkboxes */}
            {selectedCompany && (
              <div className="bg-white rounded-xl shadow-lg p-3 mb-4">
                <h3 className="text-xs font-medium text-gray-700 mb-2">Filter by Type:</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                      ${activeFilter === 'all' 
                        ? 'bg-purple-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <FaPhotoVideo size={12} />
                    All ({counts.all})
                  </button>
                  <button
                    onClick={() => setActiveFilter('photos')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                      ${activeFilter === 'photos' 
                        ? 'bg-green-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <FaImage size={12} />
                    Photos ({counts.photos})
                  </button>
                  <button
                    onClick={() => setActiveFilter('reels')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                      ${activeFilter === 'reels' 
                        ? 'bg-pink-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <FaInstagram size={12} />
                    Reels ({counts.reels})
                  </button>
                  <button
                    onClick={() => setActiveFilter('youtube')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                      ${activeFilter === 'youtube' 
                        ? 'bg-red-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <FaYoutube size={12} />
                    YouTube ({counts.youtube})
                  </button>
                  <button
                    onClick={() => setActiveFilter('events')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                      ${activeFilter === 'events' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <FaVideo size={12} />
                    Events ({counts.events})
                  </button>
                </div>
              </div>
            )}

            {/* Gallery Sections */}
            {loadingItems ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center"><FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto mb-4" /><p className="text-gray-500">Loading gallery items...</p></div>
            ) : !selectedCompany ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center"><FaCompany className="text-6xl text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Company</h3><p className="text-gray-500">Choose a company from the left sidebar to view their gallery</p></div>
            ) : filteredGalleryItems.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <FaPhotoVideo className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Items Found</h3>
                <p className="text-gray-500">No {activeFilter !== 'all' ? activeFilter : ''} items available for this company</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Photos Section */}
                {images.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 pb-1 border-b border-green-500">
                      <FaImage className="text-green-500 text-sm" />
                      <h3 className="text-sm font-semibold text-gray-800">Photos</h3>
                      <span className="bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">{images.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {images.map((item) => renderImageCard(item))}
                    </div>
                  </div>
                )}

                {/* Instagram Reels Section */}
                {instagramReels.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 pb-1 border-b border-pink-500">
                      <FaInstagram className="text-pink-500 text-sm" />
                      <h3 className="text-sm font-semibold text-gray-800">Instagram Reels</h3>
                      <span className="bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">{instagramReels.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {instagramReels.map((item) => renderInstagramCard(item))}
                    </div>
                  </div>
                )}

                {/* YouTube Videos Section */}
                {youtubeVideos.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 pb-1 border-b border-red-500">
                      <FaYoutube className="text-red-500 text-sm" />
                      <h3 className="text-sm font-semibold text-gray-800">YouTube Videos</h3>
                      <span className="bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">{youtubeVideos.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {youtubeVideos.map((item) => renderYouTubeCard(item))}
                    </div>
                  </div>
                )}

                {/* Event Videos Section */}
                {eventVideos.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 pb-1 border-b border-blue-500">
                      <FaVideo className="text-blue-500 text-sm" />
                      <h3 className="text-sm font-semibold text-gray-800">Event Videos</h3>
                      <span className="bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">{eventVideos.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {eventVideos.map((item) => renderEventVideoCard(item))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Images */}
      {lightboxOpen && currentImageSet.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"><FaTimes size={30} /></button>
          {currentImageSet.length > 1 && (
            <>
              <button onClick={prevMedia} className="absolute left-4 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition z-10"><FaChevronLeft size={30} /></button>
              <button onClick={nextMedia} className="absolute right-4 text-white bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition z-10"><FaChevronRight size={30} /></button>
            </>
          )}
          <div className="max-w-6xl max-h-screen p-4">
            <div className="relative">
              {currentImageSet[currentMediaIndex]?.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video src={currentImageSet[currentMediaIndex]} controls autoPlay className="max-w-full max-h-[80vh] rounded-lg mx-auto" />
              ) : (
                <img src={currentImageSet[currentMediaIndex]} alt={`Gallery - ${currentMediaIndex + 1}`} className="max-w-full max-h-[80vh] rounded-lg mx-auto" onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found'; }} />
              )}
            </div>
            <div className="text-white text-center mt-4">
              <h3 className="text-lg font-semibold">{selectedItem?.title}</h3>
              <p className="text-gray-300 text-sm mt-1">{currentMediaIndex + 1} of {currentImageSet.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Video Modal */}
      {activeYouTubeVideo && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setActiveYouTubeVideo(null)}
        >
          <div
            className="w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="text-white text-2xl mb-4 float-right"
              onClick={() => setActiveYouTubeVideo(null)}
            >
              <FaTimes />
            </button>
            <div className="clear-both"></div>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeYouTubeVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Instagram Video Modal */}
      {activeInstagramVideo && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setActiveInstagramVideo(null)}
        >
          <div
            className="w-full max-w-3xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="text-white text-2xl mb-4 float-right"
              onClick={() => setActiveInstagramVideo(null)}
            >
              <FaTimes />
            </button>
            <div className="clear-both"></div>
            <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
              <iframe
                className="w-full h-full"
                src={`https://www.instagram.com/reel/${activeInstagramVideo}/embed`}
                title="Instagram Reel"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyGallery;