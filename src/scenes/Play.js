class Play extends Phaser.Scene {
  constructor() {
    super ("playScene");
  }

  preload() {
    // Static images
    this.load.image('background', './assets/backgroundNEW.png');
    this.load.image('darkenBG', './assets/darkenBG.png');
    this.load.image('animalCable', './assets/animalCable.png');
    this.load.image('playerCable', './assets/playerCable.png');

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

    // Players
    this.load.spritesheet('p1Open', './assets/p1Open.png', {frameWidth: 48, frameHeight: 48});
    this.load.spritesheet('p1Closed', './assets/p1Closed.png', {frameWidth: 48, frameHeight: 48});
    this.load.spritesheet('p2Open', './assets/p2Open.png', {frameWidth: 48, frameHeight: 48});
    this.load.spritesheet('p2Closed', './assets/p2Closed.png', {frameWidth: 48, frameHeight: 48});

    // Effects
    this.load.spritesheet('score20', './assets/score20.png', {frameWidth: 96, frameHeight: 72, startFrame: 0, endFrame: 20}); 
    this.load.spritesheet('score50', './assets/score50.png', {frameWidth: 96, frameHeight: 72, startFrame: 0, endFrame: 20}); 
    this.load.spritesheet('score100', './assets/score100.png', {frameWidth: 96, frameHeight: 72, startFrame: 0, endFrame: 20}); 
    this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 8}); 
  }

  create() {
    // place BG sprite
    this.background = this.add.tileSprite(0,0,640, 480, 'background').setOrigin(0,0);
    this.background.setDepth(-10);

    // Define keys
    keyP1Action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyP1Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyP1Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyP2Action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    keyP2Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyP2Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    keyExtraAction = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    

    // Initialize stuff
    this.p1Score = 0;
    this.p2Score = 0;
    this.playerArray = [];
    this.animalArray = [];
    this.cableArray = [];
    this.animalSpriteArray = [];

    // Display score
    let scoreConfig = {
      fontFamily: 'Upheavtt',
      fontSize: '28px',
      color: '#FFFFFF',
      align: 'left',
      stroke: '#10141f',
      strokeThickness: 6
    }
    this.p1Config = {
      fontFamily: 'Upheavtt',
      fontSize: '28px',
      color: '#4f8fba',
      align: 'left',
      stroke: '#10141f',
      strokeThickness: 6
    }
    this.p2Config = {
      fontFamily: 'Upheavtt',
      fontSize: '28px',
      color: '#a53030',
      align: 'left',
      stroke: '#10141f',
      strokeThickness: 6
    }
    this.scoreLeft = this.add.text(borderPadding*2, borderPadding*2, `P1 Score: 0`, this.p1Config);
    if (game.settings.multiplayer) this.scoreRight = this.add.text(game.config.width - borderPadding*2, borderPadding*2, `P2 Score: 0`, this.p2Config).setOrigin(1, 0);
    
    //add claw (player 1)
    this.playerArray.push(
      new PlayerClaw(this, game.config.width/3, game.config.height - borderUISize - borderPadding, 'p1Open', 0, 0).setOrigin(0.5, 0));
    if(game.settings.multiplayer) {
      this.playerArray.push(
        new PlayerClaw(this, (game.config.width/3)*2, game.config.height - borderUISize - borderPadding, 'p2Open', 0, 1).setOrigin(0.5, 0));
    }

    // add animals (x6) I don't know how to initialize animals automatically... I don't wanna hard code it like this...
    this.animalArray.push(new Animal(this, game.config.width, borderUISize*2 + borderPadding, "panda", 0, "hard").setOrigin(0.5));
    this.animalArray.push(new Animal(this, game.config.width, borderUISize*4 + borderPadding, "llama", 0, "med").setOrigin(0.5));
    this.animalArray.push(new Animal(this, game.config.width/2, borderUISize*4 + borderPadding, "llama", 0, "med").setOrigin(0.5));
    this.animalArray.push(new Animal(this, game.config.width, borderUISize*6 + borderPadding, "cat", 0, "easy").setOrigin(0.5));
    this.animalArray.push(new Animal(this, (game.config.width/3), borderUISize*6 + borderPadding, "cat", 0, "easy").setOrigin(0.5));
    this.animalArray.push(new Animal(this, (game.config.width/3)*2, borderUISize*6 + borderPadding, "cat", 0, "easy").setOrigin(0.5));

    // Randomize animal sprites at the very start
    for(const animal of this.animalArray) this.changeSprite(animal);
    // Add cables to the game objects (purely aesthetic, albeit really badly coded)
    for(const animal of this.animalArray) this.cableArray.push(new Cable(this, animal.x, animal.y, 'animalCable', 0, animal).setOrigin(0.5, 1));
    for(const player of this.playerArray) this.cableArray.push(new Cable(this, player.x, player.y, 'playerCable', 0, player).setOrigin(0.5, 0));
    
    // Game over flag
    this.gameOver = false;
    // Play timer
    this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
      this.add.image(0, 0, 'darkenBG').setOrigin(0,0).setDepth(1);
      this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5).setDepth(2);
      this.getHighscore();
      this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (SPACE) to Restart or (F) for Menu', scoreConfig).setOrigin(0.5).setDepth(2);
      this.gameOver = true;
    }, null, this);
    this.timer = this.add.text(game.config.width/2, borderPadding*2, `${this.clock.delay}`, scoreConfig).setOrigin(0.5, 0);

    this.generateAnimations();
    // Fixes a bug where if the player restarts, they can't actually collide with anything. I think...
    for(const player of this.playerArray) player.reset(); 
  }

  update() {
    this.background.tilePositionX -= 0.5;
    this.background.tilePositionY -= 0.5;
    this.timer.text = Math.round((this.clock.delay - this.clock.elapsed) / 1000 );

    // Key Input for Restart
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyExtraAction)) { 
      this.scene.restart();
      this.sound.play('sfx_select'); 
    }
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyP1Action)) {
      this.scene.start("menuScene");
      this.sound.play('sfx_select');
    }

    // Keep updating game objects until game over
    if (!this.gameOver) {
      for(const player of this.playerArray) player.update(); 
      for (const animal of this.animalArray) animal.update();
    }
    for (const cable of this.cableArray) cable.update();

    // If there are sprites in the animal sprite array, make em go down
    if (this.animalSpriteArray.length != 0){
      for(const sprite of this.animalSpriteArray){
        sprite.y += game.settings.playerSpeed;
        if(sprite.y > startPos){
          // Destroy the sprite
          sprite.destroy(); 
          // "Remove element from array" code from https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
          const index = this.animalSpriteArray.indexOf(sprite);
          if (index > -1) this.animalSpriteArray.splice(index, 1);
        } 
      }
    }

    // Check collisions
    for (const animal of this.animalArray){
      for (const player of this.playerArray){
        if (!animal.taken && this.checkCollision(player, animal)){
          player.reset();
          this.grabAnimal(player, animal);
        }
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

  grabAnimal(player, animal) {
    if (this.gameOver) return;
    // create effects at animal's position
    let boom = this.add.sprite(animal.x, animal.y, 'explosion').setOrigin(0.5);
    boom.anims.play('explosion');

    let scoreEffect = this.add.sprite(animal.x -10, animal.y, `score${animal.value}`).setOrigin(0.5);
    scoreEffect.anims.play(`score${animal.value}`);

    this.animalSpriteArray.push(this.add.sprite(player.x, player.y, animal.texture.key).setOrigin(0.5));

    animal.pulled();  
    scoreEffect.on('animationcomplete', () => { 
      scoreEffect.destroy(); 
    })        
    boom.on('animationcomplete', () => { 
      boom.destroy(); 
      this.changeSprite(animal);
      animal.reset();
    });

    // Add score
    if(player.player == 0){
      this.p1Score += animal.value;
      this.scoreLeft.text = `P1 Score: ${this.p1Score}`;
    }
    if(player.player == 1){
      this.p2Score += animal.value;
      this.scoreRight.text = `P2 Score: ${this.p2Score}`;
    }

    // Add more time
    this.clock.delay += animal.addedTime;
    // Sound
    this.sound.play('sfx_animal_grabbed');
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

  getHighscore(){
    if(this.p1Score > this.p2Score && this.p1Score > highscore){
      highscore = this.p1Score;
      highscoreConfig = this.p1Config;
    }
    if(this.p2Score > this.p1Score && this.p2Score > highscore){
      highscore = this.p2Score;
      highscoreConfig = this.p2Config;
    }
    this.add.text(game.config.width/2, game.config.height/2 + 32, `Current Highscore: ${highscore}`, highscoreConfig).setOrigin(0.5).setDepth(2);
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
      key: 'explosion', 
      frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 8, first: 0}),
      frameRate: 10
    });

    this.anims.create({
      key: 'p1Closed', 
      frames: this.anims.generateFrameNumbers('p1Closed', {start: 0, end: 0, first: 0}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'p1Open', 
      frames: this.anims.generateFrameNumbers('p1Open', {start: 0, end: 0, first: 0}),
      frameRate: 10,
      repeat: -1
    });  
    this.anims.create({
      key: 'p2Closed', 
      frames: this.anims.generateFrameNumbers('p2Closed', {start: 0, end: 0, first: 0}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'p2Open', 
      frames: this.anims.generateFrameNumbers('p2Open', {start: 0, end: 0, first: 0}),
      frameRate: 10,
      repeat: -1
    });  
  }
}