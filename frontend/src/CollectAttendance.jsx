import React from 'react'
import { Outlet } from 'react-router-dom'
import './CollectAttendance.css'
export default function CollectAttendance(props) {

     return (
          <div className='container1 w-full min-h-screen bg-blue-100 md:p-15'>
               {/* <h1>Hello world</h1> */}
               <div className='container2  bg-indigo-200 min-h-screen md:rounded-2xl p-[2rem]'>
                    <h1 className="heading align-middle font-bold text-3xl text-emerald-800">Collect Attendance</h1>
                    <Outlet></Outlet>

               </div>
          </div>
     )
}
