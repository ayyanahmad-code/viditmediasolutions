// src/pages/ContactRequests.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaUser, 
  FaEye, 
  FaTrash, 
  FaClock, 
  FaReply,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaSync,
  FaPhone,
  FaComment,
  FaInfoCircle
} from 'react-icons/fa';

const ContactRequests = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const itemsPerPage = 10;

  // Base API URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch contacts
  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated]);

  // Filter contacts based on search and status
  useEffect(() => {
    let filtered = [...contacts];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(contact => 
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.contact_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredContacts(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, contacts]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/contact/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const contactsData = data.data || [];
        
        // Debug log to see phone numbers
        console.log('Contacts loaded:', contactsData.length);
        contactsData.forEach(contact => {
          console.log(`Contact ${contact.id}: Phone = "${contact.contact_number || 'N/A'}"`);
        });
        
        setContacts(contactsData);
        setFilteredContacts(contactsData);
      } else {
        throw new Error(data.message || 'Failed to fetch contacts');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this contact request?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setContacts(contacts.filter(c => c.id !== id));
        if (selectedContact?.id === id) setShowModal(false);
      } else {
        alert('Failed to delete: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete contact');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/contact/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setContacts(contacts.map(c => c.id === id ? { ...c, status } : c));
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      unread: 'bg-red-100 text-red-700',
      read: 'bg-blue-100 text-blue-700',
      replied: 'bg-green-100 text-green-700'
    };
    const icons = {
      unread: <FaClock size={10} />,
      read: <FaEye size={10} />,
      replied: <FaReply size={10} />
    };
    
    const statusText = status || 'unread';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${colors[statusText] || 'bg-gray-100'}`}>
        {icons[statusText]} {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
      </span>
    );
  };

  const truncateMessage = (message, maxLength = 60) => {
    if (!message) return 'No message';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredContacts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  // Loading states
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
          <div className="flex gap-3 justify-center">
            <button onClick={fetchContacts} className="px-6 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2">
              <FaSync /> Try Again
            </button>
            <button onClick={() => window.location.href = '/'} className="px-6 py-2 bg-gray-600 text-white rounded-lg">
              Go Home
            </button>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-800">Contact Requests</h1>
            <p className="text-gray-600 mt-1">Total: {contacts.length} requests</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchContacts} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors">
              <FaSync /> Refresh
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, subject, message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No contact requests found</p>
              <p className="text-gray-400 text-sm mt-2">Submit a contact form to see requests here</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 text-sm text-gray-900">#{contact.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-gray-400" />
                            <span className="font-medium text-gray-900">{contact.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{contact.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-gray-400" />
                            <span className="font-mono">
                              {contact.contact_number && contact.contact_number !== '' 
                                ? contact.contact_number 
                                : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaComment className="text-gray-400" />
                            <span>{contact.subject || 'General'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <div 
                              className="text-sm text-gray-600 cursor-help"
                              onMouseEnter={() => setHoveredMessage(contact.id)}
                              onMouseLeave={() => setHoveredMessage(null)}
                            >
                              <div className="flex items-center gap-2">
                                <FaInfoCircle className="text-gray-400 text-xs" />
                                <span className="line-clamp-2 max-w-xs">
                                  {truncateMessage(contact.message, 60)}
                                </span>
                              </div>
                            </div>
                            {/* Tooltip for full message on hover */}
                            {hoveredMessage === contact.id && contact.message && contact.message.length > 60 && (
                              <div className="absolute z-50 left-0 bottom-full mb-2 w-96 bg-gray-900 text-white text-sm rounded-lg shadow-xl p-3 pointer-events-none">
                                <div className="font-semibold mb-1">Full Message:</div>
                                <div className="text-gray-200 whitespace-pre-wrap">{contact.message}</div>
                                <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(contact.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedContact(contact);
                                setShowModal(true);
                                if (contact.status === 'unread') updateStatus(contact.id, 'read');
                              }}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="View Details"
                            >
                              <FaEye size={18} />
                            </button>
                            <button
                              onClick={() => deleteContact(contact.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete"
                            >
                              <FaTrash size={18} />
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
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedContact && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Contact Details</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-gray-500 text-sm block">Name</label>
                    <p className="font-medium text-gray-900">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm block">Email</label>
                    <p className="text-gray-900">{selectedContact.email}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm block">Phone</label>
                    <p className="text-gray-900 font-mono">{selectedContact.contact_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm block">Status</label>
                    <div>{getStatusBadge(selectedContact.status)}</div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-500 text-sm block">Subject</label>
                    <p className="text-gray-900">{selectedContact.subject || 'No subject'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-500 text-sm block">Message</label>
                    <div className="bg-gray-50 p-4 rounded-lg mt-1">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-500 text-sm block">Received</label>
                    <p className="text-gray-600">{formatDate(selectedContact.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  {selectedContact.status !== 'replied' && (
                    <button
                      onClick={() => {
                        window.location.href = `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Contact Request'}`;
                        updateStatus(selectedContact.id, 'replied');
                      }}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FaReply className="inline mr-2" /> Reply via Email
                    </button>
                  )}
                  <button
                    onClick={() => deleteContact(selectedContact.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaTrash className="inline mr-2" /> Delete Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactRequests;