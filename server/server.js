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

var mongoClient = require('mongodb').MongoClient;
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
  socket.on('host-join', (data)=>{
    mongoClient.connect(url,{useNewUrlParser:true}, function(err, db){
      if(err) throw err;
      var dbo = db.db("KahootDB");
      var query = {id:parseInt(data.id)};
      dbo.collection('KahootGames').find(query).toArray(function(err, result){
        if(err) throw err;
        if(result[0] !== undefined){
          var gamePin = Math.floor(Math.random()*90000)+10000;
          game.addGame(gamePin, socket.id, false, {playersAnswered:0, questionLive: false, gameid: data.id, question: 1});
          console.log('Game creaetd with pin: ', game.pin);
          socket.emit('showGamePin', {
            pin:game.pin
          });
        }else{
          socket.emit('noGameFound');
        }
        db.close();
      });
    });
  });
  socket.on('newQuiz', function(data){
    mongoClient.connect(url, function(err, db){
        if (err) throw err;
        var dbo = db.db('kahootDB');
        dbo.collection('kahootGames').find({}).toArray(function(err, result){
            if(err) throw err;
            var num = Object.keys(result).length;
            if(num == 0){
              data.id = 1
              num = 1
            }else{
              data.id = result[num -1 ].id + 1;
            }
            var game = data;
            dbo.collection("kahootGames").insertOne(game, function(err, res) {
                if (err) throw err;
                db.close();
            });
            db.close();
            socket.emit('startGameFromCreator', num);
        });
      });
    });
    socket.on('requestDbNames', function(){
        
      mongoClient.connect(url, function(err, db){
          if (err) throw err;
  
          var dbo = db.db('kahootDB');
          dbo.collection("kahootGames").find().toArray(function(err, res) {
              if (err) throw err;
              socket.emit('gameNamesData', res);
              db.close();
          });
      });   
  });
});