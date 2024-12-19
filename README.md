# zoographein

## Brainstorming

Making this was a very iterative process, but my brainstorming steps were as follows and evolved throughout the project:

1. I wanted to make the idea I originally had, and failed to implement, for the markov project submission. The idea was that you could take in and ingest an image, it would posterize the image, then, it would use the surrounding cells of each pixel as the "weights" of what color a pixel can transition to given its color.
2. Along the way, I was really satisfied with the intermediate step where I had a test color palette and a test markov transition table, so I decided to pivot and lean in because it reminded me of something. I was reminded of the little sand bottle arts people make.
3.  Instead of making a cellular automata with a sand falling simulator, I decided to stick with my loosely markov based cellular automata. I think it gives the user more control while also keeping the nondeterminism that's characteristic of the casual creator examples I looked at. 

So the final answer to what are they creating: Sand bottle art inspired paintings. 

### How will I keep users engaged and excited

I may be a bit biased, but I had a hard time continuing to work on the project because I was having fun just watching the cells change colors! It created a surprisingly deep interactive system where you can pause, do your drawing, and then watch it "appear" on the canvas. You can also vary how fast you move the brush to create an interesting effect where the colors appear to bleed into each other.

The experience is, in my opinion, continually surprising and valuable because the brushes are a small simulation that the user has limited control over. 

### How will I help creators make something they are proud to share

I give the user a bit more control over the simulation than a project like the mandatory symmetry of the silk one or the fluid simulator, so it's more on the user if they create something bad. However, I have intentionally selected the color palettes to be cohesive, each one based on a season. 

Mechanically, the users can click the download image button and do with it what they wish. 

## How is it personally meaningful

This is personally meaningful to me for two reasons:

1. I was able to achieve something I failed at. This was my original plan for submission for Markov, as I have already mentioned. It's a slight tweak on what I had planned for markov, but along the way to making this final project I had the system more or less implemented as I had originally envisioned it last September. Being able to look at a "failure" and comign back with the confidence and skill (better at js now) to achieve is very meaningful to me.
2. It's a bit nostalgic. The kinds of sand bottle art I'm referencing are a common fixture at cheap florida beach towns, summer camps, and, if you grew up in the evangelical south like I did, VBS (vacation bible study) events.

## How did it challenge me as a computer scientist?

This challenged me as a computer scientist because it made me think carefully about the state of the system. I have done most of my programming in a functional environment where the next state of the program is a function of the current state and an event. In this case, I didn't have those functional guardrails to help me stay safe so I had to carefully consider what was initialized, where variables were used, and where they were changed.

I also had to think carefully about how to efficiently iterate in non-standard orderings, and you'll see throughout the code where I chose different methods depending on the scale of the ring iterations.

I also think it was an important milestone for my less "hard" skills because I was very deliberate about planning out achievable milestones that I checked off on my list below.

What's next? Idk. I have a project that lies at the intersection of language pedagogy and classics that I have gotten a little bit of a start on. I'd like to have a version of it up and running by the end of christmas break, but it's not exaclty relevant to computational creativity.

## Bugs

None that I know of. 

## Project planning:

1. [x] Create dummy palette
1. [x] Create cells grid
1. [x] Create dummy transition table
1. [x] For circle and square brush:
   - [x] Make it resizable
   - [x] Let the user select a color from the palette
   - [x] Make it set the required cells to active
     - Note: There will need to be different "colors" as "strokes" representing different active states. Furthermore, they will need to overwrite the ones under them.
   - [x] Make it set the center pixel to the selected palette color
1. [x] Allow the user to reset the image
1. [x] Allow the user to download their image
1. [x] Allow the user to stop/set speed of the pixel propagation
1. [x] Handle active pixels
1. [x] Allow user to upload image
1. [x] Quantize image into set colors and palette
1. [x] Remove The image upload feature
1. [x] Change speed slider to play/pause
1. [x] Add swappable palette
