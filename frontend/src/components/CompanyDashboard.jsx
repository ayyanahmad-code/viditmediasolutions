// src/pages/CompanyDashboard.jsx - Updated with Total Schedule Count

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaBriefcase,
  FaEnvelope,
  FaEye,
  FaUserPlus,
  FaChartLine,
  FaCalendarAlt,
  FaDownload,
  FaFilter,
  FaSearch,
  FaStar,
  FaUserCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaBell,
  FaCog,
  FaChartPie,
  FaChartBar,
  FaChartArea,
  FaVideo,
  FaSlidersH,
  FaPlayCircle,
  FaBuilding,
  FaComment,
  FaYoutube,
  FaImage,
  FaInstagram,
  FaEdit,
  FaHeart,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaPlay,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaCalendar,
  FaGlobe,
  FaSignal,
  FaUserCheck,
  FaHourglassHalf,
  FaHistory,
  FaCalendarCheck
} from 'react-icons/fa';

const CompanyDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Real data states
  const [dashboardData, setDashboardData] = useState({
    totalVacancy: 0,
    activeVacancies: 0,
    closedVacancies: 0,
    currentMonthVacancies: 0,
    currentMonthContacts: 0,
    totalContacts: 0,  
    activeClients: 0,
    inactiveClients: 0,
    mainSliderVideos: 0,
    mainSliderActive: 0,
    mainSliderInactive: 0,
    secondarySliderVideos: 0,
    secondarySliderActive: 0,
    secondarySliderInactive: 0,
    recentApplications: [],
    recentContacts: [],
    recentVacancies: [],
    partnersWithGallery: [],
    // Visitor statistics
    totalVisits: 0,
    onlineUsers: 0,
    todayVisits: 0,
    // Career Applications Statistics
    careerStats: {
      totalApplications: 0,
      pendingApplications: 0,
      reviewedApplications: 0,
      interviewScheduled: 0,
      rejectedApplications: 0,
      hiredApplications: 0,
      totalOriginalInterviews: 0,
      totalReschedules: 0,
      totalScheduleCount: 0,
    }
  });
  
  // Gallery modal states
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyGallery, setShowCompanyGallery] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageSet, setCurrentImageSet] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [selectedLightboxItem, setSelectedLightboxItem] = useState(null);
  const [activeYouTubeVideo, setActiveYouTubeVideo] = useState(null);
  const [activeInstagramVideo, setActiveInstagramVideo] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Helper function to extract YouTube ID
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

  // Helper function to get full image URL
  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
    return `http://localhost:5000/${url}`;
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
    const fullUrls = imageUrls.map(url => getFullImageUrl(url));
    setCurrentImageSet(fullUrls);
    setCurrentMediaIndex(startIndex);
    setSelectedLightboxItem({ title, media_urls: fullUrls });
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedLightboxItem(null);
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

  // Handle company selection for gallery view
  const handleViewGallery = (partner) => {
    setSelectedCompany(partner);
    setShowCompanyGallery(true);
    setActiveFilter('all');
  };

  const closeGalleryModal = () => {
    setShowCompanyGallery(false);
    setSelectedCompany(null);
    setActiveFilter('all');
  };

  // Fetch visitor statistics
  const fetchVisitorStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch total visits (all time)
      const totalVisitsRes = await fetch(`${API_BASE_URL}/visitors/total-visits`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const totalVisitsData = await totalVisitsRes.json();
      
      // Fetch online users
      const onlineUsersRes = await fetch(`${API_BASE_URL}/visitors/online`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const onlineUsersData = await onlineUsersRes.json();
      
      // Fetch today's visits
      const todayVisitsRes = await fetch(`${API_BASE_URL}/visitors/today`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const todayVisitsData = await todayVisitsRes.json();
      
      return {
        totalVisits: totalVisitsData.total || 0,
        onlineUsers: onlineUsersData.total || 0,
        todayVisits: todayVisitsData.total || 0
      };
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      return {
        totalVisits: 0,
        onlineUsers: 0,
        todayVisits: 0
      };
    }
  };

  // Fetch career applications statistics
  const fetchCareerStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/career/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const applications = data.data || [];
        
        // Calculate statistics
        const totalApplications = applications.length;
        const pendingApplications = applications.filter(a => a.status === 'pending').length;
        const reviewedApplications = applications.filter(a => a.status === 'reviewed').length;
        const interviewScheduled = applications.filter(a => a.status === 'interview_scheduled').length;
        const rejectedApplications = applications.filter(a => a.status === 'rejected').length;
        const hiredApplications = applications.filter(a => a.status === 'hired').length;
        
        // Calculate interview statistics based on original_interview_date
        const totalOriginalInterviews = applications.filter(a => a.original_interview_date !== null && a.original_interview_date !== undefined).length;
        const totalReschedules = applications.reduce((sum, app) => sum + (app.reschedule_count || 0), 0);
        const totalScheduleCount = totalOriginalInterviews + totalReschedules;
        
        return {
          totalApplications,
          pendingApplications,
          reviewedApplications,
          interviewScheduled,
          rejectedApplications,
          hiredApplications,
          totalOriginalInterviews,
          totalReschedules,
          totalScheduleCount,
        };
      }
      return {
        totalApplications: 0,
        pendingApplications: 0,
        reviewedApplications: 0,
        interviewScheduled: 0,
        rejectedApplications: 0,
        hiredApplications: 0,
        totalOriginalInterviews: 0,
        totalReschedules: 0,
        totalScheduleCount: 0,
      };
    } catch (error) {
      console.error('Error fetching career stats:', error);
      return {
        totalApplications: 0,
        pendingApplications: 0,
        reviewedApplications: 0,
        interviewScheduled: 0,
        rejectedApplications: 0,
        hiredApplications: 0,
        totalOriginalInterviews: 0,
        totalReschedules: 0,
        totalScheduleCount: 0,
      };
    }
  };

  // Fetch all real data
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchAllDashboardData();
      
      // Refresh visitor stats every 30 seconds
      const visitorInterval = setInterval(async () => {
        const visitorStats = await fetchVisitorStats();
        setDashboardData(prev => ({
          ...prev,
          ...visitorStats
        }));
      }, 30000);
      
      return () => clearInterval(visitorInterval);
    }
  }, [isAuthenticated, user]);

  const fetchAllDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch career applications
      const careerResponse = await fetch(`${API_BASE_URL}/career/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const careerData = await careerResponse.json();
      const applications = careerData.success ? careerData.data || [] : [];
      
      // Fetch job vacancies from Career Hiring API
      let vacancies = [];
      try {
        const vacanciesResponse = await fetch(`${API_BASE_URL}/career-hiring/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const vacanciesData = await vacanciesResponse.json();
        vacancies = vacanciesData.success ? vacanciesData.data || [] : [];
      } catch (err) {
        console.log('Error fetching career hiring data:', err);
        vacancies = [];
      }
      
      // Calculate applicant count for each vacancy
      const vacanciesWithApplicants = vacancies.map(vacancy => {
        const applicantsForVacancy = applications.filter(app => 
          app.position?.toLowerCase() === vacancy.position?.toLowerCase() ||
          app.position?.toLowerCase().includes(vacancy.position?.toLowerCase())
        );
        return {
          id: vacancy.id,
          title: vacancy.position,
          status: vacancy.status || 'active',
          applicants_count: applicantsForVacancy.length,
          date: vacancy.created_at
        };
      });
      
      // Fetch contact requests
      const contactResponse = await fetch(`${API_BASE_URL}/contact/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const contactData = await contactResponse.json();
      const contacts = contactData.success ? contactData.data || [] : [];
      
      // Fetch clients
      const clientsResponse = await fetch(`${API_BASE_URL}/our-clients/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const clientsData = await clientsResponse.json();
      const clients = clientsData.success ? clientsData.data || [] : [];
      
      // Fetch videos
      const videosResponse = await fetch(`${API_BASE_URL}/videos/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const videosData = await videosResponse.json();
      const videos = videosData.success ? videosData.data || [] : [];
      
      // Fetch partners with gallery using the new endpoint
      let partnersWithGallery = [];
      try {
        const galleryResponse = await fetch(`${API_BASE_URL}/gallery/partners-with-gallery`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const galleryData = await galleryResponse.json();
        partnersWithGallery = galleryData.success ? galleryData.data || [] : [];
        console.log(`✅ Loaded ${partnersWithGallery.length} partners with gallery items`);
      } catch (err) {
        console.log('Error fetching partners with gallery:', err);
        partnersWithGallery = [];
      }
      
      // Fetch visitor statistics
      const visitorStats = await fetchVisitorStats();
      
      // Fetch career statistics
      const careerStats = await fetchCareerStats();
      
      // Calculate vacancy stats
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const activeVacancies = vacanciesWithApplicants.filter(v => v.status === 'active').length;
      const closedVacancies = vacanciesWithApplicants.filter(v => v.status === 'inactive').length;
      
      const currentMonthVacancies = vacanciesWithApplicants.filter(vacancy => {
        const vacancyDate = new Date(vacancy.date);
        return vacancyDate.getMonth() === currentMonth &&
               vacancyDate.getFullYear() === currentYear;
      }).length;
      
      const currentMonthContacts = contacts.filter(contact => {
        const contactDate = new Date(contact.createdAt);
        return contactDate.getMonth() === currentMonth &&
               contactDate.getFullYear() === currentYear;
      }).length;
      
      const activeClients = clients.filter(c => c.status === 'active').length;
      const inactiveClients = clients.filter(c => c.status === 'inactive').length;
      
      const mainSliderVideos = videos.filter(v => v.slider_type === 'slider1');
      const secondarySliderVideos = videos.filter(v => v.slider_type === 'slider2');
      
      const mainSliderActive = mainSliderVideos.filter(v => v.status === 'active').length;
      const mainSliderInactive = mainSliderVideos.filter(v => v.status === 'inactive').length;
      const secondarySliderActive = secondarySliderVideos.filter(v => v.status === 'active').length;
      const secondarySliderInactive = secondarySliderVideos.filter(v => v.status === 'inactive').length;
      
      const recentApps = applications.slice(0, 6).map(app => ({
        id: app.id,
        name: app.name,
        position: app.position,
        experience: app.experience,
        status: app.status,
        date: app.createdAt,
        email: app.email
      }));
      
      const recentContactsList = contacts.slice(0, 4).map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject || 'General',
        message: contact.message,
        date: contact.createdAt
      }));
      
      const recentVacanciesList = vacanciesWithApplicants.slice(0, 4);
      
      setDashboardData({
        totalVacancy: vacanciesWithApplicants.length,
        activeVacancies: activeVacancies,
        closedVacancies: closedVacancies,
        currentMonthVacancies: currentMonthVacancies,
        currentMonthContacts: currentMonthContacts,
        totalContacts: contacts.length,
        activeClients: activeClients,
        inactiveClients: inactiveClients,
        mainSliderVideos: mainSliderVideos.length,
        mainSliderActive: mainSliderActive,
        mainSliderInactive: mainSliderInactive,
        secondarySliderVideos: secondarySliderVideos.length,
        secondarySliderActive: secondarySliderActive,
        secondarySliderInactive: secondarySliderInactive,
        recentApplications: recentApps,
        recentContacts: recentContactsList,
        recentVacancies: recentVacanciesList,
        partnersWithGallery: partnersWithGallery,
        // Visitor statistics
        totalVisits: visitorStats.totalVisits,
        onlineUsers: visitorStats.onlineUsers,
        todayVisits: visitorStats.todayVisits,
        // Career statistics
        careerStats: careerStats
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'reviewed': return 'text-blue-600 bg-blue-100';
      case 'hired': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-red-600 bg-red-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
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

  // Render Image Card for Gallery Modal
  const renderImageCard = (item) => {
    const mediaUrls = getAllMediaUrls(item);
    const fullImageUrls = mediaUrls.map(url => getFullImageUrl(url));
    const imageCount = mediaUrls.length;
    
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
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <FaEye className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {imageCount > 1 && (
              <div className="absolute top-0 right-0 bg-black bg-opacity-70 text-white text-[8px] px-1 py-0.5 rounded-bl">
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
        className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => instaId && setActiveInstagramVideo(instaId)}
      >
        <div className="w-full h-full flex items-center justify-center">
          <FaInstagram className="text-white text-2xl" />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <FaPlay className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute top-0 right-0 bg-pink-600 text-white text-[8px] px-1 py-0.5 rounded-bl flex items-center gap-0.5">
          <FaInstagram size={8} /> IG
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
        className="relative w-20 h-20 bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => setActiveYouTubeVideo(youtubeId)}
      >
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <FaPlay className="text-white text-lg" />
        </div>
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] px-1 py-0.5 rounded-bl flex items-center gap-0.5">
          <FaYoutube size={8} /> YT
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
        className="relative w-20 h-20 bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => openLightbox(mediaUrls, 0, item.title)}
      >
        {thumbnailUrl ? (
          <>
            <video src={thumbnailUrl} className="w-full h-full object-cover" preload="metadata" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FaPlay className="text-white text-lg" />
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-blue-600 flex items-center justify-center">
            <FaVideo className="text-white text-2xl" />
          </div>
        )}
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] px-1 py-0.5 rounded-bl flex items-center gap-0.5">
          <FaVideo size={8} /> Video
        </div>
        {mediaUrls.length > 1 && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-70 text-white text-[8px] px-1 py-0.5 rounded-br">
            +{mediaUrls.length}
          </div>
        )}
      </div>
    );
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchAllDashboardData} 
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get filtered gallery items for modal
  const getFilteredItems = () => {
    if (!selectedCompany) return [];
    if (activeFilter === 'all') return selectedCompany.gallery?.all || [];
    return (selectedCompany.gallery?.all || []).filter(item => item.category === activeFilter);
  };

  const filteredModalItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards - Now 8 cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-6 mb-8"
        >
          {/* Card 1 - Total Vacancy */}
          <div className="group relative bg-white rounded-xl p-6 
            w-full sm:w-[45%] md:w-[30%] lg:w-[22%] max-w-sm
            shadow-md hover:shadow-2xl
            transition-all duration-300 ease-in-out
            hover:-translate-y-2 overflow-hidden">

            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 blur-xl opacity-30"></div>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-500 text-sm">Total Vacancy</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.totalVacancy}</p>
                <div className="text-sm mt-2 space-y-1">
                  <p className="text-green-600 flex items-center text-xs">
                    <FaCheckCircle className="mr-1" size={10} /> Active: {dashboardData.activeVacancies}
                  </p>
                  <p className="text-red-600 flex items-center text-xs">
                    <FaTimesCircle className="mr-1" size={10} /> Closed: {dashboardData.closedVacancies}
                  </p>
                </div>
              </div>

              <div className="bg-purple-100 rounded-full p-4 transition duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <FaBuilding className="text-3xl text-purple-600" />
              </div>
            </div>
          </div>

          {/* Card 2 - Contact */}
          <div className="group relative bg-white rounded-xl p-6 
            w-full sm:w-[45%] md:w-[30%] lg:w-[22%] max-w-sm
            shadow-md hover:shadow-2xl
            transition-all duration-300 ease-in-out
            hover:-translate-y-2 overflow-hidden">

            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 blur-xl opacity-30"></div>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-500 text-sm">Contact</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.totalContacts}</p>
                <p className="text-yellow-600 text-sm mt-2 flex items-center">
                  <FaClock className="mr-1" /> {dashboardData.currentMonthContacts} this month
                </p>
              </div>

              <div className="bg-blue-100 rounded-full p-4 transition duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <FaBriefcase className="text-3xl text-blue-600" />
              </div>
            </div>
          </div>

          {/* Card 3 - Clients */}
          <div className="group relative bg-white rounded-xl p-6 
            w-full sm:w-[45%] md:w-[30%] lg:w-[22%] max-w-sm
            shadow-md hover:shadow-2xl
            transition-all duration-300 ease-in-out
            hover:-translate-y-2 overflow-hidden">

            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 blur-xl opacity-30"></div>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-500 text-sm">Our Client</p>
                <p className="text-3xl font-bold text-gray-800">
                  {dashboardData.activeClients + dashboardData.inactiveClients}
                </p>
                <div className="text-sm mt-2 space-y-1">
                  <p className="text-green-600 flex items-center">
                    <FaCheckCircle className="mr-1" /> Active: {dashboardData.activeClients}
                  </p>
                  <p className="text-red-600 flex items-center">
                    <FaTimesCircle className="mr-1" /> Inactive: {dashboardData.inactiveClients}
                  </p>
                </div>
              </div>

              <div className="bg-green-100 rounded-full p-4 transition duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <FaEnvelope className="text-3xl text-green-600" />
              </div>
            </div>
          </div>

          {/* Card 4 - Main Slider */}
          <div className="group relative bg-white rounded-xl p-6 
            w-full sm:w-[45%] md:w-[30%] lg:w-[22%] max-w-sm
            shadow-md hover:shadow-2xl
            transition-all duration-300 ease-in-out
            hover:-translate-y-2 overflow-hidden">

            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 blur-xl opacity-30"></div>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-500 text-sm">Main Slider</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.mainSliderVideos}</p>
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <FaCheckCircle className="mr-1" /> Active: {dashboardData.mainSliderActive}
                </p>
              </div>

              <div className="bg-pink-100 rounded-full p-4 transition duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <FaVideo className="text-3xl text-pink-600" />
              </div>
            </div>
          </div>

          {/* Card 5 - Secondary Slider */}
          <div className="group relative bg-white rounded-xl p-6 
            w-full sm:w-[45%] md:w-[30%] lg:w-[22%] max-w-sm
            shadow-md hover:shadow-2xl
            transition-all duration-300 ease-in-out
            hover:-translate-y-2 overflow-hidden">

            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 blur-xl opacity-30"></div>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-500 text-sm">Secondary Slider</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.secondarySliderVideos}</p>
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <FaCheckCircle className="mr-1" /> Active: {dashboardData.secondarySliderActive}
                </p>
              </div>

              <div className="bg-orange-100 rounded-full p-4 transition duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <FaSlidersH className="text-3xl text-orange-600" />
              </div>
            </div>
          </div>

          {/* Card 6 - Visitors */}
          <div className="group relative bg-white rounded-xl p-6 
            w-full sm:w-[45%] md:w-[30%] lg:w-[22%] max-w-sm
            shadow-md hover:shadow-2xl
            transition-all duration-300 ease-in-out
            hover:-translate-y-2 overflow-hidden">

            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 blur-xl opacity-30"></div>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-500 text-sm">Visitor Statistics</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.totalVisits}</p>
                <div className="text-sm mt-2 space-y-1">
                  <p className="text-blue-600 flex items-center text-xs">
                    <FaUserCheck className="mr-1" size={10} /> Online: {dashboardData.onlineUsers}
                  </p>
                  <p className="text-green-600 flex items-center text-xs">
                    <FaCalendarAlt className="mr-1" size={10} /> Today: {dashboardData.todayVisits}
                  </p>
                </div>
              </div>

              <div className="bg-indigo-100 rounded-full p-4 transition duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <FaGlobe className="text-3xl text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Card 7 - Career Applications Overview */}
          <div className="group relative bg-white rounded-xl p-6 
            w-full sm:w-[45%] md:w-[30%] lg:w-[22%] max-w-sm
            shadow-md hover:shadow-2xl
            transition-all duration-300 ease-in-out
            hover:-translate-y-2 overflow-hidden">

            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 blur-xl opacity-30"></div>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-500 text-sm">Career Applications</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.careerStats.totalApplications}</p>
                <div className="text-sm mt-2 space-y-1">
                  <p className="text-yellow-600 flex items-center text-xs">
                    <FaHourglassHalf className="mr-1" size={10} /> Pending: {dashboardData.careerStats.pendingApplications}
                  </p>
                  <p className="text-blue-600 flex items-center text-xs">
                    <FaEye className="mr-1" size={10} /> Reviewed: {dashboardData.careerStats.reviewedApplications}
                  </p>
                  <p className="text-purple-600 flex items-center text-xs">
                    <FaClock className="mr-1" size={10} /> Interview: {dashboardData.careerStats.interviewScheduled}
                  </p>
                </div>
              </div>

              <div className="bg-teal-100 rounded-full p-4 transition duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <FaBriefcase className="text-3xl text-teal-600" />
              </div>
            </div>
          </div>

          {/* Card 8 - Career Results with Total Schedule Count and Total Reschedules */}
          <div className="group relative bg-white rounded-xl p-6 
            w-full sm:w-[45%] md:w-[30%] lg:w-[22%] max-w-sm
            shadow-md hover:shadow-2xl
            transition-all duration-300 ease-in-out
            hover:-translate-y-2 overflow-hidden">

            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 blur-xl opacity-30"></div>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-500 text-sm">Career Results</p>
                <div className="text-sm mt-1 space-y-1">
                  <p className="text-green-600 flex items-center text-xs">
                    <FaCheckCircle className="mr-1" size={10} /> Hired: {dashboardData.careerStats.hiredApplications}
                  </p>
                  <p className="text-red-600 flex items-center text-xs">
                    <FaTimesCircle className="mr-1" size={10} /> Rejected: {dashboardData.careerStats.rejectedApplications}
                  </p>
                  <p className="text-blue-600 flex items-center text-xs font-semibold">
                    <FaCalendarCheck className="mr-1" size={10} /> Total Schedule Count: {dashboardData.careerStats.totalScheduleCount}
                  </p>
                  <p className="text-orange-600 flex items-center text-xs">
                    <FaHistory className="mr-1" size={10} /> Total Reschedules: {dashboardData.careerStats.totalReschedules}
                  </p>
                </div>
              </div>

              <div className="bg-green-100 rounded-full p-4 transition duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <FaChartLine className="text-3xl text-green-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rest of the dashboard remains the same */}
        {/* Recent Vacancies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Job Vacancies</h2>
            <button 
              onClick={() => window.location.href = '/career-hiring-list'}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            {dashboardData.recentVacancies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaBuilding className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>No vacancies found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Job Title</th>
                    <th className="text-left py-3 px-4">Applicants</th>
                    <th className="text-left py-3 px-4">Posted Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentVacancies.map((vacancy) => (
                    <tr key={vacancy.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FaBriefcase className="text-gray-400" />
                          <span className="font-medium">{vacancy.title}</span>
                        </div>
                       </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FaUsers className="text-blue-400" />
                          <span className="text-blue-600 font-semibold">{vacancy.applicants_count}</span>
                        </div>
                       </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{formatDate(vacancy.date)}</td>
                      <td className="py-3 px-4">
                        {vacancy.status === 'active' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                            <FaCheckCircle size={10} /> Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                            <FaTimesCircle size={10} /> Inactive
                          </span>
                        )}
                       </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Recent Applications Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Applications</h2>
            <button 
              onClick={() => window.location.href = '/career-applications'}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            {dashboardData.recentApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaBriefcase className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>No applications found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Position</th>
                    <th className="text-left py-3 px-4">Experience</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                   </tr>
                </thead>
                <tbody>
                  {dashboardData.recentApplications.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <p className="text-sm text-gray-500">{app.email}</p>
                        </div>
                        </td>
                      <td className="py-3 px-4">{app.position}</td>
                      <td className="py-3 px-4">{app.experience || 'N/A'}</td>
                      <td className="py-3 px-4">{formatDate(app.date)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pending'}
                        </span>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Recent Contact Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Contact Messages</h2>
            <button 
              onClick={() => window.location.href = '/contact-requests'}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              View All
            </button>
          </div>
          
          {dashboardData.recentContacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaEnvelope className="text-4xl mx-auto mb-2 text-gray-300" />
              <p>No contact messages found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {dashboardData.recentContacts.map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                    <FaUserCircle className="text-purple-500 text-lg" />
                    <span className="font-semibold truncate">{contact.name}</span>
                  </div>
                  <div className="mb-2">
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800 text-sm truncate block">
                      {contact.email}
                    </a>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-600 text-sm">{contact.subject}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 mt-2">
                    <p className="text-gray-700 text-sm line-clamp-2">{contact.message}</p>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">{formatDate(contact.date)}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Company Gallery Section - Small Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Company Gallery</h2>
            <button 
              onClick={() => window.location.href = '/admin/gallery/create'}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Manage Gallery
            </button>
          </div>

          {dashboardData.partnersWithGallery.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaImage className="text-4xl mx-auto mb-2 text-gray-300" />
              <p>No gallery items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {dashboardData.partnersWithGallery.map((partner) => {
                const totalItems = partner.gallery?.counts?.total || 0;
                const activeItems = partner.gallery?.all?.filter(item => item.status === 'active').length || 0;
                const inactiveItems = partner.gallery?.all?.filter(item => item.status === 'inactive').length || 0;
                
                if (totalItems === 0) return null;
                
                return (
                  <div 
                    key={partner.id} 
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100"
                    onClick={() => handleViewGallery(partner)}
                  >
                    {/* Company Header with gradient */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <FaBuilding className="text-white text-sm" />
                        </div>
                        <h3 className="font-semibold text-white text-sm truncate flex-1">
                          {partner.company_name}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-3">
                      {/* Total Count */}
                      <div className="text-center mb-2">
                        <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
                        <p className="text-gray-500 text-xs">Total Items</p>
                      </div>
                      
                      {/* Active/Inactive Status */}
                      <div className="flex justify-center gap-3 mb-3 pb-2 border-b border-gray-100">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-green-600">
                            <FaCheckCircle size={10} />
                            <span className="text-xs font-medium">{activeItems}</span>
                          </div>
                          <p className="text-[10px] text-gray-500">Active</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-red-600">
                            <FaTimesCircle size={10} />
                            <span className="text-xs font-medium">{inactiveItems}</span>
                          </div>
                          <p className="text-[10px] text-gray-500">Inactive</p>
                        </div>
                      </div>
                      
                      {/* Media Type Breakdown - Small Icons */}
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {(partner.gallery?.counts?.images || 0) > 0 && (
                          <div className="flex items-center gap-1">
                            <FaImage className="text-green-500 text-[10px]" />
                            <span className="text-gray-600 text-[10px]">📷 {partner.gallery.counts.images}</span>
                          </div>
                        )}
                        {(partner.gallery?.counts?.instagram_video || 0) > 0 && (
                          <div className="flex items-center gap-1">
                            <FaInstagram className="text-purple-500 text-[10px]" />
                            <span className="text-gray-600 text-[10px]">📱 {partner.gallery.counts.instagram_video}</span>
                          </div>
                        )}
                        {(partner.gallery?.counts?.youtube_video || 0) > 0 && (
                          <div className="flex items-center gap-1">
                            <FaYoutube className="text-red-500 text-[10px]" />
                            <span className="text-gray-600 text-[10px]">▶️ {partner.gallery.counts.youtube_video}</span>
                          </div>
                        )}
                        {(partner.gallery?.counts?.event_video || 0) > 0 && (
                          <div className="flex items-center gap-1">
                            <FaVideo className="text-blue-500 text-[10px]" />
                            <span className="text-gray-600 text-[10px]">🎥 {partner.gallery.counts.event_video}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* View Button */}
                      <div className="mt-3 pt-2 border-t border-gray-100 text-center">
                        <span className="text-purple-600 text-xs group-hover:text-purple-700 transition-colors inline-flex items-center gap-1">
                          View Gallery <FaArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Company Gallery Modal */}
      {showCompanyGallery && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaBuilding className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedCompany.company_name}</h2>
                  <p className="text-purple-100 text-sm">Total {selectedCompany.gallery?.counts?.total || 0} items</p>
                </div>
              </div>
              <button onClick={closeGalleryModal} className="text-white hover:text-gray-200">
                <FaTimes size={24} />
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="px-6 py-3 bg-gray-50 border-b flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeFilter === 'all' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({selectedCompany.gallery?.all?.length || 0})
              </button>
              <button
                onClick={() => setActiveFilter('images')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  activeFilter === 'images' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaImage size={10} /> Photos ({selectedCompany.gallery?.counts?.images || 0})
              </button>
              <button
                onClick={() => setActiveFilter('instagram_video')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  activeFilter === 'instagram_video' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaInstagram size={10} /> Reels ({selectedCompany.gallery?.counts?.instagram_video || 0})
              </button>
              <button
                onClick={() => setActiveFilter('youtube_video')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  activeFilter === 'youtube_video' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaYoutube size={10} /> YouTube ({selectedCompany.gallery?.counts?.youtube_video || 0})
              </button>
              <button
                onClick={() => setActiveFilter('event_video')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  activeFilter === 'event_video' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FaVideo size={10} /> Events ({selectedCompany.gallery?.counts?.event_video || 0})
              </button>
            </div>

            {/* Gallery Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredModalItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FaImage className="text-5xl mx-auto mb-3 text-gray-300" />
                  <p>No items found in this category</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Photos Section */}
                  {filteredModalItems.filter(i => i.category === 'images').length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-500">
                        <FaImage className="text-green-500" />
                        <h3 className="font-semibold text-gray-800">Photos</h3>
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                          {filteredModalItems.filter(i => i.category === 'images').length}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {filteredModalItems.filter(i => i.category === 'images').map((item) => (
                          <div key={item.id} className="border-b border-gray-100 pb-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-800 text-sm">{item.title}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {item.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><FaEye size={10} /> {item.views || 0}</span>
                                <span className="flex items-center gap-1"><FaHeart size={10} className="text-red-500" /> {item.likes || 0}</span>
                              </div>
                            </div>
                            {renderImageCard(item)}
                            <div className="text-xs text-gray-400 mt-2">
                              <FaCalendar className="inline mr-1" size={10} /> {new Date(item.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instagram Reels Section */}
                  {filteredModalItems.filter(i => i.category === 'instagram_video').length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-pink-500">
                        <FaInstagram className="text-pink-500" />
                        <h3 className="font-semibold text-gray-800">Instagram Reels</h3>
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                          {filteredModalItems.filter(i => i.category === 'instagram_video').length}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {filteredModalItems.filter(i => i.category === 'instagram_video').map((item) => (
                          <div key={item.id} className="border-b border-gray-100 pb-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-800 text-sm">{item.title}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {item.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><FaEye size={10} /> {item.views || 0}</span>
                                <span className="flex items-center gap-1"><FaHeart size={10} className="text-red-500" /> {item.likes || 0}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {renderInstagramCard(item)}
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              <FaCalendar className="inline mr-1" size={10} /> {new Date(item.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* YouTube Videos Section */}
                  {filteredModalItems.filter(i => i.category === 'youtube_video').length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-500">
                        <FaYoutube className="text-red-500" />
                        <h3 className="font-semibold text-gray-800">YouTube Videos</h3>
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                          {filteredModalItems.filter(i => i.category === 'youtube_video').length}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {filteredModalItems.filter(i => i.category === 'youtube_video').map((item) => (
                          <div key={item.id} className="border-b border-gray-100 pb-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-800 text-sm">{item.title}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {item.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><FaEye size={10} /> {item.views || 0}</span>
                                <span className="flex items-center gap-1"><FaHeart size={10} className="text-red-500" /> {item.likes || 0}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {renderYouTubeCard(item)}
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              <FaCalendar className="inline mr-1" size={10} /> {new Date(item.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Event Videos Section */}
                  {filteredModalItems.filter(i => i.category === 'event_video').length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-500">
                        <FaVideo className="text-blue-500" />
                        <h3 className="font-semibold text-gray-800">Event Videos</h3>
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                          {filteredModalItems.filter(i => i.category === 'event_video').length}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {filteredModalItems.filter(i => i.category === 'event_video').map((item) => (
                          <div key={item.id} className="border-b border-gray-100 pb-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-800 text-sm">{item.title}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {item.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><FaEye size={10} /> {item.views || 0}</span>
                                <span className="flex items-center gap-1"><FaHeart size={10} className="text-red-500" /> {item.likes || 0}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {renderEventVideoCard(item)}
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              <FaCalendar className="inline mr-1" size={10} /> {new Date(item.created_at).toLocaleDateString()}
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
        </div>
      )}

      {/* Lightbox Modal for Images */}
      {lightboxOpen && currentImageSet.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-[60] flex items-center justify-center">
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
                <img src={currentImageSet[currentMediaIndex]} alt={`Gallery - ${currentMediaIndex + 1}`} className="max-w-full max-h-[80vh] rounded-lg mx-auto" />
              )}
            </div>
            <div className="text-white text-center mt-4">
              <h3 className="text-lg font-semibold">{selectedLightboxItem?.title}</h3>
              <p className="text-gray-300 text-sm mt-1">{currentMediaIndex + 1} of {currentImageSet.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Video Modal */}
      {activeYouTubeVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]" onClick={() => setActiveYouTubeVideo(null)}>
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
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]" onClick={() => setActiveInstagramVideo(null)}>
          <div className="w-full max-w-3xl mx-4" onClick={(e) => e.stopPropagation()}>
            <button className="text-white text-2xl mb-4 float-right" onClick={() => setActiveInstagramVideo(null)}><FaTimes /></button>
            <div className="clear-both"></div>
            <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
              <iframe className="w-full h-full" src={`https://www.instagram.com/reel/${activeInstagramVideo}/embed`} title="Instagram Reel" frameBorder="0" allowFullScreen />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;