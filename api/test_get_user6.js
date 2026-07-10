import { db } from "./connect.js";

db.connect((err) => {
  if (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
  
  const q = `SELECT s.*, u.name FROM stories AS s 
             JOIN users AS u ON (u.id = s.userId)
             LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId = ?) 
             WHERE r.followerUserId = ? OR s.userId = ? 
             GROUP BY s.id
             ORDER BY s.id DESC`;

  db.query(q, [6, 6, 6], (err, data) => {
    if (err) {
      console.error("SQL Error in getStories:", err);
    } else {
      console.log("Success! Data:", data);
    }
    db.end();
  });
});
