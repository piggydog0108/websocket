import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

console.log("hello");
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname+"/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on ws://localhost:3000`)

// app.listen(3000);//포트
const server = http.createServer(app);// http서버
const wss = new WebSocket.Server({server});//ws서버
// 이렇게 하면 http서버 ws서버를 다 사용할 수 있다.
// http서버 위에 ws서버를 올려놓는다.

// function handleConnection(socket) {
//     //socket 클라이언트와 연결된 소켓
//     //server.js의 socket은 연결된 브라우저를 뜻한다.
//     console.log(socket);
// }

const sockets = [];

wss.on("connection", (socket) => {
    //connection이 생겼을때 socket으로 즉시 메세지(hello!!!)를 보냄
    // console.log(socket);

    sockets.push(socket);
    socket["nickname"] = "Anon"; //익명사용자를 위해
    console.log("Connected to Browser");
    socket.on("close", () => {
        console.log("Disconnected from the Browser X")
    });
    
    socket.on("message", (msg) => {
        // console.log(message.toString('utf8'));
        // sockets.forEach(aSocket => aSocket.send(message.toString('utf8')));
        // socket.send(message.toString('utf8'));
        const message = JSON.parse(msg);
        // if(parsed.type === "new_message") {
        //     sockets.forEach(aSocket => aSocket.send(parsed.payload));
        // } else if(parsed.type === "nickname") {
        //     console.log(parsed.payload);
        // }

        switch(message.type) {
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname} : ${message.payload}`));
            case "nickname":
                socket["nickname"] = message.payload;
        }
        
    });

    
});



server.listen(3000, handleListen);