import { setOffline, getOnlineUsers } from "../models/visitorModel.js";

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected to socket");

    socket.on("join", (ip) => {
      socket.ip = ip;
      console.log(`📍 User joined with IP: ${ip}`);
    });

    // Send live count function
    const sendCount = async () => {
      try {
        const total = await getOnlineUsers();
        io.emit("onlineUsers", total);
        console.log(`📊 Broadcasting online users: ${total}`);
      } catch (err) {
        console.error("❌ Error getting online users:", err);
      }
    };

    // Initial count send
    sendCount();

    // Handle disconnection
    socket.on("disconnect", async () => {
      console.log(`🔴 User disconnected: ${socket.ip || 'Unknown IP'}`);
      
      if (socket.ip) {
        await setOffline(socket.ip);
        console.log(`✅ Set offline for IP: ${socket.ip}`);
      }
      
      // Send updated count to all clients
      await sendCount();
    });

    // Optional: Handle errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  console.log("🎯 Socket.IO initialized successfully");
};