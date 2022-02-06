const express = require('express')
const app = express()
const port = 3000
const data = require('./weather.json')
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiY3M1NjEtc2UiLCJwYXNzIjoiTGV0TWVJbiJ9.8f2w5c4XgSdIPjfLLKsbNGE9QV8aOnN6SeJoldv7FSU"
const expiry = new Date()
expiry.setFullYear(expiry.getFullYear()+1)

app.use(function (request, response, next) {
    // Website you wish to allow to connect
    const allowedOrigins = ['https://editor.swagger.io', 'https://hoppscotch.io', 'https://app.swaggerhub.com/','https://inspector.swagger.io/'];
    const origin = request.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        response.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    // Request methods you wish to allow eg: GET, POST, OPTIONS, PUT, PATCH, DELETE
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

app.post('/v1/auth', (request, response) => {
  console.dir(request.body)
  username = request.body.username
  password = request.body.password
  if (username == "cs561-se" && password == "LetMeIn"){
    token = {
    "jwt": jwtToken,
    "exp": expiry
    }
  return response.json(token)
  }
  else{
    return response.sendStatus(401)
  }

})

app.get('/v1/hello', (request, response) => {
  const authHeader = request.headers['authorization']
  console.log(authHeader)
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return response.sendStatus(401)

  if (token == jwtToken){
    return response.send('Welcome to Open Mock Weather Services!')
  }
  
  return response.sendStatus(403).send("Invalid Token")
})

app.get('/v1/weather', get_weather) 

function get_weather(request,response) {
  const authHeader = request.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.dir(token)
  console.dir(jwtToken)
  if (token == null) return response.sendStatus(401)

  if (token == jwtToken){
    //console.dir(request.method)
    //console.dir(request.hostname)
    //console.dir(request.ip)
    console.dir(request.originalUrl)
    return response.json(data)
  }
  
  return response.sendStatus(403).send("Invalid Token")

}

app.all('/data/2.5/weather/', get_weather)

app.listen(port,() => {
  console.log(`Weather API listening on port ${port}`)
})