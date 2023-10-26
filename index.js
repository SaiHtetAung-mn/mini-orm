const http = require('http');
const app = require('express')();
const orm = require('./orm');
const User = orm.createModel('users');
User.findOne(4).then(user => console.log(user));

const server = http.createServer(app);

server.listen(3000, () => console.log('Server running'));