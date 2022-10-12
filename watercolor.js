var slsys;

/* DIMENSIONS FOR SLIDER BOX */
let box_x = 300;
let box_y = 300;

/* ADD SLIDER FOR ITERATIONS */
let iterations = 30;

/* ADD SLIDER FOR SIZE */
let size = 20;

/* ADD SLIDER FOR STROKE OPACITY */
var StrokeOpacity = 20;

/* ADD SLIDER FOR VARIANCE */
var VR_Modifier = 1.2;

/* ADD SLIDER FOR BASE ITERATIONS */
let base_iterations = 3;

var cpicker;
var Brush_Col;

let paintsys;
let colorsys = [];
let colormap;
let count = 0;
let prev_mousex; let prev_mousey;
let distance = 0;
let angle = 0;
let color_menu = false;


function setup() {
  var canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent('scroll_locked');
  background(0, 0, 0);
  cpicker = createColorPicker();
  cpicker.position(width - 175, 250);
  cpicker.value('#FF0000');
  //colorMode(HSB,360,100,100,100);
  noStroke();
  paintsys = [];
  colormap = [];

  //PImage img = loadImage("Image.jpg");
  //image(img,0,0);
  //populateImage();
  //populateSubColors();
  //colorizeImage(10);

  // SLIDER INITIALIZATION
  textAlign(LEFT);
  textSize(20);
  slsys = new SliderSystem(createVector(width - 150, 50), 100);
  slsys.NewSlider(createVector(slsys.pos.x, slsys.pos.y), 10, 120, iterations, "Layer Iterations");
  slsys.NewSlider(createVector(slsys.pos.x, slsys.pos.y), 5, 100, size, "Stroke Size");
  slsys.NewSlider(createVector(slsys.pos.x, slsys.pos.y), 0, 100, StrokeOpacity, "Linework Opacity");
  slsys.NewSlider(createVector(slsys.pos.x, slsys.pos.y), 0.5, 10, VR_Modifier, "Variance");
  slsys.NewSlider(createVector(slsys.pos.x, slsys.pos.y), 0, 8, base_iterations, "Base Iterations");

  // BUTTON INITIALIZATION
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  cpicker.remove();
  setup();
}

function draw() {
  Brush_Col = cpicker.value();
  if (mouseIsPressed) {
    if (mouseX > width - box_x && mouseY < box_y) {
    }
    else {
      let distance = dist(prev_mousex, prev_mousey, mouseX, mouseY);
      let angle = atan2(mouseY - prev_mousey, mouseX - prev_mousex);

      if (!color_menu) {
        if (distance > 200) { distance = 200; }
        paintsys.push(new Paint(createVector((prev_mousex + mouseX) / 2, (prev_mousey + mouseY) / 2), distance, angle, size, iterations));
      }
      color_menu = false;
    }
  }

  for (let i = 0; i < paintsys.length; i++) {
    paintsys[i].Iterate_Multi(base_iterations);
  }
  prev_mousex = mouseX;
  prev_mousey = mouseY;

  DrawSliders();
}

function DrawSliders() {
  // SLIDERS
  fill(20, 20, 20);
  rectMode(CORNER);
  rect(width - box_x, 0, width, box_y);
  slsys.CheckCollisions();
  slsys.DrawSliders();

  // iterations slider
  iterations = int(slsys.sliders[0].value);
  // size slider
  size = int(slsys.sliders[1].value);
  // strokeopacity slider
  StrokeOpacity = int(slsys.sliders[2].value);
  // variance modifier slider
  VR_Modifier = slsys.sliders[3].value;
  // base iterations slider
  base_iterations = int(slsys.sliders[4].value);
}


function gridline(x1, y1, x2, y2) {
  let tmp;
  /* Swap coordinates if needed so that x1 <= x2 */
  if (x1 > x2) { tmp = x1; x1 = x2; x2 = tmp; tmp = y1; y1 = y2; y2 = tmp; }

  let dx = x2 - x1;
  let dy = y2 - y1;
  let step = 1;

  if (x2 < x1)
    step = -step;

  let sx = x1;
  let sy = y1;
  for (let x = x1 + step; x <= x2; x += step) {
    let y = y1 + step * dy * (x - x1) / dx;
    strokeWeight(1 + map(noise(sx, sy), 0, 1, -0.5, 0.5));
    line(sx, sy, x + map(noise(x, y), 0, 1, -1, 1), y + map(noise(x, y), 0, 1, -1, 1));
    sx = x;
    sy = y;
  }
}

function grid() {
  let spacing = 5;
  for (let i = -width; i < height + width; i += spacing) {
    stroke(255, random(5, 20));
    gridline(i, 0, i + height, height);
  }
  for (let i = height + width; i >= -width; i -= spacing) {
    stroke(255, random(5, 20));
    gridline(i, 0, i - height, height);
  }
}

function mouseReleased() {
  slsys.ClearSliders();
}

function keyReleased() {
  if (key == 'g') {
    grid();
  }
  if (key == 'c') {
    background(0, 0, 0);
  }
}

class Paint {

  constructor(loc, dist, rot, rad, iter) {
    this.pointsys = [];
    this.basesys = [];

    this.location = loc;
    this.multi_iter = 40;
    this.init_multi_iter = 0;
    this.multi_iter = iter;
    this.distance = dist;
    this.rotation = rot;
    this.radius = rad;
    this.col = color(int(random(0, 255)), 0, int(random(50, 255)));
    this.strokeOpacity = StrokeOpacity;
    this.vr_modifier = VR_Modifier;

    if (Brush_Col != 0) {
      this.col = Brush_Col;
    }

    //col = color (0,0,0);

    this.CreateRect();
    this.CreateBaseSystem(5);
  }

  Iterate_Multi(iter) {
    if (this.init_multi_iter < this.multi_iter) {
      for (iterations = 0; iterations < iter; iterations++) {
        let update_pointsys = [];
        for (let i = 0; i < this.pointsys.length; i++) {
          let center = createVector(0, 0);
          let p0 = this.pointsys[0]
          let p1 = this.pointsys[i]

          let variance = 0;
          if (i == this.pointsys.length - 1) {
            variance = (p0.variance + p1.variance) / 2;
            let dist1 = dist(p1.location.x, p1.location.y, p0.location.x, p0.location.y);
            center = this.Gaussian(p1.location.copy(), p0.location.copy(), dist1 / 3.25, variance);
          }
          else {
            let p2 = this.pointsys[i + 1];
            variance = (p1.variance + p2.variance) / 2;
            let dist1 = dist(p1.location.x, p1.location.y, p2.location.x, p2.location.y);
            if (dist1 <= 3) {
              dist1 /= 100;
            }
            center = this.Gaussian(p1.location.copy(), p2.location.copy(), dist1 / 3.25, variance);
          }
          update_pointsys.push(new Point(p1.location, p1.variance))
          update_pointsys.push(new Point(center.copy(), variance))
        }
        this.pointsys = update_pointsys;
      }
      this.DrawRect();
      this.pointsys = this.basesys;
      this.init_multi_iter++;
    }
  }

  CreateBaseSystem(iterate) {
    //Iterates the base shape to create a more dynamic base shape
    for (let iter = 0; iter < iterate; iter++) {
      //Create/Reset temporary array for updating base system after each iteration
      let update_basesys = [];
      for (let i = 0; i < this.basesys.length; i++) {
        let center = createVector(0, 0);
        let variance = 0;
        let p0 = this.basesys[0]
        let p1 = this.basesys[i]
        //Add Gaussian effect between each point in the point sys
        if (i == this.basesys.length - 1) {
          let dist1 = dist(p1.location.x, p1.location.y, p0.location.x, p0.location.y);
          variance = (p0.variance + p1.variance) / 2;
          center = this.Gaussian(p1.location.copy(), p0.location.copy(), dist1 / 2.5, variance);
        }
        else {
          let p2 = this.basesys[i + 1];
          let dist1 = dist(p1.location.x, p1.location.y, p2.location.x, p2.location.y);
          variance = (p1.variance + p2.variance) / 2;
          center = this.Gaussian(p1.location.copy(), p2.location.copy(), dist1 / 2.5, variance);
        }
        update_basesys.push(new Point(p1.location.copy(), p1.variance));
        update_basesys.push(new Point(center, variance))
      }
      //Update basesys for next iteration
      this.basesys = update_basesys;
    }
    //Update pointsys to basesys for use later when using pointsys iterations
    this.pointsys = this.basesys;
    //this.DrawShape();
  }

  ResetPointSystem() {
    //Creates base shape with point_num number of sides
    this.basesys = [];
    this.angle = TWO_PI / point_num;
    for (a = 0; a < TWO_PI; a += angle) {
      let px = cos(a) * radius;
      let py = sin(a) * radius;
      let pos = createVector(px, py);
      this.basesys.push(new Point(pos.copy(), random(0.8, 1.3)))
    }
    //incase user doesn't want a fuzzy base shape & doesn't use the CreateBaseSystem method
    this.pointsys = this.basesys;
  }

  CreateRect() {
    this.basesys[0] = new Point(createVector(0 - this.distance / 2, 0 - this.radius / 2), random(0.8, 1.3));
    this.basesys[1] = new Point(createVector(0 + this.distance / 2, 0 - this.radius / 2), random(0.8, 1.3));
    this.basesys[2] = new Point(createVector(0 + this.distance / 2, 0 + this.radius / 2), random(0.8, 1.3));
    this.basesys[3] = new Point(createVector(0 - this.distance / 2, 0 + this.radius / 2), random(0.8, 1.3));
  }

  DrawRect() {
    push();
    beginShape();
    stroke(red(this.col), green(this.col), blue(this.col), random(StrokeOpacity));
    fill(red(this.col), green(this.col), blue(this.col), 4);
    for (let i = 0; i < this.pointsys.length; i++) {
      vertex(this.pointsys[i].location.x, this.pointsys[i].location.y);
    }

    translate(this.location.x, this.location.y);
    rotate(this.rotation);
    endShape(CLOSE);
    pop();
  }

  DrawShape() {
    push();
    beginShape();
    blendMode(BLEND);
    fill(red(this.col), green(this.col), blue(this.col), 10);
    for (let i = 0; i < this.pointsys.length; i++) {
      let vx = this.pointsys[i].location.x;
      let vy = this.pointsys[i].location.y;
      if (i == this.pointsys.length - 1) {
        vertex(vx, vy);
      }
      else {
        vertex(vx, vy);
      }
    }
    translate(this.location.x, this.location.y);
    endShape(CLOSE);
    pop();
  }

  Gaussian(loc1, loc2, softener, variance) {
    let cx = (loc1.x + loc2.x) / 2;
    let cy = (loc1.y + loc2.y) / 2;
    /* ADD SLIDER FOR VARIANCE OPACITY 0.5 - 10*/
    // !!NOTE!! /2 VARIANCE + 20 STROKE OPACITY !!NOTE!!
    cx = cx + randomGaussian() * softener * (variance / VR_Modifier);
    cy = cy + randomGaussian() * softener * (variance / VR_Modifier);
    let new_pos = createVector(cx, cy);
    return new_pos;
  }
}

class Point {
  constructor(loc, vari) {
    this.location = loc
    this.variance = vari;
  }
}

class Slider {
  constructor(pos, low, high, value, range, text) {
    this.pos = pos;
    this.low = low;
    this.high = high;
    this.value = value;

    // For Bar Line //
    this.lowx = pos.x - range;
    this.highx = pos.x + range;
    // For Bar Line //

    // For Text //
    this.text = text;
    this.mid = this.lowx + range / 1.5;

    this.s_width = 50;
    this.s_height = 30;

    // Interaction With Mouse //
    this.isLocked = true;
    var difference;
    var clicked;

    pos.x = map(value, low, high, this.lowx, this.highx);
    this.pg = createGraphics(width, height);
  }

  UpdateValue() {
    this.value = map(this.pos.x, this.lowx, this.highx, this.low, this.high);
  }

  Draw() {
    this.pg.clear();

    // Line
    this.pg.strokeWeight(2);
    this.pg.stroke(255, 255, 255, 360);
    this.pg.line(this.lowx - this.s_width / 2, this.pos.y, this.highx + this.s_width / 2, this.pos.y);

    // Box
    this.pg.fill(255, 255, 255);
    this.pg.stroke(255, 255, 255, 200);
    this.pg.strokeWeight(this.s_width / 2);
    this.pg.line(this.pos.x - this.s_width / 2, this.pos.y, this.pos.x + this.s_width / 2, this.pos.y);
    this.pg.rectMode(CENTER);

    // Reference Text
    this.pg.strokeWeight(2);
    textAlign(CENTER);
    this.pg.text(this.text, this.mid, this.pos.y + this.s_height / 1.5);

    // Text In Box/Value referenced
    this.pg.fill(0, 0, 0);
    if (this.text != "Variance") {
      this.pg.text(int(this.value), this.pos.x - this.s_width / 3, this.pos.y + 5);
    }
    else {
      this.pg.text(round(this.value, 2), this.pos.x - this.s_width / 3, this.pos.y + 5);
    }
    image(this.pg, 0, 0);
  }
}

class SliderSystem {
  constructor(pos, range) {
    this.pos = pos;
    this.range = range;
    this.padding = 40;
    this.sliders = [];
  }

  NewSlider(pos, low, high, default_value, text) {
    let buffer = this.sliders.length * this.padding;

    this.sliders.push(new Slider(createVector(this.pos.x, this.pos.y + buffer), low, high, default_value, this.range, text));
  }

  CheckCollisions() {
    if (mouseIsPressed) {
      for (let i = 0; i < this.sliders.length; i++) {
        let s = this.sliders[i];
        if (s.isLocked) {
          if (mouseX <= s.pos.x + s.s_width / 2 && mouseX >= s.pos.x - s.s_width / 2 && mouseY <= s.pos.y + s.s_height / 2 && mouseY >= s.pos.y - s.s_height / 2) {
            s.isLocked = false;
            s.clicked = createVector(mouseX, mouseY);
            s.difference = mouseX - s.pos.x;
          }
        }

        if (s.isLocked == false) {
          s.pos.x = mouseX - s.difference;
          if (s.pos.x <= s.lowx) {
            s.pos.x = s.lowx;
          }
          else if (s.pos.x >= s.highx) {
            s.pos.x = s.highx;
          }
        }
      }
    }
  }

  DrawSliders() {
    for (let i = 0; i < this.sliders.length; i++) {
      this.sliders[i].Draw();
      this.sliders[i].UpdateValue();
    }
  }

  ClearSliders() {
    for (let i = 0; i < this.sliders.length; i++) {
      this.sliders[i].isLocked = true;
    }
  }
}

