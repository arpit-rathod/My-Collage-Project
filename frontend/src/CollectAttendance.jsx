// Parent Component - CollectAttendance.jsx
import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import './CollectAttendance.css'

export default function CollectAttendance(props) {
     const navigate = useNavigate();
     const location = useLocation();

     const handleGoBack = () => {
          if (window.history.length > 1) {
               navigate(-1); // Go back to previous page
          } else {
               navigate('/'); // Fallback to home if no history
          }
     };

     return (
          <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    {/* Compact Header with Back Button */}
                    <div className='py-6 sm:py-8'>
                         <div className=' rounded-2xl  p-4 sm:p-6'>
                              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                                   <div className='flex items-center gap-4'>
                                        {/* Back Arrow Button */}
                                        <button
                                             onClick={handleGoBack}
                                             className='flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-maroon-100 hover:bg-maroon-200 text-maroon-700 hover:text-maroon-800 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-maroon-300 focus:ring-offset-2'
                                             title="Go back"
                                        >
                                             <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                             </svg>
                                        </button>

                                        <div>
                                             <h1 className="text-2xl sm:text-3xl font-bold text-[#800000] mb-1">
                                                  Teacher Dashboard
                                             </h1>
                                             <p className='text-sm sm:text-base text-[#800000]'>
                                                  Manage classes, attendance, and student records
                                             </p>
                                        </div>
                                   </div>

                                   <div className='flex items-center gap-3 text-sm'>
                                        <div className='flex items-center gap-2 bg-maroon-100 px-3 py-2 rounded-lg'>
                                             <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                                             <span className='text-maroon-700 font-medium'>Online</span>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Main Content Area */}
                    <div className='pb-5'>
                         <Outlet />
                    </div>
               </div>
          </div>
     )
}