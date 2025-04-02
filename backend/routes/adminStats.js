const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get All Stats of tribes, stories and messages
router.get("/", async (req, res) => {
  try {
    // Fetching the counts of tribes, stories, and messages
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM tribes) AS tribes,
        (SELECT COUNT(*) FROM stories) AS stories,
        (SELECT COUNT(*) FROM user_submissions) AS messages,
        (SELECT COUNT(*) FROM user_submissions where is_read=false) AS unread_messages
    `);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching all stats:", err.stack);
    res.status(500).json({ error: "Failed to fetch all stats" });
  }
});

module.exports = router;
