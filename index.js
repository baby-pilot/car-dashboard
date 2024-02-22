document.onkeydown = updateKey;
document.onkeyup = resetKey;

const net = require('net'); // This requires node integration on client side
const server_port = 65432;
const server_addr = "192.168.1.54";

function greeting() {
    // get element from html
    var name = document.getElementById("myName").value;
    // update the content in html by inserting the name submitted into the <span> element
    document.getElementById("greet").innerHTML = "Hello " + name + "!";
    client();
}

function client() {
    var input = document.getElementById("message").value;
    console.log("Connecting to server");
    // connect listener
    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        // send the message
        console.log("connected to server!");
        client.write(`${input}\r\n`);
        console.log('Message sent!')
    });

    // get data from server
    console.log('Waiting on data...')
    client.on('data', (data) => {
        // insert data echoed back by server into span element
        // document.getElementById("greet_from_server").innerHTML = "Message echo'd back from server: " + data.toString();
        document.getElementById("bluetooth").innerHTML = data;
        console.log(data.toString());
        client.end();  // tells server we, the client, has finished sending data
        client.destroy(); // close client side socket
    });

    client.on('end', () => {
        console.log("FIN packet received from server. Disconnecting from serve by closing socket...");
        console.log("Client side socket closed");
    });
}

function send_data(data) {
    console.log("Connecting to server");
    // connect listener
    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        // send the message
        console.log("connected to server!");
        client.write(`${data}\r\n`);
        console.log('Message sent!')
        client.end();  // tells server we, the client, has finished sending data
        client.destroy(); // close client side socket
    });
}

// for detecting which key is been pressed w,a,s,d
// todo: implement long press (activate on press, deactivate on release)
function updateKey(e) {
    console.log(e.keyCode)

    e = e || window.event;

    if (e.keyCode == '87') {
        // up (w)
        document.getElementById("upArrow").style.color = "green";
        send_data("87");
    }
    else if (e.keyCode == '83') {
        // down (s)
        document.getElementById("downArrow").style.color = "green";
        send_data("83");
    }
    else if (e.keyCode == '65') {
        // left (a)
        document.getElementById("leftArrow").style.color = "green";
        send_data("65");
    }
    else if (e.keyCode == '68') {
        // right (d)
        document.getElementById("rightArrow").style.color = "green";
        send_data("68");
    }
}

// reset the key to the start state 
function resetKey(e) {

    e = e || window.event;

    document.getElementById("upArrow").style.color = "grey";
    document.getElementById("downArrow").style.color = "grey";
    document.getElementById("leftArrow").style.color = "grey";
    document.getElementById("rightArrow").style.color = "grey";
}

// update data for every 50ms
function update_data() {
    client()
    // setInterval(function () {
    //     // get image from python server
    //     client();
    // }, 50);
}