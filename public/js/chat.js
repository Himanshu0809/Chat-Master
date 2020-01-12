let socket = io();    //this makes a request to the backend or the server which will respond

function scrollToBottom(){
    let messages=document.querySelector("#messages").lastElementChild; //grabbing the last li elements or the last message inputted by the user or admin
    messages.scrollIntoView(); //JS method to scroll to view if we dont see it
}

socket.on('connect', function () {
    let searchQuery=window.location.search.substring(1);
    let params=JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g,' ').replace(/=/g,'":"')+'"}');

    // to create rooms
    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href='/';
        }else{
            console.log('No error');
        }
    })
});

socket.on('disconnect', function () {
    console.log('Disconnected from Server');
});

socket.on('updateUsersList', function(users){
    let ol=document.createElement('ol');

    users.forEach(function(user){
        let li=document.createElement('li');
        li.innerHTML=user;
        ol.appendChild(li);
    })

   let usersList=document.querySelector('#users');
   usersList.innerHTML="";
   usersList.appendChild(ol); 
})

//client listening to message created by the server
socket.on('newMessage', function (message) {
    const formattedTime=moment(message.createdAt).format('LT');
    const template=document.querySelector("#message-template").innerHTML;
    const html =Mustache.render(template,{
        from:message.from,
        text:message.text,
        createdAt:formattedTime
    });
    const div = document.createElement('div');
    div.innerHTML=html;
    document.querySelector("#messages").appendChild(div);
    scrollToBottom();
});

//client listening to message created by the server
socket.on('newLocationMessage', function (message) {
    const formattedTime=moment(message.createdAt).format('LT');
    const template=document.querySelector("#location-message-template").innerHTML;
    console.log("newLocationMessage", message);
    const html=Mustache.render(template,{
        from: message.from,
        url:message.url,
        createdAt:formattedTime
    });
    const div = document.createElement('div');
    div.innerHTML=html;
    document.querySelector("#messages").appendChild(div);
    scrollToBottom();
});

document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault();

    socket.emit("createMessage", {
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