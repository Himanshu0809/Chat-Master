const path = require("path");
express = require("express"),
    http = require("http"),
    socketIO = require("socket.io"),
    moment = require("moment"),
    { isRealString } = require("./utils/isRealString"),
    { generateMessage, generateLocationMessage } = require("./utils/message"),
    app = express();

app.use(express.static(path.join(__dirname, './../public')));

let server = http.createServer(app);
let io = socketIO(server);
const PORT = process.env.PORT || 9000;

//listen to an event
io.on('connection', (socket) => {
    console.log("New user connected");

    // console.log(socket.id)   //every socket has unique id
    //socket function join to create rooms and join members to it
    socket.on('join', (params, callback) => {
        //validation to remove space leading and trailing spaces
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and Room are required');
        }

        socket.join(params.room);

        //to send the message to the new user
        socket.emit('newMessage', generateMessage('Admin', `Welcome to ${params.room}`));

        //to send the message to all others in the chat that someone has joined
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', 'New User Joined!'));
        callback();
    })

    //server listening to the message created by client
    socket.on('createMessage', (message, callback) => {
        console.log("message created", message);
        //socket.emit will send personally whereas io.emit will send to all even to self i.e. broadcast the message
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is the server: ');

        //server creating or emitting a message
        //socket.broadcast.emit will send the message to all excluding self
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    })

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lng));
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
})


server.listen(PORT, function () {
    console.log(`Chat App server started on port ${PORT}`);
});