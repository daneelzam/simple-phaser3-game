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
let platforms;
let player;
let cursors;
let stars;
let score = 0;
let scoreText;

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

  cursors = this.input.keyboard.createCursorKeys();

  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  });

  stars.children.iterate((child) => {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

  this.physics.add.collider(player, platforms);// monitors the collision of the player & the ground
  this.physics.add.collider(stars, platforms);

  this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update() {
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
  star.disableBody(true, true);
  score += 10;
  scoreText.setText(`Score: ${score}`);
}
