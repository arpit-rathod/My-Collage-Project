// utils/lectureReset.js
import cron from 'node-cron';
import BranchLectureInfoSchema from '../StudentsFiles/BranchLectureInfoSchema.js'; // Adjust path

// Core reset function
export const resetLectures = async () => {
  try {
    const result = await BranchLectureInfoSchema.updateMany({}, {
      $set: {
        "subjectsData.$[].status": "pending",
      },
      $unset: {
        "subjectsData.$[].pin": "",
        "subjectsData.$[].classId": "",
      },
    });

    console.log(`✅ Lectures reset complete. Updated: ${result.modifiedCount} docs`);
    return { success: true, modifiedCount: result.modifiedCount };
  } catch (err) {
    console.error("❌ Reset failed:", err);
    throw err;
  }
};

// Manual reset function (Admin API endpoint)
export const manualResetLectures = async (req, res) => {
  try {
    const result = await resetLectures();
    res.json({
      message: "Lectures reset successfully",
      data: result
    });
  } catch (err) {
    res.status(500).json({ error: "Reset failed", details: err.message });
  }
};

// Auto-scheduler (runs only when server active)
let cronJob = null;

export const startLectureResetCron = () => {
  if (cronJob) return; // Prevent duplicate

  // Midnight daily: 0 0 * * *
  cronJob = cron.schedule("0 0 * * *", async () => {
    console.log("🕛 Auto midnight reset started...");
    await resetLectures();
  });

  console.log("✅ Lecture reset cron scheduled (midnight daily)");
};

export const stopLectureResetCron = () => {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log("⏹️ Lecture reset cron stopped");
  }
};

// Graceful server shutdown
export const cleanupCron = () => {
  stopLectureResetCron();
};
