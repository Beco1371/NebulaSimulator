class Nebula
{
  constructor(col1, col2)
  {
    this.col1 = col1;
    this.col2 = col2;
    this.paintsys = [];
  }

  drawBGNoise()
  {
    let xoff = 0.0;

    for (let x = 0; x < width; x+=2) {
      let yoff = 0.0;

      for (let y = 0; y < height; y+=2) {
        let col = map(noise(xoff,yoff),0,1,0,255);
        let opac = 60;
        if (col < 50)
          {
            col /= 2;
          }
        else if (col >= 150)
          {
            opac = int(map(col, 150, 255, 60, 100));
            col *= 1.05;
          }
        fill(col,col,col, opac);
        rect(x,y,2,2);
        yoff += 0.01;
      }
      xoff += 0.01;
    }
  }

  drawSmallStars()
  {
    noStroke();
    for (let y = 0; y < height; y++)
      {
        for (let x = 0; x < width; x++)
          {
            if (random(0,1000) < 4)
              {
                fill(255,255,255,int(random(20,90)));
                let sz = int(random(1,3));
                ellipse(x,y,sz,sz);
              }
          }
      }
  }

  drawBlueStars()
  {
    for (let y = 0; y < height; y++)
      {
        for (let x = 0; x < width; x++)
          {
            if (random(0,1000) < 1)
              {
                fill(180, 236, 255,150);
                let sz = int(random(1,3));
                  ellipse(x,y,sz,sz);
                for (let i = 0; i < 3; i++)
                  {
                    sz++;
                    fill(136, 236, 255,10);
                    ellipse(x,y,sz,sz);
                  }
              }
          }
      }
  }

  drawLargeStars()
  {
    for (let y = 0; y < height; y++)
      {
        for (let x = 0; x < width; x++)
          {
            if (random(0,1000) < 0.1)
              {
                fill(230, 230, 255,200);
                let sz = int(random(2,5));
                ellipse(x,y,sz,sz);
                let initsz = sz;
                for (let i = 0; i < 8; i++)
                  {
                    fill(136, 236, 255,10);
                    sz++;
                    ellipse(x,y,sz,sz);
                  }
              }
          }
      }
  }

  testCloud()
  {
    this.paintsys.push(new Paint(createVector(width/2, height/2), 50, 50, 100, 100, 255,0,0));
  }

  createSpecificCloud(low, high, size, iter, prolif, r,g,b)
  {
    let xoff = 0.0;
    for (let x = 0; x < width; x+=2) {
      let yoff = 0.0;
      for (let y = 0; y < height; y+=2) {
        if (random(0,1000) < prolif)
          {
          let nois = noise(xoff,yoff);
          if (nois > low && nois < high)
            {
              this.paintsys.push(new Paint(createVector(x, y), 0, 0, size, iter, r,g,b));
            }
          }
        yoff += 0.01;
      }
      xoff += 0.01;
    }
  }

  createCloud()
  {
    let xoff = 0.0;
    for (let x = 0; x < width; x+=2) {
      let yoff = 0.0;
      for (let y = 0; y < height; y+=2) {
        if (random(0,1000) < 3)
          {
          let nois = noise(xoff,yoff);
          let threshold = 0.4;
          if (nois >= threshold)
            {
              let r = int(map(nois,threshold,0.8,red(this.col1), red(this.col2),true));
              let g = int(map(nois,threshold,0.8,green(this.col1), green(this.col2), true));
              let b = int(map(nois,threshold,0.8,blue(this.col1), blue(this.col2), true));
              let size = map(nois,threshold,0.8,1000,10, true);
              let posx = random(0, size);
              let posy = size-posx;
              if (int(random(0,2)) == 1)
                  {
                  posx = -posx;
                  }
              if (int(random(0,2)) == 1)
                {
                  posy = -posy;
                }
              posx = x + posx;
              posy = y + posy;
              let angle = atan2(y-posy, x-posx);
              let distance = dist(x, y, posx, posy)/4;
              let iter = map(nois,threshold,0.8,1, 10, true);
              this.paintsys.push(new Paint(createVector(x, y), distance, angle, 30, iter, r,g,b));
            }
          }
        yoff += 0.01;
      }
      xoff += 0.01;
    }
  }

  drawClouds()
  {
    for (let i = 0; i < this.paintsys.length; i++)
      {
        this.paintsys[i].Iterate_Multi(3);
      }
  }
}
