import React, { useState } from 'react';
import axios from 'axios';
export default function TeacherRegistration() {
     const [formData, setFormData] = useState({
          name: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          photo: '',
          qualification: ''
     });

     const [isSubmitting, setIsSubmitting] = useState(false);
     const [errors, setErrors] = useState({});
     const [resMsg, setResMsg] = useState({});
     const [showPassword, setShowPassword] = useState(false);
     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

          // Name validation
          if (!formData.name.trim()) {
               newErrors.name = 'Full name is required';
          } else if (formData.name.trim().length < 2) {
               newErrors.name = 'Name must be at least 2 characters';
          } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
               newErrors.name = 'Name can only contain letters and spaces';
          }

          // Username validation
          if (!formData.username.trim()) {
               newErrors.username = 'Username is required';
          } else if (formData.username.length < 3) {
               newErrors.username = 'Username must be at least 3 characters';
          } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
               newErrors.username = 'Username can only contain letters, numbers, and underscores';
          }

          // Email validation (optional but if provided, must be valid)
          if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
               newErrors.email = 'Please enter a valid email address';
          }

          // Password validation
          if (!formData.password) {
               newErrors.password = 'Password is required';
          } else if (formData.password.length < 8) {
               newErrors.password = 'Password must be at least 8 characters';
          } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
               newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
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

          // Photo URL validation (optional)
          if (formData.photo && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.photo)) {
               newErrors.photo = 'Please enter a valid image URL';
          }

          // Qualification validation (optional)
          if (formData.qualification && formData.qualification.length > 200) {
               newErrors.qualification = 'Qualification must be less than 200 characters';
          }

          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (!validateForm()) {
               // Simple alert for validation errors - you can replace with toast
               alert('Please fix the errors in the form');
               return;
          }

          setIsSubmitting(true);

          try {
               // Prepare data as per server requirements
               const payload = {
                    name: formData?.name.trim(),
                    username: formData?.username.toLowerCase().trim(),
                    email: formData?.email ? formData.email.toLowerCase().trim() : undefined,
                    password: formData?.password,
                    phone: parseInt(formData?.phone.replace(/\D/g, '')),
                    photo: formData?.photo?.trim() || undefined,
                    qualification: formData?.qualification?.trim() || undefined
               };

               // API call to register teacher
               const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/teacher/register`, payload, { withCredentials: true });
               console.log(response);
               if (response.status == 200) {
                    setResMsg(prev => ({
                         ...prev,
                         error1: response.data.message
                    }))
                    // Reset form
                    setFormData({
                         name: '',
                         username: '',
                         email: '',
                         password: '',
                         confirmPassword: '',
                         phone: '',
                         photo: '',
                         qualification: ''
                    });
                    setErrors({});
               } else {
                    console.log("Register teacher error : ", response);

                    setResMsg(prev => ({
                         ...prev,
                         error1: response.data.message
                    }))
                    alert(response.data.message || 'Registration failed');
               }
          } catch (error) {
               console.log(error.response.data);
               setResMsg(prev => ({
                    ...prev,
                    error1: error.response.data?.message,
                    error2: error.response.data?.errors
               }))
               alert(error.response.data?.message);
          } finally {
               setIsSubmitting(false);
               setTimeout(() => {
                    setResMsg(prev => ({
                         ...prev,
                         error1: "",
                         error2: ""
                    }))
               }, 10000)
          }
     };

     const handleGoBack = () => {
          window.history.back();
     };

     return (
          <div className='min-h-screen bg-gradient-to-br from-slate-50 to-red-50 py-2 sm:py-4'>
               <div className='max-w-4xl mx-auto px-2 sm:px-4 lg:px-6'>
                    {/* Header with Go Back Button */}
                    <div className='mb-3 sm:mb-6'>
                         <div className='bg-white/90 backdrop-blur-md rounded-lg sm:rounded-2xl shadow-lg border border-red-100 p-3 sm:p-6'>
                              {/* Top Navigation Bar */}
                              <div className='flex items-center justify-between mb-3 sm:mb-4'>
                                   <button
                                        onClick={handleGoBack}
                                        className='flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm sm:text-base'
                                   >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span className='font-medium'>Go Back</span>
                                   </button>

                                   <div className='flex items-center gap-3 text-red-600'>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                        <span className='text-sm font-medium'>Teacher Portal</span>
                                   </div>
                              </div>

                              {/* Main Title */}
                              <div className='flex items-center justify-center gap-2 sm:gap-3'>
                                   <div className='bg-red-100 p-2 sm:p-3 rounded-lg sm:rounded-xl'>
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                   </div>
                                   <div className='text-center'>
                                        <h1 className='text-xl sm:text-3xl font-bold text-red-800'>Teacher Registration</h1>
                                        <p className='text-red-600 mt-1 text-sm sm:text-base'>Create a new teacher account</p>
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Main Form */}
                    <div className='bg-white/90 backdrop-blur-md rounded-lg sm:rounded-2xl shadow-xl border border-red-100 overflow-hidden'>
                         <div className='bg-gradient-to-r from-red-800 to-red-900 px-3 py-2 sm:px-6 sm:py-4'>
                              <h2 className='text-lg sm:text-xl font-semibold text-white'>Teacher Information</h2>
                              <p className='text-red-100 text-xs sm:text-sm'>Please fill in all required fields</p>
                         </div>

                         <form onSubmit={handleSubmit} className='p-3 sm:p-6 lg:p-8'>
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6'>
                                   {/* Full Name */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Full Name *
                                        </label>
                                        <div className='relative'>
                                             <input
                                                  type='text'
                                                  name='name'
                                                  value={formData?.name}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.name
                                                       ? 'border-red-300 bg-red-50'
                                                       : 'border-red-200 focus:border-red-500'
                                                       }`}
                                                  placeholder='Enter full name'
                                             />
                                             <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                  </svg>
                                             </div>
                                        </div>
                                        {errors?.name && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors?.name}</p>}
                                   </div>

                                   {/* Username */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Username *
                                        </label>
                                        <div className='relative'>
                                             <input
                                                  type='text'
                                                  name='username'
                                                  value={formData?.username}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.username
                                                       ? 'border-red-300 bg-red-50'
                                                       : 'border-red-200 focus:border-red-500'
                                                       }`}
                                                  placeholder='Enter username'
                                             />
                                             <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                  </svg>
                                             </div>
                                        </div>
                                        {errors?.username && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors?.username}</p>}
                                   </div>

                                   {/* Email (Optional) */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Email Address (Optional)
                                        </label>
                                        <div className='relative'>
                                             <input
                                                  type='email'
                                                  name='email'
                                                  value={formData?.email}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.email
                                                       ? 'border-red-300 bg-red-50'
                                                       : 'border-red-200 focus:border-red-500'
                                                       }`}
                                                  placeholder='Enter email address'
                                             />
                                             <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                  </svg>
                                             </div>
                                        </div>
                                        {errors.email && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors?.email}</p>}
                                   </div>

                                   {/* Phone Number */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Phone Number *
                                        </label>
                                        <div className='relative'>
                                             <input
                                                  type='tel'
                                                  name='phone'
                                                  value={formData?.phone}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.phone
                                                       ? 'border-red-300 bg-red-50'
                                                       : 'border-red-200 focus:border-red-500'
                                                       }`}
                                                  placeholder='Enter 10-digit phone number'
                                             />
                                             <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                  </svg>
                                             </div>
                                        </div>
                                        {errors?.phone && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors?.phone}</p>}
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
                                                  value={formData?.password}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.password
                                                       ? 'border-red-300 bg-red-50'
                                                       : 'border-red-200 focus:border-red-500'
                                                       }`}
                                                  placeholder='Enter strong password'
                                             />
                                             <button
                                                  type='button'
                                                  onClick={() => setShowPassword(!showPassword)}
                                                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-red-400 hover:text-red-600'
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
                                                  placeholder='Confirm your password'
                                             />
                                             <button
                                                  type='button'
                                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-red-400 hover:text-red-600'
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

                                   {/* Profile Photo URL (Optional) */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Profile Photo URL (Optional)
                                        </label>
                                        <div className='relative'>
                                             <input
                                                  type='url'
                                                  name='photo'
                                                  value={formData.photo}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.photo
                                                       ? 'border-red-300 bg-red-50'
                                                       : 'border-red-200 focus:border-red-500'
                                                       }`}
                                                  placeholder='Enter photo URL'
                                             />
                                             <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                  </svg>
                                             </div>
                                        </div>
                                        {errors.photo && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors.photo}</p>}
                                   </div>

                                   {/* Qualification (Optional) */}
                                   <div className='md:col-span-1'>
                                        <label className='block text-sm font-semibold text-red-800 mb-1 sm:mb-2'>
                                             Qualification (Optional)
                                        </label>
                                        <div className='relative'>
                                             <input
                                                  type='text'
                                                  name='qualification'
                                                  value={formData.qualification}
                                                  onChange={handleInputChange}
                                                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base ${errors.qualification
                                                       ? 'border-red-300 bg-red-50'
                                                       : 'border-red-200 focus:border-red-500'
                                                       }`}
                                                  placeholder='e.g., M.Tech Computer Science'
                                             />
                                             <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                  </svg>
                                             </div>
                                        </div>
                                        {errors.qualification && <p className='text-red-600 text-xs sm:text-sm mt-1'>{errors.qualification}</p>}
                                   </div>
                              </div>
                              <div>
                                   <p className='p-2 text-sm text-red-700'>{resMsg?.error1}</p>
                                   <div>
                                        <p className='p-2 text-sm text-red-700'>{resMsg?.error1}</p>

                                        {resMsg?.error2 && (
                                             <div className='p-2 text-sm text-red-700'>
                                                  {typeof resMsg.error2 === 'string'
                                                       ? resMsg.error2
                                                       : Object.entries(resMsg.error2).map(([key, value]) => (
                                                            <p key={key}>{key}: {value}</p>
                                                       ))
                                                  }
                                             </div>
                                        )}
                                   </div>
                                   {/* <p className='p-2 text-sm text-red-700'>{resMsg?.error2 && resMsg?.error2}</p> */}
                              </div>
                              {/* Submit Button */}
                              <div className='mt-4 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4'>
                                   <button
                                        type='button'
                                        onClick={() => {
                                             setFormData({
                                                  name: '',
                                                  username: '',
                                                  email: '',
                                                  password: '',
                                                  confirmPassword: '',
                                                  phone: '',
                                                  photo: '',
                                                  qualification: ''
                                             });
                                             setErrors({});
                                        }}
                                        className='flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 border-2 border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 hover:border-red-300 text-sm sm:text-base'
                                   >
                                        Reset Form
                                   </button>

                                   <button
                                        type='submit'
                                        disabled={isSubmitting}
                                        className={`flex-1 px-4 py-2 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl font-semibold bg-red-800 text-white font-medium shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center`}
                                   >
                                        Create a New Teacher
                                   </button>
                              </div>
                         </form>
                    </div>
               </div>
          </div>
     );
};