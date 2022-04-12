class Play extends Phaser.Scene {
  constructor() {
    super ("playScene");
  }

  preload() {
    // Images
    this.load.image('background', './assets/background.png');
    this.load.image('cat', './assets/cat.png');
    this.load.image('llama', './assets/llama.png');
    this.load.image('panda', './assets/panda.png');

    // Player
    this.load.spritesheet('clawOpen', './assets/handOpen.png', {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('clawClosed', './assets/handClosed.png', {frameWidth: 16, frameHeight: 16});

    // Effects
    this.load.spritesheet('score20', './assets/score20.png', {frameWidth: 96, frameHeight: 72, startFrame: 0, endFrame: 20}); 
    this.load.spritesheet('score50', './assets/score50.png', {frameWidth: 96, frameHeight: 72, startFrame: 0, endFrame: 20}); 
    this.load.spritesheet('score100', './assets/score100.png', {frameWidth: 96, frameHeight: 72, startFrame: 0, endFrame: 20}); 

    // Old Stuff REMOVE LATER
    this.load.spritesheet('explosionNew', './assets/explosionNew.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 8}); 
  }

  create() {
    // place BG sprite
    this.background = this.add.tileSprite(0,0,640, 480, 'background').setOrigin(0,0);

    // Initialize score
    this.p1Score = 0;

    // Display score
    let scoreConfig = {
      fontFamily: 'Upheavtt',
      fontSize: '28px',
      color: '#FFFFFF',
      align: 'left',
      stroke: '#10141f',
      strokeThickness: 6
    }
    this.scoreLeft = this.add.text(borderPadding*2, borderPadding*2, `Score: ${this.p1Score}`, scoreConfig);
    
    //add claw (player 1)
    this.p1Claw = new PlayerClaw(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'claw', 0).setOrigin(0.5, 0);

    // add animals (x6) I don't know how to initialize animals automatically... I don't wanna hard code it like this...
    this.animal01 = new Animal(this, game.config.width + borderUISize*6, borderUISize*4, "panda", 0, "hard").setOrigin(0, 0);
    this.animal02 = new Animal(this, game.config.width, borderUISize*5 + borderPadding*2, "llama", 0, "med").setOrigin(0,0);
    this.animal03 = new Animal(this, game.config.width/2, borderUISize*5 + borderPadding*2, "llama", 0, "med").setOrigin(0,0);
    this.animal04 = new Animal(this, game.config.width, borderUISize*6 + borderPadding*4, "cat", 0, "easy").setOrigin(0,0);
    this.animal05 = new Animal(this, (game.config.width/3), borderUISize*6 + borderPadding*4, "cat", 0, "easy").setOrigin(0,0);
    this.animal06 = new Animal(this, (game.config.width/3)*2, borderUISize*6 + borderPadding*4, "cat", 0, "easy").setOrigin(0,0);

    this.animalArray = [this.animal01, this.animal02, this.animal03, this.animal04, this.animal05, this.animal06];

    // Define keys
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    
    // Game over flag
    this.gameOver = false;

    // Play timer
    this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or (F) for Menu', scoreConfig).setOrigin(0.5);
        this.gameOver = true;
    }, null, this);
    this.timer = this.add.text(game.config.width/2, borderPadding*2, `${this.clock.delay}`, scoreConfig).setOrigin(0.5, 0);

    this.generateAnimations();
    this.p1Claw.anims.play('p1Open');
    // this.animal01.anims.play('spaceship1Idle');
    // this.animal02.anims.play('spaceship2Idle');
    // this.animal03.anims.play('spaceship2Idle');
    // this.animal04.anims.play('spaceship3Idle');
    // this.animal05.anims.play('spaceship3Idle');
    // this.animal06.anims.play('spaceship3Idle');
  }

  update() {
    this.background.tilePositionX -= 0.5;
    this.background.tilePositionY -= 0.5;
    this.timer.text = Math.round((this.clock.delay - this.clock.elapsed) / 1000 );

    // Key Input for Restart
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) this.scene.restart();
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) this.scene.start("menuScene");

    if (!this.gameOver) {
      this.p1Claw.update();
      for (const animal of this.animalArray) animal.update();
    }

    // check collisions
    for (const animal of this.animalArray){
      if (animal.taken) return;
      if (this.checkCollision(this.p1Claw, animal)){
        this.p1Claw.reset();
        this.grabAnimal(animal);
      }
    }
  }

  checkCollision(player, animal) {
    // simple AABB checking
    if (!player.isFiring) return false;
    if (player.x < animal.x + animal.width && 
      player.x + player.width > animal.x && 
      player.y < animal.y + animal.height &&
      player.height + player.y > animal. y) {
        return true;
    } 
    else return false;
  }

  grabAnimal(animal) {
    // create effects at animal's position
    let boom = this.add.sprite(animal.x, animal.y, 'explosionNew').setOrigin(0, 0);
    boom.anims.play('explodeNew');

    let scoreEffect = this.add.sprite(animal.x+10, animal.y-10, `score${animal.value}`).setOrigin(0, 0);
    scoreEffect.anims.play(`score${animal.value}`);

    animal.pulled(this.p1Claw.x, this.p1Claw.y, game.settings.playerSpeed);  
    scoreEffect.on('animationcomplete', () => { scoreEffect.destroy(); })        
    boom.on('animationcomplete', () => { boom.destroy(); });

    // Add score
    this.p1Score += animal.value;
    this.scoreLeft.text = `Score: ${this.p1Score}`;

    // Add more time
    this.clock.delay += animal.addedTime;

    this.sound.play('sfx_explosion');
  }

  generateAnimations(){
    // Animations
    this.anims.create({
      key: 'score20', 
      frames: this.anims.generateFrameNumbers('score20', {start: 0, end: 20, first: 0}),
      frameRate: 40
    });
    this.anims.create({
      key: 'score50', 
      frames: this.anims.generateFrameNumbers('score50', {start: 0, end: 20, first: 0}),
      frameRate: 40
    });
    this.anims.create({
      key: 'score100', 
      frames: this.anims.generateFrameNumbers('score100', {start: 0, end: 20, first: 0}),
      frameRate: 40
    });

    this.anims.create({
      key: 'explodeNew', 
      frames: this.anims.generateFrameNumbers('explosionNew', {start: 0, end: 8, first: 0}),
      frameRate: 10
    });

    this.anims.create({
      key: 'p1Closed', 
      frames: this.anims.generateFrameNumbers('clawClosed', {start: 0, end: 0, first: 0}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'p1Open', 
      frames: this.anims.generateFrameNumbers('clawOpen', {start: 0, end: 0, first: 0}),
      frameRate: 10,
      repeat: -1
    });  
  }
}