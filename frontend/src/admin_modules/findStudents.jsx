import React, { useState, useEffect } from 'react';
import axios from 'axios'
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';
import departmentsData from '..//data/departmentsData.json'
import { extractDetails } from '.././commonFunctions/getUpperCase.js';
const firstLetterUpperCase = (str) => {
     if (!str) {
          return "Null";
     }
     return str.split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
};
export default function StudentSearch(props) {
     // State for search filters
     const [searchParams, setSearchParams] = useState({
          username: '',
          department: '',
          branch: '',
          degree: ''
     });

     // State for search results and UI
     const [students, setStudents] = useState([]);
     const [isLoading, setIsLoading] = useState(false);
     const [hasSearched, setHasSearched] = useState(false);
     const [error, setError] = useState('');
     const [formArray, setFormArray] = useState({
          degrees: [],
          years: [],
          branches: [],
     });

     const departments = Object.keys(departmentsData) || [];
     const departmentsDataExtracted = extractDetails(departmentsData);

     // Available departments and branches for filters
     // Load search parameters from URL on component mount
     useEffect(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const username = urlParams.get('username') || '';
          const department = urlParams.get('department') || '';
          const branch = urlParams.get('branch') || '';

          if (username || department || branch) {
               console.log("searching when component mount and q found", { username, department, branch });
               setSearchParams({ username, department, branch });
               performSearch({ username, department, branch });
          }

          setFormArray(() => ({
               degrees: departmentsDataExtracted?.degrees,
               years: departmentsDataExtracted?.requiredYears,
               branches: departmentsDataExtracted?.branches,
          }))

     }, []);

     // Update URL when search parameters change
     const urlParams = new URLSearchParams();
     const updateURL = (params) => {
          if (params.username) urlParams.set('username', params.username);
          if (params.department) urlParams.set('department', params.department);
          if (params.branch) urlParams.set('branch', params.branch);
          const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
          window.history.pushState({}, '', newUrl);
     };

     // Handle input changes
     const handleInputChange = (e) => {
          const { name, value } = e.target;
          setSearchParams(prev => ({
               ...prev,
               [name]: value
          }));
     };

     // Perform search function
     const performSearch = async (params = searchParams) => {
          console.log("search run");

          if (!params.username && !params.department && !params.branch) {
               setError('Please enter at least one search criteria');
               // return;
          }

          setIsLoading(true);
          setError('');
          setHasSearched(true);

          try {
               // Simulate API call with realistic data
               const response = await axios.get(`${import.meta.env.VITE_API_URL}/find-user-students`, {
                    params: params,
                    withCredentials: true
               });
               console.log(response.data);

               if (response.status === 200) {
                    toast.success('Details fetched', { id: "search student", description: "data" });
                    setStudents(response.data?.results);
               }
               // await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
               updateURL(params);
               // id: 1,
               // username: 'john_doe23',
               // name: 'John Michael Doe',
               // department: 'Computer Science',
               // branch: 'Software Engineering',
               // fatherName: 'Robert Doe',
               // email: 'john.doe@university.edu',
               // year: '3rd Year'
          } catch (err) {
               console.error('Search error:', err);
               setError(err.response.data.message);
               // if(err.response.status ==400){
               //      setError(err.response.data.message);
               // }else if (err.response.status ==404){
               // }
               // setError('Failed to search students. Please try again.');
          } finally {
               setIsLoading(false);
          }
     };

     // Handle search button click
     const handleSearch = () => {
          performSearch();
     };

     // Clear search and reset
     const handleClear = () => {
          setSearchParams({ username: '', department: '', branch: '' });
          setStudents([]);
          setHasSearched(false);
          setError('');
          window.history.pushState({}, '', window.location.pathname);
     };

     // Handle edit student
     const handleEditStudent = (studentId) => {
          // In real app, navigate to edit page or open modal
          console.log('Edit student:', studentId);
          alert(`Opening edit form for student ID: ${studentId}`);
     };

     return (
          <div className="min-h-screen bg-gray-200">
               {/* Header */}
               <header className="bg-red-800 text-white shadow-lg">
                    <div className="container mx-auto px-4 py-6">
                         <div className="text-center">
                              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                   Student Directory
                              </h1>
                              <p className="text-red-100 text-sm md:text-base">
                                   Search and manage student profiles across departments
                              </p>
                         </div>
                    </div>
               </header>

               {/* Main Content */}
               <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
                    {/* Search Form */}
                    <div className="bg-white rounded-lg shadow-md p-3 mb-8">
                         <h2 className="text-xl font-semibold text-red-800 mb-4">Search Students</h2>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              {/* Username Search */}
                              <div>
                                   <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                        Username or Name
                                   </label>
                                   <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={searchParams.username}
                                        onChange={handleInputChange}
                                        placeholder="Enter username or student name"
                                        className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                   />
                              </div>

                              {/* Department Filter */}
                              <div>
                                   <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                                        Department (Optional)
                                   </label>
                                   <select
                                        id="department"
                                        name="department"
                                        value={searchParams.department}
                                        onChange={handleInputChange}
                                        className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                   >
                                        <option value="">All Departments</option>
                                        {departments.map(dept => (
                                             <option key={dept} value={dept}>{firstLetterUpperCase(dept)}</option>
                                        ))}
                                   </select>
                              </div>
                              {/* Degree Filter */}
                              <div>
                                   <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
                                        Degree (Optional)
                                   </label>
                                   <select
                                        id="degree"
                                        name="degree"
                                        value={searchParams.degree}
                                        onChange={handleInputChange}
                                        className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                   >
                                        <option value="">All Degree</option>
                                        {formArray.degrees && formArray.degrees.map(degree => (
                                             <option key={degree} value={degree}>{firstLetterUpperCase(degree)}</option>
                                        ))}
                                   </select>
                              </div>

                              {/* Branch Filter */}
                              <div>
                                   <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
                                        Branch (Optional)
                                   </label>
                                   <select
                                        id="branch"
                                        name="branch"
                                        value={searchParams.branch}
                                        onChange={handleInputChange}
                                        className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                   >
                                        <option value="">All Branches</option>
                                        {formArray.branches && formArray.branches.map(branch => (
                                             <option key={branch} value={branch}>{firstLetterUpperCase(branch)}</option>
                                        ))}
                                   </select>
                              </div>
                              {/* Year Filter */}
                              <div>
                                   <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
                                        Year (Optional)
                                   </label>
                                   <select
                                        id="year"
                                        name="year"
                                        value={searchParams.year}
                                        onChange={handleInputChange}
                                        className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                   >
                                        <option value="">All Branches</option>
                                        {formArray.years && formArray.years.map(year => (
                                             <option key={year} value={year}>{firstLetterUpperCase(year)}</option>
                                        ))}
                                   </select>
                              </div>
                         </div>

                         {/* Search Actions */}
                         <div className="flex flex-col sm:flex-row gap-3">
                              <button
                                   onClick={handleSearch}
                                   disabled={isLoading}
                                   className={`flex-1 py-2 px-6 rounded-md font-medium transition-colors ${isLoading
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-red-800 hover:bg-red-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                                        }`}
                              >
                                   {isLoading ? (
                                        <span className="flex items-center justify-center">
                                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                             Searching...
                                        </span>
                                   ) : (
                                        'Search Students'
                                   )}
                              </button>

                              <button
                                   onClick={handleClear}
                                   className="py-2 px-6 border border-red-800 text-red-800 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                              >
                                   Clear
                              </button>
                         </div>

                         {/* Error Message */}
                         {error && (
                              <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
                                   <p className="text-red-700 text-sm">{error}</p>
                              </div>
                         )}
                    </div>

                    {/* Search Results */}
                    {hasSearched && (
                         <div className="mb-8">
                              <div className="flex justify-between items-center mb-6">
                                   <h3 className="text-xl font-semibold text-red-800">
                                        Search Results
                                        {!isLoading && (
                                             <span className="text-gray-600 font-normal text-base ml-2">
                                                  ({students.length} student{students.length !== 1 ? 's' : ''} found)
                                             </span>
                                        )}
                                   </h3>
                              </div>

                              {/* Results Grid */}
                              {students.length > 0 ? (
                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {students.map((student, index) => (
                                             <div key={student.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                                  {/* Card Header */}
                                                  <div className="bg-red-800 text-white p-4">
                                                       <h4 className="font-semibold text-lg">{firstLetterUpperCase(student.name)}</h4>
                                                       <p className="text-red-100 text-sm">@{firstLetterUpperCase(student.username)}</p>
                                                  </div>

                                                  {/* Card Content */}
                                                  <div className="p-4">
                                                       <div className="space-y-3">
                                                            {student?.department &&
                                                                 <div>
                                                                      <div className="flex items-start">
                                                                           <span className="text-gray-600 font-medium text-sm w-20 flex-shrink-0">Branch:</span>
                                                                           <span className="text-gray-900 text-sm">{firstLetterUpperCase(student?.branch)}</span>
                                                                      </div>
                                                                      <div className="flex items-start">
                                                                           <span className="text-gray-600 font-medium text-sm w-20 flex-shrink-0">Father:</span>
                                                                           <span className="text-gray-900 text-sm">{firstLetterUpperCase(student?.fatherName)}</span>
                                                                      </div>

                                                                      <div className="flex items-start">
                                                                           <span className="text-gray-600 font-medium text-sm w-20 flex-shrink-0">Dept:</span>
                                                                           <span className="text-gray-900 text-sm">{firstLetterUpperCase(student?.department)}</span>
                                                                      </div>

                                                                      <div className="flex items-start">
                                                                           <span className="text-gray-600 font-medium text-sm w-20 flex-shrink-0">Year:</span>
                                                                           <span className="text-gray-900 text-sm">{firstLetterUpperCase(student.year)}</span>
                                                                      </div>
                                                                 </div>
                                                            }
                                                            <div className="flex items-start">
                                                                 <span className="text-gray-600 font-medium text-sm w-20 flex-shrink-0">Phone:</span>
                                                                 <span className="text-gray-900 text-sm">{student?.phone}</span>
                                                            </div>
                                                       </div>

                                                       {/* Edit Link */}
                                                       {/* {student?.branch && */}
                                                       <div>

                                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                                 <NavLink
                                                                      key={`${index}`}
                                                                      to={`/student-update-page?doc_id=${student._id}`}
                                                                 >
                                                                      <button
                                                                           // onClick={() => handleEditStudent(student._id)}
                                                                           className="text-red-800 hover:text-red-900 font-medium text-sm hover:underline focus:outline-none focus:underline"
                                                                      >
                                                                           View Profile →
                                                                      </button>
                                                                 </NavLink>
                                                            </div>
                                                       </div>
                                                       {/* } */}
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              ) : (
                                   !isLoading && (
                                        <div className="text-center py-12 bg-white rounded-lg shadow-md">
                                             <div className="text-gray-400 mb-4">
                                                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4m-12 0H4m16 0a2 2 0 01-2 2M4 13a2 2 0 002 2" />
                                                  </svg>
                                             </div>
                                             <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                                             <p className="text-gray-600">Try adjusting your search criteria or check the spelling.</p>
                                        </div>
                                   )
                              )}
                         </div>
                    )}

                    {/* Welcome Message */}
                    {!hasSearched && !isLoading && (
                         <div className="text-center py-16 bg-white rounded-lg shadow-md">
                              <div className="text-red-800 mb-4">
                                   <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                   </svg>
                              </div>
                              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Student Directory</h3>
                              <p className="text-gray-600 max-w-md mx-auto">
                                   Use the search form above to find students by username, department, or branch.
                                   You can use one or multiple criteria to narrow down your results.
                              </p>
                         </div>
                    )}
               </main>
          </div>
     );
}