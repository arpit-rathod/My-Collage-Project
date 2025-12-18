import React, { useState, useEffect } from 'react';
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./Home.jsx";
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode"
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

import { dashboard as StudentDashboard } from './Student-Modules/dashboard.jsx';

import FullPageSpinner from ".//animation-components/spinner"
import CollectAttendance from "./CollectAttendance.jsx";
import TeacherLectureOutlet from "./teacher-modules/teacher-take-attendance-modules/teacherLectureCard.jsx";
import AttendancePage from "./teacher-modules/teacher-take-attendance-modules/AttendancePage.jsx";
import StudentAllLectures from './Student-Modules/Submit-Attendace/StudentAllLectures.jsx'

import AddStudentProfile from './admin_modules/add_student.jsx';
import AddBranchYearDoc from './admin_modules/add_branch_year_doc.jsx';
import AddSubjectToBranchYear from './admin_modules/addSubjectToBranchYear.jsx';
import StudentSearch from './admin_modules/findStudents.jsx';
import FindStudent from './admin_modules/updateStudentProfile.jsx';
import TeacherRegistrationPage from './admin_modules/registerTeacher.jsx';

import PageAccessControlDashboard from './adminVSDataBasePages/updateAccessPageData.jsx'
import AcademicPage from './Basic-Components/Academics.jsx'
import StudentLifePage from './Basic-Components/StudentLifePage.jsx';
import AlumniPage from './Basic-Components/AlumniPage.jsx';
import PlacementCellPage from './Basic-Components/PlacementCellPage.jsx';


//function
// ...existing imports...
// ✅ Check if user is authenticated on app load

// ✅ Updated logout function
function logOutUser() {
  try {
    Cookies.remove('uiRole_token');
    Cookies.remove('auth_token'); // Clear both tokens
    // window.location.href = '/';
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// // ...rest of your code...
// setTimeout(() => {
//   if (!Cookies.get('uiRole_token')) {
//     console.log("logOUt run because ui token is not present");
//     logOutUser();
//   }
// }, 8000);

// ✅ Error logging function
function logErrorToMyService(error, componentStack) {
  console.error("Error:", error);
  console.error("Stack:", componentStack);
}

import PropTypes from 'prop-types';
const ProtectedRoute = ({ allowedRoles }) => {
  console.log(allowedRoles);
  const cookies = Cookies.get(); // get token from cookies
  console.log("ui token Token in ProtectedRoute : ", cookies);
  if (!cookies.uiRole_token) {
    console.log("No token found, redirecting to home");
    return <Navigate to="/" replace />;
  }
  try {
    const { role } = jwtDecode(cookies.uiRole_token);
    console.log(jwtDecode(cookies.uiRole_token));
    return allowedRoles.includes(role)
      ? <Outlet />
      : <Navigate to="/unauthorized" />;
  } catch (err) {
    console.error("Token decode failed:", err);
    return <Navigate to="/" replace />;
  }
};

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// ✅ Error Boundary class
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

const PageAccessGuard = ({ pageId, children, fallbackComponent }) => {
  const [accessData, setAccessData] = useState({
    loading: true,
    hasAccess: false,
    message: ""
  })

  useEffect(() => {
    checkPageAccess();
    const interval = setInterval(() => (checkPageAccess()), 30000);
    return clearInterval(interval)
  }, [pageId]);

  const checkPageAccess = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/page-access/check/${pageId}`, {
        withCredentials: true
      });
      console.log(response);

      setAccessData({
        loading: false,
        hasAccess: response.data.hasAccess,
        message: response.data.message
      });
    } catch (error) {
      console.log(error.response);
      setAccessData({
        loading: false,
        hasAccess: false,
        message: error || 'Unable to verify page access'
      });
    }

  }
  if (accessData.loading) {
    return <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }
  if (!accessData.hasAccess) {
    return fallbackComponent || (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Access Restricted
          </h3>
          <p className="text-yellow-700">{accessData.message}</p>
          <button
            onClick={checkPageAccess}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Check Again
          </button>
        </div>
      </div>
    );
  }
  // return (<h1>hello</h1>)
  return <Outlet />;
}

// ✅ Main App
function App() {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const uiRoleToken = Cookies.get('uiRole_token');
        // If uiRole_token is missing but auth_token exists, 
        // it means the UI token was cleared. Don't call logout.
        if (!uiRoleToken) {
          console.log("uiRole_token missing, but checking backend session...");

          // Verify with backend if auth_token is still valid
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/me`,
            { withCredentials: true }
          );

          if (response.status === 200) {
            // Backend confirms user is logged in
            const userData = response.data.user;
            // Restore uiRole_token if needed
            Cookies.set('uiRole_token', userData.role, {
              expires: 7,
              secure: import.meta.env.MODE === 'production',
              sameSite: 'Lax'
            });
          }
        }
      } catch (error) {
        console.log("Auth check failed, user may not be logged in");
        logOutUser();
      }
    };

    checkAuth();
  }, []);
  return (
    <Router>
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <Routes>

          {/* Public Route */}
          <Route path="/" element={<Home />} />

          <Route path="/dashboard/student" element={<StudentDashboard />} />
          {/* Teacher routes */}
          <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
            <Route path="/user-lectures" element={<CollectAttendance />}>
              <Route index element={<TeacherLectureOutlet />} />
              <Route path="get-lecture-info/:id/:index" element={<AttendancePage />} />
            </Route
            >
          </Route>

          {/* Student route */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student-classroom" index element={<StudentAllLectures />} />
            {/* <Route path="get-lecture-info/:id/:index" element={<AttendancePage />} /> */}
          </Route>

          {/* Admin route */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin-dashboard/page-access" element={<PageAccessControlDashboard />} />
            <Route path="/add-branch-year-doc" element={<AddBranchYearDoc />} />
          </Route>
          {/* For both admin + teacher */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
            <Route path="/student-search-page" element={<StudentSearch />} />
            <Route path="/student-update-page" element={<FindStudent />} />
            <Route path="/add-subject-to-branch-year" element={<AddSubjectToBranchYear />} />
          </Route>

          <Route element={<PageAccessGuard pageId="student-registration" />}>
            <Route path="/admin/manage_students" element={<AddStudentProfile />} />
          </Route>

          <Route element={<PageAccessGuard pageId="teacher-registration" />}>
            <Route path='/admin/register/new-teacher' element={<TeacherRegistrationPage />} />
          </Route>
          <Route path="/unauthorized" element={<div className="flex flex-wrap justify-between items-center"><h1>This page is not for you</h1></div>} />

          <Route path='/academic' element={<AcademicPage />} />
          <Route path='/student-life' element={<StudentLifePage />} />
          <Route path='/alumni' element={<AlumniPage />} />
          <Route path='/placements' element={<PlacementCellPage />} />

        </Routes>
      </ErrorBoundary>

      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
