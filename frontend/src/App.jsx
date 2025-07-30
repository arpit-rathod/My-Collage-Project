import React, { useState, useContext } from "react";

import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./Home.jsx";
// import LoginModel from './LoginModel.jsx'
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode"
import { Toaster } from 'react-hot-toast';
import CollectAttendance from "./CollectAttendance.jsx";
import AllCard from "./AllCard.jsx";
import AttendancePage from "./AttendancePage.jsx";

import SubmitAttendance from './SubmitAttendance.jsx'
import AllLecture from './AllLecture.jsx'
import OneLecture from './OneLecture.jsx'

const ProtectedRoute = ({ allowedRole, children }) => {
  const token = Cookies.get("token");
  if (!token) return <Navigate to="/" />;
  console.log(token);
  console.log(jwtDecode(token));

  const { userAvailable } = jwtDecode(token);
  console.log("this is role value from cookies data ", userAvailable.role);

  // return userAvailable.role === allowedRole ? children : <Navigate to="/unauthorized" />;
  return userAvailable.role === allowedRole ? <Outlet /> : <Navigate to="/unauthorized" />;
};
function App() {
  // const [count, setCount] = useState(0)
  return (
    <Router>
      <Routes>
        {/* public pages */}
        <Route path="/" element={<Home />}>
          {/* <Route path="/login" element={<LoginModule></LoginModule>}></Route> */}
        </Route>

        {/* authorised pages for admins */}
        {/* <Route path="/CollectAttedance" element={<CollectAttedance/>}></Route> */}
        {/* authorised pages for admins */}


        {/* teacher routes */}
        <Route path="/CollectAttendance" element={<ProtectedRoute allowedRole={"teacher"}>
        </ProtectedRoute>}>
          <Route index element={<AllCard></AllCard>} />
          <Route path="attendance-page" element={<AttendancePage></AttendancePage>} />
          {/* <Route path="push-notification" element={<PushNotification></PushNotification>} /> */}
        </Route>

        {/* student routes */}
        <Route path="/submitAttendance" element={<SubmitAttendance />}>
          {/* <Route index element={<AllLecture></AllLecture>} /> */}
          <Route path="onelecture" element={<OneLecture></OneLecture>} />
        </Route>
        <Route path="/unauthorized" element={<div className="align-middle"><h1>This is page not for you</h1></div>
        }></Route>
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}
export default App;