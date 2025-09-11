import * as React from 'react';
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./Home.jsx";
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode"
import { Toaster } from 'react-hot-toast';
import CollectAttendance from "./CollectAttendance.jsx";
import AllCard from "./teacher-modules/teacher-take-attendance-modules/AllCard.jsx";
import AttendancePage from "./teacher-modules/teacher-take-attendance-modules/AttendancePage.jsx";
import StudentAllLectures from './Student-Modules/Submit-Attendace/StudentAllLectures.jsx'


// ✅ Error logging function
function logErrorToMyService(error, componentStack) {
     console.error("Error:", error);
     console.error("Stack:", componentStack);
     // You can send this to your server via fetch/axios here
}
// ✅ Protected Route (Role-based auth)
const token = Cookies.get("uiRole_token"); // get token from cookies
console.log("uiRole token check : ", token);
const ProtectedRoute = ({ allowedRole }) => {
     const cookies = Cookies.get(); // get token from cookies
     console.log("ui token Token in ProtectedRoute : ", cookies);
     if (!cookies) {
          console.log("No token found, redirecting to home");
          // return <Navigate to="/unauthorized" replace />;
     }
     try {
          console.log("Decoding token:", cookies.uiRole_token);
          const { role } = jwtDecode(cookies.uiRole_token);
          console.log("Decoded Role:", role);
          // return role === allowedRole ? <Outlet /> : <Navigate to="/unauthorized" />;
     } catch (err) {
          console.error("Token decode failed:", err);
          // return <Navigate to="/" replace />;
     }
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
                         <Route element={<ProtectedRoute allowedRole={"teacher"} />}>
                              <Route path="/user-lectures" element={<CollectAttendance />}>
                                   <Route index element={<AllCard />} />
                                   <Route path="get-lecture-info/:id/:index" element={<AttendancePage />} />
                              </Route>
                         </Route>

                         {/* Student route */}
                         <Route element={<ProtectedRoute allowedRole={"student"} />}>
                              <Route path="/student-classroom" index element={<StudentAllLectures />} />
                              {/* <Route path="get-lecture-info/:id/:index" element={<AttendancePage />} /> */}
                         </Route>

                         {/* Unauthorized */}
                         <Route path="/unauthorized" element={<div className="align-middle"><h1>This page is not for you</h1></div>} />

                    </Routes>
               </ErrorBoundary>

               <Toaster position="top-right" reverseOrder={false} />
          </Router>
     );
}

export default App;
