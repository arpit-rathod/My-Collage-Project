import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import departmentsData from '../data/departmentsData.json';

export default function BranchYearForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    department: '',
    degree: '',
    year: '',
    branch: '',
    totalStudents: '',
  });
  const [formArray, setFormArray] = useState({
    degrees: [],
    years: [],
    branches: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiErrors, setApiErrors] = useState({ resError: '', formError: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);

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
        years: [],
        branches: [],
      }))
    }
  }, [formData.degree]);
  useEffect(() => {
    if (formData.department && formData.degree) {
      setFormArray(prev => ({
        ...prev,
        branches: departmentsData[formData.department][formData.degree]['branches'] || []
      }));
    } else {
      setFormArray(prev => ({
        ...prev,
        branches: [],
      }));
    }
  }, [formData.year]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // [name]: name === 'totalStudents' || name === 'previousAttendanceCount'
      //      ? parseInt(value) || 0
      //      : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Department validation
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    // Degree validation
    if (!formData.degree) {
      newErrors.degree = 'Degree is required';
    }
    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    // Branch validation
    if (!formData.branch) {
      newErrors.branch = 'Branch is required';
    }

    // Total students validation
    if (!formData.totalStudents || formData.totalStudents <= 0) {
      newErrors.totalStudents = 'Total students must be greater than 0';
    } else if (formData.totalStudents > 200) {
      newErrors.totalStudents = 'Total students cannot exceed 200';
    }

    // Previous attendance validation
    if (formData.previousAttendanceCount < 0) {
      newErrors.previousAttendanceCount = 'Previous attendance count cannot be negative';
    } else if (formData.previousAttendanceCount > formData.totalStudents) {
      newErrors.previousAttendanceCount = 'Previous attendance cannot exceed total students';
    }

    // setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // toast.error('Please fix the errors in the form');
      setApiErrors((prev) => ({
        ...prev,
        formError: "Fill all required fields"
      }))
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/add-branch-year-doc`, formData, {
        withCredentials: true
      });

      if (response.status === 201) {
        toast.success('Branch document created successfully!');
        // Reset form
        setFormData({
          department: '',
          year: '',
          branch: '',
          degree: '',
          totalStudents: '',
        });
        setErrors({});
        setShowAdvanced(false);
      }
    } catch (error) {
      console.error('Creation error:', error);
      const message = error.response.data.message || error.response.data.error || "status code 505 , internal server error."
      setApiErrors(() => (
        {
          resError: message,
        }))
      setTimeout(() => {
        setApiErrors(prev => ({
          ...prev,
          resError: "",
        }))
      }, 5000)
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Go back to previous page
    } else {
      navigate('/'); // Fallback to home if no history
    }
  };
  const handleReset = () => {
    setFormData({
      department: '',
      year: '',
      branch: '',
      totalStudents: '',
      previousAttendanceCount: 0,
      students: []
    });
    setErrors({});
    setShowAdvanced(false);
  };

  return (
    <div className='m-0 min-h-screen'>
      <div className='bg-gray-200'>
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
              {/* <div className='bg-red-100 p-3 rounded-xl'>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                   </div> */}
              <div >
                <h1 className='text-2xl font-bold'>Create Branch Document</h1>
                <p className='text-sm'>Setup a new department-year-branch combination</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className='m-1 sm:m-8'>
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
            <div className='text-red-800 p-3 sm:p-4'>
              <h2 className='text-2xl font-semibold'>Branch Information</h2>
              <p className='text-sm'>Fill in the details for the new academic branch</p>
            </div>

            <form onSubmit={handleSubmit} className='p-6 sm:p-8'>
              {/* Basic Information */}
              <div className='mb-8 -p-1 sm:p-4'>
                <h3 className='text-lg font-semibold text-red-800 mb-4 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-red-600 rounded-full'></div>
                  Basic Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {/* Department */}
                  <div className='md:col-span-1'>
                    <label className='block text-sm font-semibold text-red-800 mb-2'>
                      Department *
                    </label>
                    <select
                      name='department'
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${errors.department
                        ? 'border-red-300 bg-red-50'
                        : 'border-red-200 focus:border-red-500'
                        }`}
                    >
                      <option value=''>Select Department</option>
                      {Object.keys(departmentsData).map(dept => (
                        <option key={dept} value={dept}>{dept.toUpperCase()}</option>
                      ))}
                    </select>
                    {errors.department && <p className='text-red-600 text-sm mt-1'>{errors.department}</p>}
                  </div>
                  {/* Degree */}
                  <div className='md:col-span-1'>
                    <label className='block text-sm font-semibold text-red-800 mb-2'>
                      Degree *
                    </label>
                    <select
                      name='degree'
                      value={formData.degree}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${errors.department
                        ? 'border-red-300 bg-red-50'
                        : 'border-red-200 focus:border-red-500'
                        }`}
                    >
                      <option value=''>Select Degree</option>
                      {formData.department && formArray.degrees && formArray.degrees.map(deg => (
                        <option key={deg} value={deg}>{(deg => (
                          deg.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                        ))(deg)}</option>
                      ))}
                    </select>
                    {errors.department && <p className='text-red-600 text-sm mt-1'>{errors.department}</p>}
                  </div>
                  {/* Year */}
                  <div className='md:col-span-1'>
                    <label className='block text-sm font-semibold text-red-800 mb-2'>
                      Academic Year *
                    </label>
                    <select
                      name='year'
                      value={formData.year}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${errors.year
                        ? 'border-red-300 bg-red-50'
                        : 'border-red-200 focus:border-red-500'
                        }`}
                    >
                      <option value=''>Select Year</option>
                      {formArray.years.map(year => (
                        <option key={year} value={year}>{year.toUpperCase()}</option>
                      ))}
                    </select>
                    {errors.year && <p className='text-red-600 text-sm mt-1'>{errors.year}</p>}
                  </div>

                  {/* Branch */}
                  <div className='md:col-span-1'>
                    <label className='block text-sm font-semibold text-red-800 mb-2'>
                      Branch Section *
                    </label>
                    <select
                      name='branch'
                      value={formData.branch}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${errors.branch
                        ? 'border-red-300 bg-red-50'
                        : 'border-red-200 focus:border-red-500'
                        }`}
                    >
                      <option value=''>Select Branch</option>
                      {formArray.branches.map(branch => (
                        <option key={branch} value={branch}>{branch.toUpperCase()}</option>
                      ))}
                    </select>
                    {errors.branch && <p className='text-red-600 text-sm mt-1'>{errors.branch}</p>}
                  </div>
                </div>
              </div>

              {/* Student Information */}
              <div className='mb-8'>
                <h3 className='text-lg font-semibold text-red-800 mb-4 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                  Student Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Total Students */}
                  <div className='md:col-span-1'>
                    <label className='block text-sm font-semibold text-red-800 mb-2'>
                      Total Students *
                    </label>
                    <div className='relative'>
                      <input
                        type='number'
                        name='totalStudents'
                        value={formData.totalStudents}
                        onChange={handleInputChange}
                        min='1'
                        max='200'
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${errors.totalStudents
                          ? 'border-red-300 bg-red-50'
                          : 'border-red-200 focus:border-red-500'
                          }`}
                        placeholder='Enter total number of students'
                      />
                      <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    {errors.totalStudents && <p className='text-red-600 text-sm mt-1'>{errors.totalStudents}</p>}
                    <p className='text-xs text-slate-600 mt-1'>Maximum 200 students per branch</p>
                  </div>

                  {/* Advanced Options Toggle */}
                  <div className='md:col-span-1 flex items-center'>
                    <button
                      type='button'
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className='flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors duration-200'
                    >
                      <svg className={`w-4 h-4 transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Advanced Options
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className='mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl'>
                  <h3 className='text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2'>
                    <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                    Advanced Settings
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Previous Attendance Count */}
                    <div className='md:col-span-1'>
                      <label className='block text-sm font-semibold text-blue-800 mb-2'>
                        Previous Attendance Count
                      </label>
                      <div className='relative'>
                        <input
                          type='number'
                          name='previousAttendanceCount'
                          value={formData.previousAttendanceCount}
                          onChange={handleInputChange}
                          min='0'
                          max={formData.totalStudents || 100}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.previousAttendanceCount
                            ? 'border-red-300 bg-red-50'
                            : 'border-blue-200 focus:border-blue-500 bg-white'
                            }`}
                          placeholder='0'
                        />
                        <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                      </div>
                      {errors.previousAttendanceCount && <p className='text-red-600 text-sm mt-1'>{errors.previousAttendanceCount}</p>}
                      <p className='text-xs text-blue-600 mt-1'>Historical attendance data for reference (optional)</p>
                    </div>

                    <div className='md:col-span-1 flex items-center'>
                      <div className='bg-blue-100 border border-blue-200 rounded-xl p-4'>
                        <h4 className='font-semibold text-blue-800 text-sm mb-2'>Note</h4>
                        <p className='text-xs text-blue-700'>Student list will be empty initially. Students can be added later through the student registration process.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Card */}
              {(formData.department || formData.year || formData.branch) && (
                <div className='mb-8 p-4 bg-red-50 border border-red-200 rounded-xl'>
                  <h3 className='text-lg font-semibold text-red-800 mb-3 flex items-center gap-2'>
                    <div className='w-2 h-2 bg-red-600 rounded-full'></div>
                    Preview
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-center'>
                    <div className='bg-white rounded-lg p-3 border border-red-200'>
                      <p className='text-xs text-red-600 mb-1'>Department</p>
                      <p className='font-semibold text-red-800'>{formData.department || '---'}</p>
                    </div>
                    <div className='bg-white rounded-lg p-3 border border-red-200'>
                      <p className='text-xs text-red-600 mb-1'>Year - Branch</p>
                      <p className='font-semibold text-red-800'>{formData.year || '---'} {formData.branch ? `- ${formData.branch}` : ''}</p>
                    </div>
                    <div className='bg-white rounded-lg p-3 border border-red-200'>
                      <p className='text-xs text-red-600 mb-1'>Total Students</p>
                      <p className='font-semibold text-red-800'>{formData.totalStudents || '0'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className='p-2'>
                <div className='text-sm text-red-700 text-start'>{apiErrors?.resError}</div>
                <div className='text-sm text-red-700 text-start'>{apiErrors?.formError}</div>
              </div>
              <div className='flex flex-col sm:flex-row gap-4'>
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
                  className={`flex-1 px-8 py-3 rounded-xl font-semibold text-black shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl flex items-center justify-center gap-3 ${isSubmitting
                    ? 'bg-gradient-to-r from-slate-400 to-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Create Branch Document</span>
                    </>
                  )}
                </button>
              </div>

              {/* Help Information */}
              <div className='mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl'>
                <div className='flex items-start gap-3'>
                  <svg className="w-5 h-5 text-slate-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className='font-semibold text-slate-800 mb-1'>Important Information</h4>
                    <ul className='text-sm text-slate-700 space-y-1'>
                      <li>• This creates a new branch document for the specified department, year, and section</li>
                      <li>• Students can be added to this branch later through student registration</li>
                      <li>• Each branch combination (Department + Year + Section) should be unique</li>
                      <li>• Previous attendance count is optional and used for reference only</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}