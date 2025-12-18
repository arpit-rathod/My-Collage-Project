import React, { useState } from 'react';
import { Briefcase, TrendingUp, Users, Building2, Award, Target, BookOpen, Calendar, CheckCircle, ArrowRight, Phone, Mail, MapPin, Download, ExternalLink } from 'lucide-react';

const PlacementCellPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const placementStats = [
    { icon: <TrendingUp />, value: '95%', label: 'Placement Rate', color: 'from-green-500 to-emerald-500' },
    { icon: <Building2 />, value: '250+', label: 'Recruiters', color: 'from-blue-500 to-cyan-500' },
    { icon: <Users />, value: '1200+', label: 'Students Placed', color: 'from-purple-500 to-indigo-500' },
    { icon: <Award />, value: '45 LPA', label: 'Highest Package', color: 'from-orange-500 to-red-500' }
  ];

  const topRecruiters = [
    { name: 'Google', sector: 'Technology', color: 'bg-red-100 text-red-700' },
    { name: 'Microsoft', sector: 'Technology', color: 'bg-blue-100 text-blue-700' },
    { name: 'Amazon', sector: 'E-commerce', color: 'bg-orange-100 text-orange-700' },
    { name: 'Infosys', sector: 'IT Services', color: 'bg-cyan-100 text-cyan-700' },
    { name: 'TCS', sector: 'IT Services', color: 'bg-indigo-100 text-indigo-700' },
    { name: 'Wipro', sector: 'IT Services', color: 'bg-purple-100 text-purple-700' },
    { name: 'Accenture', sector: 'Consulting', color: 'bg-pink-100 text-pink-700' },
    { name: 'Deloitte', sector: 'Consulting', color: 'bg-green-100 text-green-700' },
    { name: 'Flipkart', sector: 'E-commerce', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Cognizant', sector: 'IT Services', color: 'bg-teal-100 text-teal-700' },
    { name: 'Capgemini', sector: 'Consulting', color: 'bg-blue-100 text-blue-700' },
    { name: 'HCL', sector: 'Technology', color: 'bg-indigo-100 text-indigo-700' }
  ];

  const upcomingDrives = [
    { company: 'Tech Mahindra', date: 'Dec 22, 2024', roles: 'Software Developer', eligibility: 'CSE, IT, AIDS', package: '6-8 LPA' },
    { company: 'Cognizant', date: 'Dec 28, 2024', roles: 'Full Stack Developer', eligibility: 'All Branches', package: '4.5-6 LPA' },
    { company: 'L&T Infotech', date: 'Jan 5, 2025', roles: 'Associate Engineer', eligibility: 'CSE, IT, EC', package: '5-7 LPA' },
    { company: 'Persistent Systems', date: 'Jan 12, 2025', roles: 'Software Engineer', eligibility: 'CSE, IT', package: '7-9 LPA' }
  ];

  const trainingPrograms = [
    { title: 'Aptitude Training', duration: '8 Weeks', icon: <Target />, description: 'Quantitative, logical reasoning, and verbal ability' },
    { title: 'Technical Skills', duration: '12 Weeks', icon: <BookOpen />, description: 'Programming, data structures, system design' },
    { title: 'Soft Skills', duration: '6 Weeks', icon: <Users />, description: 'Communication, presentation, teamwork' },
    { title: 'Mock Interviews', duration: 'Ongoing', icon: <Briefcase />, description: 'Technical and HR interview practice sessions' }
  ];

  const placementProcess = [
    { step: '1', title: 'Registration', description: 'Students register with placement cell' },
    { step: '2', title: 'Resume Building', description: 'Professional resume preparation assistance' },
    { step: '3', title: 'Training', description: 'Comprehensive skill development programs' },
    { step: '4', title: 'Pre-Placement Talks', description: 'Company presentations and Q&A sessions' },
    { step: '5', title: 'Aptitude Tests', description: 'Online/offline screening tests' },
    { step: '6', title: 'Interviews', description: 'Technical and HR interview rounds' },
    { step: '7', title: 'Offer Letter', description: 'Final selection and placement' }
  ];

  const packageDistribution = [
    { range: '3-5 LPA', percentage: 25, count: 300 },
    { range: '5-10 LPA', percentage: 45, count: 540 },
    { range: '10-20 LPA', percentage: 20, count: 240 },
    { range: '20+ LPA', percentage: 10, count: 120 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Briefcase className="w-12 h-12" />
              <h1 className="text-5xl font-bold">Training & Placement Cell</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Bridging the gap between academic excellence and professional success
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download Brochure
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Register for Placement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {placementStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform">
              <div className={`bg-gradient-to-r ${stat.color} p-6 text-white`}>
                <div className="flex justify-center mb-3">
                  {React.cloneElement(stat.icon, { className: 'w-10 h-10' })}
                </div>
                <div className="text-4xl font-bold text-center mb-2">{stat.value}</div>
                <div className="text-center text-white/90">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {['overview', 'recruiters', 'training', 'process', 'statistics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">About Our Placement Cell</h2>
              <div className="prose max-w-none text-gray-600 space-y-4">
                <p className="text-lg">
                  The Training & Placement Cell is dedicated to providing career guidance and placement assistance to students. We work tirelessly to bridge the gap between academic learning and industry requirements.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <h3 className="font-bold text-xl text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                      Our Mission
                    </h3>
                    <p>To ensure every student gets the best career opportunity matching their skills and aspirations through comprehensive training and placement support.</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-xl">
                    <h3 className="font-bold text-xl text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                      Our Vision
                    </h3>
                    <p>To be recognized as a premier placement cell that consistently produces industry-ready professionals and maintains strong corporate relationships.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Drives */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Upcoming Campus Drives</h2>
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="space-y-4">
                {upcomingDrives.map((drive, idx) => (
                  <div key={idx} className="border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-white p-6 rounded-r-xl hover:shadow-lg transition-shadow">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{drive.company}</h3>
                        <p className="text-gray-600 mt-1">{drive.roles}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span>📅 {drive.date}</span>
                          <span>🎓 {drive.eligibility}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{drive.package}</div>
                        <button className="mt-2 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
                          Apply Now <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recruiters Tab */}
        {activeTab === 'recruiters' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Top Recruiters</h2>
            <p className="text-gray-600 mb-8">We have strong partnerships with leading companies across various sectors</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {topRecruiters.map((recruiter, idx) => (
                <div key={idx} className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-500 hover:shadow-lg transition-all text-center">
                  <div className={`${recruiter.color} px-4 py-2 rounded-lg font-bold text-lg mb-2`}>
                    {recruiter.name}
                  </div>
                  <div className="text-sm text-gray-500">{recruiter.sector}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <p className="text-center text-gray-700">
                <strong>And many more...</strong> We collaborate with 250+ companies across IT, Manufacturing, Consulting, Finance, and Healthcare sectors.
              </p>
            </div>
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Training Programs</h2>
              <p className="text-gray-600 mb-8">Comprehensive training to make you industry-ready</p>
              <div className="grid md:grid-cols-2 gap-6">
                {trainingPrograms.map((program, idx) => (
                  <div key={idx} className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-500 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                        {React.cloneElement(program.icon, { className: 'w-6 h-6' })}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{program.title}</h3>
                        <div className="text-sm text-indigo-600 font-semibold mb-2">Duration: {program.duration}</div>
                        <p className="text-gray-600">{program.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Additional Resources</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Online Learning Portal</h3>
                  <p className="text-sm text-gray-600">Access to premium courses and study materials</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <Users className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Mentorship Program</h3>
                  <p className="text-sm text-gray-600">One-on-one guidance from industry experts</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <Award className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Certification Courses</h3>
                  <p className="text-sm text-gray-600">Industry-recognized certifications</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Process Tab */}
        {activeTab === 'process' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Placement Process</h2>
            <p className="text-gray-600 mb-8">Our structured approach to ensure successful placements</p>
            <div className="relative">
              {placementProcess.map((item, idx) => (
                <div key={idx} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                      {item.step}
                    </div>
                    {idx < placementProcess.length - 1 && (
                      <div className="w-1 h-20 bg-gradient-to-b from-indigo-500 to-purple-500 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Package Distribution 2023-24</h2>
              <div className="space-y-6">
                {packageDistribution.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">{item.range}</span>
                      <span className="text-gray-600">{item.count} students ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Branch-wise Placement</h3>
                <div className="space-y-3">
                  {[
                    { branch: 'CSE', rate: '98%' },
                    { branch: 'IT', rate: '97%' },
                    { branch: 'AIDS', rate: '96%' },
                    { branch: 'EC', rate: '94%' },
                    { branch: 'Mechanical', rate: '92%' },
                    { branch: 'Civil', rate: '90%' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold">{item.branch}</span>
                      <span className="text-indigo-600 font-bold">{item.rate}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Sector-wise Distribution</h3>
                <div className="space-y-3">
                  {[
                    { sector: 'IT Services', percent: '45%' },
                    { sector: 'Product Companies', percent: '25%' },
                    { sector: 'Consulting', percent: '15%' },
                    { sector: 'Core Engineering', percent: '10%' },
                    { sector: 'Others', percent: '5%' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold">{item.sector}</span>
                      <span className="text-purple-600 font-bold">{item.percent}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Contact Placement Cell</h2>
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Phone className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Phone</h3>
              <p>+91 731 1234567</p>
              <p>+91 731 7654321</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Mail className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p>placements@college.edu</p>
              <p>tpo@college.edu</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Location</h3>
              <p>Training & Placement Office</p>
              <p>Administrative Block, 2nd Floor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementCellPage;