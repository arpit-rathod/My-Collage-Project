import Dexie from 'dexie';

// Create database
const db = new Dexie('StudentAttendanceDB');

// Define schema (version 1)
db.version(1).stores({
  weeklyAttendance: 'weekStart, studentUsername, weekEnd, lastUpdated'
  // weekStart = Primary key
  // Others = Indexes for fast queries
});

// ============================================
// STORE FUNCTIONS
// ============================================

// Store single week
async function storeWeeklyAttendance(weekData) {
  try {
    await db.weeklyAttendance.put(weekData);
    console.log(`Stored week: ${weekData.weekStart} : ${weekData} `);
    return weekData.weekStart;
  } catch (error) {
    console.error('Error storing week:', error);
    throw error;
  }
}

// Store multiple weeks at once
async function storeBulkWeeks(weeksArray) {
  try {
    await db.weeklyAttendance.bulkPut(weeksArray);
    console.log(`Stored ${weeksArray.length} weeks`);
    return weeksArray.length;
  } catch (error) {
    console.error('Error storing bulk weeks:', error);
    throw error;
  }
}

// ============================================
// RETRIEVE FUNCTIONS
// ============================================

// Get specific week by weekStart
async function getWeekAttendance(weekStart) {
  try {
    const week = await db.weeklyAttendance.get(weekStart);
    if (week) {

      console.log(`Found week: ${weekStart} : ${week}`);
      return week;
    } else {
      console.log(`Week not found: ${weekStart}`);
      return null;
    }
  } catch (error) {
    console.error('Error getting week:', error);
    throw error;
  }
}

export { storeWeeklyAttendance, storeBulkWeeks, getWeekAttendance }