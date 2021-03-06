const path = require("path");
      express = require("express"),
      http = require("http"),
      socketIO = require("socket.io"),
      moment = require("moment"),
      app = express();

const { Users } = require("./utils/users"),
      { isRealString } = require("./utils/isRealString"),
      { generateMessage, generateLocationMessage, generateTypingMessage } = require("./utils/message");

let server = http.createServer(app);
let io = socketIO(server);
const PORT = process.env.PORT || 9000;
let users = new Users();

app.use(express.static(path.join(__dirname, './../public')));

//listen to an event
io.on('connection', (socket) => {
    console.log("New user connected");

    // console.log(socket.id)   //every socket has unique id
    //socket function join to create rooms and join members to it
    socket.on('join', (params, callback) => {
        //validation to remove space leading and trailing spaces
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and Room are required');
        }

        socket.join(params.room);
        users.removeUser(socket.id); //removing the user if it is in some othr room
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));

        //to send the message to the new user
        socket.emit('newMessage', generateMessage('Admin', `Welcome to ${params.room}`));

        //to send the message to all others in the chat that someone has joined
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', 'New User Joined!'));
        callback();
    })

    //server listening to the message created by client
    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {

            //socket.emit will send personally whereas io.emit will send to all even to self i.e. broadcast the message
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback('This is the server: ');

        //server creating or emitting a message
        //socket.broadcast.emit will send the message to all excluding self
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.lng));
        }
    });

    //listening the typing event
    socket.on('typing', ()=>{
        let user=users.getUser(socket.id);

        if(user){
            socket.broadcast.to(user.room).emit('newTypingMessage',generateTypingMessage(user.name));
        }
    })

    socket.on('disconnect', () => {
        //whenever a user disconnects or refreshes the page 

        //store the user
        let user = users.removeUser(socket.id);

        //if user is found remove the user
        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room`));
        }
    });
});


server.listen(PORT, function () {
    console.log(`Chat App server started on port ${PORT}`);
});