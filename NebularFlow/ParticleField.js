class ParticleField
  {
    constructor()
    {
      this.p_sys = [];
    }

    addParticle(card_dir)
    {
      let dir = card_dir.toLowerCase();

      if (dir == "up")
        {
          let pos = createVector(random(0,width), 1);
          let col = get(pos.x, pos.y);
          if (random(0,100) < 40)
          {
             let new_col = get(int(random(0,width)), int(random(pos.y - 100, pos.y  + 100)));
             if (new_col != "0,0,0,0") { col = new_col; }
           }
          this.p_sys.push(new Particle(pos, col));
        }
      else if (dir == "down")
        {
          let pos = createVector(random(0, width), height - 1);
          let col = get(pos.x, pos.y);
          if (random(0,100) < 40)
          {
             let new_col = get(int(random(0,width)), int(random(pos.y - 100, pos.y  + 100)));
             if (new_col != "0,0,0,0") { col = new_col; }
           }
          this.p_sys.push(new Particle(pos, col));

        }
      else if (dir == "left")
        {
          let pos = createVector(1, random(0, height));
          let col = get(pos.x, pos.y);
          if (random(0,100) < 40)
          {
            let new_col = get(int(random(0,width)), int(random(pos.y - 100, pos.y  + 100)));
            if (new_col != "0,0,0,0") { col = new_col; }
          }
          this.p_sys.push(new Particle(pos, col));
        }
      else if (dir == "right")
        {
          let pos = createVector(width - 1, random(0, height));
          let col = get(pos.x, pos.y);
          if (random(0,100) < 40)
          {
            let new_col = get(int(random(0,width)), int(random(pos.y - 100, pos.y  + 100)));
            if (new_col != "0,0,0,0") { col = new_col; }
          }
          this.p_sys.push(new Particle(pos, col));
        }
      else if (dir == "random")
        {
          let pos = createVector(random(0, width), random(0, height));
          let col = get(pos.x, pos.y);
          if (random(0,100) < 40) {
            let new_col = get(int(random(0,width)), int(random(pos.y - 100, pos.y  + 100)));
            if (new_col != "0,0,0,0") { col = new_col; }
          }
    }
  }
