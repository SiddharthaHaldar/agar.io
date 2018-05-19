var pos,vect=new p5.Vector(0,0),socket,id,radius=25,food=[],mass=1,flag=1,name,r=20,g=255,b=20
var points=new Object()
function setup() {
  name = prompt("Enter your name : ", "your name here");
  socket=io()
  createCanvas(windowWidth,windowHeight)
  pos=new p5.Vector(random(-950,951),random(-950,951))
  background(31)
  var num=parseInt(Math.random()*4+1)
  if(num==1)
  {
    r=220
    g=20
    b=60
  }
  if(num==2)
  {
    r=255
    g=215
    b=0
  }
  if(num==3)
  {
    r=0
    g=128
    b=128
  }
  if(num==4)
  {
    r=20
    g=255
    b=20
  }
  socket.emit('start', { x: pos.x , y: pos.y, radius: radius,name: name,r:r ,g:g, b:b })
  socket.on("id",set_id)
  socket.on("pos_update",pos_update)
  socket.on("killed",kill_me)
}

function set_id(data)
{
  id=data.id
}

function pos_update(data)
{
  points=data.points
  food=data.food
  //console.log(points)
}

function kill_me(data)
{
  if(data.id==id)
    flag=0
}

function lines()
{
  for(x=-1000;x<=3000;x+=50)
  {
    strokeWeight(2)
    stroke(70,30,180,120)
    line(-1000+x,-2000,-1000+x,2000)
    line(-2000,-1000+x,2000,-1000+x)
  }
}

function draw() {
  if(flag){
  background(224,255,255)
  vect.x=mouseX-width/2
  vect.y=mouseY-height/2
  if(pos.x+radius>=1000 && mouseX>width/2)
  {
      vect.x=0
  }
  if(pos.x-radius<=-1000 && mouseX<width/2)
  {
      vect.x=0
  }
  if(pos.y+radius>=1000 && mouseY>height/2)
  {
      vect.y=0
  }
  if(pos.y-radius<=-1000 && mouseY<height/2)
  {
      vect.y=0
  }
  
  var m=vect.mag()*0.5
  push()
  
  translate(width/2-pos.x,height/2-pos.y)
  lines()
  //if(mouseIsPressed){
  if(vect.mag()<=260)
    pos.add(vect.setMag(vect.mag()*0.025/mass))
  else
    pos.add(vect.setMag(260*0.055/mass))
  socket.emit('pos', { x: pos.x,
                       y: pos.y})
  //}
  for(var x=0;x<food.length;x++)
  {
    fill(255,0,0)
    ellipse(food[x].x,food[x].y,15,15)
    if(dist(food[x].x,food[x].y,pos.x,pos.y)<=(7.5+radius))
    {
      radius+=0.1
      mass+=0.005
      socket.emit("eat",
        {index:x,
         radius:radius})
    }
  }

  var arr=[]
  
  for(z in points)
    arr.push([z,points[z]])

  arr.sort(function(a,b){
    return a[1].radius-b[1].radius
  })

  console.log(arr)

  for(var x=0;x<arr.length;x++)
  {
    fill(arr[x][1].r,arr[x][1].g,arr[x][1].b)
    stroke(80,255,80,170)
    strokeWeight(5)
    if(arr[x][0]!=id)
      ellipse(arr[x][1].x,arr[x][1].y,
              arr[x][1].radius*2,
              arr[x][1].radius*2)
    else
      ellipse(pos.x,pos.y,arr[x][1].radius*2,arr[x][1].radius*2)
    fill(0)
    strokeWeight(1)
    noStroke()
    textAlign(CENTER)
    textSize(20)
    text(String(arr[x][1].name),(arr[x][0]!=id)?arr[x][1].x:pos.x,(arr[x][0]!=id)?arr[x][1].y:pos.y)
    if(arr[x][0]!=id)
    {
        if(radius>arr[x][1].radius)
        {
            
            
            if(dist(pos.x,pos.y,arr[x][1].x,arr[x][1].y)<=radius)
            {  radius=radius+1//arr[x][1].radius/4
               socket.emit("kill",{id:arr[x][0],
                                    radius:radius})
              //arr.splice(x,1)
            }
        }
    }
  }

  pop()
}
else
{ 
  socket.close()
  alert("Game over")
}
}