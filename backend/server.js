const express = require('express')
const cors = require('cors')
require('dotenv').config()
const http = require('http')
const { Server } = require('socket.io')

const parkingRoute = require('./routes/parkingRoute')
const userRoutes = require('./routes/userRoutes')
const careRoute = require('./routes/careRoute')
const shopRoute = require('./routes/shopRoute')
const {chatSystem} = require('./realTimeChat');

const app = express()
app.use(cors())

const server = http.createServer(app)

app.use(express.static('public'))
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})


io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`)

  socket.on('join_room', (data) => {
    console.log('join room', data)
    socket.join(data)
  })

  socket.on('setNotify', (data) => {
    console.log('set notify', data.room)
    socket.to(data.room).emit('getNotify', 1)
  })

  socket.on('leaveRoom', (room) => {
    socket.leave(room)
    console.log(`${socket.id} left room ${room}`)
    socket.to(room).emit('message', `User ${socket.id} left room ${room}`)
  })


  //chat-system
  chatSystem(socket);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id)
  })
})

app.use('/api/parking', parkingRoute)
app.use('/api/user', userRoutes)
app.use('/api/care', careRoute)
app.use('/api/shop', shopRoute)

server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
