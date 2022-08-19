class Menu extends Phaser.Scene {
  constructor() {
    super ("menuScene");
  }

  preload() {
    if(this.loaded) return;
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(80, 240, 480, 30);
    let loadingText = this.add.text(game.config.width/2, game.config.height/2 - 20, `Loading...`, menuConfig).setOrigin(0.5);

    this.load.on('progress', function(value){
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(90, 250, 460*value, 10);
    });
    this.load.on('complete', function(){
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
    
    this.load.path = "./assets/";

    // Menus
    this.load.image('title', 'logo.png')
    this.load.image('background', 'backgroundNEW.png');
    this.load.image('buttonOutline', 'buttonOutline.png');
    this.load.image('button', 'button.png');
    this.load.image('buttonSmall', 'buttonSmall.png');
    this.load.image('hud', 'hud.png');
    this.load.image('instructions', 'instructions.png');
    this.load.spritesheet('menuIconSheet', 'menuIconSheet.png', {frameWidth: 288, frameHeight: 220});

    // Audio
    this.load.audio('bgm', 'bgm_edited.wav');
    this.load.audio('sfx_select', 'menu_select.wav');
    this.load.audio('sfx_animal_grabbed', 'animal_grabbed.wav');
    this.load.audio('sfx_claw_fired', 'claw_fired.wav');

    // Animals
    this.load.atlas('easyAnimalSheet', 'easyAnimalSheet.png', 'easyAnimalJson.json');
    this.load.atlas('medAnimalSheet', 'medAnimalSheet.png', 'medAnimalJson.json');
    this.load.atlas('hardAnimalSheet', 'hardAnimalSheet.png', 'hardAnimalJson.json');

    // Players
    this.load.spritesheet('p1Open', 'p1Open.png', {frameWidth: 48, frameHeight: 48});
    this.load.spritesheet('p1Closed', 'p1Closed.png', {frameWidth: 48, frameHeight: 48});
    this.load.spritesheet('p2Open', 'p2Open.png', {frameWidth: 48, frameHeight: 48});
    this.load.spritesheet('p2Closed', 'p2Closed.png', {frameWidth: 48, frameHeight: 48});

    // Cables images
    this.load.image('animalCable', 'animalCable.png');
    this.load.image('playerCable', 'playerCable.png');

    // Effects
    this.load.spritesheet('score20', 'score20.png', {frameWidth: 96, frameHeight: 72, startFrame: 0, endFrame: 20}); 
    this.load.spritesheet('score50', 'score50.png', {frameWidth: 96, frameHeight: 72, startFrame: 0, endFrame: 20}); 
    this.load.spritesheet('score100', 'score100.png', {frameWidth: 96, frameHeight: 72, startFrame: 0, endFrame: 20}); 
    this.load.spritesheet('explosion', 'explosion.png', {frameWidth: 48, frameHeight: 48, startFrame: 0, endFrame: 8}); 
  }

  create() {
    this.bgMovespeed = 50;
    this.loaded = true;

    // define keys
    keyP1Action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyP1Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyP1Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyP2Action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    keyP2Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyP2Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    // If the music isn't playing yet
    if(!this.findSound('bgm')){
      this.sound.add('bgm', {volume: 0.1, loop: true}).play();
    }

    this.background = this.add.tileSprite(0,0,640, 480, 'background').setOrigin(0,0);
    this.add.rectangle(0, 0, game.config.width, game.config.height, 0x151d28).setOrigin(0,0).setDepth(1).setAlpha(0.5);

    let button1 = new Button(this, game.config.width/2 - 200, startPos-20, 'button', 0, "How To Play", ()=>{
      this.sound.play('sfx_select');
      this.scene.start('instructionScene');
    })
    let button2 = new Button(this, game.config.width/2, startPos-20, 'button', 0, "1 Player", ()=>{
      // 1 Player
      game.settings = {
        multiplayer: false,
        playerSpeed: 250,
        animalSpeed: {
          hard: 250,
          med: 200,
          easy: 150
        },
        addedTime: {
          hard: 5000,
          med: 2000,
          easy: 250,
        },
        gameTimer: 45000
      }
      this.sound.play('sfx_select');
      this.scene.start('playScene');
    })
    let button3 = new Button(this, game.config.width/2 + 200, startPos-20, 'button', 0, "2 Player", ()=>{
      // 2 Player
      game.settings = {
        multiplayer: true,
        playerSpeed: 300,
        animalSpeed: {
          hard: 400,
          med: 300,
          easy: 250
        },
        addedTime: {
          hard: 2500,
          med: 1000,
          easy: 125,
        },
        gameTimer: 60000
      }
      this.sound.play('sfx_select');
      this.scene.start('playScene');
    })
    let menuSpriteArray = [];
    for(let i=0; i<3; i++){
      menuSpriteArray.push(this.add.sprite(game.config.width/2, 180, 'menuIconSheet', i).setAlpha(0).setDepth(1).setOrigin(0.5));
    }
    this.menuManager = new MenuManager(this, [button1, button2, button3], menuSpriteArray);

    this.generateAnimations();
  }

  update(time, delta) {
    this.background.tilePositionX -= this.bgMovespeed * delta / 1000;
    this.background.tilePositionY -= this.bgMovespeed * delta / 1000;

    this.menuManager.update();
  }

  findSound(soundKey){
    let output = false;
    for (const sound of this.sound.sounds){
      if (sound.key == soundKey) output = true;
    }
    return output;
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