import React, { useContext } from 'react'
import SubmitAttendance from './components/LectureCards.jsx'
import AttendanceCalendar, { LectureAttendanceCalendar } from '../Student-Modules/components/monthlyCom.jsx'
import StudentProfileDashboard from '../Student-Modules/components/profileSectionCom.jsx'


const componentBG = `bg-gray-100`;
const nestedComponentBG = `bg-blue-100`;

function dashboard() {

  console.log(new Date(2025, 11, 1));

  return (
    <div className='flex justify-center bg-white smp-10'>
      <div className="grid p-0 sm:p-4 gap-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 ">
          <div className="  rounded-xs min-h-[200px] flex flex-col justify-center items-center border-[1px] border-gray-300">
            <StudentProfileDashboard componentBG={componentBG} nestedComponentBG={nestedComponentBG} />
            {/* <div className="text-center rounded-3xl"> */}
            {/* </div> */}
            {/* <p className="text-lg font-semibold">Profile Section</p>
                                   <p className="text-sm">(Coming soon)</p> */}
          </div>
          <div className="bg-gray-300 rounded-xs min-h-[200px] flex flex-col justify-center items-center border-[1px] border-gray-300">
            <div className="text-center">
              {/* <WeeklyAttendanceComponent></WeeklyAttendanceComponent> */}
              <p className="text-lg font-semibold">Academic Performance</p>
              <p className="text-sm">(Coming soon)</p>
            </div>
          </div>
        </div>

        {/* ===== ATTENDANCE SUBMISSION CARD ===== */}
        <div className="mt-4">
          <div className="sm:p-4 bg-gray-300 rounded-xs min-h-[200px] flex justify-center">
            <SubmitAttendance componentBG={componentBG} />
          </div>
        </div>

        {/* ===== WEEKLY RECORD SECTION ====  = */}
        <div className="sm:rounded-xs min-h-[200px] ">
          {/* <div className="text-center "> */}
          <LectureAttendanceCalendar componentBG={componentBG}></LectureAttendanceCalendar>
          {/* </div> */}
        </div>
        <div className="grid md:grid-cols-1 gap-0 justify-center items-center bg-gray-300 sm:rounded-xs">
          <div className=''>
            <AttendanceCalendar componentBG={componentBG}></AttendanceCalendar>
          </div>
        </div>
      </div >
    </div >
  );

  // return (
  //      <div>
  //           {/* <p>Hello this is student Dashboard</p> */}
  //           <div>
  //                <div className='grid grid-cols-1 md:grid-cols-2 p-4 gap-x-2 '>
  //                     <div className='p-4 bg-gray-300 h-[40vh] w-[30vw] rounded-3xl '>
  //                          <div>
  //                               this is profile section
  //                               <p className='text-sm'>Coming soon</p>
  //                          </div>
  //                     </div>
  //                     <div className='p-4 bg-gray-300 h-[40vh] w-[70vw] rounded-3xl' >
  //                          <div>
  //                               This is Academic Performance section
  //                               <p className='text-sm'>Coming soon</p>
  //                          </div>
  //                     </div>
  //                </div>
  //                <div className='p-4 flex gap-x-2 w-[100vw] '>
  //                     <div className='p-4 bg-gray-300 rounded-3xl' >
  //                          <div>
  //                               <SubmitAttendance />
  //                          </div>
  //                     </div>
  //                </div>
  //                <div className='p-4 flex gap-x-2 '>
  //                     <div className='p-4 bg-gray-300 h-[40vh] w-[100vw] rounded-3xl' >
  //                          <div>
  //                               This is Attendance weekly Record section
  //                               <p className='text-sm'>Coming soon</p>
  //                          </div>
  //                     </div>
  //                </div>
  //           </div>

  //      </div>
  // )
}
export { dashboard };
