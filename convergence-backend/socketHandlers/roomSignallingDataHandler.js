const roomSignallingDataHandler = (socket, data) => {
  const { connUserSocketId, signal } = data;

  const signallingData = { signal, connUserSocketId: socket.id };
  socket.to(connUserSocketId).emit("conn-signal", signallingData);
};

module.exports = roomSignallingDataHandler;
