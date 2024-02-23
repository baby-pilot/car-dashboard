// ENV NOT WORKING, MANUALLY PUT UR HOST BELOW
const PORT = process.env.PORT || 65432;
const HOST = process.env.HOST || "192.168.0.14";
const net = require('net');

console.log(HOST, PORT)

// ELECTRON_ENABLE_LOGGING=1  # export in shell for logs

let driveKeyPressed = false;

document.addEventListener("keydown", updateKey);
document.addEventListener("keyup", resetKey);
// document.addEventListener("DOMContentLoaded", update_data);

// create connection to listen for metric data and send commands
const client = net.createConnection({ port: PORT, host: HOST }, () => {
    console.log('Connected to server');
});

// only keep 1 data event listener to avoid conflicting behaviours
client.on("data", (data) => {
    const metrics = data.toString();
    console.log("Received metrics from server: ", metrics);
    // parse JSON
    try {
        const jsonData = JSON.parse(metrics);
        document.getElementById("battery").innerHTML = jsonData.battery;
        document.getElementById("speed").innerHTML = jsonData.speed;
        document.getElementById("temperature").innerHTML = jsonData.cpu_temp;
    }
    catch(e) {
        console.error('Error parsing JSON: ', e);
    }
})

function sendCommand(command) {
    client.write(command + "\r\n");
    console.log('Command sent: ', command);
    // keep connection open for future commands/data reception
}

// for detecting which key is been pressed (use arrow keys)
// todo: implement long press (activate on press, deactivate on release)
function updateKey(e) {
    // prevent pressing two keys at the same time
    if (driveKeyPressed) return;

    e = e || window.event;
    if (e.keyCode == '38') {
        document.getElementById("upArrow").style.color = "green";
        sendCommand("start_forward");
    }
    else if (e.keyCode == '40') {
        document.getElementById("downArrow").style.color = "green";
        sendCommand("start_reverse");
    }
    else if (e.keyCode == '37') {
        document.getElementById("leftArrow").style.color = "green";
        sendCommand("start_left");
    }
    else if (e.keyCode == '39') {
        document.getElementById("rightArrow").style.color = "green";
        sendCommand("start_right");
    }
    else {
        console.log("Unregistered key press. Ignoring.");
        return;
    }
    driveKeyPressed = true
}

// reset the key to the start state 
function resetKey(e) {

    e = e || window.event;
    console.log(e)
    // if keyup is not an arrow key, ignore
    if (![37, 38, 39, 40].includes(e.keyCode)) return;

    document.getElementById("upArrow").style.color = "grey";
    document.getElementById("downArrow").style.color = "grey";
    document.getElementById("leftArrow").style.color = "grey";
    document.getElementById("rightArrow").style.color = "grey";

    sendCommand("stop_car")
    driveKeyPressed = false // reset
}

/************************ unused test code *************************/

// function greeting() {
//     // get element from html
//     var name = document.getElementById("myName").value;
//     // update the content in html by inserting the name submitted into the <span> element
//     document.getElementById("greet").innerHTML = "Hello " + name + "!";
//     client();
// }

// function retrieveMetrics() {
//     // metrics include battery level, speed, and temperature of the car
//     const client = net.createConnection({ port: PORT, host: HOST }, () => {
//         console.log("Connected to server");
//         client.write(`get_metrics\r\n`);
//         // console.log('Message sent!')
//     });

//     // get data from server
//     // console.log('Waiting on data...')
//     client.on('data', (data) => {
//         let metrics = JSON.parse(data);
//         // console.log("metrics: ", metrics)
//         // insert data echoed back by server into span elements
//         if (metrics) {
//             document.getElementById("battery").innerHTML = metrics.battery.toString();
//             document.getElementById("speed").innerHTML = metrics.speed.toString();
//             document.getElementById("temperature").innerHTML = metrics.cpu_temp.toString();
//         }
//         client.end();
//         client.destroy();
//     });
// }

// function startVideoStream() {
//     const client = net.createConnection({ port: PORT, host: HOST }, () => {
//         console.log("Connected to server");
//         client.write(`start_camera\r\n`);
//         // console.log('Message sent!')
//     });

//     // get data from server
//     // console.log('Waiting on data...')
//     client.on('data', (data) => {
//         // console.log("data: ", data)
//         // insert data echoed back by server into span elements
//         if (data) {
//             // console.log("data: ", data)
//             // document.getElementById("video").innerHTML = data;
//             // document.getElementById("video").src = `data:image/jpeg;base64,${data}`;
//             document.getElementById("video_feed").src = `data:image/jpeg;base64,${data}`;
//         }
//         client.end();
//         client.destroy();
//     });
// }

// // update data for every 50ms
// function update_data() {
//     // const client = net.createConnection({ port: PORT, host: HOST }, () => {
//     //     console.log("Connected to server");
//     // });

//     setInterval(function () {
//         // get image from python server
//         retrieveMetrics();
//         startVideoStream();
//     }, 500);

//     // // close the connection when the window is closed
//     // document.addEventListener("unload", () => {
//     //     client.end();
//     //     client.destroy();
//     // });
// }