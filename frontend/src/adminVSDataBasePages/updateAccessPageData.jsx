import React, { useState, useEffect } from 'react';
import {
     Edit,
     Save,
     X,
     Plus,
     Trash2,
     Eye,
     EyeOff,
     Users,
     Clock,
     Shield,
     AlertCircle,
     CheckCircle,
     Calendar,
     UserCheck
} from 'lucide-react';
import axios from 'axios';

const PageAccessControlDashboard = () => {
     const [pageAccess, setPageAccess] = useState([]);
     const [loading, setLoading] = useState(true);
     const [editingId, setEditingId] = useState(null);
     const [showAddForm, setShowAddForm] = useState(false);
     const [searchTerm, setSearchTerm] = useState('');
     const [filterRole, setFilterRole] = useState('all');
     const [editForm, setEditForm] = useState({
          pageId: '',
          pageName: '',
          isPublic: false,
          allowedRoles: [],
          isActive: true,
          accessConditions: {
               startDate: '',
               endDate: '',
               maxUsers: '',
               currentUsers: 0
          },
          accessMessage: 'This page is currently not available'
     });

     const availableRoles = ['admin', 'teacher', 'student', 'parent', 'guest'];

     // Simulate API calls (replace with your actual API endpoints)
     const fetchPageAccess = async () => {
          setLoading(true);
          try {
               // {
               //      _id: '1',
               //      pageId: 'student-registration',
               //      pageName: 'Student Registration',
               //      isPublic: true,
               //      allowedRoles: ['admin', 'student'],
               //      isActive: true,
               //      accessConditions: {
               //           startDate: '2024-01-01',
               //           endDate: '2024-12-31',
               //           maxUsers: 1000,
               //           currentUsers: 245
               //      },
               //      accessMessage: 'Registration is currently open for all students',
               //      createdAt: '2024-01-15T10:30:00.000Z'
               // },
               const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/page-access/list`, { withCredentials: true });
               console.log(response);
               setPageAccess(response.data?.data);
          } catch (error) {
               console.error('Error fetching page access:', error);
          } finally {
               setLoading(false);
          }
     };

     const updatePageAccess = async (id, data) => {
          try {
               // Replace with actual API call
               // const response = await fetch(`/api/page-access/${id}`, {
               //   method: 'PUT',
               //   headers: { 'Content-Type': 'application/json' },
               //   body: JSON.stringify(data)
               // });

               // Mock update for demonstration
               setPageAccess(prev => prev.map(item =>
                    item._id === id ? { ...item, ...data } : item
               ));

               setEditingId(null);
               alert('Page access updated successfully!');
          } catch (error) {
               console.error('Error updating page access:', error);
               alert('Error updating page access');
          }
     };

     const addPageAccess = async (data) => {
          try {
               // Replace with actual API call
               const newPage = await axios.put(`${import.meta.env.VITE_API_URL}/api/page-access/create`, data, { withCredentials: true })
               // {
               //      _id: Date.now().toString(),
               //      ...data,
               //      createdAt: new Date().toISOString()
               // };
               console.log(newPage);

               setPageAccess(prev => [newPage, ...prev]);
               console.log('====================================');
               console.log(pageAccess);
               console.log('====================================');
               setShowAddForm(false);
               resetForm();
               alert('New page access created successfully!');
          } catch (error) {
               console.error('Error adding page access:', error);
               alert('Error creating page access');
          }
     };

     const deletePageAccess = async (id) => {
          if (!window.confirm('Are you sure you want to delete this page access?')) return;

          try {
               // Replace with actual API call
               setPageAccess(prev => prev.filter(item => item._id !== id));
               alert('Page access deleted successfully!');
          } catch (error) {
               console.error('Error deleting page access:', error);
               alert('Error deleting page access');
          }
     };

     const resetForm = () => {
          setEditForm({
               pageId: '',
               pageName: '',
               isPublic: false,
               allowedRoles: [],
               isActive: true,
               accessConditions: {
                    startDate: '',
                    endDate: '',
                    maxUsers: '',
                    currentUsers: 0
               },
               accessMessage: 'This page is currently not available'
          });
     };

     const startEditing = (page) => {
          setEditingId(page._id);
          setEditForm({
               pageId: page.pageId,
               pageName: page.pageName,
               isPublic: page.isPublic,
               allowedRoles: page.allowedRoles || [],
               isActive: page.isActive,
               accessConditions: {
                    startDate: page.accessConditions?.startDate || '',
                    endDate: page.accessConditions?.endDate || '',
                    maxUsers: page.accessConditions?.maxUsers || '',
                    currentUsers: page.accessConditions?.currentUsers || 0
               },
               accessMessage: page.accessMessage || 'This page is currently not available'
          });
     };

     const handleRoleToggle = (role) => {
          setEditForm(prev => ({
               ...prev,
               allowedRoles: prev.allowedRoles.includes(role)
                    ? prev.allowedRoles.filter(r => r !== role)
                    : [...prev.allowedRoles, role]
          }));
     };

     const filteredPages = pageAccess.filter(page => {
          const matchesSearch = page?.pageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               page.pageId.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesRole = filterRole === 'all' ||
               page.allowedRoles?.includes(filterRole) ||
               (filterRole === 'public' && page.isPublic);
          return matchesSearch && matchesRole;
     });

     useEffect(() => {
          fetchPageAccess();
     }, []);

     const getStatusColor = (page) => {
          if (!page.isActive) return 'bg-red-100 text-red-800';
          if (page.isPublic) return 'bg-green-100 text-green-800';
          return 'bg-blue-100 text-blue-800';
     };

     const getStatusIcon = (page) => {
          if (!page.isActive) return <EyeOff className="w-4 h-4" />;
          if (page.isPublic) return <Users className="w-4 h-4" />;
          return <Shield className="w-4 h-4" />;
     };

     if (loading) {
          return (
               <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                         <p className="text-gray-600">Loading page access data...</p>
                    </div>
               </div>
          );
     }

     return (
          <div className="min-h-screen bg-gray-50 p-4">
               <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                         <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Access Control</h1>
                         <p className="text-gray-600">Manage page accessibility and user permissions in real-time</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                         <div className="bg-white p-6 rounded-lg shadow-sm border">
                              <div className="flex items-center justify-between">
                                   <div>
                                        <p className="text-sm text-gray-600">Total Pages</p>
                                        <p className="text-2xl font-bold text-gray-900">{pageAccess.length}</p>
                                   </div>
                                   <div className="bg-blue-100 p-3 rounded-full">
                                        <Shield className="w-6 h-6 text-blue-600" />
                                   </div>
                              </div>
                         </div>
                         <div className="bg-white p-6 rounded-lg shadow-sm border">
                              <div className="flex items-center justify-between">
                                   <div>
                                        <p className="text-sm text-gray-600">Active Pages</p>
                                        <p className="text-2xl font-bold text-green-600">
                                             {pageAccess.filter(p => p.isActive).length}
                                        </p>
                                   </div>
                                   <div className="bg-green-100 p-3 rounded-full">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                   </div>
                              </div>
                         </div>
                         <div className="bg-white p-6 rounded-lg shadow-sm border">
                              <div className="flex items-center justify-between">
                                   <div>
                                        <p className="text-sm text-gray-600">Public Pages</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                             {pageAccess.filter(p => p.isPublic).length}
                                        </p>
                                   </div>
                                   <div className="bg-blue-100 p-3 rounded-full">
                                        <Users className="w-6 h-6 text-blue-600" />
                                   </div>
                              </div>
                         </div>
                         <div className="bg-white p-6 rounded-lg shadow-sm border">
                              <div className="flex items-center justify-between">
                                   <div>
                                        <p className="text-sm text-gray-600">Restricted</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                             {pageAccess.filter(p => !p.isActive).length}
                                        </p>
                                   </div>
                                   <div className="bg-orange-100 p-3 rounded-full">
                                        <AlertCircle className="w-6 h-6 text-orange-600" />
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                   <input
                                        type="text"
                                        placeholder="Search pages..."
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                   />
                                   <select
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                   >
                                        <option value="all">All Roles</option>
                                        <option value="public">Public Pages</option>
                                        {availableRoles.map(role => (
                                             <option key={role} value={role}>{role}</option>
                                        ))}
                                   </select>
                              </div>
                              <button
                                   onClick={() => setShowAddForm(true)}
                                   className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                   <Plus className="w-4 h-4" />
                                   Add New Page
                              </button>
                         </div>
                    </div>

                    {/* Add New Page Form */}
                    {showAddForm && (
                         <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
                              <div className="flex items-center justify-between mb-4">
                                   <h2 className="text-xl font-semibold">Add New Page Access</h2>
                                   <button
                                        onClick={() => { setShowAddForm(false); resetForm(); }}
                                        className="text-gray-500 hover:text-gray-700"
                                   >
                                        <X className="w-5 h-5" />
                                   </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Page ID</label>
                                        <input
                                             type="text"
                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                             value={editForm.pageId}
                                             onChange={(e) => setEditForm(prev => ({ ...prev, pageId: e.target.value }))}
                                             placeholder="e.g., student-portal"
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Name</label>
                                        <input
                                             type="text"
                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                             value={editForm.pageName}
                                             onChange={(e) => setEditForm(prev => ({ ...prev, pageName: e.target.value }))}
                                             placeholder="e.g., Student Portal"
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                        <input
                                             type="date"
                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                             value={editForm.accessConditions.startDate}
                                             onChange={(e) => setEditForm(prev => ({
                                                  ...prev,
                                                  accessConditions: { ...prev.accessConditions, startDate: e.target.value }
                                             }))}
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                        <input
                                             type="date"
                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                             value={editForm.accessConditions.endDate}
                                             onChange={(e) => setEditForm(prev => ({
                                                  ...prev,
                                                  accessConditions: { ...prev.accessConditions, endDate: e.target.value }
                                             }))}
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Users</label>
                                        <input
                                             type="number"
                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                             value={editForm.accessConditions.maxUsers}
                                             onChange={(e) => setEditForm(prev => ({
                                                  ...prev,
                                                  accessConditions: { ...prev.accessConditions, maxUsers: e.target.value }
                                             }))}
                                             placeholder="Leave empty for unlimited"
                                        />
                                   </div>
                                   <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Access Message</label>
                                        <textarea
                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                             rows={3}
                                             value={editForm.accessMessage}
                                             onChange={(e) => setEditForm(prev => ({ ...prev, accessMessage: e.target.value }))}
                                             placeholder="Message to show when access is denied"
                                        />
                                   </div>
                              </div>

                              <div className="mt-6">
                                   <div className="flex flex-wrap gap-4 mb-4">
                                        <label className="flex items-center">
                                             <input
                                                  type="checkbox"
                                                  className="mr-2"
                                                  checked={editForm.isPublic}
                                                  onChange={(e) => setEditForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                                             />
                                             Public Access
                                        </label>
                                        <label className="flex items-center">
                                             <input
                                                  type="checkbox"
                                                  className="mr-2"
                                                  checked={editForm.isActive}
                                                  onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                                             />
                                             Active
                                        </label>
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Roles</label>
                                        <div className="flex flex-wrap gap-2">
                                             {availableRoles.map(role => (
                                                  <button
                                                       key={role}
                                                       type="button"
                                                       onClick={() => handleRoleToggle(role)}
                                                       className={`px-3 py-1 rounded-full text-sm transition-colors ${editForm.allowedRoles.includes(role)
                                                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                                                            : 'bg-gray-100 text-gray-600 border-gray-200'
                                                            } border`}
                                                  >
                                                       {role}
                                                  </button>
                                             ))}
                                        </div>
                                   </div>
                              </div>

                              <div className="flex gap-3 mt-6">
                                   <button
                                        onClick={() => addPageAccess(editForm)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        disabled={!editForm.pageId || !editForm.pageName}
                                   >
                                        Create Page Access
                                   </button>
                                   <button
                                        onClick={() => { setShowAddForm(false); resetForm(); }}
                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                   >
                                        Cancel
                                   </button>
                              </div>
                         </div>
                    )}

                    {/* Page Access List */}
                    <div className="space-y-4">
                         {filteredPages.map(page => (
                              <div key={page._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                   {editingId === page._id ? (
                                        // Edit Form
                                        <div className="p-6">
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                  <div>
                                                       <label className="block text-sm font-medium text-gray-700 mb-2">Page Name</label>
                                                       <input
                                                            type="text"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                            value={editForm.pageName}
                                                            onChange={(e) => setEditForm(prev => ({ ...prev, pageName: e.target.value }))}
                                                       />
                                                  </div>
                                                  <div>
                                                       <label className="block text-sm font-medium text-gray-700 mb-2">Access Message</label>
                                                       <input
                                                            type="text"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                            value={editForm.accessMessage}
                                                            onChange={(e) => setEditForm(prev => ({ ...prev, accessMessage: e.target.value }))}
                                                       />
                                                  </div>
                                                  <div>
                                                       <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                                       <input
                                                            type="date"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                            value={editForm.accessConditions.startDate}
                                                            onChange={(e) => setEditForm(prev => ({
                                                                 ...prev,
                                                                 accessConditions: { ...prev.accessConditions, startDate: e.target.value }
                                                            }))}
                                                       />
                                                  </div>
                                                  <div>
                                                       <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                                       <input
                                                            type="date"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                                            value={editForm.accessConditions.endDate}
                                                            onChange={(e) => setEditForm(prev => ({
                                                                 ...prev,
                                                                 accessConditions: { ...prev.accessConditions, endDate: e.target.value }
                                                            }))}
                                                       />
                                                  </div>
                                             </div>

                                             <div className="mt-6">
                                                  <div className="flex flex-wrap gap-4 mb-4">
                                                       <label className="flex items-center">
                                                            <input
                                                                 type="checkbox"
                                                                 className="mr-2"
                                                                 checked={editForm.isPublic}
                                                                 onChange={(e) => setEditForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                                                            />
                                                            Public Access
                                                       </label>
                                                       <label className="flex items-center">
                                                            <input
                                                                 type="checkbox"
                                                                 className="mr-2"
                                                                 checked={editForm.isActive}
                                                                 onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                                                            />
                                                            Active
                                                       </label>
                                                  </div>

                                                  <div>
                                                       <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Roles</label>
                                                       <div className="flex flex-wrap gap-2">
                                                            {availableRoles.map(role => (
                                                                 <button
                                                                      key={role}
                                                                      type="button"
                                                                      onClick={() => handleRoleToggle(role)}
                                                                      className={`px-3 py-1 rounded-full text-sm transition-colors ${editForm.allowedRoles.includes(role)
                                                                           ? 'bg-blue-100 text-blue-800 border-blue-200'
                                                                           : 'bg-gray-100 text-gray-600 border-gray-200'
                                                                           } border`}
                                                                 >
                                                                      {role}
                                                                 </button>
                                                            ))}
                                                       </div>
                                                  </div>
                                             </div>

                                             <div className="flex gap-3 mt-6">
                                                  <button
                                                       onClick={() => updatePageAccess(page._id, editForm)}
                                                       className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                                  >
                                                       <Save className="w-4 h-4" />
                                                       Save Changes
                                                  </button>
                                                  <button
                                                       onClick={() => setEditingId(null)}
                                                       className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                                  >
                                                       <X className="w-4 h-4" />
                                                       Cancel
                                                  </button>
                                             </div>
                                        </div>
                                   ) : (
                                        // Display Mode
                                        <div className="p-6">
                                             <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                  <div className="flex-1">
                                                       <div className="flex items-start gap-3 mb-4">
                                                            <div className={`p-2 rounded-lg ${getStatusColor(page)}`}>
                                                                 {getStatusIcon(page)}
                                                            </div>
                                                            <div>
                                                                 <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                                      {page.pageName}
                                                                 </h3>
                                                                 <p className="text-sm text-gray-600 mb-2">
                                                                      Page ID: <code className="bg-gray-100 px-2 py-1 rounded">{page.pageId}</code>
                                                                 </p>
                                                                 <div className="flex flex-wrap gap-2">
                                                                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page)}`}>
                                                                           {getStatusIcon(page)}
                                                                           {page.isActive ? (page.isPublic ? 'Public' : 'Role-based') : 'Inactive'}
                                                                      </span>
                                                                      {page.allowedRoles?.map(role => (
                                                                           <span key={role} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                                <UserCheck className="w-3 h-3 mr-1" />
                                                                                {role}
                                                                           </span>
                                                                      ))}
                                                                 </div>
                                                            </div>
                                                       </div>

                                                       <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                                            <p className="text-sm text-gray-700">
                                                                 <strong>Access Message:</strong> {page.accessMessage}
                                                            </p>
                                                       </div>

                                                       {page.accessConditions && (
                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                                 {page.accessConditions.startDate && (
                                                                      <div className="flex items-center gap-2 text-gray-600">
                                                                           <Calendar className="w-4 h-4" />
                                                                           <span>From: {new Date(page.accessConditions.startDate).toLocaleDateString()}</span>
                                                                      </div>
                                                                 )}
                                                                 {page.accessConditions.endDate && (
                                                                      <div className="flex items-center gap-2 text-gray-600">
                                                                           <Calendar className="w-4 h-4" />
                                                                           <span>Until: {new Date(page.accessConditions.endDate).toLocaleDateString()}</span>
                                                                      </div>
                                                                 )}
                                                                 {page.accessConditions.maxUsers && (
                                                                      <div className="flex items-center gap-2 text-gray-600">
                                                                           <Users className="w-4 h-4" />
                                                                           <span>
                                                                                {page.accessConditions.currentUsers || 0} / {page.accessConditions.maxUsers} users
                                                                           </span>
                                                                      </div>
                                                                 )}
                                                            </div>
                                                       )}
                                                  </div>

                                                  <div className="flex gap-2">
                                                       <button
                                                            onClick={() => startEditing(page)}
                                                            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                       >
                                                            <Edit className="w-4 h-4" />
                                                            Edit
                                                       </button>
                                                       <button
                                                            onClick={() => deletePageAccess(page._id)}
                                                            className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                                       >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>
                                   )}
                              </div>
                         ))}

                         {filteredPages.length === 0 && (
                              <div className="text-center py-12 bg-white rounded-lg border">
                                   <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                   <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
                                   <p className="text-gray-600">
                                        {searchTerm || filterRole !== 'all'
                                             ? 'Try adjusting your search or filter criteria.'
                                             : 'Create your first page access control to get started.'
                                        }
                                   </p>
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
};

export default PageAccessControlDashboard;