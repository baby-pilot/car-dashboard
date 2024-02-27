// ENV NOT WORKING, MANUALLY PUT UR HOST BELOW
const PORT = process.env.PORT || 65432;
const HOST = process.env.HOST || "192.168.0.15";
const net = require('net');

const MAX_BATTERY = 7.4;
const MAX_SPEED = 100;
const MAX_TEMP = 100;

console.log(HOST, PORT)

// for voltage smoothing:
const readingBuffer = [];
const MAX_BUFFER_SIZE = 10;

// ELECTRON_ENABLE_LOGGING=1  // export in shell for logs

let driveKeyPressed = "";  // prevent double presses

document.addEventListener("keydown", updateKey);
document.addEventListener("keyup", resetKey);
document.getElementById("max_battery").textContent = MAX_BATTERY;
document.getElementById("max_speed").textContent = MAX_SPEED;
document.getElementById("max_temp").textContent = MAX_TEMP;

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
        const { battery, speed, cpu_temp } = JSON.parse(metrics);
        const smoothed_voltage = getSmoothedVoltage(battery);
        document.getElementById("battery").innerHTML = smoothed_voltage.toFixed(1);
        document.getElementById("speed").innerHTML = speed.toFixed(1);
        document.getElementById("temperature").innerHTML = cpu_temp.toFixed(1);
        const batt_percent = getPercentage(smoothed_voltage, MAX_BATTERY);
        const spd_percent = getPercentage(speed, MAX_SPEED);
        const cpu_percent = getPercentage(cpu_temp, MAX_TEMP);
        setProgressValue("batt_progress", batt_percent);
        setProgressValue("speed_progress", spd_percent);
        setProgressValue("temp_progress", cpu_percent);
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
        document.getElementById("upArrow").style.backgroundColor = "green";
        sendCommand("start_forward");
    }
    else if (e.keyCode == '40') {
        document.getElementById("downArrow").style.backgroundColor = "green";
        sendCommand("start_reverse");
    }
    else if (e.keyCode == '37') {
        document.getElementById("leftArrow").style.backgroundColor = "green";
        sendCommand("start_left");
    }
    else if (e.keyCode == '39') {
        document.getElementById("rightArrow").style.backgroundColor = "green";
        sendCommand("start_right");
    }
    else {
        console.log("Unregistered key press. Ignoring.");
        return;
    }
    driveKeyPressed = e.keyCode
}

// reset the key to the start state 
function resetKey(e) {

    e = e || window.event;
    // if keyup is not an arrow key or released key is not the pressed key, ignore
    if (![37, 38, 39, 40].includes(e.keyCode) || e.keyCode != driveKeyPressed) return;

    document.getElementById("upArrow").style.backgroundColor = "grey";
    document.getElementById("downArrow").style.backgroundColor = "grey";
    document.getElementById("leftArrow").style.backgroundColor = "grey";
    document.getElementById("rightArrow").style.backgroundColor = "grey";

    sendCommand("stop_car")
    driveKeyPressed = "" // reset
}

function getPercentage(value, maxValue) {
    if (value > maxValue) {
        return 100;
    }
    return Math.round((value / maxValue) * 100)
}

function getSmoothedVoltage(newReading) {
    if (readingBuffer.length >= MAX_BUFFER_SIZE) {
        readingBuffer.shift();
    }
    readingBuffer.push(newReading);
    return readingBuffer.reduce((acc, curr) => acc + curr, 0)/readingBuffer.length
}


function setProgressValue(circularProgressId, value) {
    const progressBar = document.querySelector(`#${circularProgressId}`);
    if (!progressBar) {
        console.error('Circular progress bar not found');
        return;
    }

    const endValue = value; 
    const progressColor = progressBar.getAttribute("data-progress-color");

    const progressValue = progressBar.querySelector(".percentage");
    const innerCircle = progressBar.querySelector(".inner-circle");

    progressValue.textContent = `${endValue}%`;
    progressValue.style.color = progressColor;

    innerCircle.style.backgroundColor = progressBar.getAttribute("data-inner-circle-color");

    progressBar.style.background = `conic-gradient(${progressColor} ${endValue * 3.6}deg, ${progressBar.getAttribute("data-bg-color")} 0deg)`;
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

// function client() {
//     const net = require('net'); // This requires node integration on client side
//     var input = document.getElementById("myName").value;
//     console.log("Connecting to server");
//     // connect listener
//     const client = net.createConnection({ port: server_port, host: server_addr }, () => {
//         // send the message
//         client.write(`${input}\r\n`);
//         console.log('Message sent!')
//     });

//     // get data from server
//     console.log('Waiting on data...')
//     client.on('data', (data) => {
//         // insert data echoed back by server into span element
//         document.getElementById("greet_from_server").innerHTML = "Message echo'd back from server: " + data.toString();
//         console.log(data.toString());
//         client.end();  // tells server we, the client, has finished sending data
//     });

//     client.on('end', () => {
//         console.log("FIN packet received from server. Disconnecting from serve by closing socket...");
//         client.destroy(); // close client side socket
//         console.log("Client side socket closed");
//     });
// }