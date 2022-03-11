const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { v4: uuidv4 } = require('uuid');
const { serialize, parse } = require('cookie');
const cookieParser = require('cookie-parser');
const { redirect } = require('express/lib/response');
/*
쿠키제어
https://kwanghyuk.tistory.com/90
*/
app.use(cookieParser());

let slotNum = 3;
app.get('/', (req, res) => {
    if(slotNum > 0) {
        if(userWaiting.length === 0) {
            slotNum--;
            res.send("hello world")
        }
        else if(req.cookies.uid === userWaiting[0]){
            userWaiting.shift();
            slotNum--;
            res.send("hello world")
        }
        else {
            // someone is waiting ahead.
        }
    }
    else {
        res.cookie("uid", getUUID())
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
        res.send({waitNum: userWaiting.length - 1, success: false});
    }
})
const userWaiting = [];
function getUUID() {
    const uid = uuidv4();
    userWaiting.push(uid);
    return uid;
}

app.listen(3000, () => {
    console.log('express server is up and running')
})