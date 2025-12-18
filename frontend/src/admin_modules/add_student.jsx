import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import departmentsData from '../data/departmentsData.json'

// Mock departments data for demo

export default function AddStudentProfile() {
     const [formData, setFormData] = useState({
          username: '',
          name: '',
          department: '',
          degree: '',
          year: '',
          branch: '',
          password: '',
          confirmPassword: '',
          phone: '',
          email: '',
          photo: '',
          role: 'student'
     });

     const [formArray, setFormArray] = useState({
          degrees: [],
          years: [],
          branches: [],
     });

     const [isSubmitting, setIsSubmitting] = useState(false);
     const [errors, setErrors] = useState({});
     // const [apiErrors, setApiErrors] = useState({});
     const [apiErrors, setApiErrors] = useState({});
     const [showPassword, setShowPassword] = useState(false);
     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

     // Fetch available degrees when department changes
     useEffect(() => {
          if (formData.department) {
               setFormArray(prev => ({
                    ...prev,
                    degrees: departmentsData[formData.department] ? Object.keys(departmentsData[formData.department]) : [],
               }));
          } else {
               setFormArray(prev => ({
                    ...prev,
                    degrees: [],
                    years: [],
                    branches: []
               }));
          }
     }, [formData.department]);

     useEffect(() => {
          if (formData.department && formData.degree) {
               setFormArray(prev => ({
                    ...prev,
                    years: departmentsData[formData.department][formData.degree]["requiredYear"] || [],
                    branches: departmentsData[formData.department][formData.degree]['branches'] || []
               }));
          } else {
               setFormArray(prev => ({
                    ...prev,
                    years: [],
                    branches: [],
               }));
          }
     }, [formData.degree]);

     useEffect(() => {
          if (formData.department && formData.degree) {
               setFormArray(prev => ({
                    ...prev,
                    branches: departmentsData[formData.department][formData.degree]['branches'] || []
               }));
          } else {
               setFormArray(prev => ({
                    ...prev,
                    branches: [],
               }));
          }
     }, [formData.year]);

     const handleInputChange = (e) => {
          const { name, value } = e.target;
          setFormData(prev => ({
               ...prev,
               [name]: value
          }));

          // Clear error when user starts typing
          if (errors[name]) {
               setErrors(prev => ({
                    ...prev,
                    [name]: ''
               }));
          }
     };

     const validateForm = () => {
          const newErrors = {};

          // Username validation
          if (!formData.username.trim()) {
               newErrors.username = 'Username is required';
          } else if (formData.username.length < 5) {
               newErrors.username = 'Username must be at least 5 characters';
          }

          // Name validation
          if (!formData.name.trim()) {
               newErrors.name = 'Full name is required';
          }

          // Department validation
          if (!formData.department) {
               newErrors.department = 'Department is required';
          }

          // Degree validation
          if (!formData.degree) {
               newErrors.degree = 'Degree is required';
          }

          // Year validation
          if (!formData.year) {
               newErrors.year = 'Year is required';
          }

          // Branch validation
          if (!formData.branch) {
               newErrors.branch = 'Branch is required';
          }

          // Password validation
          if (!formData.password) {
               newErrors.password = 'Password is required';
          } else if (formData.password.length < 6) {
               newErrors.password = 'Password must be at least 6 characters';
          }

          // Confirm password validation
          if (formData.password !== formData.confirmPassword) {
               newErrors.confirmPassword = 'Passwords do not match';
          }

          // Phone validation
          if (!formData.phone.trim()) {
               newErrors.phone = 'Phone number is required';
          } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
               newErrors.phone = 'Please enter a valid 10-digit phone number';
          }

          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (!validateForm()) {
               toast.error('Please fix the errors in the form');
               return;
          }
          setIsSubmitting(true);

          try {
               // Create the payload matching the server endpoint
               const payload = {
                    username: formData.username,
                    name: formData.name,
                    department: formData.department,
                    degree: formData.degree,
                    year: formData.year,
                    branch: formData.branch,
                    password: formData.password,
                    phone: formData.phone,
                    email: formData.email,
                    photo: formData.photo,
                    role: formData.role
               };

               const response = await axios.post(`${import.meta.env.VITE_API_URL}/add-student-profile`, payload, {
                    withCredentials: true
               });
               if (response.status === 201) {
                    toast.success('Student registered successfully!');
                    // Reset form
                    setFormData({
                         username: '',
                         name: '',
                         phone: '',
                         photo: '',
                         role: 'student'
                         // department: '',
                         // year: '',
                         // branch: '',
                         // password: '',
                         // confirmPassword: '',
                    });
               }
               // Reset form
               setFormData({
                    username: '',
                    name: '',
                    department: '',
                    degree: '',
                    year: '',
                    branch: '',
                    password: '',
                    confirmPassword: '',
                    phone: '',
                    photo: '',
                    role: 'student'
               });
               setErrors({});
          } catch (error) {
               console.error('Registration error:', error);
               toast.error(error.response?.data.message);
               setApiErrors((prev) => ({
                    ...prev,
                    error1: error.response.data?.message,
                    error2: error.response.data?.errors
               }))
               setTimeout(() => {
                    setApiErrors((prev) => ({
                         ...prev,
                         error1: undefined,
                         error2: undefined,
                    }))
               }, 10000)
          } finally {
               setIsSubmitting(false);
          }
     };

     const handleGoBack = () => {
          window.history.back();
     };

     return (
          <div className='min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-2 sm:py-4'>
               <div className='max-w-4xl mx-auto px-2 sm:px-4 lg:px-6'>
                    {/* Header with Go Back Button and Navigation */}
                    <div className='mb-3 sm:mb-6'>
                         <div className='bg-white/90 backdrop-blur-md rounded-lg sm:rounded-2xl shadow-lg border border-red-100 p-3 sm:p-6'>
                              {/* Top Navigation Bar */}
                              <div className='flex items-center justify-between mb-3 sm:mb-4'>
                                   <button
                                        onClick={handleGoBack}
                                        className='flex items-center cursor-pointer gap-2 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm sm:text-base'
                                   >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span className='font-medium'>Go Back</span>
                                   </button>

                                   <a
                                        href="/student-search-page"
                                        className='flex items-center cursor-pointer gap-2 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm sm:text-base'
                                   >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span className='font-medium'>Search Student</span>
                                   </a>
                              </div>

                              {/* Main Title */}
                              <div className='flex items-center justify-center gap-2 sm:gap-3'>
                                   <div className='bg-red-100 p-2 sm:p-3 rounded-lg sm:rounded-xl'>
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                   </div>
                                   <div className='text-center'>
                                        <h1 className='text-xl sm:text-3xl font-bold text-red-800'>Student Registration</h1>
                                        <p className='text-red-600 mt-1 text-sm sm:text-base'>Create a new student account</p>
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Main Form */}
                    <div className='bg-white/90 backdrop-blur-md rounded-lg sm:rounded-2xl shadow-xl border border-red-100 overflow-hidden'>
                         <div className='bg-gradient-to-r from-red-800 to-red-900 px-3 py-2 sm:px-6 sm:py-4'>
                              <h2 className='text-lg sm:text-xl font-semibold text-white'>Student Information</h2>
                              <p className='text-red-100 text-xs sm:text-sm'>Please fill in all required fields</p>
                         </div>

                         <form onSubmit={handleSubmit} className='p-3 sm:p-6 lg:p-8'>
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6'>
                                   {/* Username */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Username *
                                        </label>
                                        <div className='relative'>
                                             <input
                                                  type='text'
                                                  name='username'
                                                  value={formData.username}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.username
                                                       ? 'border-red-300 bg-red-50'
                                                       : 'border-red-200 focus:border-red-500'
                                                       }`}
                                                  placeholder='Enter username'
                                             />
                                             <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                  </svg>
                                             </div>
                                        </div>
                                        {errors.username && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors.username}</p>}
                                   </div>

                                   {/* Full Name */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Full Name *
                                        </label>
                                        <div className='relative'>
                                             <input
                                                  type='text'
                                                  name='name'
                                                  value={formData.name}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.name
                                                       ? 'border-red-300 bg-red-50'
                                                       : 'border-red-200 focus:border-red-500'
                                                       }`}
                                                  placeholder='Enter full name'
                                             />
                                             <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                  </svg>
                                             </div>
                                        </div>
                                        {errors.name && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors.name}</p>}
                                   </div>

                                   {/* Department */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Department *
                                        </label>
                                        <select
                                             name='department'
                                             value={formData.department}
                                             onChange={handleInputChange}
                                             className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.department
                                                  ? 'border-red-300 bg-red-50'
                                                  : 'border-red-200 focus:border-red-500'
                                                  }`}
                                        >
                                             <option value=''>Select Department</option>
                                             {departmentsData && Object.keys(departmentsData).map(dept => (
                                                  <option key={dept} value={dept}>{dept}</option>
                                             ))}
                                        </select>
                                        {errors.department && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors.department}</p>}
                                   </div>

                                   {/* Degree */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Degree *
                                        </label>
                                        <select
                                             name='degree'
                                             value={formData.degree}
                                             onChange={handleInputChange}
                                             className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.degree
                                                  ? 'border-red-300 bg-red-50'
                                                  : 'border-red-200 focus:border-red-500'
                                                  }`}
                                        >
                                             <option value=''>Select Degree</option>
                                             {formArray.degrees && formArray.degrees.map(deg => (
                                                  <option key={deg} value={deg}>{deg}</option>
                                             ))}
                                        </select>
                                        {errors.degree && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors.degree}</p>}
                                   </div>

                                   {/* Year */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Year *
                                        </label>
                                        <select
                                             name='year'
                                             value={formData.year}
                                             onChange={handleInputChange}
                                             className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.year
                                                  ? 'border-red-300 bg-red-50'
                                                  : 'border-red-200 focus:border-red-500'
                                                  }`}
                                        >
                                             <option value=''>Select Year</option>
                                             {formArray.years && formArray.years.map(year => (
                                                  <option key={year} value={year}>{year}</option>
                                             ))}
                                        </select>
                                        {errors.year && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors.year}</p>}
                                   </div>

                                   {/* Branch */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Branch *
                                        </label>
                                        <select
                                             name='branch'
                                             value={formData.branch}
                                             onChange={handleInputChange}
                                             className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.branch
                                                  ? 'border-red-300 bg-red-50'
                                                  : 'border-red-200 focus:border-red-500'
                                                  }`}
                                        >
                                             <option value=''>Select Branch</option>
                                             {formArray.branches && formArray.branches.map(branch => (
                                                  <option key={branch} value={branch}>{branch}</option>
                                             ))}
                                        </select>
                                        {errors.branch && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors.branch}</p>}
                                   </div>

                                   {/* Phone */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Phone Number *
                                        </label>
                                        <div className='relative'>
                                             <input
                                                  type='tel'
                                                  name='phone'
                                                  value={formData.phone}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.phone
                                                       ? 'border-red-300 bg-red-50'
                                                       : 'border-red-200 focus:border-red-500'
                                                       }`}
                                                  placeholder='Enter phone number'
                                             />
                                             <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                  </svg>
                                             </div>
                                        </div>
                                        {errors.phone && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors.phone}</p>}
                                   </div>
                                   {/* Email */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Email *
                                        </label>
                                        <div className='relative'>
                                             <input
                                                  type='tel'
                                                  name='email'
                                                  value={formData.email}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.email
                                                       ? 'border-red-300 bg-red-50'
                                                       : 'border-red-200 focus:border-red-500'
                                                       }`}
                                                  placeholder='Enter phone number'
                                             />
                                             <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                  </svg>
                                             </div>
                                        </div>
                                        {errors.email && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors.email}</p>}
                                   </div>

                                   {/* Password */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Password *
                                        </label>
                                        <div className='relative'>
                                             <input
                                                  type={showPassword ? 'text' : 'password'}
                                                  name='password'
                                                  value={formData.password}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.password
                                                       ? 'border-red-300 bg-red-50'
                                                       : 'border-red-200 focus:border-red-500'
                                                       }`}
                                                  placeholder='Enter password'
                                             />
                                             <button
                                                  type='button'
                                                  onClick={() => setShowPassword(!showPassword)}
                                                  className='cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-red-400 hover:text-red-600'
                                             >
                                                  {showPassword ? (
                                                       <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                       </svg>
                                                  ) : (
                                                       <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                       </svg>
                                                  )}
                                             </button>
                                        </div>
                                        {errors.password && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors.password}</p>}
                                   </div>

                                   {/* Confirm Password */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Confirm Password *
                                        </label>
                                        <div className='relative'>
                                             <input
                                                  type={showConfirmPassword ? 'text' : 'password'}
                                                  name='confirmPassword'
                                                  value={formData.confirmPassword}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.confirmPassword
                                                       ? 'border-red-300 bg-red-50'
                                                       : 'border-red-200 focus:border-red-500'
                                                       }`}
                                                  placeholder='Confirm password'
                                             />
                                             <button
                                                  type='button'
                                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                  className='cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-red-400 hover:text-red-600'
                                             >
                                                  {showConfirmPassword ? (
                                                       <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                       </svg>
                                                  ) : (
                                                       <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                       </svg>
                                                  )}
                                             </button>
                                        </div>
                                        {errors.confirmPassword && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors.confirmPassword}</p>}
                                   </div>

                                   {/* Photo URL (Optional) */}
                                   <div className='md:col-span-2'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Profile Photo URL (Optional)
                                        </label>
                                        <div className='relative'>
                                             <input
                                                  type='url'
                                                  name='photo'
                                                  value={formData.photo}
                                                  onChange={handleInputChange}
                                                  className='w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-red-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-sm sm:text-base'
                                                  placeholder='Enter photo URL'
                                             />
                                             <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                  </svg>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              <div>
                                   {apiErrors?.error2?.map((err, index) => (
                                        <p key={index} className='text-red-700'>{err}</p>
                                   ))}
                              </div>
                              {/* Submit Button */}
                              <div className='mt-4 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4'>
                                   <button
                                        type='button'
                                        onClick={() => {
                                             setFormData({
                                                  username: '',
                                                  name: '',
                                                  department: '',
                                                  degree: '',
                                                  year: '',
                                                  branch: '',
                                                  password: '',
                                                  confirmPassword: '',
                                                  phone: '',
                                                  photo: '',
                                                  role: 'student'
                                             });
                                             setErrors({});
                                        }}
                                        className='cursor-pointer flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 border-2 border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 hover:border-red-300 text-sm sm:text-base'
                                   >
                                        Reset Form
                                   </button>

                                   <button
                                        type='submit'
                                        disabled={isSubmitting}
                                        className={`cursor-pointer flex-1 px-4 py-2 sm:px-8 text-white sm:py-3 rounded-lg sm:rounded-xl font-semibold shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base ${isSubmitting
                                             ? 'bg-gradient-to-r from-slate-400 to-slate-500 cursor-not-allowed'
                                             : 'bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800'
                                             }`}
                                   >
                                        {isSubmitting ? (
                                             <>
                                                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                  <span>Registering...</span>
                                             </>
                                        ) : (
                                             <div className='flex items-center gap-2'>
                                                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                  </svg>
                                                  <span>Register Student</span>
                                             </div>
                                        )}
                                   </button>
                              </div>

                              {/* Helper Text */}
                              <div className='mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl'>
                                   <div className='flex items-start gap-2 sm:gap-3'>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                             <h4 className='font-semibold text-red-800 mb-1 text-sm sm:text-base'>Registration Information</h4>
                                             <ul className='text-xs sm:text-sm text-red-700 space-y-1'>
                                                  <li>• All fields marked with * are required</li>
                                                  <li>• Username must be unique and at least 5 characters long</li>
                                                  <li>• Password must be at least 6 characters long</li>
                                                  <li>• Phone number should be a valid 10-digit number</li>
                                             </ul>
                                        </div>
                                   </div>
                              </div>
                         </form>
                    </div>
               </div>
          </div>
     );
}