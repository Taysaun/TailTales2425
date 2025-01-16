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

  socket.on('hospitalHeal', function (data) {
    const level = data.level;
    const user = data.user;
    const healAmount = data.healAmount;
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
        socket.emit('pethealthFull');
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

  socket.on('adopt', function (data) {
    console.log(data)
    const user = data.user;
    const type = data.type;
    const name = data.name
    console.log(` ${type} adoption request from, ${user}`);

    db.get('SELECT * FROM users WHERE username=?;', user, (err, row) => {
      if (err) {
        console.error('Database error:', err);
        socket.emit('error', { message: 'An error occurred while processing the request.' });
        return;
      }

      db.run('INSERT INTO pets (owner, description, name, health,hunger,boredom) VALUES (?, ?, ?, 50,50,50);', [user, type, name], (err) => {
        if (err) {
          console.error('Error adopting pet:', err);
          socket.emit('error', { message: 'An error occurred while adopting pet.' });
          return;
        }
        console.log(` A pet ${type} named ${name} was adopted by ${user}`);
        socket.emit('petAdopted', { user: user, type: type, name: name });
      });
    });
  });

  socket.on('play', function (pet) {
      db.run("UPDATE pets SET boredom = boredom - 10 WHERE id = ?", pet, (err) => {
          if (err) {
              console.error('Error updating boredom:', err);
              socket.emit('boredomUpdateError', { message: 'An error occurred while updating boredom.' });
              return;
          }

          db.get("SELECT * FROM pets WHERE id = ?", pet, (err, row) => {
            if (err) {
                console.error('Error retrieving updated pet:', err);
                socket.emit('dataRetreiveError', { message: 'An error occurred while retrieving updated pet data.' });
                return;
            }

            if(!row) {
                console.error('No pet found with id: undefined');
                socket.emit('noPetFound', { pet: pet });
                return;
            }

          console.log('Pet boredom updated');
          socket.emit('petUpdated', { 
            id: row.id,
            name: row.name,
            health: row.health,
            boredom: row.boredom,
            hunger: row.hunger,
           });
      });
  });
});
}


module.exports = { socketH };