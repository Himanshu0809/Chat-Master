const path = require("path");
express = require("express"),
    http = require("http"),
    socketIO = require("socket.io"),
    app = express();

app.use(express.static(path.join(__dirname, './../public')));

let server = http.createServer(app);
let io = socketIO(server);
const PORT = process.env.PORT || 9000;

//listen to an event
io.on('connection', (socket) => {
    console.log("New user connected");

    //to send the message to the new user
    socket.emit('newMessage',{
        from:"Admin",
        text:"Welcome to ChatMaster",
        createdAt: new Date().getTime()
    })

    //to send the message to all others in the chat that someone has joined
    socket.broadcast.emit('newMessage',{
        from:"Admin",
        text:"New User Joined!",
        createdAt: new Date().getTime()
    });

    //server listening to the message created by client
    socket.on('createMessage', (message) => {
        console.log("message created", message);
        //socket.emit will send personally whereas io.emit will send to all even to self i.e. broadcast the message
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt:new Date().getTime()
        })

        //server creating or emitting a message
        //socket.broadcast.emit will send the message to all excluding self
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
})


server.listen(PORT, function () {
    console.log(`Chat App server started on port ${PORT}`);
});