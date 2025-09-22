import * as React from 'react';
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./Home.jsx";
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode"
import { Toaster } from 'react-hot-toast';

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

import logOutUser from './APICaliingFunctions/logOutApi.js';

if (!Cookies.get('uiRole_token')) {
     console.log("logOUt run because ui token is not present");
     logOutUser();
}

// ✅ Error logging function
function logErrorToMyService(error, componentStack) {
     console.error("Error:", error);
     console.error("Stack:", componentStack);
     // You can send this to your server via fetch/axios here
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

// ✅ Main App
function App() {
     return (
          <Router>
               <ErrorBoundary fallback={<p>Something went wrong</p>}>
                    <Routes>

                         {/* Public Route */}
                         <Route path="/" element={<Home />} />

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
                              {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
                              <Route path="/admin/manage_students" element={<AddStudentProfile />} />
                              <Route path="/add-branch-year-doc" element={<AddBranchYearDoc />} />
                              <Route path='/admin/register/new-teacher' element={<TeacherRegistrationPage />} />
                         </Route>
                         {/* For both admin + teacher */}
                         <Route element={<ProtectedRoute allowedRoles={["admin", "teacher"]} />}>
                              <Route path="/student-search-page" element={<StudentSearch />} />
                              <Route path="/student-update-page" element={<FindStudent />} />
                              <Route path="/add-subject-to-branch-year" element={<AddSubjectToBranchYear />} />
                         </Route>

                         <Route path="/unauthorized" element={<div className="flex flex-wrap justify-between items-center"><h1>This page is not for you</h1></div>} />

                    </Routes>
               </ErrorBoundary>

               <Toaster position="top-right" reverseOrder={false} />
          </Router>
     );
}

export default App;
