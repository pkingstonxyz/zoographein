function Cell(active, color, xpos, ypos) {
  this.active = active; //bool
  this.color = color; //int index <8
  this.xpos = xpos; //int <canvas_size
  this.ypos = ypos; //int <canvas_size
}
function Stroke(xpos, ypos, brush, brushsize, color) {
  this.xpos = xpos;
  this.ypos = ypos;
  this.brush = brush;
  this.brushsize = brushsize;
  this.color = color;
}

function StrokeQueue(linearizefn, delinearizefn) {
  this.strokes = {};
  this.queue = {};
  this.front = 0;
  this.back = 0;
  this.linearize = linearizefn;
  this.delinearize = delinearizefn;
  this.enQ = function(stroke) {
    //Add a cell to the queue and to the active set.
    let linindex = this.linearize(stroke.xpos, stroke.ypos);
    if (linindex in this.strokes) {
      this.strokes[linindex] += 1;
    } else {
      this.strokes[linindex] = 1;
    }
    this.queue[this.back] = stroke;
    this.back += 1;
  };
  this.deQ = function() {
    let stroke = this.queue[this.front];
    let linindex = this.linearize(stroke.xpos, stroke.ypos);
    this.strokes[linindex] -= 1;
    delete this.queue[this.front];
    this.front += 1;
    return stroke;
  };
  this.has = function(stroke) {
    let linindex = this.linearize(stroke.xpos, stroke.ypos);
    if (!(linindex in this.strokes)) {
      return false;
    }
    else {
      return (this.strokes[linindex] > 0);
    }
  };
  this.empty = function() {
    return this.front == this.back;
  };
}

let canvas_size, background_color, cells;
let clearcanvasbutton, downloadimagebutton;
let active_palette, paletteselectorradio, palettes;
let palette, transitions, active_color;
let stroked_cells, linearize, delinearize;
//transition_speed
let playing, playpausebutton, transition_cell;
let brush, brush_size, brushsizeslider, brushradioselector;
let image, imageinput;

function mainsketch(p){
  p.setup = function () {
    // Constants
    canvas_size = 600;
    linearize = function(x, y) {
      return y*canvas_size + x;
    };
    delinearize = function(ind) {
      return [p.floor(ind/canvas_size), ind % canvas_size];
    }

    // The palette for the has 8 items, each is a color's hex value
    // I asked chatgpt to generate these palettes
    palettes = {};
    palettes["autumn"] = [p.color("#2F2F2F"), p.color("#4682B4"), p.color("#8B0000"), p.color("#C1443E"), p.color("#D2691E"), p.color("#DAA520"), p.color("#8B4513"), p.color("#556B2F")];
    palettes["summer"] = [
  p.color("#FF5733"), // Bright Red-Orange (Sunset glow)
  p.color("#FFA500"), // Orange (Citrus and summer vibes)
  p.color("#FFD700"), // Golden Yellow (Sunshine)
  p.color("#7FFF00"), // Lime Green (Freshness of summer grass)
  p.color("#40E0D0"), // Turquoise (Tropical waters)
  p.color("#1E90FF"), // Dodger Blue (Clear summer skies)
  p.color("#FF69B4"), // Hot Pink (Summer flowers)
  p.color("#FFFFFF")  // Pure White (Bright and clean contrast)
];
    palettes["winter"] = [
  p.color("#1C1C2E"), // Deep Navy Blue (Cold winter nights)
  p.color("#5B8DBF"), // Frosty Blue (Snow shadows and icy tones)
  p.color("#D6EAF8"), // Pale Ice Blue (Frozen lakes and frost)
  p.color("#F8F9F9"), // Soft White (Fresh snow)
  p.color("#BCC6CC"), // Cool Gray (Overcast skies)
  p.color("#8A7B99"), // Muted Purple (Winter twilight)
  p.color("#A52A2A"), // Warm Brown (Cozy fireplaces and wooden cabins)
  p.color("#FFFFFF")  // Pure White (Bright snow contrast)
];
    palette = palettes["autumn"];
    //palette = [p.color(0,0,0), p.color(255,255,255), 
    //  p.color(255,0,0), p.color(0, 255, 0),
    //  p.color(0,0,255), p.color(255, 255, 0),
    //  p.color(255, 0, 255), p.color(0, 255, 255)];
    active_color = 0;
    // Basic transition table that will tend to keep a color on the same color, but has a chance of moving it to the next color
    transitions = [
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
      [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], 
      [4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3], 
      [5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4], 
      [6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5], 
      [7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6], 
      [0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]];
    background_color = p.random([0,1,2,3,4,5,6,7]);
    transition_cell = function(x, y, stroke_color) {
      let cell = cells[y][x];
      let transitionable_neighbors = [];
      //Iterate through all the neighbors of the cell
      let offsets = [[-1, 1],[ 0, 1],[ 1, 1],
                     [-1, 0],        [ 1, 0],
                     [-1,-1],[ 0,-1],[ 1,-1]];
      //Get all the neighbors that are "active"
      offsets.forEach(function(element) {
        let neighborx = element[0] + x;
        let neighbory = element[1] + y;
        //bounds check
        if (neighborx < 0 || neighbory < 0 || neighborx >= canvas_size || neighbory >= canvas_size) {
          return;
        }
        let neighborcell = cells[neighbory][neighborx];
        if (neighborcell.active) {
          transitionable_neighbors.push(neighborcell.color);
        }
      });

      if (transitionable_neighbors.length > 0) {
        //Compute the transition
        let transition_color_base = p.random(transitionable_neighbors);
        let transitioned_color = p.random(transitions[transition_color_base]);
        //Give it a 10% chance not to transition for some added user agency
        if (p.random() < 0.1) {
          transitioned_color = stroke_color;
        }
        cells[y][x].color = transitioned_color;
        //And mark it active
        cells[y][x].active = true;
      }
    }

    // Initialize array of cells
    cells = [];
    for (var i = 0; i < canvas_size; i++) {
      cells.push([]);
      for (var j = 0; j < canvas_size; j++) {
        cells[i].push(new Cell(false, background_color, j, i));
        // Cells start out as inactive, default color, with the right position
      }
    }

    // Initialize strokes (no strokes still active)
    stroked_cells = new StrokeQueue(linearize, delinearize);

    // Create a canvas 400x400 pixels
    let maincanvas = p.createCanvas(canvas_size, canvas_size);

    // Make pixels accessible
    p.loadPixels();

    // Draw the background color
    for (var i = 0; i < cells.length; i++) {
      for (var j = 0; j < cells[0].length; j++) {
        cell = cells[i][j];
        p.set(cell.xpos, cell.ypos, cell.color);
      }
    }
    p.updatePixels();

    // Add the save button
    downloadimagebutton = p.createButton("download");
    downloadimagebutton.position(520, 50+canvas_size);
    downloadimagebutton.mousePressed(function() {
      p.save(maincanvas, 'mypainting.jpg');
    });
  };

  // Draw function, loops continuously after setup
  p.draw = function () {
    //////////////////
    // HANDLE INPUT //
    //////////////////
    let xpos = p.floor(p.mouseX);
    let ypos = p.floor(p.mouseY);
    //If mouse pressed and not out of bounds
    if (p.mouseIsPressed && !(xpos < 0 || ypos < 0 || xpos >= canvas_size || ypos >= canvas_size)) {
      // Add the stroke to a queue
      // xpos, ypos, stroke, radius, color
      stroked_cells.enQ(new Stroke(xpos, ypos, brush, brush_size, active_color));
      //Color the center pixel
      cells[ypos][xpos].color = active_color;
      cells[ypos][xpos].active = true;
    }

    //get `speed` number of cells
    if (playing && !stroked_cells.empty()) {
      let stroke = stroked_cells.deQ();

      let rows = cells.length;
      let cols = cells[0].length;
      let centerX = stroke.xpos;
      let centerY = stroke.ypos;
      let maxradius = stroke.brushsize/2;
      // Start with radius = 0 and expand outward
      for (let radius = 0; radius < maxradius; radius++) {
        // Iterate over the top edge of the ring
        for (let x = centerX - radius; x <= centerX + radius; x++) {
          let y = centerY - radius;
          //bounds check
          if (x >= 0 && x < cols && y >= 0 && y < rows) {
            //If the stroke is a circle then we need to pass on out of bounds
            if (stroke.brush == 'circle') {
              if (p.dist(centerX, centerY, x, y) > maxradius) {
                continue;
              }
            }
            transition_cell(x, y, stroke.color);
          }
        }

        // Iterate over the bottom edge of the ring
        for (let x = centerX - radius; x <= centerX + radius; x++) {
          let y = centerY + radius;
          if (x >= 0 && x < cols && y >= 0 && y < rows) {
            //If the stroke is a circle then we need to pass on out of bounds
            if (stroke.brush == 'circle') {
              if (p.dist(centerX, centerY, x, y) > maxradius) {
                continue;
              }
            }
            transition_cell(x, y, stroke.color);
          }
        }

        // Iterate over the left edge of the ring
        for (let y = centerY - radius + 1; y < centerY + radius; y++) {
          let x = centerX - radius;
          if (x >= 0 && x < cols && y >= 0 && y < rows) {
            //If the stroke is a circle then we need to pass on out of bounds
            if (stroke.brush == 'circle') {
              if (p.dist(centerX, centerY, x, y) > maxradius) {
                continue;
              }
            }

            transition_cell(x, y, stroke.color);
          }
        }

        // Iterate over the right edge of the ring
        for (let y = centerY - radius + 1; y < centerY + radius; y++) {
          let x = centerX + radius;
          if (x >= 0 && x < cols && y >= 0 && y < rows) {
            //If the stroke is a circle then we need to pass on out of bounds
            if (stroke.brush == 'circle') {
              if (p.dist(centerX, centerY, x, y) > maxradius) {
                continue;
              }
            }

            transition_cell(x, y, stroke.color);
          }
        }
      }
    }
    ///////////////
    // DRAW STEP //
    ///////////////
    // Draw the cells every frame
    for (var i = 0; i < cells.length; i++) {
      for (var j = 0; j < cells[0].length; j++) {
        cell = cells[i][j];
        p.set(cell.xpos, cell.ypos, palette[cell.color]);
      }
    }
    p.updatePixels();

    //p.filter(p.BLUR, 5, false);

    // Draw the brush on top
    p.ellipseMode(p.RADIUS);
    p.strokeWeight(1);
    p.fill(p.color(0, 0, 0, 0));
    p.stroke(p.lerpColor(p.color(255, 255, 255), 
      p.color(100, 100, 100),
      p.sin(p.millis()/150)));
    if (brush == 'circle') {
      p.circle(p.mouseX, p.mouseY, brush_size/2);
    }
    if (brush == 'square') {
      p.rectMode(p.RADIUS);
      p.rect(p.mouseX, p.mouseY, brush_size/2);
    }
    if (!playing) {
      p.rectMode(p.CORNERS);
      p.strokeWeight(5);
      p.rect(550, 10, 565, 50);
      p.rect(575, 10, 590, 50);
    }
  };
}


/////////////////////
/// CONTROL PANEL ///
/////////////////////

function controls(p) {
  p.setup = function () {
    p.createCanvas(canvas_size, 103);
    //Create a slider with a min of 3, max of 101, default of 51, and step of 2
    brushsizeslider = p.createSlider(3, 101, 51, 2);
    brushsizeslider.position(110, 90+canvas_size);
    brushsizeslider.size(100);

    //Create radio buttons to select the brush shape
    brushradioselector = p.createRadio("square");
    brushradioselector.position(110, 25+canvas_size);
    brushradioselector.option('square');
    brushradioselector.option('circle');
    brushradioselector.selected('square');
    brushradioselector.size(65);

    //Create a button that clears the canvas
    clearcanvasbutton = p.createButton("clear");
    clearcanvasbutton.position(550, 80+canvas_size);
    clearcanvasbutton.mousePressed(function() {
      for (var i = 0; i < cells.length; i++) {
        for (var j = 0; j < cells[i].length; j++) {
          cells[i][j].active = false;
          cells[i][j].color = active_color;
        }
      }
    });

    //Palette selector button
    paletteselectorradio = p.createRadio("autumn");
    paletteselectorradio.position(430, 50+canvas_size);
    paletteselectorradio.option('autumn');
    paletteselectorradio.option('summer');
    paletteselectorradio.option('winter');
    paletteselectorradio.selected('autumn');
    paletteselectorradio.size(75);

    //Create a toggle that determines if it's simulating.
    playing = false;
    playpausebutton = p.createButton('toggle play/pause');
    playpausebutton.mousePressed(function() {
      playing = !playing;
    });
    playpausebutton.position(430, 20+canvas_size);
    playpausebutton.size(162);

  };
  p.draw = function () {
    p.background('#dddddd');
    //Fetch updates each frame
    brush            = brushradioselector.value();
    brush_size       = brushsizeslider.value();

    let curselected = paletteselectorradio.value();
    active_palette = curselected;
    palette = palettes[active_palette];

    //Label the brush size slider
    p.fill('black');
    p.text("Brush Size:", 110, 75);

    p.rectMode(p.CENTER);
    p.fill('white');
    p.stroke('black');
    p.strokeWeight(1);
    // Draw the brush preview
    if (brush == 'circle') {
      p.circle(51, 51, brush_size);
    }
    if (brush == 'square') {
      p.rect(51, 51, brush_size, brush_size);
    }
    p.fill(palette[active_color]);
    p.stroke(palette[active_color]);
    p.circle(51, 51, 1);

    // Draw the color selectors
    p.rectMode(p.CORNERS);
    p.strokeWeight(0);
    for (var i = 0; i < palette.length; i++) {
      //map the index to coordinates
      let topleftx = (i % p.floor(palette.length/2));
      let toplefty;
      if (i < p.floor(palette.length/2)) {
        toplefty = 0;
      } else {
        toplefty = 1;
      }
      //scale it up
      topleftx = topleftx * (200/(palette.length/2));
      toplefty = toplefty * (200/(palette.length/2));
      //shift it over
      topleftx = topleftx + 210; //THIS VALUE USED LATER
      cornershift = (200/(palette.length/2));
      if (i == active_color) {
        topleftx = topleftx + 5;
        toplefty = toplefty + 5;
        cornershift = cornershift - 10;
      } else {
      }
      p.fill(palette[i]);
      p.rect(topleftx, toplefty, topleftx + cornershift, toplefty + cornershift);
    }
  };

  p.mousePressed = function () {
    let x = p.mouseX;
    let y = p.mouseY;
    if (x < 210 || x > (210+(200/(palette.length/2))*(palette.length/2)) || y < 0 || y > 101) {
      return;
    }
    // Do the drawing process backwards
    xind = x - 210;
    yind = y;
    xind = xind/(200/(palette.length/2));
    yind = yind/(200/(palette.length/2));
    if (xind < 0 || yind < 0) {
      return;
    }
    xind = p.floor(xind);
    yind = p.floor(yind);
    let index = yind * p.floor(palette.length/2) + xind;
    if (index > (palette.length - 1)) {
      return;
    }
    active_color = index;
  }
}



new p5(mainsketch);
new p5(controls);
