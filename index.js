const PORT = 65432;
const HOST = process.env.HOST || "192.168.1.54";
const net = require('net');
// ELECTRON_ENABLE_LOGGING=1  # export in shell for logs

let keyPressed = false;
let carKeyPressed = false;

document.addEventListener("keydown", updateKey);
document.addEventListener("keyup", resetKey);

function sendCommand(command) {
    const client = net.createConnection({ port: PORT, host: HOST }, () => {
        client.write(command + "\r\n");
        console.log('Command sent: ', command);
        client.end();  // tells server we, the client, has finished sending data
        client.destroy(); // close client side socket
    });
}

function client() {
    var input = document.getElementById("message").value;
    console.log("Connecting to server");
    // connect listener
    const client = net.createConnection({ port: PORT, host: HOST }, () => {
        // send the message
        client.write(`${input}\r\n`);
        console.log('Message sent!')
    });

    // get data from server
    console.log('Waiting on data...')
    client.on('data', (data) => {
        // insert data echoed back by server into span element
        document.getElementById("bluetooth").innerHTML = data.toString();
        console.log(data.toString());
        client.end();  // tells server we, the client, has finished sending data
    });

    client.on('end', () => {
        console.log("FIN packet received from server. Disconnecting from serve by closing socket...");
        console.log("Client side socket closed");
    });
}

// for detecting which key is been pressed (use arrow keys)
// todo: implement long press (activate on press, deactivate on release)
function updateKey(e) {
    // prevent pressing two keys at the same time
    if (keyPressed) return;

    e = e || window.event;

    if (e.keyCode == '38') {
        document.getElementById("upArrow").style.color = "green";
        carKeyPressed = true;
        sendCommand("start_forward");
    }
    else if (e.keyCode == '40') {
        document.getElementById("downArrow").style.color = "green";
        carKeyPressed = true;
        sendCommand("start_reverse");
    }
    else if (e.keyCode == '37') {
        document.getElementById("leftArrow").style.color = "green";
        carKeyPressed = true;
        sendCommand("start_left");
    }
    else if (e.keyCode == '39') {
        document.getElementById("rightArrow").style.color = "green";
        carKeyPressed = true;
        sendCommand("start_right");
    }
    console.log("keypressed")
    keyPressed = true
}

// reset the key to the start state 
function resetKey(e) {

    e = e || window.event;

    document.getElementById("upArrow").style.color = "grey";
    document.getElementById("downArrow").style.color = "grey";
    document.getElementById("leftArrow").style.color = "grey";
    document.getElementById("rightArrow").style.color = "grey";

    // send stop command stored in keyPressed
    // only if keyPressed is true
    if (carKeyPressed) {
        sendCommand("stop_car")
        carKeyPressed = false
    }
    keyPressed = false // reset
}

// update data for every 50ms
function update_data() {
    client()
    // setInterval(function(){
    //     // get image from python server
    //     client();
    // }, 50);
}


/************************ unused test code *************************/

// function greeting() {
//     // get element from html
//     var name = document.getElementById("myName").value;
//     // update the content in html by inserting the name submitted into the <span> element
//     document.getElementById("greet").innerHTML = "Hello " + name + "!";
//     client();
// }

