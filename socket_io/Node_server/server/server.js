const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');


const app = express();
var server = http.createServer(app);
var publicPath = path.join(__dirname, '../public');
var port = process.env.PORT || 3000;
var io = socketIO(server);
var emitEventInInterval = function () {
    let initialTimeOut = 6000;
    setInterval(() => {
        io.emit('updatedState', {
            "from": 'server',
            "data": [{
                "id": 1,
                "percentage": Math.floor(Math.random() * 30) + 1,
                "widthPos": 0
            }, {
                "id": 2,
                "percentage": Math.floor(Math.random() * 30) + 1,
                "widthPos": 150
            }, {
                "id": 3,
                "percentage": Math.floor(Math.random() * 30) + 1,
                "widthPos": 300
            }]
        })
    }, initialTimeOut = 2000)
}

app.use(express.static(publicPath));
io.on('connection', (socket) => {
    console.log('Client connected.');
})
server.listen(port, () => {
    console.log(`Server is up on ${port}`);
    emitEventInInterval();
})
