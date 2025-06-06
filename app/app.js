// app/app.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 1. Serve static files from the "public" directory
//    With app.js at /opt/realtime-chat/app/app.js, this points to /opt/realtime-chat/app/public
app.use(express.static(path.join(__dirname, 'public')));

// 2. Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// 3. Start listening on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat app running on port ${PORT}`);
});
