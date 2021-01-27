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
}

function update() {
}
