class FlowField
{
  constructor(density, variation)
  {
    this.field_sys = [];
    this.density = density;
    this.variation = variation;
    this.generateField();
    this.drawField();
  }

  generateField()
  {
    let y_offset = 0;
    let columns = floor(width / this.density);
    let rows = floor(height / this.density);
    for (let y = 0; y <= rows; y++)
    {
      let x_offset = 0;
      this.field_sys[y] = [];
      for (let x = 0; x <= columns; x++)
        {
          let index = (x + y * width) * 4;
          let angle = noise(x_offset, y_offset) * 2*(TWO_PI);
          let dir = p5.Vector.fromAngle(angle);
          x_offset += this.variation;
          this.field_sys[y][x] = new FlowVector(createVector(x * this.density, y * this.density), dir, this.density);
        }
      y_offset += this.variation;
    }
  }

  drawField()
  {

    for (let y = 0; y < this.field_sys.length; y++)
      {
        let len = this.field_sys[y].length;
        for (let x = 0; x < len; x++)
        {
          this.field_sys[y][x].drawVector();
        }
      }
  }
}
