


function setup() {
  // Create a canvas 400x400 pixels
  createCanvas(600, 600);

  // Set the background color
  background(220); // Light gray
}

// Draw function, loops continuously after setup
function draw() {
  // Set the fill color
  fill(0); // Black

  // Draw a circle at the mouse position
  ellipse(mouseX, mouseY, 50, 50);
}

