// // frontend/src/components/AdminOurClients.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Navigate } from 'react-router-dom';
// import { 
//   FaTrash, FaEdit, FaPlus, FaImage, FaTimes, FaSave, FaSpinner 
// } from 'react-icons/fa';

// const AdminOurClients = () => {
//   const { user, isAuthenticated, loading } = useAuth();
//   const [clients, setClients] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [editingClient, setEditingClient] = useState(null);
//   const [formData, setFormData] = useState({
//     client_name: '',
//     alt_text: '',
//     status: 'active',
//     logo: null
//   });

//   const API_BASE_URL = 'http://localhost:5000/api';

//   useEffect(() => {
//     if (isAuthenticated && user?.role === 'admin') {
//       fetchClients();
//     }
//   }, [isAuthenticated, user]);

//   const fetchClients = async () => {
//     try {
//       setIsLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${API_BASE_URL}/our-clients/admin/all`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       const data = await response.json();
//       if (data.success) {
//         setClients(data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching clients:', error);
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setFormData(prev => ({ ...prev, logo: file }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const formDataToSend = new FormData();
//       formDataToSend.append('client_name', formData.client_name);
//       formDataToSend.append('alt_text', formData.alt_text);
//       formDataToSend.append('status', formData.status);
//       if (formData.logo) {
//         formDataToSend.append('logo', formData.logo);
//       }

//       const url = editingClient 
//         ? `${API_BASE_URL}/our-clients/${editingClient.id}`
//         : `${API_BASE_URL}/our-clients/upload`;
      
//       const method = editingClient ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formDataToSend
//       });

//       const data = await response.json();
//       if (data.success) {
//         alert(editingClient ? 'Client updated!' : 'Client added!');
//         setShowModal(false);
//         setEditingClient(null);
//         setFormData({ client_name: '', alt_text: '', status: 'active', logo: null });
//         fetchClients();
//       } else {
//         alert(data.message || 'Failed to save client');
//       }
//     } catch (error) {
//       console.error('Error saving client:', error);
//       alert('Failed to save client');
//     }
//   };

//   const deleteClient = async (id) => {
//     if (!window.confirm('Delete this client?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${API_BASE_URL}/our-clients/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (data.success) {
//         alert('Client deleted!');
//         fetchClients();
//       } else {
//         alert(data.message || 'Failed to delete client');
//       }
//     } catch (error) {
//       console.error('Error deleting:', error);
//       alert('Failed to delete client');
//     }
//   };

//   const editClient = (client) => {
//     setEditingClient(client);
//     setFormData({
//       client_name: client.client_name,
//       alt_text: client.alt_text || '',
//       status: client.status || 'active',
//       logo: null
//     });
//     setShowModal(true);
//   };

//   const toggleStatus = async (id, currentStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
//       const response = await fetch(`${API_BASE_URL}/our-clients/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ status: newStatus })
//       });
//       const data = await response.json();
//       if (data.success) {
//         fetchClients();
//       } else {
//         alert(data.message || 'Failed to update status');
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//       alert('Failed to update status');
//     }
//   };

//   // Fallback image as data URL (no external dependency)
//   const getFallbackImage = () => {
//     return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Crect width='100' height='60' fill='%23f3f4f6'/%3E%3Ctext x='50' y='35' font-family='Arial' font-size='10' fill='%239ca3af' text-anchor='middle'%3ENo Logo%3C/text%3E%3C/svg%3E";
//   };

//   if (loading || isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <FaSpinner className="animate-spin rounded-full h-12 w-12 text-purple-600 mx-auto" />
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated || user?.role !== 'admin') {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 py-8">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Our Clients Management</h1>
//             <p className="text-gray-600 mt-1">Manage client logos displayed on the website</p>
//           </div>
//           <button
//             onClick={() => { setEditingClient(null); setShowModal(true); setFormData({ client_name: '', alt_text: '', status: 'active', logo: null }); }}
//             className="bg-purple-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-md"
//           >
//             <FaPlus /> Add New Client
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4">
//             <p className="font-medium">Error</p>
//             <p>{error}</p>
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alt Text</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {clients.map((client) => (
//                   <tr key={client.id} className={`hover:bg-gray-50 ${client.status === 'inactive' ? 'bg-gray-50 opacity-75' : ''}`}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {client.logo_path ? (
//                         <img 
//                           src={`http://localhost:5000${client.logo_path}`} 
//                           alt={client.client_name}
//                           className="h-12 w-auto object-contain"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = getFallbackImage();
//                           }}
//                         />
//                       ) : (
//                         <img 
//                           src={getFallbackImage()}
//                           alt="No logo"
//                           className="h-12 w-auto object-contain"
//                         />
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">{client.client_name}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-500 max-w-xs truncate">{client.alt_text || '-'}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <button
//                         onClick={() => toggleStatus(client.id, client.status)}
//                         className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                           client.status === 'active' 
//                             ? 'bg-green-100 text-green-800 hover:bg-green-200' 
//                             : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                         }`}
//                       >
//                         {client.status === 'active' ? 'Active' : 'Inactive'}
//                       </button>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex gap-2">
//                         <button 
//                           onClick={() => editClient(client)} 
//                           className="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
//                           title="Edit client"
//                         >
//                           <FaEdit size={18} />
//                         </button>
//                         <button 
//                           onClick={() => deleteClient(client.id)} 
//                           className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
//                           title="Delete client"
//                         >
//                           <FaTrash size={18} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {clients.length === 0 && (
//             <div className="text-center py-12">
//               <FaImage className="mx-auto text-4xl text-gray-300 mb-3" />
//               <p className="text-gray-500">No clients found</p>
//               <p className="text-sm text-gray-400">Click "Add New Client" to get started</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal - Updated with Status field */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
//             <div className="flex justify-between items-center mb-4 pb-2 border-b">
//               <h2 className="text-xl font-bold text-gray-800">
//                 {editingClient ? 'Edit Client' : 'Add New Client'}
//               </h2>
//               <button 
//                 onClick={() => setShowModal(false)} 
//                 className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <FaTimes size={20} />
//               </button>
//             </div>
            
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1 text-gray-700">
//                   Client Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="client_name"
//                   value={formData.client_name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   placeholder="Enter client name"
//                   required
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1 text-gray-700">
//                   Alt Text
//                 </label>
//                 <input
//                   type="text"
//                   name="alt_text"
//                   value={formData.alt_text}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   placeholder="Alternative text for SEO"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">Helps with SEO and accessibility</p>
//               </div>

//               {/* Status field in modal */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1 text-gray-700">
//                   Status <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//                 <p className="text-xs text-gray-500 mt-1">Inactive clients will not be displayed on the website</p>
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1 text-gray-700">
//                   Client Logo {!editingClient && <span className="text-red-500">*</span>}
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">JPEG, PNG, JPG, WEBP, SVG (Max 5MB)</p>
//                 {/* FIXED: Changed 'client' to 'editingClient' */}
//                 {editingClient && editingClient.logo_path && (
//                   <p className="text-xs text-gray-500 mt-1">Leave empty to keep current logo</p>
//                 )}
//               </div>
              
//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2 shadow-md font-semibold"
//               >
//                 <FaSave /> {editingClient ? 'Update Client' : 'Add Client'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminOurClients;



import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  FaTrash, FaEdit, FaPlus, FaImage, FaTimes, FaSave, FaSpinner,
  FaToggleOn, FaToggleOff
} from 'react-icons/fa';

const AdminOurClients = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'inactive'
  const [formData, setFormData] = useState({
    client_name: '',
    alt_text: '',
    status: 'active',
    logo: null
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchClients();
    }
  }, [isAuthenticated, user]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/our-clients/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setClients(data.data || []);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
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
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, logo: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('client_name', formData.client_name);
      formDataToSend.append('alt_text', formData.alt_text);
      formDataToSend.append('status', formData.status);
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      const url = editingClient 
        ? `${API_BASE_URL}/our-clients/${editingClient.id}`
        : `${API_BASE_URL}/our-clients/upload`;
      
      const method = editingClient ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      if (data.success) {
        alert(editingClient ? 'Client updated!' : 'Client added!');
        setShowModal(false);
        setEditingClient(null);
        setFormData({ client_name: '', alt_text: '', status: 'active', logo: null });
        fetchClients();
      } else {
        alert(data.message || 'Failed to save client');
      }
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Failed to save client');
    }
  };

  const deleteClient = async (id) => {
    if (!window.confirm('Delete this client?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/our-clients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert('Client deleted!');
        fetchClients();
      } else {
        alert(data.message || 'Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete client');
    }
  };

  const editClient = (client) => {
    setEditingClient(client);
    setFormData({
      client_name: client.client_name,
      alt_text: client.alt_text || '',
      status: client.status || 'active',
      logo: null
    });
    setShowModal(true);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await fetch(`${API_BASE_URL}/our-clients/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        fetchClients();
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  // Filter clients based on active tab
  const getFilteredClients = () => {
    if (activeTab === 'active') {
      return clients.filter(c => c.status === 'active');
    } else if (activeTab === 'inactive') {
      return clients.filter(c => c.status === 'inactive');
    }
    return clients;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
      : <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>;
  };

  // Fallback image as data URL
  const getFallbackImage = () => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Crect width='100' height='60' fill='%23f3f4f6'/%3E%3Ctext x='50' y='35' font-family='Arial' font-size='10' fill='%239ca3af' text-anchor='middle'%3ENo Logo%3C/text%3E%3C/svg%3E";
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <FaSpinner className="animate-spin rounded-full h-12 w-12 text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const filteredClients = getFilteredClients();
  const activeCount = clients.filter(c => c.status === 'active').length;
  const inactiveCount = clients.filter(c => c.status === 'inactive').length;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Our Clients Management</h1>
            <p className="text-gray-600 mt-1">Manage client logos displayed on the website</p>
          </div>
          <button
            onClick={() => { setEditingClient(null); setShowModal(true); setFormData({ client_name: '', alt_text: '', status: 'active', logo: null }); }}
            className="bg-purple-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-md"
          >
            <FaPlus /> Add New Client
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
                All Clients ({clients.length})
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

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alt Text</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className={`hover:bg-gray-50 ${client.status === 'inactive' ? 'bg-gray-50 opacity-75' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.logo_path ? (
                        <img 
                          src={`http://localhost:5000${client.logo_path}`} 
                          alt={client.client_name}
                          className="h-12 w-auto object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getFallbackImage();
                          }}
                        />
                      ) : (
                        <img 
                          src={getFallbackImage()}
                          alt="No logo"
                          className="h-12 w-auto object-contain"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.client_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">{client.alt_text || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStatus(client.id, client.status)}
                          className={`p-2 rounded-lg transition-colors ${
                            client.status === 'active' 
                              ? 'text-green-600 hover:text-green-800 hover:bg-green-50' 
                              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                          }`}
                          title={client.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {client.status === 'active' ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                        </button>
                        {getStatusBadge(client.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => editClient(client)} 
                          className="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit client"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteClient(client.id)} 
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete client"
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
          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <FaImage className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-gray-500">
                {activeTab === 'all' && 'No clients found'}
                {activeTab === 'active' && 'No active clients found'}
                {activeTab === 'inactive' && 'No inactive clients found'}
              </p>
              <p className="text-sm text-gray-400">Click "Add New Client" to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal with Status Field */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingClient ? 'Edit Client' : 'Add New Client'}
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
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter client name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Alt Text
                </label>
                <input
                  type="text"
                  name="alt_text"
                  value={formData.alt_text}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Alternative text for SEO"
                />
                <p className="text-xs text-gray-500 mt-1">Helps with SEO and accessibility</p>
              </div>

              {/* Status field in modal */}
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
                <p className="text-xs text-gray-500 mt-1">Inactive clients will not be displayed on the website</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Client Logo {!editingClient && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <p className="text-xs text-gray-500 mt-1">JPEG, PNG, JPG, WEBP, SVG (Max 5MB)</p>
                {editingClient && editingClient.logo_path && (
                  <p className="text-xs text-gray-500 mt-1">Leave empty to keep current logo</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2 shadow-md font-semibold"
              >
                <FaSave /> {editingClient ? 'Update Client' : 'Add Client'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOurClients;