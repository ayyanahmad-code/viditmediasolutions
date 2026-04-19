import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaUpload, FaPlus, FaTimes, FaTrash, FaEye, FaArrowLeft, FaInstagram, FaVideo, FaImage, FaYoutube,
  FaBuilding, FaChevronDown, FaChevronUp, FaHeart, FaCalendar, FaEdit, FaSave, FaSpinner,
  FaCheckCircle, FaTimesCircle, FaToggleOn, FaToggleOff, FaPlay
} from 'react-icons/fa';

const API_BASE_URL = "http://localhost:5000/api";

const AdminGalleryForm = () => {

  // ================= VIEW =================
  const [view, setView] = useState("list");

  // ================= FORM =================
  const [formData, setFormData] = useState({
    title: '',
    partner_id: '',
    category: '',
    instagram_urls: [],
    youtube_urls: []
  });

  const [partners, setPartners] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [partnersWithGallery, setPartnersWithGallery] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const titleInputRef = useRef(null);

  // ================= SEARCH/FILTER =================
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  
  // Lightbox states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageSet, setCurrentImageSet] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeYouTubeVideo, setActiveYouTubeVideo] = useState(null);
  const [activeInstagramVideo, setActiveInstagramVideo] = useState(null);

  // ================= URL INPUT STATES =================
  const [currentInstagramUrl, setCurrentInstagramUrl] = useState('');
  const [currentYoutubeUrl, setCurrentYoutubeUrl] = useState('');

  // ================= PARTNER MODAL =================
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [newPartner, setNewPartner] = useState({
    company_name: '',
    email: '',
    phone: ''
  });
  const [partnerLoading, setPartnerLoading] = useState(false);
  const [partnerError, setPartnerError] = useState('');

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

  // ================= FETCH =================
  useEffect(() => {
    fetchPartners();
    fetchPartnersWithGallery();
  }, []);

  const fetchPartners = async () => {
    const res = await fetch(`${API_BASE_URL}/partners/all`);
    const data = await res.json();
    if (data.success) setPartners(data.data);
  };

  const fetchPartnersWithGallery = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/gallery/partners-with-gallery`);
      const data = await res.json();
      if (data.success) {
        setPartnersWithGallery(data.data);
        const allItems = data.data.flatMap(p => p.gallery?.all || []);
        setGalleryList(allItems);
        if (data.data.length > 0 && !selectedCompany) {
          setSelectedCompany(data.data[0]);
          setGalleryItems(data.data[0].gallery?.all || []);
        }
      }
    } catch (error) {
      console.error("Error fetching partners with gallery:", error);
    }
  };

  const fetchGallery = async () => {
    await fetchPartnersWithGallery();
  };

  // Handle company selection
  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setGalleryItems(company.gallery?.all || []);
  };

  // ================= INPUT =================
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  }, []);

  useEffect(() => {
    if (formData.partner_id) {
      titleInputRef.current?.focus();
    }
  }, [formData.partner_id]);

  // ================= URL HANDLERS =================
  const addInstagramUrl = () => {
    if (!currentInstagramUrl.trim()) return;
    const instaId = extractInstagramId(currentInstagramUrl);
    if (!instaId) {
      setError("Invalid Instagram video URL");
      return;
    }
    setFormData(prev => ({
      ...prev,
      instagram_urls: [...prev.instagram_urls, currentInstagramUrl]
    }));
    setCurrentInstagramUrl('');
    setError(null);
  };

  const removeInstagramUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      instagram_urls: prev.instagram_urls.filter((_, i) => i !== index)
    }));
  };

  const addYoutubeUrl = () => {
    if (!currentYoutubeUrl.trim()) return;
    const youtubeId = extractYouTubeId(currentYoutubeUrl);
    if (!youtubeId) {
      setError("Invalid YouTube video URL");
      return;
    }
    setFormData(prev => ({
      ...prev,
      youtube_urls: [...prev.youtube_urls, currentYoutubeUrl]
    }));
    setCurrentYoutubeUrl('');
    setError(null);
  };

  const removeYoutubeUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      youtube_urls: prev.youtube_urls.filter((_, i) => i !== index)
    }));
  };

  // ================= IMAGE HANDLERS =================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const updated = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
      isNew: true
    }));
    setImages(prev => [...prev, ...updated]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // ================= VIDEO HANDLERS =================
  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    const updated = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
      isNew: true
    }));
    setVideos(prev => [...prev, ...updated]);
  };

  const removeVideo = (id) => {
    setVideos(prev => prev.filter(vid => vid.id !== id));
  };

  const removeExistingVideo = (index) => {
    setExistingVideos(prev => prev.filter((_, i) => i !== index));
  };

  // ================= DRAG DROP =================
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    files.forEach(file => {
      if (file.type.startsWith("image/")) {
        setImages(prev => [...prev, { 
          file, 
          preview: URL.createObjectURL(file),
          id: Math.random().toString(36).substr(2, 9),
          isNew: true
        }]);
      } else if (file.type.startsWith("video/")) {
        setVideos(prev => [...prev, { 
          file, 
          preview: URL.createObjectURL(file),
          id: Math.random().toString(36).substr(2, 9),
          isNew: true
        }]);
      }
    });
  };

  // ================= EDIT HANDLER =================
  const startEdit = (item) => {
    setEditingItem(item);
    setIsEditing(true);
    setFormData({
      title: item.title || '',
      partner_id: item.partner_id?.toString() || '',
      category: item.category || '',
      instagram_urls: item.instagram_urls || [],
      youtube_urls: item.youtube_urls || []
    });
    
    if (item.category === 'images' && item.media_urls) {
      setExistingImages(item.media_urls.map((url, idx) => ({ url, id: idx })));
      setImages([]);
    } else if (item.category === 'event_video' && item.media_urls) {
      setExistingVideos(item.media_urls.map((url, idx) => ({ url, id: idx })));
      setVideos([]);
    } else {
      setExistingImages([]);
      setExistingVideos([]);
      setImages([]);
      setVideos([]);
    }
    
    setView("form");
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const confirmMessage = currentStatus === 'active' 
      ? 'Deactivate this item? It will not be visible on the website.'
      : 'Activate this item? It will become visible on the website.';
    
    if (!window.confirm(confirmMessage)) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      if (data.success) {
        await fetchGallery();
        alert(`Item ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  // ================= SUBMIT (CREATE/UPDATE) =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return setError("Title required");
    if (!formData.partner_id) return setError("Select partner");
    if (!formData.category) return setError("Select category");

    if (formData.category === "instagram_video") {
      if (formData.instagram_urls.length === 0) {
        return setError("At least one Instagram video URL required");
      }
    } else if (formData.category === "youtube_video") {
      if (formData.youtube_urls.length === 0) {
        return setError("At least one YouTube video URL required");
      }
    } else if (formData.category === "images" && images.length === 0 && existingImages.length === 0) {
      return setError("At least one image required");
    } else if (formData.category === "event_video" && videos.length === 0 && existingVideos.length === 0) {
      return setError("At least one video required");
    }

    setLoading(true);

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("partner_id", formData.partner_id);
    fd.append("category", formData.category);
    
    if (formData.category === "instagram_video") {
      formData.instagram_urls.forEach(url => fd.append("instagram_urls", url));
    }
    
    if (formData.category === "youtube_video") {
      formData.youtube_urls.forEach(url => fd.append("youtube_urls", url));
    }

    images.forEach(img => fd.append("images", img.file));
    videos.forEach(vid => fd.append("videos", vid.file));

    if (isEditing && editingItem) {
      fd.append("_method", "PUT");
      fd.append("id", editingItem.id);
      
      if (existingImages.length > 0) {
        fd.append("existing_images", JSON.stringify(existingImages.map(img => img.url)));
      }
      if (existingVideos.length > 0) {
        fd.append("existing_videos", JSON.stringify(existingVideos.map(vid => vid.url)));
      }
    }

    try {
      const url = isEditing 
        ? `${API_BASE_URL}/gallery/${editingItem.id}`
        : `${API_BASE_URL}/gallery/create`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method: method,
        body: fd
      });

      const data = await res.json();

      if (data.success) {
        setFormData({ 
          title: '', 
          partner_id: '', 
          category: '', 
          instagram_urls: [],
          youtube_urls: []
        });
        
        images.forEach(img => URL.revokeObjectURL(img.preview));
        videos.forEach(vid => URL.revokeObjectURL(vid.preview));
        
        setImages([]);
        setVideos([]);
        setExistingImages([]);
        setExistingVideos([]);
        setCurrentInstagramUrl('');
        setCurrentYoutubeUrl('');
        setIsEditing(false);
        setEditingItem(null);
        await fetchGallery();
        setView("list");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Server error");
    }

    setLoading(false);
  };

  // ================= DELETE GALLERY ITEM =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item? This action cannot be undone.")) return;

    try {
      await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: "DELETE"
      });
      await fetchGallery();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ================= PARTNER HANDLERS =================
  const handlePartnerChange = (e) => {
    const { name, value } = e.target;
    setNewPartner(prev => ({ ...prev, [name]: value }));
  };

  const handleCreatePartner = async (e) => {
    e.preventDefault();

    if (!newPartner.company_name.trim()) {
      setPartnerError("Company name required");
      return;
    }

    setPartnerLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/partners/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newPartner)
      });

      const data = await res.json();

      if (data.success) {
        await fetchPartners();
        const newId = data.data?.id || data.id;
        setFormData(prev => ({
          ...prev,
          partner_id: newId.toString()
        }));
        setShowPartnerModal(false);
        setNewPartner({ company_name: '', email: '', phone: '' });
        setPartnerError('');
      } else {
        setPartnerError(data.message);
      }
    } catch {
      setPartnerError("Server error");
    }

    setPartnerLoading(false);
  };

  // ================= RENDER BULK IMAGES CARD (like CompanyGallery) =================
  const renderImageCard = (item) => {
    const mediaUrls = getAllMediaUrls(item);
    const fullImageUrls = mediaUrls.map(url => getFullImageUrl(url));
    const imageCount = mediaUrls.length;
    
    return (
      <div className="flex flex-wrap gap-2">
        {fullImageUrls.map((url, idx) => (
          <div 
            key={idx} 
            className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(fullImageUrls, idx, item.title)}
          >
            <img 
              src={url} 
              alt={`${item.title} - ${idx + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/96x96?text=No+Image'; }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <FaEye className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {imageCount > 1 && (
              <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white text-[10px] px-1.5 py-0.5 rounded-bl">
                {idx + 1}/{imageCount}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render Instagram Reel Card
  const renderInstagramCard = (item) => {
    const instaId = extractInstagramId(item.instagram_urls?.[0]);
    
    return (
      <div 
        className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => instaId && setActiveInstagramVideo(instaId)}
      >
        <div className="w-full h-full flex items-center justify-center">
          <FaInstagram className="text-white text-3xl" />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <FaPlay className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute top-0 right-0 bg-pink-600 text-white text-[10px] px-1.5 py-0.5 rounded-bl flex items-center gap-0.5">
          <FaInstagram size={10} />
          IG
        </div>
      </div>
    );
  };

  // Render YouTube Video Card
  const renderYouTubeCard = (item) => {
    const youtubeId = extractYouTubeId(item.youtube_urls?.[0]);
    if (!youtubeId) return null;
    
    return (
      <div 
        className="relative w-24 h-24 bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => setActiveYouTubeVideo(youtubeId)}
      >
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <FaPlay className="text-white text-xl" />
        </div>
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-bl flex items-center gap-0.5">
          <FaYoutube size={10} />
          YT
        </div>
      </div>
    );
  };

  // Render Event Video Card
  const renderEventVideoCard = (item) => {
    const mediaUrls = getAllMediaUrls(item);
    const thumbnailUrl = mediaUrls.length > 0 ? getFullImageUrl(mediaUrls[0]) : null;
    
    return (
      <div 
        className="relative w-24 h-24 bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => openLightbox(mediaUrls.map(url => getFullImageUrl(url)), 0, item.title)}
      >
        {thumbnailUrl ? (
          <>
            <video src={thumbnailUrl} className="w-full h-full object-cover" preload="metadata" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FaPlay className="text-white text-xl" />
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-blue-600 flex items-center justify-center">
            <FaVideo className="text-white text-3xl" />
          </div>
        )}
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-bl flex items-center gap-0.5">
          <FaVideo size={10} />
          Video
        </div>
        {mediaUrls.length > 1 && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-70 text-white text-[10px] px-1.5 py-0.5 rounded-br">
            +{mediaUrls.length}
          </div>
        )}
      </div>
    );
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {view === "form" ? (isEditing ? "Edit Gallery Item" : "Add Gallery") : "Gallery Management"}
          </h2>

          <div className="flex gap-2">
            {view === "list" && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingItem(null);
                  setFormData({
                    title: '',
                    partner_id: '',
                    category: '',
                    instagram_urls: [],
                    youtube_urls: []
                  });
                  setImages([]);
                  setVideos([]);
                  setExistingImages([]);
                  setExistingVideos([]);
                  setView("form");
                }}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
              >
                <FaPlus /> Add New
              </button>
            )}
            <button
              onClick={() => setView(view === "form" ? "list" : "form")}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
            >
              {view === "form" ? <FaEye /> : <FaArrowLeft />}
              {view === "form" ? "View Gallery" : "Back"}
            </button>
          </div>
        </div>

        {/* FORM */}
        {view === "form" && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            {error && <p className="text-red-500 bg-red-50 p-2 rounded">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Partner */}
              <div>
                <label className="block mb-1 font-medium">Partner *</label>
                <div className="flex gap-2">
                  <select
                    name="partner_id"
                    value={formData.partner_id}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">Select Partner</option>
                    {partners.map(p => (
                      <option key={p.id} value={p.id}>{p.company_name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowPartnerModal(true)}
                    className="bg-green-600 text-white px-3 rounded hover:bg-green-700"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* Category */}
              {formData.partner_id && (
                <div>
                  <label className="block mb-1 font-medium">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="instagram_video">📸 Instagram Reel</option>
                    <option value="youtube_video">▶️ YouTube Video</option>
                    <option value="event_video">🎥 Event Video</option>
                    <option value="images">🖼️ Post / Images</option>
                  </select>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block mb-1 font-medium">Title *</label>
                <input
                  ref={titleInputRef}
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter Title"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {/* Instagram URLs */}
              {formData.category === "instagram_video" && (
                <div>
                  <label className="block mb-1 font-medium">
                    <FaInstagram className="inline mr-2" /> Instagram Reel URLs *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={currentInstagramUrl}
                      onChange={(e) => setCurrentInstagramUrl(e.target.value)}
                      placeholder="https://www.instagram.com/reel/xxxxx"
                      className="flex-1 border p-2 rounded"
                    />
                    <button type="button" onClick={addInstagramUrl} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">
                      <FaPlus /> Add
                    </button>
                  </div>
                  {formData.instagram_urls.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {formData.instagram_urls.map((url, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm truncate flex-1">{url}</span>
                          <button type="button" onClick={() => removeInstagramUrl(idx)} className="text-red-500 hover:text-red-700 ml-2">
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* YouTube URLs */}
              {formData.category === "youtube_video" && (
                <div>
                  <label className="block mb-1 font-medium">
                    <FaYoutube className="inline mr-2" /> YouTube Video URLs *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={currentYoutubeUrl}
                      onChange={(e) => setCurrentYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=xxxxx"
                      className="flex-1 border p-2 rounded"
                    />
                    <button type="button" onClick={addYoutubeUrl} className="bg-red-600 text-white px-4 rounded hover:bg-red-700">
                      <FaPlus /> Add
                    </button>
                  </div>
                  {formData.youtube_urls.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {formData.youtube_urls.map((url, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm truncate flex-1">{url}</span>
                          <button type="button" onClick={() => removeYoutubeUrl(idx)} className="text-red-500 hover:text-red-700 ml-2">
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Images Upload - Multiple */}
              {formData.category === "images" && (
                <div>
                  <label className="block mb-1 font-medium">
                    <FaImage className="inline mr-2" /> Upload Images *
                  </label>
                  
                  {existingImages.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
                      <div className="flex flex-wrap gap-2">
                        {existingImages.map((img, idx) => (
                          <div key={idx} className="relative w-20 h-20 group">
                            <img 
                              src={img.url.startsWith('http') ? img.url : `http://localhost:5000${img.url}`}
                              className="w-full h-full object-cover rounded"
                              alt="existing"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <label className="block border-2 border-dashed p-6 text-center cursor-pointer hover:bg-gray-50">
                    <FaUpload className="mx-auto mb-2 text-2xl text-gray-400" />
                    <span className="text-gray-500">Click to select images</span>
                    <input type="file" multiple accept="image/*" hidden onChange={handleImageChange} />
                  </label>
                  
                  {images.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">New Images:</p>
                      <div className="flex flex-wrap gap-2">
                        {images.map((img) => (
                          <div key={img.id} className="relative w-20 h-20 group">
                            <img src={img.preview} className="w-full h-full object-cover rounded" alt="preview" />
                            <button type="button" onClick={() => removeImage(img.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Videos Upload - Multiple */}
              {formData.category === "event_video" && (
                <div>
                  <label className="block mb-1 font-medium">
                    <FaVideo className="inline mr-2" /> Upload Videos *
                  </label>
                  
                  {existingVideos.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Existing Videos:</p>
                      <div className="flex flex-wrap gap-2">
                        {existingVideos.map((vid, idx) => (
                          <div key={idx} className="relative w-32 h-20 group">
                            <video 
                              src={vid.url.startsWith('http') ? vid.url : `http://localhost:5000${vid.url}`}
                              className="w-full h-full object-cover rounded"
                              controls
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingVideo(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <label className="block border-2 border-dashed p-6 text-center cursor-pointer hover:bg-gray-50">
                    <FaUpload className="mx-auto mb-2 text-2xl text-gray-400" />
                    <span className="text-gray-500">Click to select videos</span>
                    <input type="file" multiple accept="video/*" hidden onChange={handleVideoChange} />
                  </label>
                  
                  {videos.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">New Videos:</p>
                      <div className="flex flex-wrap gap-2">
                        {videos.map((vid) => (
                          <div key={vid.id} className="relative w-32 h-20 group">
                            <video src={vid.preview} className="w-full h-full object-cover rounded" controls />
                            <button type="button" onClick={() => removeVideo(vid.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Drag Drop Area */}
              {(formData.category === "images" || formData.category === "event_video") && (
                <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="border-2 border-dashed border-gray-300 p-8 text-center rounded hover:border-purple-500 transition bg-gray-50">
                  <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                  <p className="text-gray-500">Drag & Drop {formData.category === "images" ? "Images" : "Videos"} Here</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50">
                {loading ? <FaSpinner className="animate-spin inline mr-2" /> : (isEditing ? <FaSave className="inline mr-2" /> : <FaUpload className="inline mr-2" />)}
                {loading ? "Processing..." : (isEditing ? "Update Gallery Item" : "Submit Gallery Item")}
              </button>
            </form>
          </div>
        )}

        {/* LIST - Company Gallery Style (like CompanyGallery.jsx) */}
        {view === "list" && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT SIDEBAR - Company List */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-4">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <FaBuilding /> Companies ({partnersWithGallery.length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-100 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {partnersWithGallery.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No companies found</div>
                  ) : (
                    partnersWithGallery.map((company) => (
                      <div 
                        key={company.id} 
                        onClick={() => handleCompanySelect(company)} 
                        className={`p-4 cursor-pointer transition-all duration-200 hover:bg-purple-50 ${
                          selectedCompany?.id === company.id ? 'bg-purple-50 border-l-4 border-purple-600' : 'border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                            <FaBuilding className="text-purple-600" />
                          </div>
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
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                        <FaBuilding className="text-xl text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{selectedCompany.company_name}</h2>
                        <p className="text-gray-500 text-xs">{selectedCompany.contact_person || 'Contact available'}</p>
                      </div>
                    </div>
                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      Total: {galleryItems.length} items
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Buttons */}
              {selectedCompany && (
                <div className="bg-white rounded-xl shadow-lg p-3 mb-4">
                  <h3 className="text-xs font-medium text-gray-700 mb-2">Filter by Type:</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilterCategory('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                        ${filterCategory === 'all' 
                          ? 'bg-purple-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      All ({galleryItems.length})
                    </button>
                    <button
                      onClick={() => setFilterCategory('images')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                        ${filterCategory === 'images' 
                          ? 'bg-green-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <FaImage size={12} /> Photos ({galleryItems.filter(i => i.category === 'images').length})
                    </button>
                    <button
                      onClick={() => setFilterCategory('instagram_video')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                        ${filterCategory === 'instagram_video' 
                          ? 'bg-pink-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <FaInstagram size={12} /> Reels ({galleryItems.filter(i => i.category === 'instagram_video').length})
                    </button>
                    <button
                      onClick={() => setFilterCategory('youtube_video')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                        ${filterCategory === 'youtube_video' 
                          ? 'bg-red-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <FaYoutube size={12} /> YouTube ({galleryItems.filter(i => i.category === 'youtube_video').length})
                    </button>
                    <button
                      onClick={() => setFilterCategory('event_video')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5
                        ${filterCategory === 'event_video' 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <FaVideo size={12} /> Events ({galleryItems.filter(i => i.category === 'event_video').length})
                    </button>
                  </div>
                </div>
              )}

              {/* Gallery Sections */}
              {!selectedCompany ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <FaBuilding className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Company</h3>
                  <p className="text-gray-500">Choose a company from the left sidebar to view their gallery</p>
                </div>
              ) : galleryItems.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Items Found</h3>
                  <p className="text-gray-500">No items available for this company</p>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        title: '',
                        partner_id: selectedCompany.id.toString(),
                        category: '',
                        instagram_urls: [],
                        youtube_urls: []
                      });
                      setView("form");
                    }}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    <FaPlus className="inline mr-2" /> Add First Item
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Photos Section */}
                  {galleryItems.filter(i => i.category === 'images').length > 0 && (filterCategory === 'all' || filterCategory === 'images') && (
                    <div className="bg-white rounded-xl shadow-lg p-4">
                      <div className="flex items-center gap-2 mb-3 pb-1 border-b border-green-500">
                        <FaImage className="text-green-500" />
                        <h3 className="font-semibold text-gray-800">Photos</h3>
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{galleryItems.filter(i => i.category === 'images').length}</span>
                      </div>
                      <div className="space-y-4">
                        {galleryItems.filter(i => i.category === 'images').map((item) => (
                          <div key={item.id} className="border-b border-gray-100 pb-4 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-800">{item.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {item.status === 'active' ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => updateStatus(item.id, item.status)} className="text-gray-500 hover:text-purple-600 p-1" title={item.status === 'active' ? 'Deactivate' : 'Activate'}>
                                  {item.status === 'active' ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                                </button>
                                <button onClick={() => startEdit(item)} className="text-yellow-500 hover:text-yellow-700 p-1" title="Edit">
                                  <FaEdit size={16} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-1" title="Delete">
                                  <FaTrash size={16} />
                                </button>
                              </div>
                            </div>
                            {renderImageCard(item)}
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><FaEye /> {item.views || 0}</span>
                              <span className="flex items-center gap-1"><FaHeart className="text-red-500" /> {item.likes || 0}</span>
                              <span><FaCalendar /> {new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instagram Reels Section */}
                  {galleryItems.filter(i => i.category === 'instagram_video').length > 0 && (filterCategory === 'all' || filterCategory === 'instagram_video') && (
                    <div className="bg-white rounded-xl shadow-lg p-4">
                      <div className="flex items-center gap-2 mb-3 pb-1 border-b border-pink-500">
                        <FaInstagram className="text-pink-500" />
                        <h3 className="font-semibold text-gray-800">Instagram Reels</h3>
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{galleryItems.filter(i => i.category === 'instagram_video').length}</span>
                      </div>
                      <div className="space-y-4">
                        {galleryItems.filter(i => i.category === 'instagram_video').map((item) => (
                          <div key={item.id} className="border-b border-gray-100 pb-4 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-800">{item.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {item.status === 'active' ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => updateStatus(item.id, item.status)} className="text-gray-500 hover:text-purple-600 p-1">
                                  {item.status === 'active' ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                                </button>
                                <button onClick={() => startEdit(item)} className="text-yellow-500 hover:text-yellow-700 p-1">
                                  <FaEdit size={16} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-1">
                                  <FaTrash size={16} />
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {renderInstagramCard(item)}
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><FaEye /> {item.views || 0}</span>
                              <span className="flex items-center gap-1"><FaHeart className="text-red-500" /> {item.likes || 0}</span>
                              <span><FaCalendar /> {new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* YouTube Videos Section */}
                  {galleryItems.filter(i => i.category === 'youtube_video').length > 0 && (filterCategory === 'all' || filterCategory === 'youtube_video') && (
                    <div className="bg-white rounded-xl shadow-lg p-4">
                      <div className="flex items-center gap-2 mb-3 pb-1 border-b border-red-500">
                        <FaYoutube className="text-red-500" />
                        <h3 className="font-semibold text-gray-800">YouTube Videos</h3>
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{galleryItems.filter(i => i.category === 'youtube_video').length}</span>
                      </div>
                      <div className="space-y-4">
                        {galleryItems.filter(i => i.category === 'youtube_video').map((item) => (
                          <div key={item.id} className="border-b border-gray-100 pb-4 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-800">{item.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {item.status === 'active' ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => updateStatus(item.id, item.status)} className="text-gray-500 hover:text-purple-600 p-1">
                                  {item.status === 'active' ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                                </button>
                                <button onClick={() => startEdit(item)} className="text-yellow-500 hover:text-yellow-700 p-1">
                                  <FaEdit size={16} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-1">
                                  <FaTrash size={16} />
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {renderYouTubeCard(item)}
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><FaEye /> {item.views || 0}</span>
                              <span className="flex items-center gap-1"><FaHeart className="text-red-500" /> {item.likes || 0}</span>
                              <span><FaCalendar /> {new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Event Videos Section */}
                  {galleryItems.filter(i => i.category === 'event_video').length > 0 && (filterCategory === 'all' || filterCategory === 'event_video') && (
                    <div className="bg-white rounded-xl shadow-lg p-4">
                      <div className="flex items-center gap-2 mb-3 pb-1 border-b border-blue-500">
                        <FaVideo className="text-blue-500" />
                        <h3 className="font-semibold text-gray-800">Event Videos</h3>
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{galleryItems.filter(i => i.category === 'event_video').length}</span>
                      </div>
                      <div className="space-y-4">
                        {galleryItems.filter(i => i.category === 'event_video').map((item) => (
                          <div key={item.id} className="border-b border-gray-100 pb-4 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-800">{item.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {item.status === 'active' ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => updateStatus(item.id, item.status)} className="text-gray-500 hover:text-purple-600 p-1">
                                  {item.status === 'active' ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                                </button>
                                <button onClick={() => startEdit(item)} className="text-yellow-500 hover:text-yellow-700 p-1">
                                  <FaEdit size={16} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-1">
                                  <FaTrash size={16} />
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {renderEventVideoCard(item)}
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><FaEye /> {item.views || 0}</span>
                              <span className="flex items-center gap-1"><FaHeart className="text-red-500" /> {item.likes || 0}</span>
                              <span><FaCalendar /> {new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
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
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setActiveYouTubeVideo(null)}>
          <div className="w-full max-w-4xl mx-4" onClick={(e) => e.stopPropagation()}>
            <button className="text-white text-2xl mb-4 float-right" onClick={() => setActiveYouTubeVideo(null)}><FaTimes /></button>
            <div className="clear-both"></div>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${activeYouTubeVideo}?autoplay=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
        </div>
      )}

      {/* Instagram Video Modal */}
      {activeInstagramVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setActiveInstagramVideo(null)}>
          <div className="w-full max-w-3xl mx-4" onClick={(e) => e.stopPropagation()}>
            <button className="text-white text-2xl mb-4 float-right" onClick={() => setActiveInstagramVideo(null)}><FaTimes /></button>
            <div className="clear-both"></div>
            <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
              <iframe className="w-full h-full" src={`https://www.instagram.com/reel/${activeInstagramVideo}/embed`} title="Instagram Reel" frameBorder="0" allowFullScreen />
            </div>
          </div>
        </div>
      )}

      {/* Partner Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
            <button onClick={() => setShowPartnerModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"><FaTimes /></button>
            <h3 className="text-xl font-bold mb-4">Add New Partner</h3>
            {partnerError && <p className="text-red-500 mb-2">{partnerError}</p>}
            <form onSubmit={handleCreatePartner} className="space-y-3">
              <input name="company_name" value={newPartner.company_name} onChange={handlePartnerChange} placeholder="Company Name *" className="w-full border p-2 rounded" required />
              <input name="email" value={newPartner.email} onChange={handlePartnerChange} placeholder="Email" type="email" className="w-full border p-2 rounded" />
              <input name="phone" value={newPartner.phone} onChange={handlePartnerChange} placeholder="Phone" className="w-full border p-2 rounded" />
              <button type="submit" disabled={partnerLoading} className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50">
                {partnerLoading ? "Adding..." : "Add Partner"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryForm;