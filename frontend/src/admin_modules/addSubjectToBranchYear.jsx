import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import departmentsData from '../data/departmentsData.json';

export default function AddSubjectToBranchForm() {
     const navigate = useNavigate();
     const [formData, setFormData] = useState({
          department: '',
          year: '',
          branch: '',
          degree: '',
          subjectObject: {
               subName: '',
               subCode: '',
               username: '',
               teacher: ''
          }
     });
     const [formArray, setFormArray] = useState({
          degrees: [], branches: [], years: ['first-year', 'second-year', 'third-year', 'fourth-year'],
     });
     const [availableBranches, setAvailableBranches] = useState([]);
     const [selectedBranchInfo, setSelectedBranchInfo] = useState(null);

     const [defaultState, setDefaultState] = useState({});

     const [isLoadingBranches, setIsLoadingBranches] = useState(false);
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [errors, setErrors] = useState({});
     const [existingSubjects, setExistingSubjects] = useState([]);
     const [successMessage, setSuccessMessage] = useState('');
     const [apiError, setApiError] = useState('');

     const departments = departmentsData ? Object.keys(departmentsData) : [];

     // Static options
     useEffect(() => {
          // Set default selections if needed
          const departmentSelectBox = document.getElementById('department-select-box');
          const branchSelectBox = document.getElementById('branch-select-box');
          const yearSelectBox = document.getElementById('year-select-box');

     }, []);

     var defaultSelected = {
          'department': 'engineering',
          'branch': 'cse-b',
          'year': null,
     }
     var branches = [];
     var years = ['first-year', 'second-year', 'third-year', 'fourth-year'];


     // Sample common subjects for quick selection
     const commonSubjects = {
          'Computer Science': [
               { name: 'Data Structures and Algorithms', code: 'CS301' },
               { name: 'Database Management Systems', code: 'CS302' },
               { name: 'Operating Systems', code: 'CS303' },
               { name: 'Computer Networks', code: 'CS304' },
               { name: 'Software Engineering', code: 'CS305' },
               { name: 'Web Development', code: 'CS306' },
               { name: 'Machine Learning', code: 'CS401' },
               { name: 'Artificial Intelligence', code: 'CS402' }
          ],
          'Information Technology': [
               { name: 'System Analysis and Design', code: 'IT301' },
               { name: 'Network Security', code: 'IT302' },
               { name: 'Mobile App Development', code: 'IT303' },
               { name: 'Cloud Computing', code: 'IT304' },
               { name: 'Data Mining', code: 'IT305' },
               { name: 'Cybersecurity', code: 'IT306' }
          ],
          'Electronics': [
               { name: 'Digital Signal Processing', code: 'EC301' },
               { name: 'Microprocessors', code: 'EC302' },
               { name: 'VLSI Design', code: 'EC303' },
               { name: 'Communication Systems', code: 'EC304' },
               { name: 'Control Systems', code: 'EC305' }
          ],
          'Mechanical': [
               { name: 'Thermodynamics', code: 'ME301' },
               { name: 'Fluid Mechanics', code: 'ME302' },
               { name: 'Manufacturing Processes', code: 'ME303' },
               { name: 'Machine Design', code: 'ME304' }
          ],
          'Civil': [
               { name: 'Structural Analysis', code: 'CE301' },
               { name: 'Concrete Technology', code: 'CE302' },
               { name: 'Transportation Engineering', code: 'CE303' },
               { name: 'Environmental Engineering', code: 'CE304' }
          ]
     };

     // Mock API functions (replace with actual API calls)
     const mockApiCall = (endpoint, data, delay = 1000) => {
          return new Promise((resolve, reject) => {
               setTimeout(() => {
                    // Simulate random API responses
                    if (Math.random() > 0.1) { // 90% success rate
                         resolve({
                              status: 200,
                              data: {
                                   success: true,
                                   message: 'Operation successful',
                                   ...data
                              }
                         });
                    } else {
                         reject({
                              response: {
                                   data: {
                                        error: 'Simulated API error'
                                   }
                              }
                         });
                    }
               }, delay);
          });
     };

     // Fetch available degrees when department changes
     useEffect(() => {
          if (formData.department) {
               setFormArray(prev => ({
                    ...prev,
                    degrees: departmentsData[formData.department] ? Object.keys(departmentsData[formData.department]) : [],
               }));
               // console.log(formArray.degrees);
          } else {
               setFormArray(() => ({
                    degrees: [], branches: []
               }))
               // setAvailableBranches([]);
               // setSelectedBranchInfo(null);
               setExistingSubjects([]);
          }
     }, [formData.department]);

     useEffect(() => {
          if (formData.department && formData.degree) {
               setFormArray(prev => ({
                    ...prev,
                    years: departmentsData[formData.department][formData.degree]["requiredYear"] || [],
                    branches: departmentsData[formData.department][formData.degree]['branches'] || []
               }));
               console.log("department changed end");
               console.log(formArray.degrees);
          } else {
               setFormArray(() => ({
                    branches: [],
                    years: [],
               }))
               // setAvailableBranches([]);
               // setSelectedBranchInfo(null);
               setExistingSubjects([]);
          }
     }, [formData.degree]);

     useEffect(() => {
          if (formData.department && formData.degree) {
               setFormArray(prev => ({
                    ...prev,
                    branches: departmentsData[formData.department][formData.degree]['branches'] || []
               }));
          } else {
               setExistingSubjects([]);
          }
     }, [formData.year]);

     // Clear messages after 5 seconds
     useEffect(() => {
          if (successMessage || apiError) {
               const timer = setTimeout(() => {
                    setSuccessMessage('');
                    setApiError('');
               }, 5000);
               return () => clearTimeout(timer);
          }
     }, [successMessage, apiError]);

     const fetchAvailableBranches = async () => {
          setIsLoadingBranches(true);
          try {
               // Simulate API call
               await mockApiCall('get-available-branches', {}, 500);
               // setAvailableBranches(branches.map(b => ({ value: b, label: `Branch ${b}` })));
          } catch (error) {
               console.error('Error fetching branches:', error);
               setApiError('Failed to load available branches');
          } finally {
               setIsLoadingBranches(false);
          }
     };

     const fetchBranchInfo = async () => {
          try {
               // Simulate API call to get branch info
               const response = await mockApiCall('get-branch-info', {
                    department: formData.department,
                    year: formData.year,
                    branch: formData.branch,
                    totalStudents: Math.floor(Math.random() * 60) + 30, // Random 30-90 students
                    subjectsData: generateMockSubjects()
               }, 800);

               if (response.data) {
                    // setSelectedBranchInfo(response.data);
                    setExistingSubjects(response.data.subjectsData || []);
               }
          } catch (error) {
               console.error('Error fetching branch info:', error);
               // setSelectedBranchInfo(null);
               setExistingSubjects([]);
               setApiError('Failed to fetch branch information');
          }
     };

     const generateMockSubjects = () => {
          const mockSubjects = [
               { subName: 'Mathematics', subCode: 'MA301', teacher: 'Dr. Smith', status: 'active' },
               { subName: 'Physics', subCode: 'PH301', teacher: 'Prof. Johnson', status: 'active' },
               { subName: 'Programming Fundamentals', subCode: 'CS201', teacher: 'Dr. Brown', status: 'pending' }
          ];
          return mockSubjects.slice(0, Math.floor(Math.random() * 3) + 1);
     };

     const handleInputChange = (e) => {
          const { name, value } = e.target;

          if (name.startsWith('subject.')) {
               const subjectField = name.replace('subject.', '');
               setFormData(prev => ({
                    ...prev,
                    subjectObject: {
                         ...prev.subjectObject,
                         [subjectField]: value
                    }
               }));
          } else {
               setFormData(prev => ({
                    ...prev,
                    [name]: value
               }));
          }

          // Clear errors and messages
          if (errors[name]) {
               setErrors(prev => ({
                    ...prev,
                    [name]: ''
               }));
          }
          setSuccessMessage('');
          setApiError('');
     };

     const handleQuickSubjectSelect = (subject) => {
          setFormData(prev => ({
               ...prev,
               subjectObject: {
                    ...prev.subjectObject,
                    subName: subject.name,
                    subCode: subject.code
               }
          }));
          setSuccessMessage(`Quick selected: ${subject.name}`);
     };

     const validateForm = () => {
          const newErrors = {};
          const { subjectObject } = formData;

          // Branch selection validation
          if (!formData.department) newErrors.department = 'Department is required';
          if (!formData.year) newErrors.year = 'Year is required';
          if (!formData.branch) newErrors.branch = 'Branch is required';

          // Subject validation
          if (!subjectObject.subName.trim()) newErrors['subject.subName'] = 'Subject name is required';
          if (!subjectObject.subCode.trim()) newErrors['subject.subCode'] = 'Subject code is required';
          if (!subjectObject.username.trim()) newErrors['subject.username'] = 'Username is required';
          if (!subjectObject.teacher.trim()) newErrors['subject.teacher'] = 'Teacher name is required';

          // Check for duplicate subject codes
          const isDuplicate = existingSubjects.some(s =>
               s.subCode.toLowerCase() === subjectObject.subCode.toLowerCase() ||
               s.subName.toLowerCase() === subjectObject.subName.toLowerCase()
          );
          if (isDuplicate) {
               newErrors['subject.subCode'] = 'Subject code or Subject name already exists in this branch';
          }

          // Subject code format validation
          if (subjectObject.subCode && !/^[A-Z]{2}\d{3}$/.test(subjectObject.subCode.toUpperCase())) {
               newErrors['subject.subCode'] = 'Subject code should be in format: CS301, IT302, etc.';
          }

          // Username validation
          if (subjectObject.username && !/^[a-zA-Z0-9_]{3,20}$/.test(subjectObject.username)) {
               newErrors['subject.username'] = 'Username should be 3-20 characters (letters, numbers, underscore only)';
          }

          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (!validateForm()) {
               setApiError('Please fix the errors in the form');
               return;
          }

          setIsSubmitting(true);
          setApiError('');
          setSuccessMessage('');

          try {
               console.log("Submitting form data:", formData);

               const response = await axios.post(`${import.meta.env.VITE_API_URL}/add-subject-to-branch-year`, {
                    department: formData.department,
                    degree: formData.degree,
                    year: formData.year,
                    branch: formData.branch.toLowerCase(),
                    subjectObject: {
                         ...formData.subjectObject,
                         subCode: formData.subjectObject.subCode.toUpperCase()
                    }
               }, { withCredentials: true });

               if (response.status === 200) {

                    setSuccessMessage('Subject added successfully!');
                    // Reset subject form but keep branch selection
                    setFormData(prev => ({
                         ...prev,
                         subjectObject: {
                              subName: '',
                              subCode: '',
                              username: '',
                              teacher: '',
                         }
                    }));

                    // Refresh branch info to show new subject
                    // setTimeout(() => {
                    //      fetchBranchInfo();
                    // }, 500);
               }
          } catch (error) {
               console.error('Add subject error:', error);
               const message = error.response?.data?.error || 'Failed to add subject. Please try again.';
               setApiError(message);
          } finally {
               setIsSubmitting(false);
          }
     };

     const handleReset = () => {
          setFormData({
               department: '',
               year: '',
               branch: '',
               subjectObject: {
                    subName: '',
                    subCode: '',
                    username: '',
                    teacher: ''
               }
          });
          setErrors({});
          // setSelectedBranchInfo(null);
          setExistingSubjects([]);
          setSuccessMessage('');
          setApiError('');
     };

     const handleRemoveSubject = async (subjectCode) => {
          if (!window.confirm('Are you sure you want to remove this subject?')) {
               return;
          }

          try {
               await mockApiCall('remove-subject', { subjectCode }, 1000);
               setSuccessMessage('Subject removed successfully!');
               fetchBranchInfo(); // Refresh the list
          } catch (error) {
               setApiError('Failed to remove subject');
          }
     };
     const handleGoBack = () => {
          if (window.history.length > 1) {
               navigate(-1); // Go back to previous page
          } else {
               navigate('/'); // Fallback to home if no history
          }
     };

     return (
          <div className='min-h-screen bg-gray-200 '>
               <div className='mx-auto'>
                    {/* Header */}
                    <div className=' bg-red-800'>
                         <div className='flex flex-col sm:flex-row sm:place-items-center p-[2px] sm:p-4'>
                              <button
                                   onClick={handleGoBack}
                                   className='flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-red-100 hover:bg-red-200 text-red-800 hover:text-red-800 rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2'
                                   title="Go back"
                              >
                                   <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                   </svg>
                              </button>
                              <div className='flex items-center justify-center text-white gap-2 pl-3'>
                                   <div>
                                        <h1 className='text-2xl font-bold'>Add Subject to Branch</h1>
                                        <p className='mt-1 text-sm'>Add a new subject to an existing department-year-branch</p>
                                   </div>
                              </div>
                         </div>
                    </div>


                    <div className='m-1'>
                         <div className='grid grid-cols-1 lg:grid-cols-3 gap-2 sm:p-4'>
                              {/* Main Form */}
                              <div className='lg:col-span-2'>
                                   <div className='bg-white p-2 sm:p-9 backdrop-blur-md rounded-2xl shadow-xl border border-red-100 overflow-hidden'>
                                        <div className='text-red-800'>
                                             <h2 className='text-xl font-semibold '>Subject Information</h2>
                                             <p className=' text-sm'>Select branch and enter subject details</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className=''>
                                             {/* Branch Selection */}
                                             <div>
                                                  <h3 className='text-lg font-semibold text-red-800 mb-4 flex items-center gap-2'>
                                                       <div className='w-2 h-2 bg-red-600 rounded-full'></div>
                                                       Target Branch
                                                  </h3>
                                                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                                       <div>
                                                            <label className='block text-sm font-semibold text-red-800 mb-2'>Department *</label>
                                                            <select
                                                                 id='department-select-box'
                                                                 name='department'
                                                                 value={formData.department}
                                                                 onChange={handleInputChange}
                                                                 className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${errors.department ? 'border-red-300 bg-red-50' : 'border-red-200 focus:border-red-500'
                                                                      }`}
                                                            >
                                                                 <option value=''>Select Department</option>
                                                                 {departments.map(dept => (
                                                                      <option selected key={dept} value={dept}>{(dept => (
                                                                           dept.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                                                                      ))(dept)}</option>
                                                                 ))}
                                                            </select>
                                                            {errors.department && <p className='text-red-600 text-sm mt-1'>{errors.department}</p>}
                                                       </div>
                                                       <div>
                                                            <label className='block text-sm font-semibold text-red-800 mb-2'>Degree *</label>
                                                            <select
                                                                 id='degree-select-box'
                                                                 name='degree'
                                                                 value={formData.degree}
                                                                 onChange={handleInputChange}
                                                                 className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${errors.department ? 'border-red-300 bg-red-50' : 'border-red-200 focus:border-red-500'
                                                                      }`}
                                                            >
                                                                 <option value=''>Select Degree</option>
                                                                 {formArray.degrees && formArray.degrees.map(deg => (
                                                                      <option key={deg} value={deg}>{(deg => (
                                                                           deg.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                                                                      ))(deg)}</option>
                                                                 ))}
                                                            </select>
                                                            {errors.degree && <p className='text-red-600 text-sm mt-1'>{errors.degree}</p>}
                                                       </div>

                                                       <div>
                                                            <label className='block text-sm font-semibold text-red-800 mb-2'>Year *</label>
                                                            <select
                                                                 id='year-select-box'
                                                                 name='year'
                                                                 value={formData.year}
                                                                 onChange={handleInputChange}
                                                                 className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${errors.year ? 'border-red-300 bg-red-50' : 'border-red-200 focus:border-red-500'
                                                                      }`}
                                                            >
                                                                 <option value=''>Select Year</option>
                                                                 {formArray.years && formArray.years.map(year => (
                                                                      <option selected={defaultSelected['year']} key={year} value={year}>{(year => (
                                                                           year.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                                                                      ))(year)}</option>
                                                                 ))}
                                                            </select>
                                                            {errors.year && <p className='text-red-600 text-sm mt-1'>{errors.year}</p>}
                                                       </div>

                                                       <div>
                                                            <label className='block text-sm font-semibold text-red-800 mb-2'>Branch *</label>
                                                            <select
                                                                 id='branch-select-box'
                                                                 name='branch'
                                                                 value={formData.branch}
                                                                 onChange={handleInputChange}
                                                                 // disabled={!formData.department || !formData.year || isLoadingBranches}
                                                                 className={`w-full px-4 py-3 border-2 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${errors.branch ? 'border-red-300 bg-red-50' : 'border-red-200 focus:border-red-500'
                                                                      } ${(!formData.department || !formData.year) ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                                                            >
                                                                 <option value=''>
                                                                      {isLoadingBranches ? 'Loading branches...' : 'Select Branch'}
                                                                 </option>
                                                                 {formArray.branches.map(branch => (
                                                                      <option key={branch.value} value={branch.value}>{(branch => (
                                                                           branch.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                                                                      ))(branch)}</option>
                                                                 ))}
                                                            </select>
                                                            {errors.branch && <p className='text-red-600 text-sm mt-1'>{errors.branch}</p>}
                                                       </div>
                                                  </div>
                                             </div>

                                             {/* Quick Subject Selection */}
                                             {formData.department && commonSubjects[formData.department] && (
                                                  <div className='p-4 bg-blue-50 border border-blue-200 rounded-xl'>
                                                       <h4 className='text-sm font-semibold text-blue-800 mb-3'>Quick Select Common Subjects</h4>
                                                       <div className='flex flex-wrap gap-2'>
                                                            {commonSubjects[formData.department].map(subject => (
                                                                 <button
                                                                      key={subject.code}
                                                                      type='button'
                                                                      onClick={() => handleQuickSubjectSelect(subject)}
                                                                      className='px-3 py-1 text-xs bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-lg transition-colors duration-200'
                                                                 >
                                                                      {subject.code} - {subject.name}
                                                                 </button>
                                                            ))}
                                                       </div>
                                                  </div>
                                             )}

                                             {/* Subject Details */}
                                             <div>
                                                  <h3 className='text-lg font-semibold text-red-800 mb-4 flex items-center gap-2'>
                                                       <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                                                       Subject Details
                                                  </h3>
                                                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                                       <div className='md:col-span-2'>
                                                            <label className='block text-sm font-semibold text-red-800 mb-2'>Subject Name *</label>
                                                            <input
                                                                 type='text'
                                                                 name='subject.subName'
                                                                 value={formData.subjectObject.subName}
                                                                 onChange={handleInputChange}
                                                                 className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${errors['subject.subName'] ? 'border-red-300 bg-red-50' : 'border-red-200 focus:border-red-500'
                                                                      }`}
                                                                 placeholder='e.g., Data Structures and Algorithms'
                                                            />
                                                            {errors['subject.subName'] && <p className='text-red-600 text-sm mt-1'>{errors['subject.subName']}</p>}
                                                       </div>

                                                       <div>
                                                            <label className='block text-sm font-semibold text-red-800 mb-2'>Subject Code *</label>
                                                            <input
                                                                 type='text'
                                                                 name='subject.subCode'
                                                                 value={formData.subjectObject.subCode}
                                                                 onChange={handleInputChange}
                                                                 className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 font-mono ${errors['subject.subCode'] ? 'border-red-300 bg-red-50' : 'border-red-200 focus:border-red-500'
                                                                      }`}
                                                                 placeholder='CS301'
                                                                 style={{ textTransform: 'uppercase' }}
                                                            />
                                                            {errors['subject.subCode'] && <p className='text-red-600 text-sm mt-1'>{errors['subject.subCode']}</p>}
                                                       </div>

                                                       <div>
                                                            <label className='block text-sm font-semibold text-red-800 mb-2'>Teacher Username *</label>
                                                            <input
                                                                 type='text'
                                                                 name='subject.username'
                                                                 value={formData.subjectObject.username}
                                                                 onChange={handleInputChange}
                                                                 className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${errors['subject.username'] ? 'border-red-300 bg-red-50' : 'border-red-200 focus:border-red-500'
                                                                      }`}
                                                                 placeholder='teacher_username'
                                                            />
                                                            {errors['subject.username'] && <p className='text-red-600 text-sm mt-1'>{errors['subject.username']}</p>}
                                                       </div>

                                                       <div>
                                                            <label className='block text-sm font-semibold text-red-800 mb-2'>Teacher Name *</label>
                                                            <input
                                                                 type='text'
                                                                 name='subject.teacher'
                                                                 value={formData.subjectObject.teacher}
                                                                 onChange={handleInputChange}
                                                                 className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${errors['subject.teacher'] ? 'border-red-300 bg-red-50' : 'border-red-200 focus:border-red-500'
                                                                      }`}
                                                                 placeholder='Prof. John Doe'
                                                            />
                                                            {errors['subject.teacher'] && <p className='text-red-600 text-sm mt-1'>{errors['subject.teacher']}</p>}
                                                       </div>

                                                       {/* <div>
                                                       <label className='block text-sm font-semibold text-red-800 mb-2'>Initial PIN (Optional)</label>
                                                       <input
                                                            type='text'
                                                            name='subject.pin'
                                                            value={formData.subjectObject.pin}
                                                            onChange={handleInputChange}
                                                            maxLength='6'
                                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 font-mono ${errors['subject.pin'] ? 'border-red-300 bg-red-50' : 'border-red-200 focus:border-red-500'
                                                                 }`}
                                                            placeholder='123456'
                                                       />
                                                       {errors['subject.pin'] && <p className='text-red-600 text-sm mt-1'>{errors['subject.pin']}</p>}
                                                       <p className='text-xs text-slate-600 mt-1'>6-digit PIN for attendance (can be set later)</p>
                                                  </div> */}
                                                  </div>
                                             </div>
                                             {/* Success/Error Messages */}
                                             {(successMessage || apiError) && (
                                                  <div className='mb-6'>
                                                       {successMessage && (
                                                            <div className='bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center gap-2'>
                                                                 <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                 </svg>
                                                                 {successMessage}
                                                            </div>
                                                       )}
                                                       {apiError && (
                                                            <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-2'>
                                                                 <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                 </svg>
                                                                 {apiError}
                                                            </div>
                                                       )}
                                                  </div>
                                             )}
                                             {/* Action Buttons */}
                                             <div className='flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200'>
                                                  <button
                                                       type='button'
                                                       onClick={handleReset}
                                                       className='flex-1 sm:flex-none px-6 py-3 border-2 border-red-200 text-red-700 bg-white hover:bg-red-50 rounded-xl font-semibold transition-all duration-200 hover:border-red-300 flex items-center justify-center gap-2'
                                                  >
                                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                       </svg>
                                                       Reset Form
                                                  </button>

                                                  <button
                                                       type='submit'
                                                       disabled={isSubmitting}
                                                       className={`flex-1 px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-3 ${isSubmitting
                                                            ? 'bg-gradient-to-r from-slate-400 to-slate-500 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                                                            }`}
                                                  >
                                                       {isSubmitting ? (
                                                            <>
                                                                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                 <span>Adding Subject...</span>
                                                            </>
                                                       ) : (
                                                            <>
                                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                 </svg>
                                                                 <span>Add Subject</span>
                                                            </>
                                                       )}
                                                  </button>
                                             </div>
                                        </form>
                                   </div>
                              </div>

                              {/* Sidebar - Branch Info & Existing Subjects */}
                              <div className='lg:col-span-1 space-y-6'>
                                   {/* Statistics Card */}
                                   <div className='bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-red-100 p-6'>
                                        <h3 className='text-lg font-semibold text-red-800 mb-4 flex items-center gap-2'>
                                             <div className='w-2 h-2 bg-indigo-600 rounded-full'></div>
                                             Quick Stats
                                        </h3>
                                        <div className='grid grid-cols-2 gap-3'>
                                             <div className='bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 text-center'>
                                                  <p className='text-2xl font-bold text-blue-700'>{departments.length}</p>
                                                  <p className='text-xs text-blue-600'>Departments</p>
                                             </div>
                                             <div className='bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 text-center'>
                                                  <p className='text-2xl font-bold text-green-700'>{years.length}</p>
                                                  <p className='text-xs text-green-600'>Year Levels</p>
                                             </div>
                                             <div className='bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 text-center'>
                                                  <p className='text-2xl font-bold text-purple-700'>{branches.length}</p>
                                                  <p className='text-xs text-purple-600'>Branches</p>
                                             </div>
                                             <div className='bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 text-center'>
                                                  <p className='text-2xl font-bold text-orange-700'>{existingSubjects.length}</p>
                                                  <p className='text-xs text-orange-600'>Current Subjects</p>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Branch Information */}
                                   {selectedBranchInfo && (
                                        <div className='bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-red-100 p-6'>
                                             <h3 className='text-lg font-semibold text-red-800 mb-4 flex items-center gap-2'>
                                                  <div className='w-2 h-2 bg-green-600 rounded-full animate-pulse'></div>
                                                  Branch Information
                                             </h3>
                                             <div className='space-y-3'>
                                                  <div className='bg-red-50 rounded-lg p-3'>
                                                       <p className='text-xs text-red-600 mb-1'>Department</p>
                                                       <p className='font-semibold text-red-800'>{selectedBranchInfo.department}</p>
                                                  </div>
                                                  <div className='grid grid-cols-2 gap-3'>
                                                       <div className='bg-blue-50 rounded-lg p-3'>
                                                            <p className='text-xs text-blue-600 mb-1'>Year</p>
                                                            <p className='font-semibold text-blue-800'>{selectedBranchInfo.year}</p>
                                                       </div>
                                                       <div className='bg-purple-50 rounded-lg p-3'>
                                                            <p className='text-xs text-purple-600 mb-1'>Branch</p>
                                                            <p className='font-semibold text-purple-800'>{selectedBranchInfo.branch}</p>
                                                       </div>
                                                  </div>
                                                  <div className='bg-green-50 rounded-lg p-3'>
                                                       <p className='text-xs text-green-600 mb-1'>Total Students</p>
                                                       <p className='font-semibold text-green-800'>{selectedBranchInfo.totalStudents}</p>
                                                  </div>
                                             </div>
                                        </div>
                                   )}

                                   {/* Existing Subjects */}
                                   {existingSubjects.length > 0 && (
                                        <div className='bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-red-100 p-6'>
                                             <h3 className='text-lg font-semibold text-red-800 mb-4 flex items-center gap-2'>
                                                  <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                                                  Existing Subjects ({existingSubjects.length})
                                             </h3>
                                             <div className='space-y-2 max-h-60 overflow-y-auto'>
                                                  {existingSubjects.map((subject, index) => (
                                                       <div key={index} className='bg-slate-50 border border-slate-200 rounded-lg p-3 hover:bg-slate-100 transition-colors duration-200'>
                                                            <div className='flex items-start justify-between'>
                                                                 <div className='flex-1'>
                                                                      <p className='font-semibold text-slate-800 text-sm'>{subject.subName}</p>
                                                                      <p className='text-xs text-slate-600 font-mono'>{subject.subCode}</p>
                                                                      <p className='text-xs text-slate-600'>{subject.teacher}</p>
                                                                 </div>
                                                                 <div className='flex items-center gap-2'>
                                                                      <div className={`px-2 py-1 rounded-full text-xs ${subject.status === 'active'
                                                                           ? 'bg-green-100 text-green-800'
                                                                           : 'bg-slate-100 text-slate-600'
                                                                           }`}>
                                                                           {subject.status || 'pending'}
                                                                      </div>
                                                                      <button
                                                                           onClick={() => handleRemoveSubject(subject.subCode)}
                                                                           className='text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors duration-200'
                                                                           title='Remove subject'
                                                                      >
                                                                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                           </svg>
                                                                      </button>
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>
                                   )}

                                   {/* Help Card */}
                                   <div className='bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6'>
                                        <h3 className='text-lg font-semibold text-indigo-800 mb-3 flex items-center gap-2'>
                                             <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                             </svg>
                                             Help & Tips
                                        </h3>
                                        <div className='space-y-3 text-sm text-indigo-700'>
                                             <div className='flex items-start gap-2'>
                                                  <div className='w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2'></div>
                                                  <p>Subject codes should follow the format: <span className='font-mono bg-indigo-100 px-1 rounded'>CS301</span></p>
                                             </div>
                                             <div className='flex items-start gap-2'>
                                                  <div className='w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2'></div>
                                                  <p>Use the quick select buttons to add common subjects quickly</p>
                                             </div>
                                             <div className='flex items-start gap-2'>
                                                  <div className='w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2'></div>
                                                  <p>PIN is optional and can be set later for attendance tracking</p>
                                             </div>
                                             <div className='flex items-start gap-2'>
                                                  <div className='w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2'></div>
                                                  <p>Teacher username should be unique and without spaces</p>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Recent Activity (Mock) */}
                                   <div className='bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-red-100 p-6'>
                                        <h3 className='text-lg font-semibold text-red-800 mb-4 flex items-center gap-2'>
                                             <div className='w-2 h-2 bg-yellow-600 rounded-full'></div>
                                             Recent Activity
                                        </h3>
                                        <div className='space-y-3 text-sm'>
                                             <div className='flex items-center gap-3 p-2 bg-green-50 rounded-lg'>
                                                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                                  <div className='flex-1'>
                                                       <p className='text-green-800 font-medium'>CS301 added successfully</p>
                                                       <p className='text-green-600 text-xs'>2 minutes ago</p>
                                                  </div>
                                             </div>
                                             <div className='flex items-center gap-3 p-2 bg-blue-50 rounded-lg'>
                                                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                                  <div className='flex-1'>
                                                       <p className='text-blue-800 font-medium'>Branch B selected</p>
                                                       <p className='text-blue-600 text-xs'>5 minutes ago</p>
                                                  </div>
                                             </div>
                                             <div className='flex items-center gap-3 p-2 bg-purple-50 rounded-lg'>
                                                  <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                                                  <div className='flex-1'>
                                                       <p className='text-purple-800 font-medium'>Form initialized</p>
                                                       <p className='text-purple-600 text-xs'>10 minutes ago</p>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}