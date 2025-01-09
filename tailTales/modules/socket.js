function socketH (socket) {
    console.log('a user connected');
    socket.on('connect', function () {
      console.log('user connected');
    });
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
    socket.on('message', function (msg) {
      console.log('message: ' + msg);
  });
}

module.exports = {socketH};