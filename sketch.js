
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
let palette, transitions;
let stroke, active_strokes;
let brush, brush_size, brushsizeslider, brushradioselector;

function mainsketch(p){
  p.setup = function () {
    // Constants
    canvas_size = 600;

    // The palette for the has 8 items, each is a color's hex value
    // TODO: base on ingesting image
    palette = [0x000, 0xfff, 0xf00, 0x0f0, 
      0x00f, 0xff0, 0xf0f, 0x0ff];
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
    if (p.mousePressed) {
      // Initialize a stroke
      active_strokes.push(stroke);
      stroke += 1;
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


function controls(p) {
  p.setup = function () {
    p.createCanvas(canvas_size, 103);
    //Create a slider with a min of 3, max of 101, default of 51, and step of 2
    brushsizeslider = p.createSlider(3, 101, 51, 2);
    brushsizeslider.position(110, 90+canvas_size);
    brushsizeslider.size(100);

    brushradioselector = p.createRadio();
    brushradioselector.position(110, 10+canvas_size);
    brushradioselector.option('square');
    p.rectMode(p.CENTER);
    brushradioselector.option('circle');
    brushradioselector.selected('square');
  };
  p.draw = function () {
    p.background('white');
    brush          = brushradioselector.value();
    brush_size     = brushsizeslider.value();

    if (brush == 'circle') {
      p.circle(51, 51, brush_size);
    }
    if (brush == 'square') {
      p.rect(51, 51, brush_size, brush_size);
    }

  };
}

//We need the controls before the mainsketch
new p5(mainsketch);
new p5(controls);
