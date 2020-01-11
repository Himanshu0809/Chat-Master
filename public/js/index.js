let socket = io();    //this makes a request to the backend or the server which will respond

socket.on('connect', function () {
    console.log('Connected to Server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from Server');
});

//client listening to message created by the server
socket.on('newMessage', function (message) {
    console.log("new Message", message);
    let li = document.createElement('li');
    li.innerText = `${message.from}: ${message.text}`;

    document.querySelector('body').appendChild(li);
});

document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault();
    socket.emit("createMessage", {
        from: "User",
        text: document.querySelector('input[name="message"]').value
    }, function () {

    })
});

document.querySelector('#send-location').addEventListener('click', function (e) {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage',{
            lat:position.coords.latitude,
            lng:position.coords.longitude
        })
    }, function () {
        alert('Unable to fetch location!');
    })
});