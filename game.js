// initialize context
kaboom({
  font: "sink",
  background: [110, 150, 255],
});

// Loading Sprites
loadSprite("bugs", "sprites/bugs.png");
loadSprite("coffee", "sprites/coffee.png");
loadSprite("programmer", "sprites/programmer.png");

// Loading Musics
loadSound("background", "sounds/background.mp3");
loadSound("gameover", "sounds/gameover.mp3");
loadSound("sip", "sounds/sip.mp3");
loadSound("score", "sounds/score.mp3");

// Define Game Variables
let SPEED = 620;
let BUGSPEED = 2;
let SCORE = 0;
let scoreText;
let bg = false;
let backgroundMusic;
let instructions;

const displayInstructions = () => {
  instructions = add([
    text(" Start : Click on the Screen | UP ↑ | DOWN ↓ | 🠨 LEFT | 🠦 RIGHT "),
    scale(3),
    color(0, 64, 255),
    pos(320, 50),
  ]);
};

// Lets define a function to display score
const displayScore = () => {
  destroy(scoreText);
  scoreText = add([text("Score: " + SCORE), scale(4), pos(width() - 320, 50)]);
};

// Lets define a funtion for Background Music
const playBg = () => {
  if (!bg) {
    backgroundMusic = play("background", { volume: 0.5 });
    bg = true;
  }
};

// Lets add the programmer
const programmer = add([
  sprite("programmer"), // renders as a sprite
  pos(120, 30), // position in world
  area(), // has a collider
  scale(0.2),
]);

// move programmer using keys
onKeyDown("left", () => {
  destroy(instructions);
  playBg();
  programmer.move(-SPEED, 0);
});
onKeyDown("right", () => {
  destroy(instructions);
  playBg();
  programmer.move(SPEED, 0);
});
onKeyDown("up", () => {
  destroy(instructions);
  playBg();
  programmer.move(0, -SPEED);
});
onKeyDown("down", () => {
  destroy(instructions);
  playBg();
  programmer.move(0, SPEED);
});

// Lets add the bugs and coffee on loop
loop(4, () => {
  for (let i = 0; i < 4; i++) {
    let x = rand(0, width());
    let y = height();

    let c = add([sprite("bugs"), pos(x, y), area(), scale(0.13), "bug"]);
    c.onUpdate(() => {
      c.moveTo(c.pos.x, c.pos.y - BUGSPEED);
    });
  }

  let x = rand(0, width());
  let y = height();
  // lets add the coffee
  let c = add([sprite("coffee"), pos(x, y), area(), scale(0.13), "coffee"]);
  c.onUpdate(() => {
    c.moveTo(c.pos.x - 0.3, c.pos.y - BUGSPEED);
  });

  if (BUGSPEED < 10) {
    BUGSPEED += 1;
  }
});

programmer.onCollide("bug", () => {
  backgroundMusic.volume(0.2);
  play("gameover", { volume: 3 });
  destroy(programmer);
  addKaboom(programmer.pos);

  scoreText = add([
    text("Game Over"),
    scale(4),
    pos(center()),
    color(250, 250, 255),
  ]);
});

programmer.onCollide("coffee", (coffee) => {
  backgroundMusic.volume(0.2);
  play("sip", { volume: 3 });
  destroy(coffee);
  SCORE += 1;
  displayScore();

  wait(2, () => {
    backgroundMusic.volume(0.5);
  });
});

// Display the Score
displayScore();
displayInstructions();
