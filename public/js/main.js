const input = document.getElementById('input');
const messages=document.querySelector('.message');
const usersList = document.querySelector('.users');

//const moment=require('moment');
 
//get username  and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true

});
console.log(username)
console.log(room)


const socket = io();

//join room
socket.emit('joinroom',{username, room});

//get room and users info
socket.on('roomUsers', ({ room, users }) => {
   // outputUsers(users);
   console.log(room)
    console.log(users)
    showRoom(room);
    showusers(users);
});

function showRoom(room){
    document.getElementById('roomname').innerHTML = room;
}

function showusers(users){
    
    usersList.innerHTML = `${users.map(user => `<div class ="user"> <img src="user_default.png" alt="pic"> ${user.username}  </div>`).join('')}`;
   

    /*for(let i = 0; i < users.length; i++) {
        
        usersList.innerHTML += '<div class="user">' + users[i].username + '</div>';
      }*/

}

//notice
socket.on('notice', notice => {
    shownotice(notice);

    //scroll down
    messages.scrollTop = messages.scrollHeight;
});


//listen for incoming messages from server
socket.on('message', message =>{
    showmessage(message,'incoming');

    //scroll down
    messages.scrollTop = messages.scrollHeight;

});

//message submit
input.addEventListener('submit', e =>{
    e.preventDefault();

    //get message text
    const msg = e.target.elements.text.value;

    //emit message to server
    socket.emit('chatmessage',msg);

    //show outgoing message
    showmessage(msg, 'outgoing');

    //scroll down
    messages.scrollTop = messages.scrollHeight;

    // Clear input
    e.target.elements.text.value = '';
    e.target.elements.text.focus();
});

function showmessage(message, type){
    const div =document.createElement('div');
    div.classList.add(type);
    if(type=='incoming'){

        div.innerHTML = ` <span style="display: block;">${message.username} ${message.time}</span> ${message.text}`;
        document.querySelector('.message').appendChild(div);
   }
   if(type=='outgoing'){
    //var time=moment().format('h:mm:a');
    // before message for time  <span style="display: block; margin-top:-32px"></span>
    div.innerHTML = `  ${message}`;
    document.querySelector('.message').appendChild(div);
   } 
   

}

function shownotice(notice){
    const div =document.createElement('div');
    div.classList.add('notice');
    
    div.innerHTML = ` <span style="display: block;"> ${notice.time}</span> ${notice.text}`;
    document.querySelector('.message').appendChild(div);
}

/*function outputUsers(users){
   /* const div =document.createElement('div');
    div.classList.add(user);*/

 /*   usersList.innerHTML = /*`${users.map(user => <div.user>${user.username}</div.user> ).join('')`};*/

