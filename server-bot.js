/*
File format:
-ChatCord
  |_css
  |_js
  |_chat.html
  |_index.html
-utils
  |_messages.js
  |_users.js
-server-bot.js
*/

// This is the server side

const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { joinUser, getRoomUsers, userLeave } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Set static folder
app.use(express.static(path.join(__dirname, 'ChatCord')))

const botName = 'ChatCord Bot'

// Run when client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({username, room}) => {
        const user = {
            username,
            room
        }
        // Add users to the database
        joinUser(username, room )

        // Add user to the mentioned room
        socket.join(user.room)

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!')) // emits to a single client
    
        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`)) // broadcast : emits to everyone except the user thats connected
        
        // Send users and room info when connected
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room) // Filter the users based on room in database and display it
        })

        // Listen for chatMessage
        socket.on('chatMessage', msg => {
            io.to(user.room).emit('message', formatMessage(user.username, msg))
        })
        
        // Runs when client disconnects
        socket.on('disconnect', () => {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))

            // Remove user from database on leaving
            userLeave(user.username)

            // Send users and room info when disconnected
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        })
    })




})

const port = 3000 || process.env.PORT
server.listen(port, () => console.log(`Server running on port ${port}`))
