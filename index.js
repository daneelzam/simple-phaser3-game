const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const game = new Phaser.Game(config);
let platforms; // ground
let player;
let cursors; // keyboard
let stars;
let score = 0;
let scoreText;
let bombs;
let gameOver = false;

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
  this.add.image(400, 300, 'sky');// 400 and 300 - object center position
  platforms = this.physics.add.staticGroup();// create Static object
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();// doubling the scale of the "ground" and refresh

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  player = this.physics.add.sprite(100, 450, 'dude');// create sprite, by default - dynamic obj

  player.setBounce(0.2); // when hitting the ground, the sprite will cover slightly
  player.setCollideWorldBounds(true); // now the sprite collides with the borders of the world

  this.anims.create({ // movement to the left - animation
    key: 'left',
    // use frames 0 to 3 for animation
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    fremRate: 10, // 10 frames per second
    repeat: -1, // animation loop
  });

  this.anims.create({ // movement to the front - animation
    key: 'turn',
    // use 4 frames for animation
    frames: [{ key: 'dude', frame: 4 }],
    fremRate: 20, // 20 frames per second
  });

  this.anims.create({ // movement to the right - animation
    key: 'right',
    // use frames 5 to 8 for animation
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    fremRate: 10, // 10 frames per second
    repeat: -1, // animation loop
  });

  cursors = this.input.keyboard.createCursorKeys(); // keyboard

  stars = this.physics.add.group({ // create dynamic obj group
    key: 'star', // texture key
    repeat: 11, // 1 by default and 11 repeat, total 12 stars
    setXY: { x: 12, y: 0, stepX: 70 }, // start point X:12 Y:0, next start X:82 Y:0 (12 + 70)
  });

  stars.children.iterate((child) => { // random bounce when falling from 0.4 to 0.8
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  bombs = this.physics.add.group(); // create dynamic obj group for bombs

  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

  this.physics.add.collider(player, platforms);// monitors the collision of the player & the ground
  this.physics.add.collider(stars, platforms);// monitors the collision of the stars & the ground
  this.physics.add.collider(bombs, platforms);// monitors the collision of the bombs & the ground

  // when a player and a star collide, start the function collectStar
  this.physics.add.overlap(player, stars, collectStar, null, this);
  // when a player and a bomb collide, start the function hitBomb
  this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
  if (gameOver) { // if gameOver = true
    return; // stop the game
  }
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function collectStar(player, star) {
  star.disableBody(true, true); // star disappears
  score += 10; // game score changes
  scoreText.setText(`Score: ${score}`); // refresh the game score on the screen

  if (stars.countActive(true) === 0) { // if there are no more stars
    //  A new batch of stars to collect
    stars.children.iterate((child) => {
      child.enableBody(true, child.x, 0, true, true);
    });
    // create a variable that will be equal to a random number
    // between 400 and 800 if the player's position is less than 400,
    // or from 0 to 400 if the player's position is greater than 400
    const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    // create one bomb
    const bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1); // endless bounce
    bomb.setCollideWorldBounds(true); // collision with the walls of the world
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20); // direction of movement from -200 to 200
    bomb.allowGravity = false; // cancel gravity
  }
}

function hitBomb(player, bomb) {
  this.physics.pause(); // stop the game
  player.setTint(0xff0000); // and turn the player red
  player.anims.play('turn');
  gameOver = true;
}
