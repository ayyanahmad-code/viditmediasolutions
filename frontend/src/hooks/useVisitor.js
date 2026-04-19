import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5
});

const useVisitor = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        console.log('🟢 Initializing visitor tracking...');
        
        // Try multiple IP API services for redundancy
        let ipData = null;
        
        try {
          // Try ipapi.co first
          const response = await fetch("https://ipapi.co/json/");
          ipData = await response.json();
          console.log('📍 IP Data from ipapi.co:', ipData);
        } catch (error) {
          console.log('ipapi.co failed, trying ip-api.com...');
          // Fallback to ip-api.com
          const response = await fetch("http://ip-api.com/json/");
          ipData = await response.json();
          console.log('📍 IP Data from ip-api.com:', ipData);
        }

        const visitor = {
          ip: ipData.ip || ipData.query || "Unknown",
          city: ipData.city || "Unknown",
          country: ipData.country || ipData.country_name || "Unknown",
        };

        console.log('📤 Sending visitor data to backend:', visitor);

        // Save to database with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const saveResponse = await fetch(`${SOCKET_URL}/api/visitors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visitor),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!saveResponse.ok) {
          throw new Error(`HTTP ${saveResponse.status}: ${saveResponse.statusText}`);
        }

        const result = await saveResponse.json();
        console.log('✅ Save result:', result);

        // Join socket room
        socket.emit("join", visitor.ip);
        
        // Verify data was saved
        const debugResponse = await fetch(`${SOCKET_URL}/api/visitors/debug`);
        const debugData = await debugResponse.json();
        console.log('🔍 Debug - All visitors in DB:', debugData);
        
      } catch (error) {
        console.error('❌ Error initializing visitor:', error);
        if (error.name === 'AbortError') {
          console.error('Request timeout - backend might not be running');
        }
      }
    };

    init();

    socket.on("onlineUsers", (count) => {
      if (isMounted) {
        console.log("👥 Online users count updated:", count);
        setOnlineUsers(count);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      isMounted = false;
      socket.off("onlineUsers");
      socket.off("connect_error");
    };
  }, []);

  return onlineUsers;
};

export default useVisitor;