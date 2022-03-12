const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { v4: uuidv4 } = require('uuid');
const { serialize, parse } = require('cookie');
const cookieParser = require('cookie-parser');
const { redirect } = require('express/lib/response');
const io = require('socket.io')(server);
/*
쿠키제어
https://kwanghyuk.tistory.com/90
socket.io cookie
https://socket.io/how-to/deal-with-cookies

*/
app.use(cookieParser());
const welcomeList = [];
io.on('connection', (socket) => {
    console.log(socket.id) + ' is connected';
    userWaiting.push(socket.id);
    socket.on('disconnect', () => {
        let index;
        if((index = userWaiting.findIndex(element => element === socket.id)) !== -1) {
            userWaiting.splice(index, 1);
            console.log(socket.id + ' is removed');
        }
        console.log('disconnected')
        console.log(userWaiting);
    })
    socket.on('check', () => {
        console.log('check')
        console.log('socket.id = ' + socket.id);
        console.log('userWaiting = ' + userWaiting);
        if(slotNum > 0 && socket.id === userWaiting[0]) {
            // welcomeList.add(userWaiting[0]);
            // slotNum--;
            // userWaiting.shift();
            console.log('userWaiting = ' + userWaiting);
            console.log('emit welcome')
            welcomeList.push(socket.id);
            socket.emit('welcome', socket.id);
        }
        else {
            console.log('emit check')
            socket.emit('check', userWaiting.findIndex(element => element === socket.id));
        }
    })
});

let slotNum = 0;
app.get('/:id', (req, res) => {
    console.log('/id ' + req.params.id)
    if(req.params.id === welcomeList[0]) {
        slotNum--;
        welcomeList.shift();
        console.log('send welcome')
        // res.redirect('/');
        res.send('welcome')
    }
})
app.get('/', (req, res) => {
    if(slotNum > 0) {
        if(userWaiting.length === 0) {
            slotNum--;
            res.send("hello world")
        }
        else {  // someone is already waiting before you
            // this case is handled by socket.io
        }
    }
    else {
        res.sendFile(__dirname + '/index.html');
    }
});
app.get('/setSlot/:data', (req, res) => {
    console.log('setSlot/:data');
    console.log(req.params.data);
    slotNum = req.params.data;
    res.sendStatus(200);
})
app.get('/check', (req, res) => {
    console.log('check');
    console.log(req.cookies);
    console.log(userWaiting);
    // if slot is available
    // 요청이 대기열의 첫번째이면 입장시킨다.
    if(slotNum > 0 && req.cookies.uid === userWaiting[0]) {
        // userWaiting.shift();    // 대기열에서 제거
        // res.redirect('http://localhost:3000/');
        res.send({waitNum: userWaiting.length - 1, success: true});
    }
    else {
        res.send({waitNum: userWaiting.findIndex(element => element === req.cookies.uid), success: false});
    }
})
const userWaiting = [];
function getUUID() {
    const uid = uuidv4();
    userWaiting.push(uid);
    return uid;
}

// app.listen(3000, () => {
//     console.log('express server is up and running')
// })

server.listen(3000, () => {
    console.log('http server is listening at 3000');
})