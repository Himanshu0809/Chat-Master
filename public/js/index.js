let socket = io();    //this makes a request to the backend or the server which will respond

socket.on('connect', function() {
    console.log('Connected to Server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from Server');
});

//client listening to message created by the server
socket.on('newMessage',function(message){
    console.log("new Message", message);
});

