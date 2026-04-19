const { pool } = require('../config/database');

// ✅ ADD OR UPDATE VISITOR with 15-minute visit counting logic
exports.addVisitor = async ({ ip, city, country }) => {
  try {
    console.log('📝 Attempting to save visitor:', { ip, city, country });
    
    if (!ip) {
      console.error('❌ No IP address provided');
      return false;
    }

    // Check if visitor exists
    const [existing] = await pool.query(
      'SELECT id, total_visits, last_visit_time FROM visitors WHERE ip = ?',
      [ip]
    );

    if (existing.length > 0) {
      const visitor = existing[0];
      const lastVisit = new Date(visitor.last_visit_time);
      const now = new Date();
      const timeDiffMinutes = (now - lastVisit) / (1000 * 15);
      
      let shouldIncrementVisit = timeDiffMinutes >= 15;
      
      if (shouldIncrementVisit) {
        console.log(`⏰ Last visit was ${timeDiffMinutes.toFixed(2)} minutes ago - counting new visit`);
      } else {
        console.log(`⏰ Last visit was ${timeDiffMinutes.toFixed(2)} minutes ago - NOT counting as new visit`);
      }
      
      const [updateResult] = await pool.query(
        `UPDATE visitors 
         SET city = ?, 
             country = ?, 
             is_online = 1, 
             last_visit_time = NOW(),
             total_visits = total_visits + ?
         WHERE ip = ?`,
        [city || 'Unknown', country || 'Unknown', shouldIncrementVisit ? 1 : 0, ip]
      );
      
      console.log('✅ Visitor updated:', {
        ip,
        timeSinceLastVisit: `${timeDiffMinutes.toFixed(2)} minutes`,
        visitCounted: shouldIncrementVisit,
        newTotalVisits: visitor.total_visits + (shouldIncrementVisit ? 1 : 0)
      });
    } else {
      const [insertResult] = await pool.query(
        `INSERT INTO visitors (ip, city, country, is_online, total_visits, last_visit_time, created_at)
         VALUES (?, ?, ?, 1, 1, NOW(), NOW())`,
        [ip, city || 'Unknown', country || 'Unknown']
      );
      console.log('✅ New visitor inserted (first visit counted):', insertResult);
    }
    return true;
  } catch (err) {
    console.error('❌ Visitor insert error:', err.message);
    return false;
  }
};

// ✅ SET OFFLINE - Updated for callback support
exports.setOffline = async (ip) => {
  try {
    console.log('📝 Setting offline for IP:', ip);
    const [result] = await pool.query(
      `UPDATE visitors SET is_online = 0 WHERE ip = ?`,
      [ip]
    );
    console.log('✅ Offline update result:', result);
    return result;
  } catch (err) {
    console.error('❌ Set offline error:', err.message);
    throw err;
  }
};

// ✅ GET ONLINE USERS - Updated for callback support
exports.getOnlineUsers = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as total FROM visitors WHERE is_online = 1`
    );
    console.log('📊 Online users count:', rows[0].total);
    return rows[0].total;
  } catch (err) {
    console.error('❌ Get online users error:', err.message);
    return 0;
  }
};

// ✅ GET ONLINE USERS with Callback Support (for backward compatibility)
exports.getOnlineUsersCallback = (callback) => {
  pool.query('SELECT COUNT(*) as total FROM visitors WHERE is_online = 1', (err, result) => {
    if (err) {
      console.error('❌ Get online users error:', err.message);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

// ✅ GET TOTAL VISITS (all time)
exports.getTotalVisits = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT SUM(total_visits) as total FROM visitors`
    );
    return rows[0].total || 0;
  } catch (err) {
    console.error('❌ Get total visits error:', err.message);
    return 0;
  }
};

// ✅ GET UNIQUE VISITORS
exports.getUniqueVisitors = async () => {
  try {
    const [rows] = await pool.query(`SELECT COUNT(*) as total FROM visitors`);
    return rows[0].total || 0;
  } catch (err) {
    console.error('❌ Get unique visitors error:', err.message);
    return 0;
  }
};

// ✅ GET TODAY'S VISITS
exports.getTodaysVisits = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as total FROM visitors 
       WHERE DATE(last_visit_time) = CURDATE()`
    );
    return rows[0].total || 0;
  } catch (err) {
    console.error('❌ Get today\'s visits error:', err.message);
    return 0;
  }
};