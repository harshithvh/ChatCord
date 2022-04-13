// This is the client side 

const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

// Get username and root from query string
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// To set up the connection with the server
const socket = io()

// Get room and users info to display
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
})

// Join chatroom (sending the obtained username and room from query string to server)
socket.emit('joinRoom', { username, room})

// Message from server
socket.on('message', message => {
    console.log(message)
    outputMessage(message)

    // Auto scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message sent from user to server
chatForm.addEventListener('submit', e => {
    e.preventDefault() // to prevent a form from submitting to a file

    // Get message text
    const msg = e.target.elements.msg.value;
   
    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input field
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div'); // create a div tag
    div.classList.add('message'); // add a class to the div tag
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerHTML = room;
} 

// Add Users to DOM
function outputUsers(users) {

   userList.innerHTML = `
   ${users.map(user => `<li>${user.username}</li>`).join('')}`
}