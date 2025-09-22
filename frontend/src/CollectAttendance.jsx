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
               <div className='max-w-7xl mx-auto'>
                    {/* Compact Header with Back Button */}
                    <div className='border-b-2 border-red-800'>
                         <div className='rounded-2xl  p-1 sm:p-6'>
                              <div className='relative flex flex-col md:flex md:flex-row  gap-2'>
                                   <button
                                        onClick={handleGoBack}
                                        className='flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-red-100 hover:bg-red-200 text-red-800 hover:text-red-800 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2'
                                        title="Go back"
                                   >
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                   </button>
                                   <div className='flex items-center gap-2 pl-3'>
                                        <div>
                                             <h1 className="text-2xl sm:text-3xl font-bold text-[#800000] mb-1">
                                                  {`Teacher's All Lectures`}
                                             </h1>
                                             <p className='text-sm sm:text-base text-[#800000]'>
                                                  Manage classes, attendance, and student records
                                             </p>
                                        </div>
                                   </div>
                                   <div className='absolute top-1 right-5 flex items-center gap-3 text-sm'>
                                        <div className='flex items-center gap-2 bg-red-100 px-3 py-2 rounded-lg'>
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