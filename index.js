'use strict'
// EAAaXW0ZBr56cBAPsTb62sBrU4ZAJiS6TmxZAvrX5FkdXxPz6HEfooit6aUv1c4UNp63rbNayPzZBpE4TQwfwFZCuOHkQc1kZCr58QBNy7QODslH7goEXUXo21AU6xcelKkKbgIwZCJaUiWNvNmqWRs5zfv7UrMEHkJgLSM1BvXzXQZDZD


const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

const token = process.env.FB_PAGE_ACCESS_TOKEN;

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'christinazhu') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

  app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        if (isNumeric(text)) {
            $.ajax({
               url : "http://maps.googleapis.com/maps/api/geocode/json?&components=postal_code:"+text+"&sensor=false",
               method: "POST",
               success:function(data){
                   latitude = data.results[0].geometry.location.lat;
                   longitude= data.results[0].geometry.location.lng;
                   sendTextMessage(sender, "Lat = "+latitude+"- Long = "+longitude);
               }
            });
            sendGenericMessage(sender)
            continue
        }
        sendTextMessage(sender, "Welcome to the Unofficial Meetup Messenger Bot! To begin, please enter a zip code where you would like to find some Meetups.");
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
        continue
      }
    }
    res.sendStatus(200)
  })



function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function isNumeric(num){
    return !isNaN(num)
}

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

