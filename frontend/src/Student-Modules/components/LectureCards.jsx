// module for submitting attendance student side
import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react'
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Outlet, useNavigate } from 'react-router-dom';
import FullPageSpinner from '../../animation-components/spinner';

export default function SubmitAttendance({ componentBG }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [lecturesData, setLecturesData] = useState(null);
  const [subjectsData, setSubjectsData] = useState(null);
  const [lecturesDataLoading, setLecturesDataIsLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, present: 0, running: 0, completed: 0 });
  const [studentInfo, setStudentInfo] = useState({ name: null, username: null })
  useEffect(() => {
    async function fetchLectures() {
      console.log("Fetching lectures... for student");
      try {
        setLecturesDataIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/student-lectures`, {
          withCredentials: true,
        });
        if (response.status == 200) {
          console.log("lectures information fetched");
          console.log(response.data);
          setStudentInfo((pre) => {
            pre.name = response?.data?.lectureObject.name.toUpperCase();
            pre.username = response.data.lectureObject.username.toUpperCase();
            return pre;
          });
          setLecturesData(response.data?.lectureObject);
          setSubjectsData(response.data?.lectureObject?.subjectsData);
          // Calculate statistics
          const subjects = response.data?.lectureObject?.subjectsData || [];
          const stats = subjects.reduce((acc, subject) => {
            acc.total++;
            if (subject.studentStatus === 'present') acc.present++;
            if (subject.status === 'running') acc.running++;
            if (subject.status === 'complete') acc.completed++;
            return acc;
          }, { total: 0, present: 0, running: 0, completed: 0 });
          setStats(stats);
        } else {
          console.log("No lecture information found");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch lectures");
      } finally {
        setLecturesDataIsLoading(false);
      }
    }
    fetchLectures();
  }, []);

  const handleOpenModal = (lecture) => {
    setSelectedLecture(lecture);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLecture(null);
  };

  const updateSubjectStatus = (subCode, newStatus) => {
    setSubjectsData(prevData => {
      const updated = prevData.map(subject =>
        subject.subCode === subCode
          ? { ...subject, studentStatus: newStatus }
          : subject
      );

      // Recalculate stats
      const newStats = updated.reduce((acc, subject) => {
        acc.total++;
        if (subject.studentStatus === 'present') acc.present++;
        if (subject.status === 'running') acc.running++;
        if (subject.status === 'complete') acc.completed++;
        return acc;
      }, { total: 0, present: 0, running: 0, completed: 0 });
      setStats(newStats);

      return updated;
    });
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Go back to previous page
    } else {
      navigate('/'); // Fallback to home if no history
    }
  };
  if (lecturesDataLoading) {
    return (
      <div className='flex justify-center items-center bg-gradient-to-br from-slate-50 to-red-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4'></div>
          <h1 className='text-xl font-semibold text-red-800'>Loading your classes...</h1>
          <p className='text-red-600 mt-2'>Please wait</p>
        </div>
      </div>
    );
  }

  if (!lecturesData || !subjectsData) {
    return (
      <div className='flex justify-center items-center bg-gradient-to-br from-slate-50 to-red-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4'></div>
          <h1 className='text-xl font-semibold text-red-800'>Loading your classes...</h1>
          <p className='text-red-600 mt-2'>Please wait</p>
        </div>
      </div>
    );
  }

  if (!lecturesData || !subjectsData) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-red-50'>
        <div className='text-center'>
          <div className='bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-slate-700 mb-2'>No Classes Found</h3>
          <p className='text-slate-500'>You are not enrolled in any classes yet</p>
        </div>
      </div>
    );
  }
  const profileStyle = `bg-red-50 rounded-full font-medium bg-transparent`
  return (
    <div className={`w-[94vw] max-w-7xl ${componentBG}`}>
      <div className=''>
        {/* Header Section */}
        {/* rounded-2xl shadow-lg border border-red-100 */}
        <div className=''>
          {/* Quick Stats */}
          <div className='     m-1 rounded-2xl'>
            <div className="flex gap-1 md:gap-4 m-0 md:m-2 ">
              <div className="p-1 pr-2 gap-x-1 flex items-center justify-center md:text-xl text-center bg-gradient-to-br from-red-500 to-red-900 text-white rounded-xl">
                <div className="text-xs text-red-100 content-center gap-1 p-2">Total Classes</div>
                <div className="">{stats.total}</div>
              </div>
              <div className="p-1 pr-2 gap-x-1 flex items-center justify-center md:text-xl text-center bg-gradient-to-br from-green-500 to-green-900 text-white rounded-xl">
                <div className="text-xs text-green-100">Present</div>
                <div className="">{stats.present}</div>
              </div>
              <div className="p-1 pr-2 gap-x-1 flex items-center justify-center md:text-xl text-center bg-gradient-to-br from-blue-500 to-blue-900 text-white rounded-xl">
                <div className="text-xs text-blue-100">Live Now</div>
                <div className="">{stats.running}</div>
              </div>
              <div className="p-1 pr-2 gap-x-1 flex items-center justify-center md:text-xl text-center bg-gradient-to-br from-slate-500 to-slate-900 text-white rounded-xl">
                <div className="text-xs text-slate-100">Completed</div>
                <div className="">{stats.completed}</div>
              </div>
            </div>
          </div>
        </div>


        {/* Subjects Grid */}
        {/*  lg:grid-cols-3 xl:grid-cols-4 */}
        {subjectsData.length != 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-2">
            {subjectsData?.map((item, index) => (
              <LectureCard
                key={index}
                item={item}
                onClick={() => handleOpenModal(item)}
              />
            ))}
          </div>
        ) : (
          <div className='text-center mb-8'>
            <div className='bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-red-300 p-6'>
              <div className='flex items-center justify-center gap-3 mb-4'>
                <div className='bg-red-100 p-3 rounded-xl'>
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /> */}
                  </svg>
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-red-800'>No Lectures Allocated yet</h1>
                  <p className='text-red-600 mt-1'>wait for your instructor to allocate lectures</p>
                </div>
              </div>
            </div>
          </div>
        )
        }
      </div>
      {/* Modal Component */}
      {showModal && selectedLecture && (
        <ModalForSubmitAttendance
          lecture={selectedLecture}
          onClose={handleCloseModal}
          onSuccess={(subCode) => updateSubjectStatus(subCode, 'present')}
        />
      )}
      <Outlet />
    </div>
  )
}

// Enhanced Lecture Card Component
function LectureCard({ item, onClick }) {
  console.log(item);
  const studentStatus = item.studentStatus;
  const lectureStatus = item.status;

  const getStatusConfig = () => {
    if (lectureStatus === 'running') {
      if (studentStatus === 'present') {
        return {
          border: 'border-l-4 border-green-500',
          badge: 'bg-green-100 text-green-800 border-green-200',
          icon: '✅',
          action: null,
          statusBorder: 'border-l border-green-500 bg-gradient-to-br from-green-50 to-green-300'
        };
      } else {
        return {
          border: 'border-l-4 border-blue-500',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: '🟢',
          action: 'Mark Present',
          statusBorder: 'border-l border-green-50 bg-gradient-to-br from-green-50 to-green-300'
        };
      }
    } else if (lectureStatus === 'complete') {
      return {
        border: studentStatus === 'present' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500',
        badge: 'bg-slate-100 text-slate-600 border-slate-200',
        icon: studentStatus === 'present' ? '✅' : '❌',
        action: null,
        statusBorder: 'border-l border-black-900 bg-gradient-to-br from-gray-50 to-gray-400'
      };
    } else {
      return {
        border: 'border-l-4 border-amber-500',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: '⏳',
        action: null,
        statusBorder: 'border-l border-amber-500 bg-gradient-to-br from-amber-50 to-amber-300'
      };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md border-1 border-red-900 ${config.border} transition-all duration-200 transform hover:-translate-y-1 hover:scale-102 overflow-hidden h-48`}>
      <div className="p-2 md:p-4 h-full flex flex-col">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${config.badge} ${config.statusBorder}`}>
            {lectureStatus.toUpperCase()}
          </div>
          <span className="text-lg">{config.icon}</span>
        </div>

        {/* Subject Info */}
        <div className="flex-1 mb-3">
          <h3 className="font-bold text-[#800000] text-base mb-1 line-clamp-2">
            {item.subName}
          </h3>
          <p className="text-sm text-red-600 font-mono mb-1">
            {item.subCode}
          </p>
          <p className="text-xs text-slate-600 truncate">
            {item.teacher}
          </p>
        </div>

        {/* Status Display */}
        <div className="mt-auto">
          {lectureStatus === 'running' && studentStatus === 'present' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
              <span className="text-green-800 font-medium text-sm">Present</span>
            </div>
          )}

          {lectureStatus === 'running' && studentStatus !== 'present' && (
            <button
              onClick={onClick}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-3 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Mark Present
            </button>
          )}

          {lectureStatus === 'complete' && (
            <div className={`border rounded-lg p-2 text-center ${studentStatus === 'present'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
              }`}>
              <span className={`font-medium text-sm ${studentStatus === 'present'
                ? 'text-green-800'
                : 'text-red-800'
                }`}>
                {studentStatus === 'present' ? 'Present' : 'Absent'}
              </span>
            </div>
          )}

          {lectureStatus === 'pending' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
              <span className="text-amber-800 font-medium text-sm">Pending</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced Modal Component
function ModalForSubmitAttendance({ lecture, onClose, onSuccess }) {
  const [processing, setProcessing] = useState("idle");
  const [attendanceCode, setAttendanceCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!attendanceCode || attendanceCode.length < 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setProcessing("loading");

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/submit-attendance`, {
        verificationPin: attendanceCode,
        subCode: lecture.subCode,
        classId: lecture.classId,
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log(response.data);
        setProcessing("success");
        toast.success("Successfully marked present!");
        onSuccess(lecture.subCode);
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error) {
      if (error.response.status === 404) {
        toast.error("Invalid PIN code");
        setProcessing("error");
      } else if (error.response.status === 400) {
        toast.error("Class not found");
        setProcessing("error");
      }
      console.error("Attendance submission error:", error);
      setProcessing("error");
    }

    if (processing !== "success") {
      setTimeout(() => {
        setProcessing("idle");
        setAttendanceCode('');
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className='text-red-800 grid-cols-1 justify-center'>
              <h2 className="text-xl font-bold">Mark Attendance</h2>
              <p className=" text-sm">Enter the code from your teacher</p>
            </div>
            <button
              onClick={onClose}
              className="absolute right-3 top-3 text-red-800 hover:text-white bg-red-500/30 hover:bg-red-500/50 rounded-lg p-1 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-2 md:p-5">
          {/* Subject Info */}
          <div className="bg-red-50 rounded-xl p-1 md:p-3 border border-red-100">
            <h3 className="text-lg font-bold text-red-800 mb-1">{lecture.subName}</h3>
            <div className="flex items-center justify-between text-sm text-red-800 font-mono">
              <span className="">{lecture.subCode}</span>
              <span className="">{lecture.teacher}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-red-800 mb-3">
                Attendance PIN
              </label>
              <input
                type="number"
                value={attendanceCode}
                onChange={(e) => setAttendanceCode(e.target.value)}
                className="w-full px-4 py-3 text-center text-xl font-mono border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                placeholder="000000"
                maxLength="6"
                disabled={processing === "loading"}
                required
              />
              <p className="text-xs text-slate-500 text-center mt-2">
                Enter the 6-digit code shown by your teacher
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-red-700 bg-red-100 hover:bg-red-200 rounded-xl font-semibold transition-colors"
                disabled={processing === "loading"}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing === "loading" || !attendanceCode}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${processing === "idle" && attendanceCode
                  ? "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  : processing === "loading"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 cursor-not-allowed"
                    : processing === "success"
                      ? "bg-gradient-to-r from-green-600 to-green-700"
                      : processing === "error"
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : "bg-slate-300 cursor-not-allowed"
                  }`}
              >
                {processing === "loading" && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}

                {processing === "idle" && (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Submit
                  </>
                )}
                {processing === "loading" && "Processing..."}
                {processing === "success" && (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Success!
                  </>
                )}
                {processing === "error" && "Try Again"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export { LectureCard, ModalForSubmitAttendance };
