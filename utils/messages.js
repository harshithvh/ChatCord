// File to format the messages displayed based on username, text and time

const moment = require('moment');

function formatMessage(username, text){
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage