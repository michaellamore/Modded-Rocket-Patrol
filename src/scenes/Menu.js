class Menu extends Phaser.Scene {
  constructor() {
    super ("menuScene");
  }

  preload() {
    this.menuConfig = {
      fontFamily: 'Upheavtt',
      fontSize: '28px',
      color: '#FFFFFF',
      stroke: '#10141f',
      strokeThickness: 6,
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 0
    }

    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(80, 240, 480, 30);
    let loadingText = this.add.text(game.config.width/2, game.config.height/2 - 20, `Loading...`, this.menuConfig).setOrigin(0.5);

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

    // Images
    this.load.image('title', './assets/logo.png')
    this.load.image('darkenBG', './assets/darkenBG.png');
    this.load.image('background', './assets/backgroundNEW.png');

    // Audio
    this.load.audio('bgm', './assets/bgm_edited.wav');
    this.load.audio('sfx_select', './assets/menu_select.wav');
    this.load.audio('sfx_animal_grabbed', './assets/animal_grabbed.wav');
    this.load.audio('sfx_claw_fired', './assets/claw_fired.wav');

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

    // Med
    this.load.image('llama', './assets/llama.png');
    this.load.image('deer', './assets/deer.png');
    this.load.image('whale', './assets/whale.png');
    this.load.image('bear', './assets/bear.png');
    this.load.image('pig', './assets/pig.png');

    // Hard
    this.load.image('panda', './assets/panda.png');
    this.load.image('lion', './assets/lion.png');
    this.load.image('elephant', './assets/elephant.png');

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
    // If the music isn't playing yet
    
    if(!this.findSound('bgm')){
      this.sound.add('bgm', {volume: 0.1, loop: true}).play();
    }
    

    this.background = this.add.tileSprite(0,0,640, 480, 'background').setOrigin(0,0);
    this.add.image(0, 0, 'darkenBG').setOrigin(0,0);
    this.title = this.add.image(0, 0, 'title').setOrigin(0,0);

    this.add.text(game.config.width/2, game.config.height/2 + borderUISize*2, 'Player 1: (A)(D) to Move (F) to Fire', this.menuConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2 + borderUISize*3, 'Player 2: (<-)(->) to Move (Enter) to Fire', this.menuConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2 + borderUISize*4, 'Press (F) for 1P or (Enter) for 2P', this.menuConfig).setOrigin(0.5);

    // define keys
    keyP1Action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyP2Action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  update() {
    this.background.tilePositionX -= 0.5;
    this.background.tilePositionY -= 0.5;

    if (Phaser.Input.Keyboard.JustDown(keyP1Action)) {
      // 1 Player
      game.settings = {
        multiplayer: false,
        playerSpeed: 5,
        animalSpeed: {
          hard: 5,
          med: 4,
          easy: 3
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
    }
    if (Phaser.Input.Keyboard.JustDown(keyP2Action)) {
      // 2 Player
      game.settings = {
        multiplayer: true,
        playerSpeed: 6,
        animalSpeed: {
          hard: 8,
          med: 6,
          easy: 5
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
    }
  }

  findSound(soundKey){
    let output = false;
    for (const sound of this.sound.sounds){
      if (sound.key == soundKey) output = true;
    }
    return output;
  }
}