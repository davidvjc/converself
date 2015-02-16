// Modules included with nodejs, just need to link them in
var util = require('util');
var fs = require('fs');

// Install markov module: npm install markov
// Markov module docs https://github.com/substack/node-markov
var markov = require('markov');


// Install express: $ npm install express
// Install socket.io: $ npm install socket.io
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//create markov variable with length
var m = markov(3);

//write the corpus file based on the message input - needs to be longer than markov variabel!!
//replaces the file if already existing - http://nodejs.org/docs/latest/api/fs.html#fs_fs_writefile_filename_data_options_callback
fs.writeFile('corpus.txt', 'msg: this is something cool lets say something cool here okay?', function (err) {
  if (err) throw err;
  console.log('The corpus has been saved at this point in time.');
});

//the read text
var s = fs.createReadStream(__dirname + '/corpus.txt');
m.seed(s, function () {
  console.log('seeded');
});


//serve the html file
app.get('/', function(req, res){
  res.sendfile('index.html');


});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('user message', function(msg){
    console.log('msg: '+msg);
    var res = m.respond(msg.toString(), 2).join(' ');
    socket.emit('bot message', res);

              
  });


});


http.listen(3002, function(){
  console.log('listening on *:3002');
});





