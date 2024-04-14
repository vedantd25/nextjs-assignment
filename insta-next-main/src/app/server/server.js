// Server-side code

// Import required modules
const http = require('http');
const { Server } = require('socket.io');

// Create HTTP server
const server = http.createServer();

// Initialize Socket.IO server
const io = new Server(server);

// Store likes count in a map (postId -> likesCount)
const likesCountMap = new Map();

// Handle client connections
io.on('connection', (socket) => {
  console.log('Server: A user connected');

  // Handle 'like' event from client
  socket.on('like', (postId, hasLiked) => {
    console.log('Server: Received "like" event with postId:', postId, 'and hasLiked:', hasLiked);
    // Update likes count map based on 'hasLiked' parameter
    if (hasLiked) {
      likesCountMap.set(postId, (likesCountMap.get(postId) || 0) + 1);
    } else {
      likesCountMap.set(postId, Math.max((likesCountMap.get(postId) || 0) - 1, 0));
    }

    // Emit updated likes count to all clients
    io.emit('likeUpdated', { postId, likesCount: likesCountMap.get(postId) });
    console.log('Server: Emitting "likeUpdated" event with postId:', postId, 'and likesCount:', likesCountMap.get(postId));
  });

  // Handle 'getLikesCount' event from client
  socket.on('getLikesCount', (postId) => {
    console.log('Server: Received "getLikesCount" event with postId:', postId);
    // Send initial likes count to client
    socket.emit('likeUpdated', { postId, likesCount: likesCountMap.get(postId) || 0 });
    console.log('Server: Sending initial likes count to client:', likesCountMap.get(postId) || 0);
  });

  // Handle client disconnections
  socket.on('disconnect', () => {
    console.log('Server: A user disconnected');
  });
});

// Start server and listen on port 3001
server.listen(3001, () => {
  console.log('Socket.IO server running on port 3001');
});
