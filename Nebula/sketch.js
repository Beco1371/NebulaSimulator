var iterations = 30;
var paintsys = [];
var colorsys = [];
var count = 0;
var prev_mousex = 0;
var prev_mousey = 0;
var distance = 0;
var angle = 0;
var neb;
var count = 0;

function preload()
{
  img = loadImage("assets/" + "nebula" + int(random(1,5)) + ".png");
}

function setup()
{
  neb = new Nebula(color(212,103,109), color(212,103,109));
    var canvas = createCanvas(windowWidth, windowHeight);
  noStroke();
    background(0,0,0);
    neb.drawBGNoise();
    neb.createSpecificCloud(0.4,0.5,150,2,1,67,84,104);
}

function applyBurn()
{
  blendMode(DODGE);
  image(img,0,0,width,height);
}

function mouseClicked()
{
  if (count == 0)
    {
      neb.createSpecificCloud(0.5,0.6,100,2,2,116,98,117);
    }
  if (count == 1)
    {
      neb.createSpecificCloud(0.6,0.7,50,5,2,152,90,98);
    }
  if (count == 2)
    {
      neb.createSpecificCloud(0.6,0.8,100,2,1,223,105,108);
    }
  if (count == 3)
    {
      neb.createCloud();
    }
  if (count == 4)
    {
      fill(0,0,0,75)
    rect(0,0,width,height)
    //neb.drawSmallStars();
    //neb.drawBlueStars();
    //neb.drawLargeStars();
    }
  if (count == 5)
    {
      applyBurn();
    }
  if (count == 6)
    {
      applyBurn();
    }
          count++;

}

function draw()
{
  neb.drawClouds();
}


function gridline(x1, y1, x2, y2)
{
  tmp = 0;
  /* Swap coordinates if needed so that x1 <= x2 */
  if (x1 > x2) { tmp = x1; x1 = x2; x2 = tmp; tmp = y1; y1 = y2; y2 = tmp; }

  dx = x2 - x1;
  dy = y2 - y1;
  step = 1;

  if (x2 < x1)
    step = -step;

  sx = x1;
  sy = y1;
  for (x = x1+step; x <= x2; x+=step) {
    y = y1 + step * dy * (x - x1) / dx;
    strokeWeight(1 + map(noise(sx, sy), 0, 1, -0.5, 0.5));
    line(sx, sy, x + map(noise(x, y), 0, 1, -1, 1), y + map(noise(x, y), 0, 1, -1, 1));
    sx = x;
    sy = y;
  }
}

function grid()
{
  spacing = 5;
  for (i = -width; i < height + width; i+=spacing) {
    stroke(255, random(5, 20));
    gridline(i, 0, i + height, height);
  }
  for (i = height + width; i >= -width; i-=spacing) {
    stroke(255, random(5, 20));
    gridline(i, 0, i - height, height);
  }
}



/* full screening will change the size of the canvas */
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

  /* prevents the mobile browser from processing some default
   * touch events, like swiping left for "back" or scrolling the page.
   */
  document.ontouchmove = function(event) {
      event.preventDefault();
  };
