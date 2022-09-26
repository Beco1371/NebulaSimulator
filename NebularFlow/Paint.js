class Paint
{
  constructor(loc, distance, rot, rad, iter, r,g,b,strke)
  {
    this.location = loc.copy();
    this.distance = distance;
    this.rotation = rot;
    this.radius = rad;
    this.multi_iter = iter;
    this.col = color(r,g,b);
    this.strke = strke;

    this.init_multi_iter = 0;
    this.pointsys = [];
    this.basesys = [];

    this.ResetPointSystem();
    this.CreateBaseSystem(1);
  }

  Iterate_Multi(iter)
  {
    if (this.init_multi_iter < this.multi_iter)
    {
      for (let iterations = 0; iterations < iter; iterations++)
      {
        let update_pointsys = [];
        for (let i = 0; i < this.pointsys.length; i++)
        {
          let center = createVector(0,0);
          let p0 = this.pointsys[0]
          let p1 = this.pointsys[i]

          let variance = 0;
          if (i == this.pointsys.length-1)
          {
            variance = (p0.variance + p1.variance)/2;
            let dist1 = dist(p1.location.x, p1.location.y, p0.location.x, p0.location.y);
            center = this.Gaussian(p1.location.copy(), p0.location.copy(), dist1/3.25, variance);
          }
          else
          {
            let p2 = this.pointsys[i+1];
            variance = (p1.variance + p2.variance)/2;
            let dist1 = dist(p1.location.x, p1.location.y, p2.location.x, p2.location.y);
            if (dist1 <= 3)
              {
                dist1 /= 100;
              }
            center = this.Gaussian(p1.location.copy(), p2.location.copy(), dist1/3.25, variance);
          }
          update_pointsys.push(new Point(p1.location, p1.variance))
          update_pointsys.push(new Point(center.copy(), variance))
        }
        this.pointsys = update_pointsys;
      }
      this.DrawShape();
      this.pointsys = this.basesys;
      this.init_multi_iter++;
    }
  }

  CreateBaseSystem(iterate)
  {
    //Iterates the base shape to create a more dynamic base shape
    for (let iter = 0; iter < iterate; iter++) {
      //Create/Reset temporary array for updating base system after each iteration
      let update_basesys = [];
      for (let i = 0; i < this.basesys.length; i++)
      {
        let center = createVector(0,0);
        let variance = 0;
        let p0 = this.basesys[0]
        let p1 = this.basesys[i]
        //Add Gaussian effect between each point in the point sys
        if (i == this.basesys.length-1)
        {
          let dist1 = dist(p1.location.x, p1.location.y, p0.location.x, p0.location.y);
          variance = (p0.variance + p1.variance)/2;
          center = this.Gaussian(p1.location.copy(), p0.location.copy(), dist1/2.5, variance);
        }
        else
        {
          let p2 = this.basesys[i+1];
          let dist1 = dist(p1.location.x, p1.location.y, p2.location.x, p2.location.y);
          variance = (p1.variance + p2.variance)/2;
          center = this.Gaussian(p1.location.copy(), p2.location.copy(), dist1/2.5, variance);
        }
        update_basesys.push(new Point(p1.location.copy(), p1.variance));
        update_basesys.push(new Point(center, variance))
      }
      //Update basesys for next iteration
      this.basesys = update_basesys;
    }
    //Update pointsys to basesys for use later when using pointsys iterations
    this.pointsys = this.basesys;
    this.DrawShape();
  }

  ResetPointSystem()
  {
    //Creates base shape
    let angle = TWO_PI / 10;
    for (let a = 0; a < TWO_PI; a += angle)
    {
      let px = cos(a) * this.radius;
      let py = sin(a) * this.radius;
      let pos = createVector(px,py);
      this.basesys.push(new Point(pos.copy(), random(0.8,1.3)))
    }
  }

  /*CreateRect()
  {
    this.basesys[0] = new Point(createVector(0-this.distance/2, 0-this.radius/2), random(0.8,1.3));
    this.basesys[1] = new Point(createVector(0+this.distance/2, 0-this.radius/2), random(0.8,1.3));
    this.basesys[2] = new Point(createVector(0+this.distance/2, 0+this.radius/2), random(0.8,1.3));
    this.basesys[3] = new Point(createVector(0-this.distance/2, 0+this.radius/2), random(0.8,1.3));
  }*/

  DrawShape()
  {
    //drawingContext.shadowColor = color(red(this.col), green(this.col), blue(this.col),360);
  //drawingContext.shadowBlur = width;
    push();
    beginShape();
    if (this.strke == true)
    {
      stroke(red(this.col), green(this.col), blue(this.col), 20);
    }
    else {
      noStroke();
    }
    fill(red(this.col), green(this.col), blue(this.col), 4);
    for (let i = 0; i < this.pointsys.length; i++)
    {
      let vx = this.pointsys[i].location.x;
      let vy = this.pointsys[i].location.y;
      if (i == this.pointsys.length-1)
      {
        vertex(vx, vy);
      }
      else
      {
        vertex(vx, vy);
      }
    }
    translate(this.location.x, this.location.y);
    endShape(CLOSE);
    pop();
  }

  Gaussian(loc1, loc2, softener, variance)
  {
    let cx = (loc1.x + loc2.x) / 2;
    let cy = (loc1.y + loc2.y) / 2;
    cx = cx + randomGaussian() * softener * (variance/1);
    cy = cy + randomGaussian() * softener * (variance/1);
    let new_pos = createVector(cx,cy);
    return new_pos.copy();
  }
}
