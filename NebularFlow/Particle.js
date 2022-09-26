class Particle
  {
    constructor(pos, col)
    {
      this.pos = pos;
      this.velocity = createVector(0, 0);
      this.prev_pos = pos;
      this.col = col
      this.isActive = true;
      this.lifespan = 0;
    }

    updatePosition()
    {
      this.pos = p5.Vector.add(this.pos, this.velocity);
    }

    applyForce(force)
    {
      this.velocity = p5.Vector.add(this.velocity, force);
      this.velocity = p5.Vector.mult(this.velocity, 0.8);
    }

    drawSegment()
    {
      this.prev_pos = this.pos;
      this.lifespan++;
    }
  }
