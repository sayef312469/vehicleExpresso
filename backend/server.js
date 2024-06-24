/* eslint-disable no-undef */
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const socket = require('socket.io')

const parkingRoute = require('./routes/parkingRoute')
const userRoutes = require('./routes/userRoutes')
const careRoute = require('./routes/careRoute')

const app = express()
app.use(cors())

const server = app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})

app.use(express.static('public'))
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

const io = socket(server)

io.on('connection', () => {
  console.log('socket connected')
})

app.use('/api/parking', parkingRoute)
app.use('/api/user', userRoutes)
app.use('/api/care', careRoute)
