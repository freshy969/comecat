const express = require('express');
const bodyParser = require('body-parser');
var request = require('request');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', (req, res) => {

    const roomID = req.body.room.id;
    const userName = req.body.sender.name;
    const isGuest = req.body.sender.isGuest == 1;

    const serverUrl = 'http://localhost:8080/api/v3/cc/send';
    const apiKey = 'GtZX9bkKKiWpJKauL06ugOCZS2BwrJEY';

    if(!isGuest)
        return;

    request.post({
        headers: {
            'apikey': apiKey,
        },
        uri: serverUrl,
        body: { 
            roomID: roomID,
            message: 'Hi ' + userName
        },
        json: true,
        method: 'POST'
    }, (err, res, body) => {

        console.log(body);
        
    });

});

app.listen(3003, () => console.log('Example app listening on port 3003!'));



