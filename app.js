const {PythonShell} = require('python-shell')
const pyshell = PythonShell.run("spacy-listen.py", null, function(err) {
  if (err) throw err;
  console.log("python script started");
});
const express = require('express')
const http = require('http')
const path = require('path')
const app = express()
const server = http.Server(app)
const socketio = require('socket.io')
const io = socketio(server)
const port = 3000

let Message = ""

//receive from py
pyshell.on('message', function (message) {  
  Message = message
  //console.log(message);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

server.listen(3000, () => {
  console.log('listening on 3000')
})

io.on('connection', (socket) => {
  console.log('connection started with', socket.id)
  
  socket.on('disconnect', () => {
    console.log('connection end')
  })
})

// app.get('/entities', function (req, res) {
//   res.send('sample entities')
// })