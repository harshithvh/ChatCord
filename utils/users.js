const users = []

function joinUser(username, room) {
    const user = { username, room }

    users.push(user)

    return user
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

// When user leaves the chat
function userLeave(username) {
    const index = users.findIndex(user => user.username === username)

    if (index !== -1) {
        users.splice(index, 1)
    }
}

module.exports = {
    joinUser,
    getRoomUsers,
    userLeave
}