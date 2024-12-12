
function Cell(isseed, active, color, xpos, ypos) {
  this.isseed = isseed; //bool
  this.active = active; //int
  this.color = color; //int index <8
  this.xpos = xpos; //int <600
  this.ypos = ypos; //int <600
}

let canvas_size, palette, transitions, background_color, cells, stroke, active_strokes;

function setup() {
  // Constants
  canvas_size = 600;

  // The palette for the final project will have 8 items, indexed 0-7 each is a color's hex value
  // TODO: base on ingesting image
  palette = [0x000, 0xfff]//, 0xf00, 0x0f0, 
           //0x00f, 0xff0, 0xf0f, 0x0ff];
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
  createCanvas(canvas_size, canvas_size);

  // Make pixels accessible
  loadPixels();

  // Draw the background color
  for (var i = 0; i < cells.length; i++) {
    for (var j = 0; j < cells[0].length; j++) {
      cell = cells[i][j];
      set(cell.xpos, cell.ypos, cell.color);
    }
  }
  updatePixels();
}

// Draw function, loops continuously after setup
function draw() {

  //////////////////
  // HANDLE INPUT //
  //////////////////
  if (mousePressed) {
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
      set(cell.xpos, cell.ypos, cell.color);
    }
  }
  updatePixels();
}

