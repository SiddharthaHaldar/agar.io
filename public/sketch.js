var pos,vect=new p5.Vector(0,0);
function setup() {
  createCanvas(windowWidth,windowHeight)
  pos=new p5.Vector(width/2,height/2)
  background(31)
  for(var x=0;x<=360;x+=40)
  {
       var xx=width/2+100*cos(x*PI/180)
       var yy=height/2+100*sin(x*PI/180)
       ellipse(xx,yy,20,20)
  }
}
function lines()
{
  for(x=0;x<=2000;x+=50)
  {
    strokeWeight(2)
    stroke(51)
    line(-1000+x,-1000,-1000+x,1000)
    line(-1000,-1000+x,1000,-1000+x)
  }
}
function draw() {
  background(255)
  
  vect.x=mouseX-width/2
  vect.y=mouseY-height/2
  var m=vect.mag()*0.5
  //console.log(m)
  //console.log(vect)
  push()
  translate(width/2-pos.x,height/2-pos.y)
  lines()
  for(var x=0;x<=360;x+=40)
  {
       var xx=100*cos(x*PI/180)
       var yy=100*sin(x*PI/180)
       ellipse(xx,yy,20,20)
}
  pos.add(vect.setMag(vect.mag()*0.025))
  console.log(vect.normalize())
  console.log(p5.Vector.mult(vect.normalize(),m))
  fill(31)
  ellipse(pos.x,pos.y,100,100)
  fill(255,0,0)
  text(String(parseInt(pos.x))+","+String(parseInt(pos.y)),pos.x,pos.y)
  //console.log(mouseX+","+mouseY)
  pop()
}