var express=require("express")
var app=express()
var bodyparser=require("body-parser")
var cookieParser=require("cookie-parser")
var morgan=require("morgan")
var server=require("http").Server(app)
var io=require("socket.io")(server)

app.use("/play",express.static("./public"))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });

app.get("/",function(req,res){
	res.send("hello world")
})

server.listen(8000,function(){
	console.log("Server started")
})

io.on('connection', function (socket) {
	
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});