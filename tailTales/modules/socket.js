const { db } = require("./routes");
routes = require('./routes.js');
function socketH(socket) {

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

  socket.on('hospitalHeal1', function (data) {
    const level = data.level;
    const user = data.user;
    const healAmount = 10;
    console.log(` level ${level} heal request from, ${user}`);

    db.get('SELECT * FROM pets WHERE owner=?;', user, (err, row) => {
      if (err) {
        console.error('Database error:', err);
        socket.emit('error', { message: 'An error occurred while processing the request.' });
        return;
      }

      if (!row) {
        console.log('No pet found for user:', user);
        socket.emit('noPetFound', { user: user });
        return;
      }

      console.log('Pet found, checking health...');
      if (row.health >= 100) {
        console.log('Pet health is already full');
        socket.emit('pethealthFull', { user: user });
      } else {
        const newHealth = Math.min(row.health + healAmount, 100); // Ensure health does not exceed 100
        console.log(`Updating health from ${row.health} to ${newHealth}`);

        db.run('UPDATE pets SET health = ? WHERE owner=?;', [newHealth, user], (err) => {
          if (err) {
            console.error('Error updating health:', err);
            socket.emit('error', { message: 'An error occurred while updating health.' });
            return;
          }
          console.log('Pet health updated');
          socket.emit('pethealthUpdated', { user: user, newHealth: newHealth });
        });
      }
    });
  });



  socket.on('hospitalHeal2', function (data) {
    const level = data.level;
    const user = data.user;
    const healAmount = 20;
    console.log(` level ${level} heal request from, ${user}`);

    db.get('SELECT * FROM pets WHERE owner=?;', user, (err, row) => {
      if (err) {
        console.error('Database error:', err);
        socket.emit('error', { message: 'An error occurred while processing the request.' });
        return;
      }

      if (!row) {
        console.log('No pet found for user:', user);
        socket.emit('noPetFound', { user: user });
        return;
      }

      console.log('Pet found, checking health...');
      if (row.health >= 100) {
        console.log('Pet health is already full');
        socket.emit('pethealthFull', { user: user });
      } else {
        const newHealth = Math.min(row.health + healAmount, 100); // Ensure health does not exceed 100
        console.log(`Updating health from ${row.health} to ${newHealth}`);

        db.run('UPDATE pets SET health = ? WHERE owner=?;', [newHealth, user], (err) => {
          if (err) {
            console.error('Error updating health:', err);
            socket.emit('error', { message: 'An error occurred while updating health.' });
            return;
          }
          console.log('Pet health updated');
          socket.emit('pethealthUpdated', { user: user, newHealth: newHealth });
        });
      }
    });
  });

  socket.on('hospitalHeal3', function (data) {
    const level = data.level;
    const user = data.user;
    const healAmount = 30;
    console.log(` level ${level} heal request from, ${user}`);

    db.get('SELECT * FROM pets WHERE owner=?;', user, (err, row) => {
      if (err) {
        console.error('Database error:', err);
        socket.emit('error', { message: 'An error occurred while processing the request.' });
        return;
      }

      if (!row) {
        console.log('No pet found for user:', user);
        socket.emit('noPetFound', { user: user });
        return;
      }

      console.log('Pet found, checking health...');
      if (row.health >= 100) {
        console.log('Pet health is already full');
        socket.emit('pethealthFull', { user: user });
      } else {
        const newHealth = Math.min(row.health + healAmount, 100); // Ensure health does not exceed 100
        console.log(`Updating health from ${row.health} to ${newHealth}`);

        db.run('UPDATE pets SET health = ? WHERE owner=?;', [newHealth, user], (err) => {
          if (err) {
            console.error('Error updating health:', err);
            socket.emit('error', { message: 'An error occurred while updating health.' });
            return;
          }
          console.log('Pet health updated');
          socket.emit('pethealthUpdated', { user: user, newHealth: newHealth });
        });
      }
    });
  });

  socket.on('hospitalHeal4', function (data) {
    const level = data.level;
    const user = data.user;
    const healAmount = 40;
    console.log(` level ${level} heal request from, ${user}`);

    db.get('SELECT * FROM pets WHERE owner=?;', user, (err, row) => {
      if (err) {
        console.error('Database error:', err);
        socket.emit('error', { message: 'An error occurred while processing the request.' });
        return;
      }

      if (!row) {
        console.log('No pet found for user:', user);
        socket.emit('noPetFound', { user: user });
        return;
      }

      console.log('Pet found, checking health...');
      if (row.health >= 100) {
        console.log('Pet health is already full');
        socket.emit('pethealthFull', { user: user });
      } else {
        const newHealth = Math.min(row.health + healAmount, 100); // Ensure health does not exceed 100
        console.log(`Updating health from ${row.health} to ${newHealth}`);

        db.run('UPDATE pets SET health = ? WHERE owner=?;', [newHealth, user], (err) => {
          if (err) {
            console.error('Error updating health:', err);
            socket.emit('error', { message: 'An error occurred while updating health.' });
            return;
          }
          console.log('Pet health updated');
          socket.emit('pethealthUpdated', { user: user, newHealth: newHealth });
        });
      }
    });
  });

  socket.on('hospitalHeal5', function (data) {
    const level = data.level;
    const user = data.user;
    const healAmount = 50;
    console.log(`level ${level} heal request from, ${user}`);

    db.get('SELECT * FROM pets WHERE owner=?;', user, (err, row) => {
      if (err) {
        console.error('Database error:', err);
        socket.emit('error', { message: 'An error occurred while processing the request.' });
        return;
      }

      if (!row) {
        console.log('No pet found for user:', user);
        socket.emit('noPetFound', { user: user });
        return;
      }

      console.log('Pet found, checking health...');
      if (row.health >= 100) {
        console.log('Pet health is already full');
        socket.emit('pethealthFull', { user: user });
      } else {
        const newHealth = Math.min(row.health + healAmount, 100); 
        console.log(`Updating health from ${row.health} to ${newHealth}`);

        db.run('UPDATE pets SET health = ? WHERE owner=?;', [newHealth, user], (err) => {
          if (err) {
            console.error('Error updating health:', err);
            socket.emit('error', { message: 'An error occurred while updating health.' });
            return;
          }
          console.log('Pet health updated');
          socket.emit('pethealthUpdated', { user: user, newHealth: newHealth });
        });
      }
    });
  });
}


module.exports = { socketH };