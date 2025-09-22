import React, { useState, useEffect } from 'react';
import axios from 'axios';
import departmentsData from '..//data/departmentsData.json'
import toast from 'react-hot-toast';

export default function StudentUpdatePage() {
     // Get student ID from URL parameters
     const [studentId, setStudentId] = useState('');
     const [formArray, setFormArray] = useState({
          degrees: [],
          years: [],
          branches: [],
     });
     // Original data (for display cards)
     const [originalPersonal, setOriginalPersonal] = useState(null);
     const [originalAcademic, setOriginalAcademic] = useState(null);

     // Personal Details State (for form)
     const [personalDetails, setPersonalDetails] = useState({
          username: '',
          name: '',
          email: '',
          phone: ''
     });

     // Academic Details State (for form)
     const [academicDetails, setAcademicDetails] = useState({
          department: '',
          branch: '',
          year: ''
     });

     // UI State
     const [isLoadingPersonal, setIsLoadingPersonal] = useState(false);
     const [isLoadingAcademic, setIsLoadingAcademic] = useState(false);
     const [isSavingPersonal, setIsSavingPersonal] = useState(false);
     const [isSavingAcademic, setIsSavingAcademic] = useState(false);
     const [personalMessage, setPersonalMessage] = useState('');
     const [academicMessage, setAcademicMessage] = useState('');

     // Available options for dropdowns
     const departments = Object.keys(departmentsData) || [];


     // Fetch available degrees when department changes
     useEffect(() => {
          if (academicDetails.department) {
               setFormArray(prev => ({
                    ...prev,
                    degrees: departmentsData[academicDetails.department] ? Object.keys(departmentsData[academicDetails.department]) : [],
               }));
               // console.log(formArray.degrees);
          } else {
               setFormArray(() => ({
                    degrees: [], branches: []
               }))
          }
     }, [academicDetails.department]);
     useEffect(() => {
          if (academicDetails.department && academicDetails.degree) {
               setFormArray(prev => ({
                    ...prev,
                    years: departmentsData[academicDetails.department][academicDetails.degree]["requiredYear"] || [],
                    branches: departmentsData[academicDetails.department][academicDetails.degree]['branches'] || []
               }));
               console.log("department changed end");
               console.log(formArray.degrees);
          } else {
               setFormArray(() => ({
                    years: [],
                    branches: [],
               }))
          }
     }, [academicDetails.degree]);

     useEffect(() => {
          if (academicDetails.department && academicDetails.degree) {
               setFormArray(prev => ({
                    ...prev,
                    branches: departmentsData[academicDetails.department][academicDetails.degree]['branches'] || []
               }));
          } else {
               setFormArray(prev => ({
                    ...prev,
                    branches: [],
               }));
          }
     }, [academicDetails.year]);

     // Extract student ID from URL on component mount
     useEffect(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const id = urlParams.get('doc_id');
          console.log(id);
          if (id) {
               setStudentId(id);
               loadStudentData(id);
          } else {
               setPersonalMessage('No student ID provided in URL');
               setAcademicMessage('No student ID provided in URL');
          }
     }, []);

     // Load student data from both APIs
     const loadStudentData = async (id) => {
          await Promise.all([
               loadPersonalDetails(id),
          ]);
     };

     // Load personal details
     const loadPersonalDetails = async (id) => {
          setIsLoadingPersonal(true);
          setPersonalMessage('');
          setIsLoadingAcademic(true);
          setAcademicMessage('');

          try {
               const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-student-all-info`, { params: { id: id }, withCredentials: true });
               console.log(response);
               if (response.status == 200) {
                    setOriginalPersonal(response.data.informationDocument)
                    const studentData = {
                         username: response.data.student.username || '',
                         name: response.data.student.name || '',
                         email: response.data.student.email || '',
                         phone: response.data.student.phone || ''
                    };
                    const academicData = {
                         department: response.data.academic.department || '',
                         branch: response.data.academic.branch || '',
                         year: response.data.academic.year || ''
                    };

                    setOriginalPersonal(studentData);
                    setPersonalDetails(studentData);
                    setOriginalAcademic(academicData);
                    setAcademicDetails(academicData);
               } else {
                    setAcademicMessage('Failed to load academic details');
                    setPersonalMessage('Failed to load personal details');
               }
          } catch (error) {
               console.error('Error loading personal details:', error);
               setPersonalMessage('Error loading personal details');
               console.error('Error loading academic details:', error);
               setAcademicMessage('Error loading academic details');
          } finally {
               setIsLoadingPersonal(false);
               setIsLoadingAcademic(false);
          }
     };
     // Handle personal details input change
     const handlePersonalChange = (e) => {
          const { name, value } = e.target;
          setPersonalDetails(prev => ({
               ...prev,
               [name]: value
          }));
     };

     // Handle academic details input change
     const handleAcademicChange = (e) => {
          const { name, value } = e.target;
          setAcademicDetails(prev => ({
               ...prev,
               [name]: value
          }));
     };

     // Save personal details
     const savePersonalDetails = async () => {
          if (!studentId) {
               setPersonalMessage('No student ID available');
               return;
          }

          setIsSavingPersonal(true);
          setPersonalMessage('');

          try {
               const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/update/student/profile/${studentId}`, personalDetails, { withCredentials: true });
               console.log(response.data);
               if (response.data) {
                    setOriginalPersonal(personalDetails); // Update displayed data
                    setPersonalMessage('Personal details updated successfully!');
                    setTimeout(() => setPersonalMessage(''), 5000);
               } else {
                    setPersonalMessage('Failed to update personal details');
               }
          } catch (error) {
               console.error('Error saving personal details:', error);
               setPersonalMessage('Failed : ' + error.response.data.message);
               toast(error.response.data.error)
          } finally {
               setIsSavingPersonal(false);
          }
     };

     // Save academic details
     const saveAcademicDetails = async () => {
          if (!studentId) {
               setAcademicMessage('No student ID available');
               return;
          }
          setIsSavingAcademic(true);
          setAcademicMessage('');

          try {
               const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/update/student/academic/${studentId}`, academicDetails, { withCredentials: true });
               console.log(response);

               if (response.status == 200) {
                    setOriginalAcademic(academicDetails); // Update displayed data
                    setAcademicMessage('Academic details updated successfully!');
                    setTimeout(() => setAcademicMessage(''), 5000);
               } else {
                    setAcademicMessage('Failed to update academic details');
               }
          } catch (error) {
               console.error('Error saving academic details:', error);
               setAcademicMessage(error.response.data?.message || "An error in server");
          } finally {
               setIsSavingAcademic(false);
          }
     };

     // Reset personal form to original values
     const resetPersonalForm = () => {
          setPersonalDetails(originalPersonal);
          setPersonalMessage('');
     };

     // Reset academic form to original values
     const resetAcademicForm = () => {
          setAcademicDetails(originalAcademic);
          setAcademicMessage('');
     };

     // Validate personal form
     const isPersonalFormValid = () => {
          return true;
          // personalDetails.username.trim() &&
          //      personalDetails.name.trim() &&
          //      personalDetails.email.trim() &&
          //      personalDetails.phone;
     };

     // Validate academic form
     const isAcademicFormValid = () => {
          return true;
          //  academicDetails.department &&
          //      academicDetails.branch &&
          //      academicDetails.year;
     };

     // Check if personal form has changes
     const hasPersonalChanges = () => {
          if (!originalPersonal) return false;
          return JSON.stringify(personalDetails) !== JSON.stringify(originalPersonal);
     };

     // Check if academic form has changes
     const hasAcademicChanges = () => {
          if (!originalAcademic) return false;
          return JSON.stringify(academicDetails) !== JSON.stringify(originalAcademic);
     };

     return (
          <div className="min-h-screen bg-gray-200">
               {/* Header */}
               <header className="bg-red-800 text-white shadow-lg">
                    <div className="container mx-auto px-4 py-4">
                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                   <h1 className="text-2xl md:text-3xl font-bold">Student Profile Management</h1>
                                   <p className="text-red-100 text-sm md:text-base mt-1">
                                        View and update personal and academic information
                                   </p>
                              </div>
                              {studentId && (
                                   <div className="mt-3 sm:mt-0">
                                        <span className="bg-red-700 px-3 py-1 rounded-full text-sm font-medium">
                                             ID: {studentId.slice(-8)}...
                                        </span>
                                   </div>
                              )}
                         </div>
                    </div>
               </header>

               {/* Main Content */}
               <main className="container mx-auto p-1 sm:p-6">
                    <div className="max-w-4xl mx-auto space-y-5">
                         {/* Personal Details Display Card */}
                         <div className="bg-white rounded-lg shadow-md overflow-hidden">
                              <div className="bg-red-800 text-white px-6 py-4">
                                   <div className="flex items-center justify-between">
                                        <h2 className="text-sm font-semibold flex items-center">
                                             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                             </svg>
                                             Personal Details
                                        </h2>
                                        {isLoadingPersonal && (
                                             <div className="flex items-center text-red-100">
                                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                  Loading...
                                             </div>
                                        )}
                                   </div>
                              </div>

                              <div className="p-4 sm:p-6">
                                   {originalPersonal ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                             <div className="space-y-4">
                                                  <div className='flex gap-2 border-b-1 border-gray-600 p-2'>
                                                       <span className="text-sm font-medium text-gray-500">Username :</span>
                                                       <p className="text-sm px-2 font-semibold text-gray-900 rounded-2xl">{originalPersonal.username}</p>
                                                  </div>
                                                  <div className='flex gap-2 border-b-1 border-gray-600 p-2'>
                                                       <span className="text-sm font-medium text-gray-500">Full Name :</span>
                                                       <p className="text-sm font-semibold text-gray-900">{originalPersonal.name || "Null"}</p>
                                                  </div>
                                             </div>
                                             <div className="space-y-4">
                                                  <div className='flex gap-2 border-b-1 border-gray-600 p-2'>
                                                       <span className="text-sm font-medium text-gray-500">Email Address :</span>
                                                       <p className="text-sm font-semibold text-gray-900">{originalPersonal.email ? originalPersonal.email : "Null"}</p>
                                                  </div>
                                                  <div className='flex gap-2 border-b-1 border-gray-600 p-2'>
                                                       <span className="text-sm font-medium text-gray-500">Phone Number :</span>
                                                       <p className="text-sm font-semibold text-gray-900">{originalPersonal.phone || "Null"}</p>
                                                  </div>
                                             </div>
                                        </div>
                                   ) : (
                                        <div className="text-center py-8 text-gray-500">
                                             {isLoadingPersonal ? 'Loading personal details...' : 'No personal details available'}
                                        </div>
                                   )}
                              </div>
                         </div>

                         {/* Personal Details Update Form */}
                         <div className="bg-white rounded-lg shadow-md px-6 py-4">
                              <div className='mb-3 sm:mb-6'>
                                   <h3 className="text-lg font-semibold text-red-800 ">Update Personal Details</h3>
                                   <p className='text-[13px]'>Note: Only fill that fields have to modify</p>
                              </div>
                              {personalMessage && (
                                   <div className={`mb-6 p-4 rounded-md ${personalMessage.includes('Error') || personalMessage.includes('Failed')
                                        ? 'bg-red-100 text-red-700 border border-red-300'
                                        : 'bg-green-100 text-green-700 border border-green-300'
                                        }`}>
                                        {personalMessage}
                                   </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-5 mb-8">
                                   {/* Username */}
                                   <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                             Username *
                                        </label>
                                        <input
                                             type="text"
                                             id="username"
                                             name="username"
                                             value={personalDetails.username}
                                             onChange={handlePersonalChange}
                                             disabled={isLoadingPersonal}
                                             className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                                             placeholder="Enter username"
                                        />
                                   </div>

                                   {/* Name */}
                                   <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                             Full Name *
                                        </label>
                                        <input
                                             type="text"
                                             id="name"
                                             name="name"
                                             value={personalDetails.name}
                                             onChange={handlePersonalChange}
                                             disabled={isLoadingPersonal}
                                             className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                                             placeholder="Enter full name"
                                        />
                                   </div>

                                   {/* Email */}
                                   <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                             Email Address *
                                        </label>
                                        <input
                                             type="email"
                                             id="email"
                                             name="email"
                                             value={personalDetails.email}
                                             onChange={handlePersonalChange}
                                             disabled={isLoadingPersonal}
                                             className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                                             placeholder="Enter email address"
                                        />
                                   </div>

                                   {/* Phone */}
                                   <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                             Phone Number *
                                        </label>
                                        <input
                                             type="tel"
                                             id="phone"
                                             name="phone"
                                             value={personalDetails.phone}
                                             onChange={handlePersonalChange}
                                             disabled={isLoadingPersonal}
                                             className="text-sm   w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                                             placeholder="Enter phone number"
                                        />
                                   </div>
                              </div>

                              {/* Personal Details Action Buttons */}
                              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 justify-end">
                                   <button
                                        onClick={resetPersonalForm}
                                        disabled={!hasPersonalChanges() || isSavingPersonal}
                                        className={`px-2 sm:px-4 py-2 rounded-md font-medium transition-colors ${!hasPersonalChanges() || isSavingPersonal
                                             ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                             : 'border border-red-800 text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                                             }`}
                                   >
                                        Reset Changes
                                   </button>

                                   <button
                                        onClick={savePersonalDetails}
                                        disabled={isSavingPersonal || isLoadingPersonal || !isPersonalFormValid() || !hasPersonalChanges()}
                                        className={`px-6 py-2 rounded-md font-medium transition-colors ${isSavingPersonal || isLoadingPersonal || !isPersonalFormValid() || !hasPersonalChanges()
                                             ? 'bg-gray-400 cursor-not-allowed text-white'
                                             : 'bg-red-800 hover:bg-red-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                                             }`}
                                   >
                                        {isSavingPersonal ? (
                                             <span className="flex items-center">
                                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                  Saving...
                                             </span>
                                        ) : (
                                             'Save Personal Details'
                                        )}
                                   </button>
                              </div>
                         </div>

                         {/* Academic Details Display Card */}
                         {personalDetails?.role == "student"
                              &&
                              <div>
                                   <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <div className="bg-red-800 text-white px-6 py-4">
                                             <div className="flex items-center justify-between">
                                                  <h2 className="text-sm font-semibold flex items-center">
                                                       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                       </svg>
                                                       Academic Details
                                                  </h2>
                                                  {isLoadingAcademic && (
                                                       <div className="flex items-center text-red-100">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Loading...
                                                       </div>
                                                  )}
                                             </div>
                                        </div>

                                        <div className="p-6">
                                             {originalAcademic ? (
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                       <div className='flex gap-2 border-b-1 border-gray-600 p-2' >
                                                            <span className="text-sm font-medium text-gray-500">Department :</span>
                                                            <p className="text-sm font-semibold text-gray-900">{originalAcademic.department}</p>
                                                       </div>
                                                       <div className='flex flex-wrap gap-2 border-b-1 border-gray-600 p-2'>
                                                            <span className="text-sm font-medium text-gray-500">Branch :</span>
                                                            <p className="text-sm font-semibold text-gray-900">{originalAcademic.branch}</p>
                                                       </div>
                                                       <div className='flex gap-2 border-b-1 border-gray-600 p-2'>
                                                            <span className="text-sm font-medium text-gray-500">Academic Year :</span>
                                                            <p className="text-sm font-semibold text-gray-900">{originalAcademic.year}</p>
                                                       </div>
                                                  </div>
                                             ) : (
                                                  <div className="text-center py-8 text-gray-500">
                                                       {isLoadingAcademic ? 'Loading academic details...' : 'No academic details available'}
                                                  </div>
                                             )}
                                        </div>
                                   </div>

                                   {/* Academic Details Update Form */}
                                   <div className="bg-white rounded-lg shadow-md p-6">
                                        <h3 className="text-sm font-semibold text-red-800 mb-6">Update Academic Details</h3>

                                        {academicMessage && (
                                             <div className={`mb-6 p-4 rounded-md ${academicMessage.includes('Error') || academicMessage.includes('Failed')
                                                  ? 'bg-red-100 text-red-700 border border-red-300'
                                                  : 'bg-green-100 text-green-700 border border-green-300'
                                                  }`}>
                                                  {academicMessage}
                                             </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                             {/* Department */}
                                             <div>
                                                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                                                       Department *
                                                  </label>
                                                  <select
                                                       id="department"
                                                       name="department"
                                                       value={academicDetails.department}
                                                       onChange={handleAcademicChange}
                                                       disabled={isLoadingAcademic}
                                                       className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                                                  >
                                                       <option value="">Select Department</option>
                                                       {departments.map(dept => (
                                                            <option key={dept} value={dept}>{dept}</option>
                                                       ))}
                                                  </select>
                                             </div>
                                             {/* degree */}
                                             <div>
                                                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                                                       Department *
                                                  </label>
                                                  <select
                                                       id="degree"
                                                       name="degree"
                                                       value={academicDetails.degree}
                                                       onChange={handleAcademicChange}
                                                       disabled={isLoadingAcademic}
                                                       className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                                                  >
                                                       <option value="">Select degree</option>
                                                       {formArray.degrees && formArray.degrees.map(dept => (
                                                            <option key={dept} value={dept}>{dept}</option>
                                                       ))}
                                                  </select>
                                             </div>

                                             {/* Branch */}
                                             <div>
                                                  <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
                                                       Branch *
                                                  </label>
                                                  <select
                                                       id="branch"
                                                       name="branch"
                                                       value={academicDetails.branch}
                                                       onChange={handleAcademicChange}
                                                       disabled={isLoadingAcademic}
                                                       className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                                                  >
                                                       <option value="">Select Branch</option>
                                                       {formArray.branches.map(branch => (
                                                            <option key={branch} value={branch}>{branch}</option>
                                                       ))}
                                                  </select>
                                             </div>

                                             {/* Year */}
                                             <div>
                                                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                                                       Academic Year *
                                                  </label>
                                                  <select
                                                       id="year"
                                                       name="year"
                                                       value={academicDetails.year}
                                                       onChange={handleAcademicChange}
                                                       disabled={isLoadingAcademic}
                                                       className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                                                  >
                                                       <option value="">Select Year</option>
                                                       {formArray.years.map(year => (
                                                            <option key={year} value={year}>{year}</option>
                                                       ))}
                                                  </select>
                                             </div>
                                        </div>

                                        {/* Academic Details Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                             <button
                                                  onClick={resetAcademicForm}
                                                  disabled={!hasAcademicChanges() || isSavingAcademic}
                                                  className={`px-4 py-2 rounded-md font-medium transition-colors ${!hasAcademicChanges() || isSavingAcademic
                                                       ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                                       : 'border border-red-800 text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                                                       }`}
                                             >
                                                  Reset Changes
                                             </button>

                                             <button
                                                  onClick={saveAcademicDetails}
                                                  disabled={isSavingAcademic || isLoadingAcademic || !isAcademicFormValid() || !hasAcademicChanges()}
                                                  className={`px-6 py-2 rounded-md font-medium transition-colors ${isSavingAcademic || isLoadingAcademic || !isAcademicFormValid() || !hasAcademicChanges()
                                                       ? 'bg-gray-400 cursor-not-allowed text-white'
                                                       : 'bg-red-800 hover:bg-red-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                                                       }`}
                                             >
                                                  {isSavingAcademic ? (
                                                       <span className="flex items-center">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Saving...
                                                       </span>
                                                  ) : (
                                                       'Save Academic Details'
                                                  )}
                                             </button>
                                        </div>
                                   </div>
                              </div>}

                         {/* Back Navigation */}
                         <div className="text-center">
                              <button
                                   onClick={() => window.history.back()}
                                   className="inline-flex items-center px-4 py-2 border border-red-800 text-red-800 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                              >
                                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                   </svg>
                                   Back to Student List
                              </button>
                         </div>
                    </div>
               </main>
          </div>
     );
}