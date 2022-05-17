const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");


//서버와 연결된 소켓
//app.js의 소켓은 서버로의 연결을 뜻한다.
const socket = new WebSocket(`ws://${window.location.host}`);


function makeMessage(type, payload) {
    const msg = {type, payload}
    return JSON.stringify(msg);
}

socket.addEventListener("open", ()=>{
    // connection이 연결되었을때
    console.log("Connected to Server");
})

socket.addEventListener("message", (message) =>{
    // 메세지가 올때마다
    // const li = document.createElement("li");
    
    // li.innerText = message.data;
    // messageList.append(li);
})

socket.addEventListener("close", ()=> {
    // 서버가 오프라인이 될때
    console.log("connected from server Xfail");
})

function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    const message = input.value;
    socket.send(makeMessage("new_message", message));
    const li = document.createElement("li");
    li.innerText = `You: ${message}`;
    messageList.append(li);
    input.value = "";
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    const nickname = input.value;
    socket.send(makeMessage("nickname", nickname));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
