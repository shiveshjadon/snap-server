const {PythonShell} = require('python-shell')
const pyshell = PythonShell.run("spacy-listen.py", null, function(err) {
  if (err) throw err;
  console.log("python script started");
});
const express = require('express')
const http = require('http')
const path = require('path')
const app = express()
app.use((req,res,next)=>{
  res.setHeader('Acces-Control-Allow-Origin','*');
  res.setHeader('Acces-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Acces-Contorl-Allow-Methods','Content-Type','Authorization');
  next(); 
})

const server = http.Server(app)
const socketio = require('socket.io')
const io = socketio(server, {
  cors: {
    origin: '*',
  }
})
const port = 3000

// let cors = require("cors");
// app.use(cors());


app.use(express.static(__dirname))

let Message = ""

//receive from py
pyshell.on('message', function (message) {  
  Message = message
  //console.log(message);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

io.on('connection', (socket) => {
  socket.emit("hello", "world");
  for(let i=0; i<5; i++)
    socket.emit("handshake", "hello world! ~from nodejs server!")


  socket.on('disconnect', () => {
    console.log('connection end')
  })
})

server.listen(3000, () => {
  console.log('listening on 3000')
})

// app.get('/entities', function (req, res) {
//   res.send('sample entities')
// })