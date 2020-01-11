let socket = io();    //this makes a request to the backend or the server which will respond

socket.on('connect', function () {
    console.log('Connected to Server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from Server');
});

//client listening to message created by the server
socket.on('newMessage', function (message) {
    const formattedTime=moment(message.createdAt).format('LT');//to change the time stamp into formatted form using moment.js doc
    console.log("new Message", message);
    let li = document.createElement('li');
    li.innerText = `${message.from} ${formattedTime}: ${message.text}`;

    document.querySelector('body').appendChild(li);
});

//client listening to message created by the server
socket.on('newLocationMessage', function (message) {
    console.log("newLocationMessage", message);
    const formattedTime=moment(message.createdAt).format('LT');
    let li = document.createElement('li');
    let a=document.createElement('a');
    li.innerText = `${message.from} ${formattedTime}: `;
    a.setAttribute('target','_blank');  //open another tab
    a.setAttribute('href',message.url)
    a.innerText='My Current Location';
    li.appendChild(a) ;

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