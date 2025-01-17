const { db } = require("./routes");
routes = require('./routes.js');



function socketH(socket) {

  let hungerChange = setInterval(() => {
    db.run('UPDATE pets SET hunger = hunger + 1 WHERE hunger < 100;', (err) => {
      if (err) {
        console.error('Error updating hunger:', err);
      }
      db.all('SELECT * FROM pets', (err, rows) => { 
        if (err) {
          console.error('Database error:', err);
          return;
        }
        socket.emit('petsUpdated', rows);
      });
    })
  }, 60000)

  let boredomChange = setInterval(() => {
    db.run('UPDATE pets SET boredom = boredom + 1 WHERE boredom < 100;', (err) => {
      if (err) {
        console.error('Error updating boredom:', err);
      }
      db.all('SELECT * FROM pets', (err, rows) => { 
        if (err) {
          console.error('Database error:', err);
          return;
        }
        socket.emit('petsUpdated', rows);
      });
    })
  }, 20000)

  let healthChange = setInterval(() => {
    db.run('UPDATE pets SET health = health - 1 WHERE health > 0 AND hunger = 100;', (err) => {
      if (err) {
        console.error('Error updating health:', err);
      }
    })
  }, 15000)

  console.log('a user connected');
  socket.on('connect', function () {
    console.log('user connected');
  });

  socket.on('disconnect', function () {
    clearInterval(hungerChange);
    clearInterval(healthChange);
    clearInterval(boredomChange);
    console.log('user disconnected');
  });

  socket.on('message', function (msg) {
    console.log('message: ' + msg);
  });

  socket.on('hospitalHeal', function (data) {
    const level = data.level;
    const user = data.user;
    const healAmount = data.healAmount;
    const pet = data.pet;
    console.log(` level ${level} heal request from, ${user}`);

    db.all('SELECT * FROM pets WHERE owner=?;', user, (err, row) => {
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
      console.log(row)

      console.log('Pet found, checking health...');

      row.forEach(element => {
        if (element.health >= 100 && element.id == pet) {
          console.log('Pet health is already full');
          socket.emit('pethealthFull');
        } else if (element.id == pet) {
          const newHealth = Math.min(element.health + healAmount, 100); // Ensure health does not exceed 100
          console.log(`Updating health from ${element.health} to ${newHealth}`);

          db.run('UPDATE pets SET health = ? WHERE owner=? AND id=?;', [newHealth, user, pet], (err) => {
            if (err) {
              console.error('Error updating health:', err);
              socket.emit('error', { message: 'An error occurred while updating health.' });
              return;
            }
            console.log('Pet health updated');
            socket.emit('pethealthUpdated', { user: user, newHealth: newHealth });
          });
        }
      })
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

  socket.on('feed', function (pet) {
    db.run("UPDATE pets SET hunger = hunger - 10 WHERE id = ?", pet, (err) => {
      if (err) {
        console.error('Error updating hunger:', err);
        socket.emit('hungerUpdateError', { message: 'An error occurred while updating hunger.' });
        return;
      }
  
      db.get("SELECT * FROM pets WHERE id = ?", pet, (err, row) => {
        if (err) {
          console.error('Error retrieving updated pet:', err);
          socket.emit('dataRetreiveError', { message: 'An error occurred while retrieving updated pet data.' });
          return;
        }
  
        if (!row) {
          console.error('No pet found with id: undefined');
          socket.emit('noPetFound', { pet: pet , message: 'No pet found with id: undefined' });
          return;
        }
  
        console.log('Pet hunger updated');
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

        if(row.boredom < 0){

        }

        if (!row) {
          console.error('No pet found with id: undefined');
          socket.emit('noPetFound', { pet: pet , message: 'No pet found with id: undefined' });
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