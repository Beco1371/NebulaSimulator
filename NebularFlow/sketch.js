var variation = 0.01;
var mouseHeldDown = false;
var finishedAdjustments = false;
var paint_sys;
var neb;
var count = 0;
var small = false;
var mod = 1;
var density = 2*(mod);
var baseR = 212; baseG = 103; baseB = 109;


function preload()
{
  img = loadImage("assets/" + "nebula" + int(random(1,10)) + ".png");
}

function setup() {
  createCanvas(displayWidth*mod, displayHeight*mod);
  p_field = new ParticleField();
  f_field = new FlowField(density, variation);

  noStroke();
  background(0);
  neb = new Nebula(color(baseR,baseG,baseB), color(baseR,baseG,baseB));

  paint_sys = [];
}

function draw()
{
  noStroke();
  drawParticles();
  drawPaint();
  neb.drawClouds();
}

function mouseClicked()
{
  if (count == 0)
  {
    for (let i = 0; i < 50; i++)
          {
            p_field.addParticle("random");
          }
  }
  else if (count == 1)
    {
      neb.createSpecificCloud(0.5,0.6,100,2,2,116,98,117,true);
    }
  else if (count == 2)
    {
      neb.createSpecificCloud(0.6,0.7,50,2,4,152,90,98,true);
    }
  else if (count == 3)
    {
      neb.createCloud(mod);
    }
    else if (count == 4)
      {
        small = true;
        for (let i = 0; i < 100; i++)
        {
          p_field.addParticle("random");
        }
      }
    else if (count == 5)
    {
      neb.createSpecificCloud(0,1,70*mod,25/mod,0.5/mod,0,0,0,true);
    }
    else if (count == 6)
    {
      fill(0,0,0,75)
      rect(0,0,width,height)
      neb.drawSmallStars();
      neb.drawBlueStars();
      neb.drawLargeStars();
    }
    else if (count == 7)
    {
      blendMode(DODGE);
      image(img,0,0,width,height);
    }
    else if (count == 8)
    {
      image(img,0,0,width,height);
    }
    count++;
}

function drawPaint()
{
  for (let i = 0; i < paint_sys.length; i++)
      {
        paint_sys[i].Iterate_Multi(3);
      }
}

function drawParticles()
{
  for (let i = 0; i < p_field.p_sys.length; i++)
    {
      let smallest = 10000;
      let index = 0;
      let particle = p_field.p_sys[i];

      if (particle.pos.x > width || particle.pos.x < 0 || particle.pos.y > height || particle.pos.y < 0) { particle.isActive = false; }

      if (particle.isActive)
        {
          // convert particle position x,y to grid position x,y
          let particle_y = int(particle.pos.y / density);
          let particle_x = int(particle.pos.x / density);

          //
          if (particle_y <= f_field.field_sys.length && particle_x <= f_field.field_sys[0].length){
            particle.applyForce(f_field.field_sys[particle_y][particle_x].dir);
            particle.updatePosition();
          }
          if (particle.lifespan < 75 * mod)
          {
            particle.drawSegment();
            if (small == false)
            {
              paint_sys.push(new Paint(createVector(particle.pos.x, particle.pos.y), 1, 1, 15*mod, 1, baseR,baseG,baseB,false));
              paint_sys.push(new Paint(createVector(particle.pos.x+5, particle.pos.y+5), 10, 3, 5*(mod), 1, 255,255,255,false));
            }
            else
            {
              paint_sys.push(new Paint(createVector(particle.pos.x+5, particle.pos.y+5), 10, 3, 1*(mod), 1, 220,220,220,true));
            }
          }
        }
    }
}

/*function keyPressed()
{
  blendMode(BLEND);
  if (key == ' '){
    f_field.drawField();
  }
}*/
