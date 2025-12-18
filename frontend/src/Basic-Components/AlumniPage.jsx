import React, { useState } from 'react';
import { Users, Briefcase, Award, TrendingUp, Search, Filter, GraduationCap, Building2, MapPin, Linkedin } from 'lucide-react';

const AlumniPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBatch, setFilterBatch] = useState('all');
  const [filterDegree, setFilterDegree] = useState('all');

  const alumni = [
    {
      id: 1,
      name: 'Rahul Sharma',
      batch: '2020',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      company: 'Google India',
      position: 'Software Engineer',
      location: 'Bangalore',
      photoColor: 'from-blue-400 to-blue-600',
      achievements: 'Led development of critical payment systems'
    },
    {
      id: 2,
      name: 'Priya Patel',
      batch: '2019',
      degree: 'B.Pharm',
      branch: 'Pharmacy',
      company: 'Sun Pharma',
      position: 'Research Scientist',
      location: 'Mumbai',
      photoColor: 'from-purple-400 to-purple-600',
      achievements: 'Published 5 research papers in international journals'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      batch: '2021',
      degree: 'B.Tech',
      branch: 'Information Technology',
      company: 'Microsoft',
      position: 'Cloud Solutions Architect',
      location: 'Hyderabad',
      photoColor: 'from-green-400 to-green-600',
      achievements: 'Azure certification holder and tech speaker'
    },
    {
      id: 4,
      name: 'Sneha Deshmukh',
      batch: '2018',
      degree: 'B.Com',
      branch: 'Commerce',
      company: 'Deloitte',
      position: 'Senior Consultant',
      location: 'Pune',
      photoColor: 'from-pink-400 to-pink-600',
      achievements: 'CA qualified, handles Fortune 500 clients'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      batch: '2020',
      degree: 'B.Tech',
      branch: 'Mechanical Engineering',
      company: 'Tata Motors',
      position: 'Design Engineer',
      location: 'Pune',
      photoColor: 'from-orange-400 to-orange-600',
      achievements: 'Worked on electric vehicle innovations'
    },
    {
      id: 6,
      name: 'Ananya Reddy',
      batch: '2019',
      degree: 'B.Tech',
      branch: 'Electronics & Communication',
      company: 'Qualcomm',
      position: 'Hardware Engineer',
      location: 'Bangalore',
      photoColor: 'from-teal-400 to-teal-600',
      achievements: '3 patents in 5G technology'
    },
    {
      id: 7,
      name: 'Arjun Mehta',
      batch: '2021',
      degree: 'B.Sc',
      branch: 'Computer Science',
      company: 'Amazon',
      position: 'Data Scientist',
      location: 'Bangalore',
      photoColor: 'from-indigo-400 to-indigo-600',
      achievements: 'ML model optimization specialist'
    },
    {
      id: 8,
      name: 'Kavya Joshi',
      batch: '2018',
      degree: 'B.Tech',
      branch: 'Civil Engineering',
      company: 'L&T Construction',
      position: 'Project Manager',
      location: 'Mumbai',
      photoColor: 'from-yellow-400 to-yellow-600',
      achievements: 'Led metro rail infrastructure projects'
    },
    {
      id: 9,
      name: 'Rohan Malhotra',
      batch: '2020',
      degree: 'B.Tech',
      branch: 'AI & Data Science',
      company: 'Flipkart',
      position: 'ML Engineer',
      location: 'Bangalore',
      photoColor: 'from-red-400 to-red-600',
      achievements: 'Built recommendation algorithms'
    },
    {
      id: 10,
      name: 'Ishita Verma',
      batch: '2019',
      degree: 'D.Pharm',
      branch: 'Pharmacy',
      company: 'Apollo Hospitals',
      position: 'Clinical Pharmacist',
      location: 'Delhi',
      photoColor: 'from-cyan-400 to-cyan-600',
      achievements: 'Patient care excellence award winner'
    },
    {
      id: 11,
      name: 'Siddharth Rao',
      batch: '2021',
      degree: 'M.Com',
      branch: 'Commerce',
      company: 'KPMG',
      position: 'Tax Consultant',
      location: 'Bangalore',
      photoColor: 'from-lime-400 to-lime-600',
      achievements: 'Specialized in GST advisory'
    },
    {
      id: 12,
      name: 'Neha Kapoor',
      batch: '2018',
      degree: 'B.Sc',
      branch: 'Information Technology',
      company: 'Infosys',
      position: 'Business Analyst',
      location: 'Pune',
      photoColor: 'from-fuchsia-400 to-fuchsia-600',
      achievements: 'Digital transformation projects leader'
    }
  ];

  const stats = [
    { icon: <Users />, value: '10,000+', label: 'Alumni Network' },
    { icon: <Building2 />, value: '500+', label: 'Companies' },
    { icon: <Award />, value: '95%', label: 'Employed/Entrepreneurs' },
    { icon: <TrendingUp />, value: '12 LPA', label: 'Average Package' }
  ];

  const batches = ['all', '2018', '2019', '2020', '2021'];
  const degrees = ['all', 'B.Tech', 'B.Pharm', 'D.Pharm', 'B.Com', 'M.Com', 'B.Sc'];

  const filteredAlumni = alumni.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = filterBatch === 'all' || person.batch === filterBatch;
    const matchesDegree = filterDegree === 'all' || person.degree === filterDegree;
    return matchesSearch && matchesBatch && matchesDegree;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Alumni Network</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our proud alumni making waves across industries and building successful careers worldwide
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
              <div className="text-indigo-600 flex justify-center mb-3">
                {React.cloneElement(stat.icon, { className: 'w-8 h-8' })}
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, company, or branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
              >
                <option value="all">All Batches</option>
                {batches.slice(1).map(batch => (
                  <option key={batch} value={batch}>Batch {batch}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={filterDegree}
                onChange={(e) => setFilterDegree(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
              >
                <option value="all">All Degrees</option>
                {degrees.slice(1).map(degree => (
                  <option key={degree} value={degree}>{degree}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAlumni.length} of {alumni.length} alumni
          </div>
        </div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAlumni.map((person) => (
            <div key={person.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
              {/* Photo Section */}
              <div className={`bg-gradient-to-br ${person.photoColor} h-48 flex items-center justify-center relative`}>
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                  Batch {person.batch}
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{person.name}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold">{person.degree}</span>
                    <span>•</span>
                    <span className="text-sm">{person.branch}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold">{person.position}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>{person.company}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>{person.location}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 italic mb-3">"{person.achievements}"</p>
                  <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                    <Linkedin className="w-4 h-4" />
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAlumni.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No alumni found matching your criteria</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>

      {/* Alumni Success Stories Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-6 text-white text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Alumni Network</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Stay connected, mentor students, and be part of a thriving community of professionals
          </p>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Register as Alumni
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlumniPage;