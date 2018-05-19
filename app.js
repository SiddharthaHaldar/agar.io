var express=require("express")
var app=express()
var bodyparser=require("body-parser")
var cookieParser=require("cookie-parser")
var morgan=require("morgan")
var server=require("http").Server(app)
var io=require("socket.io")(server)

var points={}
var food=[]
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

server.listen(process.env.PORT || 8000,function(){
	for(var x=1;x<=100;x++)
	{
		var obj={
			x:Math.random()*(2000)-1000,
			y:Math.random()*(2000)-1000
		}
		food.push(obj)
	}
	console.log("Server started")
})

setInterval(function(){
		io.sockets.emit('pos_update',{points:points})
},16)

io.on('connection', function (socket) {

  socket.emit('news', { id: socket.id });

  socket.on("start",function(data){
  	points[socket.id]=
    {x:data.x,
  		y:data.y,
      radius:data.radius,
      name:data.name,
      r:data.r,
      g:data.g,
      b:data.b}
	socket.emit("id",{id:socket.id,food:food})
  	//console.log(points)
  })

  socket.on("pos", function (data) {
    if(points[socket.id])
    {
    points[socket.id].x=data.x
  	points[socket.id].y=data.y
	 //console.log(points)
    }
  });

  socket.on("eat",function(data)
  {
    var obj={
      x:Math.random()*(2000)-1000,
      y:Math.random()*(2000)-1000
    }
    food[data.index]=obj
    points[socket.id].radius=data.radius
    socket.emit("food",{food:food})
  })

  socket.on("disconnect",function(data){
  	if(points[socket.id])
      delete points[socket.id]
    //console.log(points)
  })

  socket.on("kill",function(data){
    console.log(data)
    io.sockets.emit("killed",{id:data.id})
    points[socket.id].radius=data.radius
    delete points[data.id]
    console.log(points)
  })
});