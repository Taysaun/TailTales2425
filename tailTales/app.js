const express = require('express');
const app = express(); 
const sharedsession = require('express-socket.io-session');
const routes = require('./modules/routes.js');
const socket = require('./modules/socket.js');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const socketIo = require('socket.io');
PORT = 3000;
const sqlite3 = require('sqlite3');
path = require('path');

const sessionMiddleware = session({
    store: new SQLiteStore,
    secret: 'skibidiragatheoppstoppa',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
});

app.use(sessionMiddleware);
app.use(express.static('public'));
const server = app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});
const io = socketIo(server);

io.use(sharedsession(sessionMiddleware, {
    autoSave: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.set('view engine', 'ejs');

app.get('/', routes.index);

app.get('/login', routes.login);

app.post('/login', routes.loginPost);

app.get('/logout', isAuthenticated, routes.logout);

app.get('/chat', isAuthenticated, routes.chat);

app.get('/adopt', isAuthenticated, routes.adopt);

app.get('/home', isAuthenticated, routes.home);

app.get('/mall', isAuthenticated, routes.mall);

app.get('/hospital', isAuthenticated, routes.hospital);


io.on('connection', socket.socketH);

