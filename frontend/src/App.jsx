import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import BubbleRain from './components/BubbleRain';
import Navbar from './components/Navbar';
import AuthHeader from './components/AuthHeader';
import Footer from './components/Footer';
import AuthFooter from './components/AuthFooter';
import ScrollToTop from './components/ScrollToTop'; // Import ScrollToTop

import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Career from './pages/Career';
import CareerApplicationPage from "../src/pages/Career/CareerApplicationPage";
import Testimonials from './pages/Testimonials';
import Features from './pages/Features';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanyDashboard from './components/CompanyDashboard';
import ContactRequests from "../src/pages/ContactRequests";
import Profile from './pages/Profile';
import CareerApplications from './pages/CareerApplications';
import CreateCareer from './pages/CreateCareer';
import CareerHiringList from './pages/CareerHiringList';
import AdminVideos from './pages/AdminVideos';
import AdminOurClients from './pages/AdminOurClients';
import Gallery from './pages/Gallery';
import AdminGalleryForm from './pages/AdminGalleryForm';
import CompanyGallery from './pages/CompanyGallery';

// Layout Component for Public Routes (with regular footer)
const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <BubbleRain intensity="normal" color="purple" maxBubbles={80} />
        {children}
      </div>
      <Footer />
    </>
  );
};

// Layout Component for Protected Routes (with auth footer)
const ProtectedLayout = ({ children }) => {
  return (
    <>
      <AuthHeader />
      <div className="min-h-screen pt-24">
        {children}
      </div>
      <AuthFooter />
    </>
  );
};

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <ProtectedLayout>{children}</ProtectedLayout>;
};

// ✅ App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* ScrollToTop will scroll to top on every route change */}
        <ScrollToTop />
        
        <Routes>
          {/* ✅ Public Routes with PublicLayout (Regular Footer) */}
          <Route path="/" element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          } />
          <Route path="/services" element={
            <PublicLayout>
              <Services />
            </PublicLayout>
          } />
          <Route path="/about" element={
            <PublicLayout>
              <About />
            </PublicLayout>
          } />
          <Route path="/contact" element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          } />
          <Route path="/login" element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          } />
          <Route path="/register" element={
            <PublicLayout>
              <Register />
            </PublicLayout>
          } />
          <Route path="/career" element={
            <PublicLayout>
              <Career />
            </PublicLayout>
          } />
          <Route path="/career/apply" element={
            <PublicLayout>
              <CareerApplicationPage />
            </PublicLayout>
          } />
          <Route path="/gallery" element={
            <PublicLayout>
              <Gallery />
            </PublicLayout>
          } />
          <Route path="/company-gallery" element={
            <PublicLayout>
              <CompanyGallery />
            </PublicLayout>
          } />

          {/* ✅ Protected Routes with ProtectedLayout (Auth Footer) */}
          <Route 
            path="/testimonials" 
            element={
              <ProtectedRoute>
                <Testimonials />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/features" 
            element={
              <ProtectedRoute>
                <Features />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/contact-requests" 
            element={
              <ProtectedRoute>
                <ContactRequests />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
          path="/career-applications" 
          element={
            <ProtectedRoute>
              <CareerApplications />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/create-career" 
          element={
            <ProtectedRoute>
              <CreateCareer />
            </ProtectedRoute>
          } 
        />
            <Route path="/career/hiring-list" element={
            <ProtectedRoute>
              <CareerHiringList />
            </ProtectedRoute>
          } />
          <Route path="/admin/our-clients" element={
            <ProtectedRoute>
              <AdminOurClients />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin/gallery/create" element={
            <ProtectedRoute>
              <AdminGalleryForm />
            </ProtectedRoute>
          } 
        />

          {/* ✅ 404 Page */}
          <Route path="*" element={
            <PublicLayout>
              <div className="text-center text-white mt-20">404 Page Not Found</div>
            </PublicLayout>
          } />
          <Route path="/admin/videos" element={
            <ProtectedRoute>
              <AdminVideos />
            </ProtectedRoute>
          } 
        />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;