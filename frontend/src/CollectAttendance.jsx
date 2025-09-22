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
          <div className='min-h-screen  '>
               <div className='max-w-7xl mx-auto'>
                    {/* Compact Header with Back Button */}
                    {/* Header */}
                    <div className=' bg-red-800'>
                         <div className='flex flex-col sm:flex-row sm:place-items-center p-[2px] sm:p-4'>
                              <button
                                   onClick={handleGoBack}
                                   className='flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-red-100 hover:bg-red-200 text-red-800 hover:text-red-800 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2'
                                   title="Go back"
                              >
                                   <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                   </svg>
                              </button>
                              <div className='flex items-center justify-center text-white gap-2 pl-3'>
                                   {/* <div className='bg-maroon-100 p-3 rounded-xl'>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                   </div> */}
                                   <div >
                                        <h1 className='text-2xl font-bold'>Teacher&apos;s All Lectures</h1>
                                        <p className='text-sm'>Manage classes, attendance,</p>
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