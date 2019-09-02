//npm i ws
//npm i fs
//make a .txt file and put its path in line 13

const WebSocket = require('ws').Server;

const fs = require('fs');
console.log('SYSTEM TASK INITIATED: TERMINATE YOUR MOM');

const wss = new WebSocket({
    port: 8080 
});
const FILENAME = 'login.txt';

var d = new Date();
var date = d.getDate();
var sameDay;

wss.on('connection', (ws => {
    //Checks if it's a new date (meeting)
    if (date != d.getDate()){
        sameDay = false;
        date = d.getDate();
    } else { sameDay = true };

    ws.on('message', (message => {
        console.log('Received message:', message); 
        var msg = JSON.parse(message);
        ws.send(msg.firstname + " " + msg.lastname); 

        //writes to text file
        var logger = fs.createWriteStream(FILENAME, {
            flags: 'a'
        })        
        if( !sameDay ) { 
            logger.write("\n--------------------------------\n");
            logger.write("\nAttendance from " + msg.weekday + ', ' + msg.month + '/' + msg.day + ":\n\n") 
            sameDay = true;
        }
        logger.write("- " + msg.firstname + " " + msg.lastname + "\n");
       
        //fs.close(); keeps giving me errors so if you wanna make changes onto 
        //the .txt file for whatever reason close the server
    }));
    ws.on('close', () => {
        console.log('client disconnected from server');
    });
}));