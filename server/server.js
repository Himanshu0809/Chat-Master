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

    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
})


server.listen(PORT, function () {
    console.log(`Chat App server started on port ${PORT}`);
});