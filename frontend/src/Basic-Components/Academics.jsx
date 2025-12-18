import React, { useState } from 'react';
import { GraduationCap, Book, Users, Award, ChevronRight, Microscope, Pill, Calculator, Cpu } from 'lucide-react';

const AcademicPage = () => {
  const [selectedDept, setSelectedDept] = useState(null);

  const departments = [
    {
      id: 'engineering',
      name: 'Engineering & IT',
      icon: <Cpu className="w-8 h-8" />,
      description: 'State-of-the-art engineering programs fostering innovation and technical excellence',
      color: 'from-blue-500 to-blue-600',
      branches: [
        { code: 'CSE', name: 'Computer Science & Engineering', duration: '4 Years', seats: 120 },
        { code: 'IT', name: 'Information Technology', duration: '4 Years', seats: 60 },
        { code: 'AIDS', name: 'Artificial Intelligence & Data Science', duration: '4 Years', seats: 60 },
        { code: 'ME', name: 'Mechanical Engineering', duration: '4 Years', seats: 60 },
        { code: 'CIVIL', name: 'Civil Engineering', duration: '4 Years', seats: 60 },
        { code: 'EC', name: 'Electronics & Communication', duration: '4 Years', seats: 60 }
      ]
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy',
      icon: <Pill className="w-8 h-8" />,
      description: 'Comprehensive pharmaceutical education preparing future healthcare professionals',
      color: 'from-green-500 to-green-600',
      branches: [
        { code: 'B.Pharm', name: 'Bachelor of Pharmacy', duration: '4 Years', seats: 100 },
        { code: 'D.Pharm', name: 'Diploma in Pharmacy', duration: '2 Years', seats: 60 }
      ]
    },
    {
      id: 'commerce',
      name: 'Commerce',
      icon: <Calculator className="w-8 h-8" />,
      description: 'Professional commerce education building future business leaders',
      color: 'from-purple-500 to-purple-600',
      branches: [
        { code: 'B.Com', name: 'Bachelor of Commerce', duration: '3 Years', seats: 120 },
        { code: 'B.Com (Hons)', name: 'Bachelor of Commerce (Honours)', duration: '3 Years', seats: 60 },
        { code: 'M.Com', name: 'Master of Commerce', duration: '2 Years', seats: 40 }
      ]
    },
    {
      id: 'science',
      name: 'Science & Technology',
      icon: <Microscope className="w-8 h-8" />,
      description: 'Diverse scientific programs nurturing research and analytical thinking',
      color: 'from-orange-500 to-orange-600',
      branches: [
        { code: 'B.Sc (CS)', name: 'Bachelor of Science in Computer Science', duration: '3 Years', seats: 60 },
        { code: 'B.Sc (IT)', name: 'Bachelor of Science in Information Technology', duration: '3 Years', seats: 60 },
        { code: 'B.Sc (Physics)', name: 'Bachelor of Science in Physics', duration: '3 Years', seats: 40 },
        { code: 'B.Sc (Chemistry)', name: 'Bachelor of Science in Chemistry', duration: '3 Years', seats: 40 },
        { code: 'B.Sc (Mathematics)', name: 'Bachelor of Science in Mathematics', duration: '3 Years', seats: 40 },
        { code: 'B.Sc (Biology)', name: 'Bachelor of Science in Biology', duration: '3 Years', seats: 40 }
      ]
    }
  ];

  const stats = [
    { icon: <Book />, value: '50+', label: 'Programs Offered' },
    { icon: <Users />, value: '5000+', label: 'Students Enrolled' },
    { icon: <Award />, value: '95%', label: 'Placement Rate' },
    { icon: <GraduationCap />, value: '200+', label: 'Expert Faculty' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-300 to-purple-400 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center ">
          <h1 className="text-5xl font-bold mb-6 text-red-800">Truba Academic Excellence</h1>
          <p className="text-xl  text-red-800 max-w-3xl mx-auto">
            Empowering minds through innovative education and cutting-edge research across diverse disciplines
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
              <div className="text-red-800 flex justify-center mb-3">
                {React.cloneElement(stat.icon, { className: 'w-8 h-8' })}
              </div>
              <div className="text-3xl font-bold text-gray-700 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Departments Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-600 mb-12">Departments in Truba Gruop of Institute</h2>

        <div className="grid grid-cols-1 gap-8 mb-12">
          {departments.map((dept) => (
            <div
              key={dept.id}
              onClick={() => setSelectedDept(selectedDept === dept.id ? null : dept.id)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all"
            >
              <div className={`bg-gradient-to-r ${dept.color} text-white p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {dept.icon}
                    <h3 className="text-2xl font-bold">{dept.name}</h3>
                  </div>
                  <ChevronRight className={`w-6 h-6 transform transition-transform ${selectedDept === dept.id ? 'rotate-90' : ''}`} />
                </div>
                <p className="mt-3 text-white/90">{dept.description}</p>
              </div>

              {selectedDept === dept.id && (
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Available Programs</h4>
                  <div className="space-y-3">
                    {dept.branches.map((branch, idx) => (
                      <div key={idx} className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg hover:bg-indigo-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-gray-800 text-lg">{branch.code}</div>
                            <div className="text-gray-600">{branch.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Duration</div>
                            <div className="font-semibold text-indigo-600">{branch.duration}</div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">Intake: {branch.seats} seats</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Industry Partnerships</h3>
            <p className="text-gray-600">Collaborations with leading companies ensuring practical exposure and internship opportunities</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Research Focus</h3>
            <p className="text-gray-600">State-of-the-art laboratories and research centers promoting innovation and discovery</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Global Recognition</h3>
            <p className="text-gray-600">Accredited programs meeting international standards of academic excellence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicPage;