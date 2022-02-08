const {PythonShell} = require('python-shell')
const pyshell = new PythonShell('spacy-listen.py')
const DDG = require('duck-duck-scrape')
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
const port = 3000

const socketio = require('socket.io')
const io = socketio(server, {
  cors: {
    origin: '*',
  }
})

const { image_search } = require('duckduckgo-images-api')

app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

server.listen(port, () => {
  console.log('listening on 3000')
})

lastm = ""

io.on('connection', (socket) => {
  console.log('connection start')

  socket.on('message', (message) => {    
    pyshell.send(message)
  })

  pyshell.on('message', (message) => {
    // socket.emit('message', message)
    if(lastm != message){
      lastm = message
      console.log(message)
      socket.broadcast.emit('message', message)
    }
  })

  //recieve img request 
  socket.on('query', (query) => {  
    console.log("got request for query: ", query)  
    image_search({ 
      query: query, 
      moderate : true,   
      iterations : 1,
      retries  : 1
    }).then(function(res) {
      console.log(res[0])
      socket.emit('img', res[0])
    })
  })

  socket.on('search', (keyword) => {
    keyword = keyword.replace(' ', '+')
    const searchResults = DDG.search(keyword, {
      safeSearch: DDG.SafeSearchType.STRICT
    }).then(function(res) {
      console.log(res)
      socket.emit('search', res)
    })
  })

  socket.on('disconnect', () => {
    console.log('connection end')
  })
})





