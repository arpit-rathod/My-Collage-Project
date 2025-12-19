import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Calendar, User, ChevronDown, ChevronUp, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';
import { RefreshCw } from 'lucide-react';
import { storeWeeklyAttendance, getWeekAttendance } from '../../database/services/Dexie.js'
import { ProfileContext } from '../../All-Provider/profileDataProvider';
import FullPageSpinner from '../../animation-components/spinner.jsx'


// import { ProfileContext } from './All-Provider/profileDataProvider';
// const { profileData, profileDataLoading } = useContext(Profile

function getCurrentWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0=Sunday, 1=Monday, etc.
  const diff = day === 0 ? -6 : 1 - day; // Go back to Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0); // Reset to start of day

  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const date = String(monday.getDate()).padStart(2, '0');

  return `${year}-${month}-${date}`;
}

export function LectureAttendanceCalendar() {
  const { profileData, profileDataLoading } = useContext(ProfileContext);
  // State management (data store करने के लिए)
  const [selectedWeekStart, setSelectedWeekStart] = useState(getCurrentWeekStart); // current selected week start date 
  // const [selectedWeekStart, setSelectedWeekStart] = useState(new Date().toISOString().split('T')[0]); // current selected week start date 
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(profileData, profileDataLoading);
  // const [expandedWeeks, setExpandedWeeks] = useState({ 0: true });
  // const [currentWeekData, setCurrentWeekData] = useState(null);
  // const [currentWeek, setCurrentWeek] = useState(null); // current week data 
  // const [allWeeks, setAllWeeks] = useState([]);

  // Student details - Real example: Login करने के बाद ye details milti हैं
  // const studentUsername = profileData?.name;

  let studentUsername = null;

  useEffect(() => {
    studentUsername = profileData?.name;
  }, [profileData]);


  // const session = "2024-25";
  // const department = "engineering";
  const [weekStats, setWeekStats] = useState(null);
  const [weekDates, setWeekDates] = useState([]);

  // let isExpanded = expandedWeeks[weekIndex];

  const calculateWeekEnd = (weekStart) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + 6);
    return date.toISOString().split('T')[0];
  };
  // API se data fetch karo
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const weekKey = selectedWeekStart; // e.g. "2025-09-15"
      let weeksData = JSON.parse(sessionStorage.getItem("weeksData")) || {};
      console.log(weeksData);

      if (weeksData[weekKey]) {
        console.log("Using cached week:", weekKey);
        const organized = transformApiData(weeksData[weekKey].lectures);
        setAttendanceData(organized);
        const dates = Object.keys(organized);
        setWeekDates(dates);
        const stats = getWeekStats(dates);
        setWeekStats(stats);
        return;  // STOP execution — no API call required
      } else {
        console.log("fetching from api");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/student-attendance/${studentUsername}`, {
          withCredentials: true,
          params: {
            startDate: selectedWeekStart,
            endDate: calculateWeekEnd(selectedWeekStart)
          },
        });
        console.log("API Response:", response.data);

        let newWeekData = {
          weekStart: selectedWeekStart,
          weekEnd: calculateWeekEnd(selectedWeekStart),
          lectures: response.data?.data,
          lastUpdated: new Date().toISOString()
        };
        weeksData[weekKey] = newWeekData
        window.sessionStorage.setItem("weeksData", JSON.stringify(weeksData));
        const organized = transformApiData(weeksData[selectedWeekStart]['lectures']);
        console.log(organized);
        setAttendanceData(organized);
        setWeekDates(Object.keys(organized));
        setWeekStats(getWeekStats(Object.keys(organized)));
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const calculateNextWeek = (offset) => {
    const date = new Date(selectedWeekStart);
    date.setDate(date.getDate() + offset);
    let nextWeek = date.toISOString().split('T')[0]
    setSelectedWeekStart(nextWeek)
    return nextWeek;
  };
  const NextWeek = () => {
    console.log(calculateNextWeek(7));
  }
  const previousWeek = () => {
    console.log(calculateNextWeek(-7));
  }
  // weekly lectures ko date wise grouped kr rhe h 
  // organized = {lectures=['2025-09-15'= [],'2025-09-16'= []]}
  const transformApiData = (apiData) => {
    const organized = {};

    // Group by date (date-wise lectures organize karo)
    apiData.forEach((record) => {
      if (!organized[record.date]) {
        organized[record.date] = {
          lectures: []
        };
      }

      organized[record.date].lectures.push({
        id: `${record.date}-${record.subCode}`,
        subject: record.subCode,
        subjectName: record.subName,
        status: record.status,
        time: "10:00 AM" // Can be added to API response
      });
    });

    return organized;
  };

  // Component load होते ही data fetch
  useEffect(() => {
    fetchAttendanceData();
  }, [selectedWeekStart]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const formatWeekRange = (dates) => {
    const startDate = new Date(selectedWeekStart);
    // const endDate = new Date(dates[dates.length - 1]);
    const endDate = new Date(calculateWeekEnd(selectedWeekStart));
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[startDate.getMonth()]} ${startDate.getDate()} - ${months[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;
  };

  const getDayStats = (dateStr) => {
    const dayData = attendanceData[dateStr];
    if (!dayData) return { total: 0, present: 0, absent: 0, percentage: 0 };

    const lectures = dayData.lectures;
    const present = lectures.filter(l => l.status === 'present').length;
    const absent = lectures.filter(l => l.status === 'absent').length;
    const total = lectures.length;
    const percentage = Math.round((present / total) * 100);

    return { total, present, absent, percentage };
  };

  const getWeekStats = (dates) => {
    let totalLectures = 0;
    let totalPresent = 0;
    let totalAbsent = 0;

    dates.forEach(dateStr => {
      const stats = getDayStats(dateStr);
      totalLectures += stats.total;
      totalPresent += stats.present;
      totalAbsent += stats.absent;
    });

    const percentage = totalLectures > 0 ? Math.round((totalPresent / totalLectures) * 100) : 0;
    return { totalLectures, totalPresent, totalAbsent, percentage };
  };
  // Loading state
  if (loading || profileDataLoading) {
    // return (
    //   <div className="bg-gradient-to-br from-blue-500 via-indigo-50 to-purple-500 flex items-center justify-center">
    //     <div className="text-center">
    //       <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
    //       <p className="text-xl text-gray-700 font-semibold">Loading your attendance...</p>
    //     </div>
    //   </div>
    // );
    return (
      <FullPageSpinner></FullPageSpinner>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-500 via-indigo-50 to-purple-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchAttendanceData}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="sm:rounded-sm bg-gradient-to-br">
      <div className="mx-auto bg-gray-300">
        {/* Header */}
        <div className="p-1 sm:p-1 sm:mb-4 border-b-[1px] border-gray-400">
          <div className="flex items-center justify-between px-2 sm:px-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {/* <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div> */}
              <div>
                <h1 className="text-[15px] sm:text-2xl font-bold text-gray-700">
                  Your Weekly Lecture-wise Attendance
                </h1>
                {/* <p className="text-gray-600 text-[15px] sm:text-sm text-left">
                  {session} • {department} Department
                </p> */}
              </div>
            </div>
            {/* <div className="text-right"> */}
            {/* <p className="text-sm text-gray-500">Total Lectures</p>
              <p className="text-3xl font-bold text-indigo-600">
                {Object.values(attendanceData).reduce((sum, day) => sum + day.lectures.length, 0)}
              </p> */}
            {/* <button
                onClick={fetchAttendanceData}
                className="mt-2 px-4 py-1.5 bg-white rounded-lg text-sm text-indigo-600 hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button> */}
            {/* </div> */}
          </div>
        </div>

        {/* Weekly Accordion */}
        <div className="space-y-4 w-full">
          <div className="space-y-4 flex flex-wrap justify-center sm:gap-2">
            {/* {weeks.map((week, weekIndex) => { */}
            <div className="rounded-sm shadow-lg border-[1px] border-gray-400 sm:m-4 m-[1.9px] w-full md:w-[800px] sm:p-2">

              {/* Week Header */}
              <div className="flex items-center gap-1 sm:gap-2 flex-nowrap sm:p-1 justify-between p-1 hover:bg-gray-50 transition-colors">
                <div className="flex items-center sm:gap-1">
                  <div className="mx-1 w-5 h-5 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-3 h-3 sm:w-5 sm:h-5 text-red-800" />
                  </div>
                  <div className="text-left">
                    {/* <h3 className="text-sm sm:text-lg font-bold text-gray-800">Week</h3> */}
                    <p className="text-sm text-gray-500">{formatWeekRange(weekDates)}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm sm:t  ext-2xl font-bold text-indigo-600">{weekStats.percentage}%</p>
                  {/* <p className="text-xs text-gray-500">
                    {weekStats.totalPresent}/{weekStats.totalLectures} lectures
                  </p> */}
                </div>
                <div className="flex gap-2">
                  <div className="px-1 sm:px-3 sm:py-1 bg-green-100 rounded-full">
                    <span className="text-sm font-semibold text-green-700">{weekStats.totalPresent}P</span>
                  </div>
                  <div className="px-1 sm:px-3 sm:py-1 bg-red-100 rounded-full">
                    <span className="text-sm font-semibold text-red-700">{weekStats.totalAbsent}A</span>
                  </div>
                </div>
                <div>
                  <div className='flex gap-1'>
                    <ChevronLeft onClick={() => previousWeek()} className="w-7 h-9 sm:w-9 sm:h-12 text-gray-500 bg-gray-200 hover:bg-gray-300 rounded-sm" />
                    <ChevronRight onClick={() => NextWeek()} className="w-7 h-9 sm:w-9 sm:h-12 text-gray-500 bg-gray-200  hover:bg-gray-300 rounded-sm" />
                  </div>
                </div>
                {/* {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )} */}
              </div>
              {/* Week Content - Day wise lectures */}
              <div className="border-t border-gray-200 bg-gray-50 p-2 sm:p-4 min-h-80">
                <div className="space-y-2">
                  {weekDates.map((dateStr) => {
                    const dayStats = getDayStats(dateStr);
                    const dayData = attendanceData[dateStr];

                    return (
                      <div
                        key={dateStr}
                        className="bg-white rounded-xl overflow-hidden shadow-sm border-2 border-gray-200"
                      >
                        {/* Day Header */}
                        <div className="w-full p-1 sm:p-4 flex items-start justify-between">
                          {/* Left side */}
                          <div className="flex items-center gap-1 sm:gap-3">
                            <div className="w-5 h-5 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-red-800" />
                            </div>

                            <div className="text-left">
                              {/* DATE TEXT */}
                              <p className="font-semibold text-gray-800 text-[12px] sm:text-base lg:text-lg">
                                {formatDate(dateStr)}
                              </p>

                              {/* PRESENT/TOTAL */}
                              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                                {dayStats.present}/{dayStats.total} Present
                              </p>
                            </div>
                          </div>

                          {/* Right side Lectures */}
                          <div className="flex-1 sm:ml-4">
                            <div className="flex flex-wrap gap-2 justify-end">
                              {dayData.lectures.map((lecture) => (
                                <div
                                  key={lecture.id}
                                  className={`flex items-center gap-1 sm:gap-2 px-1 py-1 sm:px-3 sm:py-2 rounded-lg transition-all hover:scale-105 ${lecture.status === "present"
                                    ? "bg-green-100 border border-green-300"
                                    : "bg-red-100 border border-red-300"
                                    }`}
                                >
                                  {lecture.status === "present" ? (
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                                  ) : lecture.status === "absent" ? (
                                    <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                                  ) : null}

                                  <div className="text-left">
                                    {/* SUBJECT CODE */}
                                    <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800">
                                      {lecture.subject}
                                    </p>

                                    {/* Subject short name */}
                                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 hidden sm:block">
                                      {lecture?.sortName}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card
        {weeks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 m-4 sm:m-0 mt-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Overall Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <p className="text-3xl font-bold text-indigo-600">
                  {weeks.length > 0 ? getWeekStats(weeks[0].dates).percentage : 0}%
                </p>
                <p className="text-sm text-gray-600 mt-1">Attendance</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {Object.values(attendanceData).reduce((sum, day) =>
                    sum + day.lectures.filter(l => l.status === 'present').length, 0
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-1">Present</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">
                  {Object.values(attendanceData).reduce((sum, day) =>
                    sum + day.lectures.filter(l => l.status === 'absent').length, 0
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-1">Absent</p>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}


const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getYearsArray(admissionYear) {
  const years = null;
  const currentYear = new Date().getFullYear();
  const startYear = parseInt(admissionYear);

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year.toString());
  }
  console.log(years);
  return years;
}


export default function AttendanceCalendar() {

  const ref = useRef(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profileData, profileDataLoading } = useContext(ProfileContext);

  let studentUsername = null;
  let years = null;


  useEffect(() => {
    years = ["2023", "2024", "2025", "2026", "2027", "2028"];
    studentUsername = profileData?.name;
  }, [profileData]);

  useEffect(() => {
    async function fetchLectures() {
      console.log("Fetching lectures... for student");
      try {
        // setLecturesDataIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/student-attendance/${studentUsername}`, {
          withCredentials: true,
          params: {
            year: 'third-year',
          },
        });
        if (response.status == 200) {
          console.log("lectures information fetched");
          console.log(response.data);
          setAttendanceData(response.data?.data);
        } else {
          console.log("No lecture information found");
        }
      } catch (error) {
        console.log(error);
        // toast.error("Failed to fetch lectures");
      } finally {
        // setLecturesDataIsLoading(false);
        setLoading(false);
        // setTimeout(() => {
        //   ref.current.scrollLeft = ref.current.scrollWidth;
        // }, 5000)
      }
    }
    fetchLectures();
  }, []);
  const attendanceMap = {};
  if (attendanceData) {
    attendanceData.forEach((record) => {
      attendanceMap[record.date] = record.status;
    });
  }


  // Government holidays list (भारत के main holidays)
  const governmentHolidays = [
  ];
  // "2025-01-26", // Republic Day
  // "2025-08-15", // Independence Day
  // "2025-10-02", // Gandhi Jayanti
  // "2025-03-14", // Holi (example)
  // "2025-10-24", // Diwali (example)

  // Check if date is government holiday
  const isGovernmentHoliday = (date) => {
    return governmentHolidays.includes(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading attendance...</div>
      </div>
    );
  }
  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0;
  }
  if (profileDataLoading) {
    return (
      <FullPageSpinner></FullPageSpinner>
    )
  }
  return (
    <div className="">
      {/* <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Student Attendance Calendar
      </h2> */}

      {/* Legend (समझने के लिए color guide) */}
      {/* <div className="flex flex-wrap gap-4 sm:mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-700 rounded"></div>
          <span>Government Holiday</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-700 rounded"></div>
          <span>College Holiday</span>
        </div>
      </div> */}

      {/* Horizontal Scrollable Container */}
      {/* Mobile पर swipe करके देख सकते हो */}
      <div ref={ref} className="p-0 m-0">
        <div className="max-w-[98vw] overflow-scroll flex gap-2 sm:gap-6 p-2 sm:p-4">
          {years.map((currentYear, yearIndex) => (
            Array.from({ length: 12 }).map((_, monthIndex) => {
              const monthStart = new Date(currentYear, monthIndex, 1);
              const firstDay = monthStart.getDay(); // 0=Sunday, 6=Saturday
              const totalDays = getDaysInMonth(monthIndex, currentYear);
              const nowMonth = new Date().getMonth();
              const nowYear = new Date().getFullYear();

              if (currentYear > nowYear) {
                return null;
              };
              if (currentYear == nowYear && monthIndex > nowMonth) {
                return null;
              };
              return (
                <div
                  key={`${yearIndex}-${monthIndex}`}
                  className="rounded-xl px-2 sm:px-4 bg-white border border-gray-200 shadow-sm min-w-[280px]"
                >
                  {/* Month Name */}
                  <h3 className="text-center text-lg font-semibold mb-3 text-gray-700">
                    {monthStart.toLocaleString("default", { month: "long" }) + " " + currentYear}
                  </h3>

                  {/* Weekday Header */}
                  <div className="grid grid-cols-7 text-center font-bold text-xs mb-2 text-gray-600">
                    {weekDays.map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Blank cells पहले दिन से पहले */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`blank-${i}`}></div>
                    ))}

                    {/* Actual calendar days */}
                    {Array.from({ length: totalDays }).map((_, dayIndex) => {
                      const dateNumber = dayIndex + 1;

                      // YYYY-MM-DD format में date बनाओ
                      const formattedDate = new Date(
                        currentYear,
                        monthIndex,
                        dateNumber + 1
                      )
                        .toISOString() // 2025-09-22T00:00:00.000Z
                        .split("T")[0];

                      // Attendance status check करो
                      let status = attendanceMap[formattedDate];
                      // Color logic (असली application logic)
                      let bgColor = "#BDBDBD" //bg-gray-200"; // No record
                      let textColor = "text-gray-700";
                      let dayStatus = 'No data';
                      if (isWeekend(formattedDate)) {
                        bgColor = "#9CA3AF"; //bg-red-100"; // Weekend with no record
                        dayStatus = 'Sunday';
                      }

                      // Government holiday को red-700 दो (सबसे important)
                      if (isGovernmentHoliday(formattedDate)) {
                        bgColor = "#FBC02D" //bg-red-700";
                        textColor = "text-white";
                      }
                      // College holiday
                      else if (status === "college_holiday" || status === "holiday") {
                        // Check if it's also government holiday
                        if (isGovernmentHoliday(formattedDate)) {
                          bgColor = "#FBC02D" //bg-red-700";
                        } else {
                          bgColor = "#42A5F5" //bg-purple-700";
                        }
                        textColor = "text-white";
                      }
                      // Present
                      else if (status === "present") {
                        bgColor = "#4CAF50" //"bg-red-500";
                        textColor = "text-white";
                      }
                      // Absent
                      else if (status === "absent") {
                        bgColor = "#E53935" //"bg-green-500";
                        textColor = "text-white";
                      }

                      return (
                        <div
                          key={dateNumber}
                          style={{ background: bgColor }}
                          className={`p-2 text-center rounded-md ${textColor} text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity`}
                          title={status ? status : dayStatus}
                        >
                          {dateNumber}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      {/* <button
        onClick={fetchAttendanceData}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Refresh Attendance
      </button> */}
    </div>
  );
}

const formatDateDisplay = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
