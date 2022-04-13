class Play extends Phaser.Scene {
  constructor() {
    super ("playScene");
  }

  preload() {
    // Static images
    this.load.image('background', './assets/backgroundNEW.png');
    this.load.image('cable', './assets/cable.png');

    // Easy
    this.load.image('cat', './assets/cat.png');
    this.load.image('fox', './assets/fox.png');
    this.load.image('dog', './assets/dog.png');
    this.load.image('rabbit', './assets/rabbit.png');
    this.load.image('duck', './assets/duck.png');
    this.load.image('turtle', './assets/turtle.png');
    this.load.image('owl', './assets/owl.png');
    this.easySprites = ['cat', 'fox', 'dog', 'rabbit', 'duck', 'turtle', 'owl'];

    // Med
    this.load.image('llama', './assets/llama.png');
    this.load.image('deer', './assets/deer.png');
    this.load.image('whale', './assets/whale.png');
    this.load.image('bear', './assets/bear.png');
    this.load.image('pig', './assets/pig.png');
    this.medSprites = ['llama', 'deer', 'whale', 'bear', 'pig'];

    // Hard
    this.load.image('panda', './assets/panda.png');
    this.load.image('lion', './assets/lion.png');
    this.load.image('elephant', './assets/elephant.png');
    this.hardSprites = ['panda', 'lion', 'elephant'];

    // Player
    this.load.spritesheet('clawOpen', './assets/handOpen.png', {frameWidth: 48, frameHeight: 480});
    this.load.spritesheet('clawClosed', './assets/handClosed.png', {frameWidth: 48, frameHeight: 480});

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
    this.background.setDepth(-10);

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
    this.animal01 = new Animal(this, game.config.width, borderUISize*2, "panda", 0, "hard").setOrigin(0.5);
    this.animal02 = new Animal(this, game.config.width, borderUISize*4, "llama", 0, "med").setOrigin(0.5);
    this.animal03 = new Animal(this, game.config.width/2, borderUISize*4, "llama", 0, "med").setOrigin(0.5);
    this.animal04 = new Animal(this, game.config.width, borderUISize*6, "cat", 0, "easy").setOrigin(0.5);
    this.animal05 = new Animal(this, (game.config.width/3), borderUISize*6, "cat", 0, "easy").setOrigin(0.5);
    this.animal06 = new Animal(this, (game.config.width/3)*2, borderUISize*6, "cat", 0, "easy").setOrigin(0.5);

    this.animalArray = [this.animal01, this.animal02, this.animal03, this.animal04, this.animal05, this.animal06];
    this.cableArray = [];
    
    // Randomize animal sprites at the very start
    for(const animal of this.animalArray) this.changeSprite(animal);
    for(const animal of this.animalArray) this.cableArray.push(new Cable(this, animal.x, animal.y, 'cable', 0, animal).setOrigin(0.5, 1));
    

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
      for (const cable of this.cableArray) cable.update();
    }

    if (this.animalSprite != null){
      if (this.animalSprite.y > startPos) return;
      this.animalSprite.y += game.settings.playerSpeed;
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
    let boom = this.add.sprite(animal.x, animal.y, 'explosionNew').setOrigin(0.5);
    boom.anims.play('explodeNew');

    let scoreEffect = this.add.sprite(animal.x, animal.y - borderPadding*2, `score${animal.value}`).setOrigin(0.5);
    scoreEffect.anims.play(`score${animal.value}`);

    this.animalSprite = this.add.sprite(this.p1Claw.x, this.p1Claw.y, animal.texture.key).setOrigin(0.5);

    animal.pulled();  
    scoreEffect.on('animationcomplete', () => { 
      scoreEffect.destroy(); 
    })        
    boom.on('animationcomplete', () => { 
      boom.destroy(); 
      this.animalSprite.destroy();
      this.animalSprite = null;
      this.changeSprite(animal);
      animal.reset();
    });

    // Add score
    this.p1Score += animal.value;
    this.scoreLeft.text = `Score: ${this.p1Score}`;
    // Add more time
    this.clock.delay += animal.addedTime;
    // Sound
    this.sound.play('sfx_explosion');
  }

  changeSprite(animal){
    let currentArray;
    if(animal.type == "easy") currentArray = this.easySprites;
    if(animal.type == "med") currentArray = this.medSprites;
    if(animal.type == "hard") currentArray = this.hardSprites;
    let newSprite = currentArray[Math.floor(Math.random() * currentArray.length)];
    // If the new sprite is the same as the previous sprite, choose a new one
    if(newSprite == animal.texture.key) return this.changeSprite(animal);
    animal.setTexture(newSprite);
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