import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaUpload, FaPlus, FaTimes, FaTrash, FaEye, FaArrowLeft, FaInstagram, FaVideo, FaImage, FaYoutube
} from 'react-icons/fa';

const API_BASE_URL = "http://localhost:5000/api";

const AdminGalleryForm = () => {

  // ================= VIEW =================
  const [view, setView] = useState("form");

  // ================= FORM =================
  const [formData, setFormData] = useState({
    title: '',
    partner_id: '',
    category: '',
    instagram_urls: [],  // Changed to array for multiple URLs
    youtube_urls: []     // Added for multiple YouTube URLs
  });

  const [partners, setPartners] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [galleryList, setGalleryList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const titleInputRef = useRef(null);

  // ================= SEARCH/FILTER =================
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

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

  // ================= FETCH =================
  useEffect(() => {
    fetchPartners();
    fetchGallery();
  }, []);

  const fetchPartners = async () => {
    const res = await fetch(`${API_BASE_URL}/partners/all`);
    const data = await res.json();
    if (data.success) setPartners(data.data);
  };

  const fetchGallery = async () => {
    const res = await fetch(`${API_BASE_URL}/gallery/all`);
    const data = await res.json();
    if (data.success) setGalleryList(data.data);
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
      id: Math.random().toString(36).substr(2, 9)
    }));
    setImages(prev => [...prev, ...updated]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // ================= VIDEO HANDLERS =================
  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    const updated = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setVideos(prev => [...prev, ...updated]);
  };

  const removeVideo = (id) => {
    setVideos(prev => prev.filter(vid => vid.id !== id));
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
          id: Math.random().toString(36).substr(2, 9)
        }]);
      } else if (file.type.startsWith("video/")) {
        setVideos(prev => [...prev, { 
          file, 
          preview: URL.createObjectURL(file),
          id: Math.random().toString(36).substr(2, 9)
        }]);
      }
    });
  };

  // ================= EXTRACT IDs =================
  const extractInstagramId = (url) => {
    const patterns = [
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/tv\/([A-Za-z0-9_-]+)/
    ];
    
    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const extractYouTubeId = (url) => {
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

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return setError("Title required");
    if (!formData.partner_id) return setError("Select partner");
    if (!formData.category) return setError("Select category");

    // Validate based on category
    if (formData.category === "instagram_video") {
      if (formData.instagram_urls.length === 0) {
        return setError("At least one Instagram video URL required");
      }
    } else if (formData.category === "youtube_video") {
      if (formData.youtube_urls.length === 0) {
        return setError("At least one YouTube video URL required");
      }
    } else if (formData.category === "images" && images.length === 0) {
      return setError("At least one image required");
    } else if (formData.category === "event_video" && videos.length === 0) {
      return setError("At least one video required");
    }

    setLoading(true);

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("partner_id", formData.partner_id);
    fd.append("category", formData.category);
    
    // Append multiple Instagram URLs
    if (formData.category === "instagram_video") {
      formData.instagram_urls.forEach(url => fd.append("instagram_urls", url));
    }
    
    // Append multiple YouTube URLs
    if (formData.category === "youtube_video") {
      formData.youtube_urls.forEach(url => fd.append("youtube_urls", url));
    }

    // Append multiple images
    images.forEach(img => fd.append("images", img.file));
    
    // Append multiple videos
    videos.forEach(vid => fd.append("videos", vid.file));

    try {
      const res = await fetch(`${API_BASE_URL}/gallery/create`, {
        method: "POST",
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
        
        // Cleanup preview URLs
        images.forEach(img => URL.revokeObjectURL(img.preview));
        videos.forEach(vid => URL.revokeObjectURL(vid.preview));
        
        setImages([]);
        setVideos([]);
        setCurrentInstagramUrl('');
        setCurrentYoutubeUrl('');
        fetchGallery();
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
    if (!window.confirm("Delete this item?")) return;

    try {
      await fetch(`${API_BASE_URL}/gallery/delete/${id}`, {
        method: "DELETE"
      });
      fetchGallery();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ================= FILTER GALLERY =================
  const filteredGallery = galleryList.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory ? item.category === filterCategory : true)
  );

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

  // ================= RENDER MEDIA IN LIST =================
  const renderMedia = (item) => {
    if (item.category === "instagram_video" && item.instagram_urls && item.instagram_urls.length > 0) {
      return (
        <div className="mt-2 space-y-3">
          {item.instagram_urls.slice(0, 2).map((url, idx) => {
            const instaId = extractInstagramId(url);
            return (
              <div key={idx} className="relative">
                <iframe
                  src={`https://www.instagram.com/reel/${instaId}/embed`}
                  className="w-full h-64 rounded"
                  allowFullScreen
                  title={`Instagram Video ${idx + 1}`}
                />
              </div>
            );
          })}
          {item.instagram_urls.length > 2 && (
            <p className="text-sm text-gray-500 text-center">
              +{item.instagram_urls.length - 2} more Instagram videos
            </p>
          )}
        </div>
      );
    } else if (item.category === "youtube_video" && item.youtube_urls && item.youtube_urls.length > 0) {
      return (
        <div className="mt-2 space-y-3">
          {item.youtube_urls.slice(0, 2).map((url, idx) => {
            const youtubeId = extractYouTubeId(url);
            return (
              <div key={idx} className="relative">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  className="w-full h-64 rounded"
                  allowFullScreen
                  title={`YouTube Video ${idx + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            );
          })}
          {item.youtube_urls.length > 2 && (
            <p className="text-sm text-gray-500 text-center">
              +{item.youtube_urls.length - 2} more YouTube videos
            </p>
          )}
        </div>
      );
    } else if (item.category === "images" && item.media && item.media.length > 0) {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {item.media.slice(0, 4).map((url, idx) => (
            <img key={idx} src={url} className="rounded h-24 w-full object-cover" alt={`Gallery ${idx}`} />
          ))}
          {item.media.length > 4 && (
            <div className="relative">
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center text-white font-bold">
                +{item.media.length - 4}
              </div>
            </div>
          )}
        </div>
      );
    } else if (item.category === "event_video" && item.media && item.media.length > 0) {
      return (
        <div className="mt-2 space-y-2">
          {item.media.slice(0, 2).map((url, idx) => (
            <video key={idx} src={url} className="rounded w-full h-32 object-cover" controls />
          ))}
          {item.media.length > 2 && (
            <p className="text-sm text-gray-500">+{item.media.length - 2} more videos</p>
          )}
        </div>
      );
    }
    return null;
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {view === "form" ? "Add Gallery" : "Gallery List"}
          </h2>

          <button
            onClick={() => setView(view === "form" ? "list" : "form")}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            {view === "form" ? <FaEye /> : <FaArrowLeft />}
            {view === "form" ? "View Gallery" : "Back"}
          </button>
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
                      <option key={p.id} value={p.id}>
                        {p.company_name}
                      </option>
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
                    <option value="instagram_video">📸 Instagram Video</option>
                    <option value="youtube_video">▶️ YouTube Video</option>
                    <option value="event_video">🎥 Event Video</option>
                    <option value="images">🖼️ Post</option>
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

              {/* Multiple Instagram URLs Field */}
              {formData.category === "instagram_video" && (
                <div>
                  <label className="block mb-1 font-medium">
                    <FaInstagram className="inline mr-2" />
                    Instagram Video URLs *
                  </label>
                  
                  <div className="flex gap-2 mb-2">
                    <input
                      value={currentInstagramUrl}
                      onChange={(e) => setCurrentInstagramUrl(e.target.value)}
                      placeholder="https://www.instagram.com/reel/xxxxx"
                      className="flex-1 border p-2 rounded"
                    />
                    <button
                      type="button"
                      onClick={addInstagramUrl}
                      className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
                    >
                      <FaPlus /> Add
                    </button>
                  </div>

                  {/* List of added Instagram URLs */}
                  {formData.instagram_urls.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {formData.instagram_urls.map((url, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm truncate flex-1">{url}</span>
                          <button
                            type="button"
                            onClick={() => removeInstagramUrl(idx)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Supports: Reels, Posts, IGTV URLs. You can add multiple videos.
                  </p>
                </div>
              )}

              {/* Multiple YouTube URLs Field */}
              {formData.category === "youtube_video" && (
                <div>
                  <label className="block mb-1 font-medium">
                    <FaYoutube className="inline mr-2" />
                    YouTube Video URLs *
                  </label>
                  
                  <div className="flex gap-2 mb-2">
                    <input
                      value={currentYoutubeUrl}
                      onChange={(e) => setCurrentYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=xxxxx"
                      className="flex-1 border p-2 rounded"
                    />
                    <button
                      type="button"
                      onClick={addYoutubeUrl}
                      className="bg-red-600 text-white px-4 rounded hover:bg-red-700"
                    >
                      <FaPlus /> Add
                    </button>
                  </div>

                  {/* List of added YouTube URLs */}
                  {formData.youtube_urls.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {formData.youtube_urls.map((url, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm truncate flex-1">{url}</span>
                          <button
                            type="button"
                            onClick={() => removeYoutubeUrl(idx)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Supports: YouTube URLs, Shorts, YouTu.be links. You can add multiple videos.
                  </p>
                </div>
              )}

              {/* Multiple Images Upload */}
              {formData.category === "images" && (
                <div>
                  <label className="block mb-1 font-medium">
                    <FaImage className="inline mr-2" />
                    Upload Multiple Post *
                  </label>
                  
                  <label className="block border-2 border-dashed p-6 text-center cursor-pointer hover:bg-gray-50">
                    <FaUpload className="mx-auto mb-2 text-2xl text-gray-400" />
                    <span className="text-gray-500">Click to select images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </label>

                  {/* Images Preview Grid */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-3">
                      {images.map((img) => (
                        <div key={img.id} className="relative group">
                          <img 
                            src={img.preview} 
                            className="h-24 w-full object-cover rounded"
                            alt="preview"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Multiple Videos Upload */}
              {formData.category === "event_video" && (
                <div>
                  <label className="block mb-1 font-medium">
                    <FaVideo className="inline mr-2" />
                    Upload Multiple Videos *
                  </label>
                  
                  <label className="block border-2 border-dashed p-6 text-center cursor-pointer hover:bg-gray-50">
                    <FaUpload className="mx-auto mb-2 text-2xl text-gray-400" />
                    <span className="text-gray-500">Click to select videos</span>
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      hidden
                      onChange={handleVideoChange}
                    />
                  </label>

                  {/* Videos Preview Grid */}
                  {videos.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {videos.map((vid) => (
                        <div key={vid.id} className="relative group">
                          <video 
                            src={vid.preview} 
                            className="h-32 w-full object-cover rounded"
                            controls
                          />
                          <button
                            type="button"
                            onClick={() => removeVideo(vid.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Drag Drop Area */}
              {(formData.category === "images" || formData.category === "event_video") && (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-300 p-8 text-center rounded hover:border-purple-500 transition bg-gray-50"
                >
                  <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                  <p className="text-gray-500">Drag & Drop {formData.category === "images" ? "Images" : "Videos"} Here</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Submit"}
              </button>

            </form>
          </div>
        )}

        {/* LIST */}
        {view === "list" && (
          <div className="bg-white p-6 rounded-xl shadow">

            {/* Search and Filter */}
            <div className="flex gap-3 mb-4">
              <input
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded flex-1"
              />

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">All Categories</option>
                <option value="instagram_video">📸 Instagram Video</option>
                <option value="youtube_video">▶️ YouTube Video</option>
                <option value="event_video">🎥 Event Video</option>
                <option value="images">🖼️ Images</option>
              </select>
            </div>

            {filteredGallery.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No gallery items found</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGallery.map(item => (
                  <div key={item.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.category === "instagram_video" && "📸 Instagram Video"}
                          {item.category === "youtube_video" && "▶️ YouTube Video"}
                          {item.category === "event_video" && "🎥 Event Video"}
                          {item.category === "images" && "🖼️ Images"}
                        </p>
                        {item.event_management_company && (
                          <p className="text-xs text-gray-500 mt-1">{item.event_management_company}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {renderMedia(item)}

                    {item.category === "images" && item.media && (
                      <p className="text-xs text-gray-500 mt-2">
                        {item.media.length} image{item.media.length !== 1 ? 's' : ''}
                      </p>
                    )}
                    
                    {item.category === "event_video" && item.media && (
                      <p className="text-xs text-gray-500 mt-2">
                        {item.media.length} video{item.media.length !== 1 ? 's' : ''}
                      </p>
                    )}

                    {item.category === "instagram_video" && item.instagram_urls && (
                      <p className="text-xs text-gray-500 mt-2">
                        {item.instagram_urls.length} Instagram video{item.instagram_urls.length !== 1 ? 's' : ''}
                      </p>
                    )}

                    {item.category === "youtube_video" && item.youtube_urls && (
                      <p className="text-xs text-gray-500 mt-2">
                        {item.youtube_urls.length} YouTube video{item.youtube_urls.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ================= PARTNER MODAL ================= */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">

            <button
              onClick={() => setShowPartnerModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>

            <h3 className="text-xl font-bold mb-4">Add New Partner</h3>

            {partnerError && (
              <p className="text-red-500 mb-2">{partnerError}</p>
            )}

            <form onSubmit={handleCreatePartner} className="space-y-3">

              <input
                name="company_name"
                value={newPartner.company_name}
                onChange={handlePartnerChange}
                placeholder="Company Name *"
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="email"
                value={newPartner.email}
                onChange={handlePartnerChange}
                placeholder="Email"
                type="email"
                className="w-full border p-2 rounded"
              />

              <input
                name="phone"
                value={newPartner.phone}
                onChange={handlePartnerChange}
                placeholder="Phone"
                className="w-full border p-2 rounded"
              />

              <button
                type="submit"
                disabled={partnerLoading}
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
              >
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