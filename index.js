'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')
const app = express()

const token = 'EAAaXW0ZBr56cBAPsTb62sBrU4ZAJiS6TmxZAvrX5FkdXxPz6HEfooit6aUv1c4UNp63rbNayPzZBpE4TQwfwFZCuOHkQc1kZCr58QBNy7QODslH7goEXUXo21AU6xcelKkKbgIwZCJaUiWNvNmqWRs5zfv7UrMEHkJgLSM1BvXzXQZDZD';

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
    var latitude;
    var longitude;
    if (event.message && event.message.text) {
      let text = event.message.text
      if (checkNumber(text) && text.length === 5) {
        request({
          url: 'http://maps.googleapis.com/maps/api/geocode/json?&components=postal_code:'+text+'&sensor=false',
          key: 'AIzaSyA37mA3uweNrUGD159vlW06IZh7EZHOEaA',
          method: "POST",
        }, function (error, response, body){
          var jsonBody = JSON.parse(response.body);
          console.log(jsonBody);
          if (response.body.results !== null) {
            latitude = jsonBody.results[0].geometry.location.lat;
            longitude = jsonBody.results[0].geometry.location.lng;
            console.log("LAT = "+latitude+"- LNG---------- = "+longitude);
            findMeetups(latitude, longitude, sender);
          }
        });
        continue
      } else if (checkNumber(text)) {
        sendTextMessage(sender, "We're sorry, please enter a valid zip code.");
      } else {
        sendTextMessage(sender, "Hi, I am the Unofficial Meetup Messenger Bot! To begin, please enter a zip code where you would like to find some Meetups.");
      }
    }
    if (event.postback) {
      let text = JSON.stringify(event.postback)
      sendTextMessage(sender, "Sorry, this feature has not been built yet. Thank you!")
      continue
    }
  }
  res.sendStatus(200)
})

function findMeetups(lat, lng, sender) {
  request({
    url: 'http://api.meetup.com/find/events/?&sign=true&key=66577a535e5a78e405721501067238&lat=' + lat + '&lon=' + lng,
    method: "GET",
  }, function (error, response, body){
    var jsonBody = JSON.parse(response.body);

    // console.log(jsonBody);
    var names = [];
    var links = [];
    var groups = [];
    var desc = [];
    for (var i = 0; i < 5; i++) {
      console.log(jsonBody[i].name);
      names[i] = jsonBody[i].name;
      console.log(jsonBody[i].link);
      links[i] = jsonBody[i].link;
      console.log(jsonBody[i].group.name);
      groups[i] = jsonBody[i].group.name;
      console.log(jsonBody[i].description);
    }
    sendGenericMessage(sender, names, links, groups, desc);

    if (response.body.results !== null) {
    }
  });
}

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

function sendGenericMessage(sender, names, links, groups, desc) {
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "list",
        "top_element_style": "compact",
        "elements": [
        {
          "title": names[0],
          "image_url": "",
          "subtitle": groups[0],
          "default_action": {
            "type": "web_url",
            "url": links[0],
            "messenger_extensions": true,
            "webview_height_ratio": "tall",
            "fallback_url": links[0]                        
          },
          "buttons": [
          {
            "title": "Check It Out",
            "type": "web_url",
            "url": links[0],
            "messenger_extensions": true,
            "webview_height_ratio": "tall",
            "fallback_url": links[0]                        
          }
          ]                
        },
        {
          "title": names[1],
          "image_url": "",
          "subtitle": groups[1],
          "default_action": {
            "type": "web_url",
            "url": links[1],
            "messenger_extensions": true,
            "webview_height_ratio": "tall",
            "fallback_url": links[1]                        
          },
          "buttons": [
          {
            "title": "Check It Out",
            "type": "web_url",
            "url": links[1],
            "messenger_extensions": true,
            "webview_height_ratio": "tall",
            "fallback_url": links[1]                        
          }
          ]                
        },
        {
          "title": names[2],
          "image_url": "",
          "subtitle": groups[2],
          "default_action": {
            "type": "web_url",
            "url": links[2],
            "messenger_extensions": true,
            "webview_height_ratio": "tall",
            "fallback_url": links[2]                        
          },
          "buttons": [
          {
            "title": "Check It Out",
            "type": "web_url",
            "url": links[2],
            "messenger_extensions": true,
            "webview_height_ratio": "tall",
            "fallback_url": links[2]                        
          }
          ]                
        },
        {
          "title": names[3],
          "image_url": "",
          "subtitle": groups[3],
          "default_action": {
            "type": "web_url",
            "url": links[3],
            "messenger_extensions": true,
            "webview_height_ratio": "tall",
            "fallback_url": links[3]                        
          },
          "buttons": [
          {
            "title": "Check It Out",
            "type": "web_url",
            "url": links[3],
            "messenger_extensions": true,
            "webview_height_ratio": "tall",
            "fallback_url": links[3]                        
          }
          ]                
        },
        ],
        "buttons": [
        {
          "title": "View More",
          "type": "postback",
          "payload": "payload"                        
        }
        ]  
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

function checkNumber(value) {
  if ( value % 1 === 0 )
    return true;
  else
    return false;
}

// Spin up the server
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})

