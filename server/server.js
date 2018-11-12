var express = require('express');
var app = express();
var http = require('http');
var socketIO = require('socket.io');
const path = require('path');
var server = http.createServer(app);
var io = socketIO(server);

const {Players} = require('./player');
const {Games} = require('./game');

const port = 3000;
const players = new Players();
const game = new Games();

var MongoCliennt = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/";


/*
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});
*/
var os = require('os');
var ifaces = os.networkInterfaces();
var ipAddress ='192.168.1.11';

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
    return;
    }
    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
      ipAddress = iface.address;
      } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
      ipAddress = iface.address;
    }
  ++alias;
  });
});

app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, () =>{
  console.log('listening on port: ' + port);
});

io.on('connection', (socket) =>{
  console.log('a user connected');
  socket.on('disconnect', () =>{
    console.log('user disconnected');
  });
  //TODO: need to 
});