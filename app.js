const express = require('express')
const app = express()
const port = 3000
const data = require('./weather.json')

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    const allowedOrigins = ['https://editor.swagger.io', 'https://hoppscotch.io'];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    // Request methods you wish to allow eg: GET, POST, OPTIONS, PUT, PATCH, DELETE
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

app.get('/v1/hello', (req, res) => {
  res.send('Welcome to Open Mock Weather Services!')
})

app.post('/v1/auth', (req, res) => {
  res.send('12a3c2bf78ad167b3836fcda54cd32cv')
})

// POST method route
app.post('/', function (req, res) {
    res.send('POST request to the homepage')
})

app.get('/v1/weather', get_weather) 

function get_weather(request,response) {
  //console.dir(request.method)
  //console.dir(request.hostname)
  //console.dir(request.ip)
  //console.dir(request.originalUrl)
  response.json(data)
}

app.all('/data/2.5/weather/', get_weather)

app.listen(port,() => {
  console.log(`Weather API listening on port ${port}`)
})