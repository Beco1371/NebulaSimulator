class FlowVector
{
  constructor(pos, dir, density)
  {
    this.pos = pos;
    this.dir = dir;
    this.density = density;
  }

  drawVector()
  {
    stroke(0, 0, 0, 80);
    push();
    translate(this.pos.x, this.pos.y)
    rotate(this.dir.heading());
    line(0, 0, this.density, 0);
    pop();
  }
}
