const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {Players} = require('./player');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

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
});});

server.listen(3000, ipAddress || 'localhost',function() {
    console.log('Application worker ' + process.pid + ' started...');
});
