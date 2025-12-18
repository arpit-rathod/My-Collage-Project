import React, { useState, useContext } from 'react';
import { User, Award, BookOpen, Calendar, TrendingUp, Target, Clock, Mail, Phone, MapPin, Github, Linkedin, Globe } from 'lucide-react';
import { ProfileContext } from '../../All-Provider/profileDataProvider.jsx'
import FullPageSpinner from '../../animation-components/spinner.jsx'

export default function StudentProfileDashboard({ componentBG, nestedComponentBG }) {
  const { profileData, profileDataLoading } = useContext(ProfileContext);
  const [studentData] = useState({
    // Basic Info
    name: "Rahul Sharma",
    username: "rahul_sharma_23",
    email: "rahul.sharma@college.edu",
    phone: "+91 98765 43210",
    department: "Computer Science & Engineering",
    branch: "Computer Science",
    year: "3rd Year",
    section: "A",
    rollNumber: "CS21A045",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",

    // Academic Stats
    // cgpa: 8.75,
    totalCredits: 120,
    attendanceRate: 87,

    // Activity Stats
    assignmentsCompleted: 45,
    totalAssignments: 52,
    projectsCompleted: 8,
    certifications: 3,

    // Social Links
    portfolioLinks: {
      github: "github.com/rahulsharma",
      linkedin: "linkedin.com/in/rahulsharma",
      portfolio: "rahulsharma.dev"
    },
  });

  const getStatusColor = (status) => {
    if (status === 'completed') return 'bg-green-100 text-green-700';
    if (status === 'in-progress') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 85) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };
  if (profileDataLoading) {
    return (
      <FullPageSpinner></FullPageSpinner>
    )
  }
  return (
    // from-indigo-200 via-purple-200 to-pink-50
    <div className="bg-gradient-to-br">
      <div className={`max-w-5xl mx-auto sm:space-y-6 p-6 rounded-xs ${componentBG}`}>

        {/* Profile Header Card */}
        <div className={` rounded-2xl shadow-lg overflow-hidden ${nestedComponentBG}`}>
          <div className="h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className={`px-8 pb-8`}>
            <div className="flex flex-col md:flex-row gap-6 -mt-16">
              <div className="flex-shrink-0">
                <img
                  src={studentData.img}
                  alt={profileData?.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white"
                />
              </div>

              {/* Basic Info */}
              <div className="flex-grow mt-16 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">{profileData?.name}</h1>
                    <p className="text-gray-500 text-lg">@{profileData?.username}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                        {profileData?.branch}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        {profileData?.year}
                      </span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
                        Section {profileData?.section}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        Roll: {profileData?.rollNumber}
                      </span>
                    </div>
                  </div>

                  {/* CGPA Badge */}
                  {/* <div className="mt-4 md:mt-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 text-center shadow-lg">
                    <p className="text-white text-sm font-semibold">CGPA</p>
                    <p className="text-white text-4xl font-bold">{studentData.cgpa}</p>
                    <p className="text-white text-xs">/ 10.0</p>
                  </div> */}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{profileData?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{profileData?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{profileData?.department}</span>
                  </div>
                  {/* <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{studentData.totalCredits} Credits Earned</span>
                  </div> */}
                </div>

                {/* Social Links */}
                <div className="flex gap-3 mt-4">
                  <a href={`https://${profileData?.portfolioLinks?.github}`} target="_blank" rel="noopener noreferrer"
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Github className="w-5 h-5 text-gray-700" />
                  </a>
                  <a href={`https://${profileData?.portfolioLinks?.linkedin}`} target="_blank" rel="noopener noreferrer"
                    className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors">
                    <Linkedin className="w-5 h-5 text-blue-700" />
                  </a>
                  <a href={`https://${profileData?.portfolioLinks?.portfolio}`} target="_blank" rel="noopener noreferrer"
                    className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors">
                    <Globe className="w-5 h-5 text-purple-700" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 `}>
          {/* Attendance */}
          <div className={`${nestedComponentBG} rounded-2xl shadow-lg p-6 `}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className={`text-3xl font-bold ${getAttendanceColor(studentData.attendanceRate)}`}>
                {studentData.attendanceRate}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold">Overall Attendance</h3>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${studentData.attendanceRate}%` }}
              ></div>
            </div>
          </div>

          {/* Assignments */}
          <div className={`${nestedComponentBG} rounded-2xl shadow-lg p-6 `}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-blue-600">
                {studentData.assignmentsCompleted}/{studentData.totalAssignments}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold">Assignments Completed</h3>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${(studentData.assignmentsCompleted / studentData.totalAssignments) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Projects */}
          <div className={`${nestedComponentBG} rounded-2xl shadow-lg p-6 `}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-purple-600">{studentData.projectsCompleted}</span>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold">Projects Completed</h3>
            <p className="text-xs text-gray-500 mt-2">Academic & Personal</p>
          </div>

          {/* Certifications */}
          <div className={`${nestedComponentBG} rounded-2xl shadow-lg p-6 `}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-3xl font-bold text-yellow-600">{studentData.certifications}</span>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold">Certifications Earned</h3>
            <p className="text-xs text-gray-500 mt-2">Industry recognized</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Skills & Subjects */}
          {/* <div className="lg:col-span-2 space-y-6">

                              <div className="bg-white rounded-2xl shadow-lg p-6">
                                   <div className="flex items-center gap-2 mb-4">
                                        <BookOpen className="w-5 h-5 text-indigo-600" />
                                        <h2 className="text-xl font-bold text-gray-800">Current Semester Subjects</h2>
                                   </div>

                                   <div className="space-y-3">
                                        {studentData.currentSubjects.map((subject) => (
                                             <div key={subject.code} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                                  <div className="flex justify-between items-start mb-2">
                                                       <div>
                                                            <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                                                            <p className="text-sm text-gray-500">{subject.code} • {subject.credits} Credits</p>
                                                       </div>
                                                       <span className={`text-lg font-bold ${getAttendanceColor(subject.attendance)}`}>
                                                            {subject.attendance}%
                                                       </span>
                                                  </div>
                                                  <div className="bg-gray-200 rounded-full h-2 mt-2">
                                                       <div
                                                            className={`h-2 rounded-full ${subject.attendance >= 85 ? 'bg-green-500' : subject.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                            style={{ width: `${subject.attendance}%` }}
                                                       ></div>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              <div className="bg-white rounded-2xl shadow-lg p-6">
                                   <div className="flex items-center gap-2 mb-4">
                                        <Target className="w-5 h-5 text-indigo-600" />
                                        <h2 className="text-xl font-bold text-gray-800">Technical Skills</h2>
                                   </div>

                                   <div className="space-y-4">
                                        {studentData.skills.map((skill) => (
                                             <div key={skill.name}>
                                                  <div className="flex justify-between items-center mb-1">
                                                       <span className="text-sm font-semibold text-gray-700">{skill.name}</span>
                                                       <span className="text-sm font-bold text-indigo-600">{skill.level}%</span>
                                                  </div>
                                                  <div className="bg-gray-200 rounded-full h-2">
                                                       <div
                                                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                                                            style={{ width: `${skill.level}%` }}
                                                       ></div>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         </div> */}

          {/* Right Column - Recent Activity
                         <div className="space-y-6">
                              <div className="bg-white rounded-2xl shadow-lg p-6">
                                   <div className="flex items-center gap-2 mb-4">
                                        <Clock className="w-5 h-5 text-indigo-600" />
                                        <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                                   </div>

                                   <div className="space-y-3">
                                        {studentData.recentActivities.map((activity) => (
                                             <div key={activity.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                                                  <div className="flex justify-between items-start mb-1">
                                                       <h3 className="font-semibold text-gray-800 text-sm">{activity.title}</h3>
                                                  </div>
                                                  <div className="flex justify-between items-center">
                                                       <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                                                            {activity.status.replace('-', ' ')}
                                                       </span>
                                                       <span className="text-xs text-gray-500">{activity.date}</span>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>

                                   <button className="w-full mt-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-semibold transition-colors">
                                        View All Activities
                                   </button>
                              </div>
                         </div> */}
        </div>

      </div>
    </div>
  );
}