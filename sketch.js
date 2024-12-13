function Cell(isseed, active, color, xpos, ypos) {
  this.isseed = isseed; //bool
  this.active = active; //int
  this.color = color; //int index <8
  this.xpos = xpos; //int <600
  this.ypos = ypos; //int <600
}

// The two brushes have the same interface but there's only two so I'm not going
// to do any sort of inheritance heirarchy
function CircleBrush() {
  this.size;
}
function SquareBrush() {
  this.size;
}

let canvas_size, background_color, cells;
let palette, transitions, active_color;
let stroke, active_strokes;
let brush, brush_size, brushsizeslider, brushradioselector;

function mainsketch(p){
  p.setup = function () {
    // Constants
    canvas_size = 600;

    // The palette for the has 8 items, each is a color's hex value
    // TODO: base on ingesting image
    palette = [p.color(0,0,0), p.color(255,255,255), 
      p.color(255,0,0), p.color(0, 255, 0),
      p.color(0,0,255), p.color(255, 255, 0),
      p.color(255, 0, 255), p.color(0, 255, 255)];
    active_color = 0;
    // Basic transition table that will flip between black and white
    // TODO: base on ingesting image
    transitions = {0: {0: 0.2,
      1: 0.8,},
      1: {0: 0.8,
        1: 0.2}};
    // TODO: Make changable
    background_color = 0x000;

    // Initialize array of cells
    cells = [];
    for (var i = 0; i < canvas_size; i++) {
      cells.push([]);
      for (var j = 0; j < canvas_size; j++) {
        cells[i].push(new Cell(false, 0, background_color, j, i));
        // Cells start out NOT as seeds, inactive, default color, with the right position
      }
    }

    // Initialize active strokes (no strokes still active)
    stroke = 1;
    active_strokes = [];

    // Create a canvas 400x400 pixels
    p.createCanvas(canvas_size, canvas_size);

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
  };

  // Draw function, loops continuously after setup
  p.draw = function () {
    //////////////////
    // HANDLE INPUT //
    //////////////////
    if (p.mouseIsPressed) {
      // Initialize a stroke
      active_strokes.push(stroke);
      stroke += 1;
      if (brush == 'square') {
      }
      if (brush == 'circle') {

      }
    }
    ///////////////
    // DRAW STEP //
    ///////////////
    // Draw the cells every frame
    for (var i = 0; i < cells.length; i++) {
      for (var j = 0; j < cells[0].length; j++) {
        cell = cells[i][j];
        p.set(cell.xpos, cell.ypos, cell.color);
      }
    }
    p.updatePixels();
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
    brushsizeslider.position(110, 80+canvas_size);
    brushsizeslider.size(100);

    brushradioselector = p.createRadio();
    brushradioselector.position(110, 25+canvas_size);
    brushradioselector.option('square');
    brushradioselector.option('circle');
    brushradioselector.selected('square');
    brushradioselector.size(65);
  };
  p.draw = function () {
    p.background('#dddddd');
    brush          = brushradioselector.value();
    brush_size     = brushsizeslider.value();

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
    for (var i = 0; i < 8; i++) {
      //map the index to coordinates
      let topleftx = (i % 4);
      let toplefty;
      if (i < 4) {
        toplefty = 0;
      } else {
        toplefty = 1;
      }
      //scale it up
      topleftx = topleftx * 50;
      toplefty = toplefty * 50;
      //shift it over
      topleftx = topleftx + 210; //THIS VALUE USED LATER
      cornershift = 50;
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
    // Do the drawing process backwards
    xind = x - 210;
    yind = y;
    xind = xind/50;
    yind = yind/50;
    if (xind < 0 || yind < 0) {
      return;
    }
    xind = p.floor(xind);
    yind = p.floor(yind);
    let index = yind * 4 + xind;
    console.log("(" + p.str(xind) + ", " + p.str(yind) + ")");
    console.log(p.str(index));
    active_color = index;
  }
}

new p5(mainsketch);
new p5(controls);
