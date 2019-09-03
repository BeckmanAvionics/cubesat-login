//npm i ws
//npm i fs
//make a .txt file and put its path in line 13

const WebSocket = require('ws').Server;

const fs = require('fs');
console.log('connected');

const wss = new WebSocket({
    port: 8081
});
const FILENAME = 'login.txt';

var d = new Date();
var date; //d.getDate(); 
var sameDay;
var password = 'password';

wss.on('connection', (ws => {

    if (!date) {
        sameDay = false;
        date = d.getDate();
        console.log('first')
    } else {
        if (date != d.getDate()) {
            sameDay = false;
            date = d.getDate();
            console.log('second')
        } else {
            sameDay = true;
            console.log('third')
        }
    }

    ws.on('message', (message => {
        console.log('Received message:', message);
        var msg = JSON.parse(message);

        if (msg.id == 'member') {
            if (msg.password == password) {
                //writes to text file
                var logger = fs.createWriteStream(FILENAME, {
                    flags: 'a'
                })
                if (!sameDay) {
                    logger.write("\n--------------------------------\n");
                    logger.write("\nAttendance from " + msg.weekday + ', ' + msg.month + '/' + msg.day + ":\n\n")
                    sameDay = true;
                }
                logger.write("- " + msg.firstname + " " + msg.lastname + "\n");

                //fs.close(); keeps giving me errors so if you wanna make changes onto 
                //the .txt file for whatever reason close the server

                ws.send('Success! You have logged in!')
            } else {
                ws.send('Incorrect password! The system has not logged you in, please try again!')
            }
        } else {
            if(msg.id == 'admin') {
                password = msg.password;
                console.log('Password set as: ', password);
                ws.send(password );
            } else {
                console.log('error id =/= member nor password tf u doing');
            }
        }
    }));


    ws.on('close', () => {
        console.log('client disconnected from server');
    });
}));
