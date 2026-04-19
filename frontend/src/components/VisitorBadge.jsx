import React, { useState, useEffect } from "react";
import useVisitor from "../hooks/useVisitor";

const SOCKET_URL = "http://localhost:5000";

const VisitorBadge = () => {
  const onlineUsers = useVisitor();
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);

  useEffect(() => {
    // Fetch total visits
    const fetchStats = async () => {
      try {
        const [totalRes, todayRes] = await Promise.all([
          fetch(`${SOCKET_URL}/api/visitors/total-visits`),
          fetch(`${SOCKET_URL}/api/visitors/today`)
        ]);
        
        const totalData = await totalRes.json();
        const todayData = await todayRes.json();
        
        setTotalVisits(totalData.total || 0);
        setTodayVisits(todayData.total || 0);
      } catch (error) {
        console.error('Error fetching visit stats:', error);
      }
    };
    
    fetchStats();
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span>Live: {onlineUsers}</span>
      </div>
      
      <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs">
        📊 Today: {todayVisits}
      </div>
      
      <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs">
        🌐 Total: {totalVisits}
      </div>
    </div>
  );
};

export default VisitorBadge;