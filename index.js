'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

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
    if (req.query['hub.verify_token'] === 'EAAaXW0ZBr56cBAI9XZCSZA2Nz9O2swQRoCXnvoga2abkkDqobkY6Ub0IjyApPq41rujgwB3jk7nYm2WzpdwlC1tgseAQ1lG2obSmRJTWt3BS3363tB9r03hbSfYU3mcG0bRgr68lbIi9iqEa1QhZA1ZCjl9AXBEsgpDyenbwWEQZDZD') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

