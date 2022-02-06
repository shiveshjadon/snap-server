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

let common = "test"

app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

io.on('connection', (socket) => {
  socket.on('message', (message) => {  
    let options = {
      mode: 'text',
      pythonOptions: ['-u'],
      args: [message]
    }
    PythonShell.run('spacy-listen.py', options, function (err, result){
      if (err) throw err;
      console.log(result);
      socket.broadcast.emit('message', result)
    });
  })

  pyshell.on('message', (message) => {
    console.log(message)
  })

  socket.on('disconnect', () => {
    console.log('connection end')
  })
})

server.listen(3000, () => {
  console.log('listening on 3000')
})
