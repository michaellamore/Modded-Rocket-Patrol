class Menu extends Phaser.Scene {
  constructor() {
    super ("menuScene");
  }

  preload() {
    // Images
    this.load.image('title', './assets/logo.png')
    this.load.image('darkenBG', './assets/darkenBG.png');
    this.load.image('background', './assets/backgroundNEW.png');

    // Audio
    this.load.audio('sfx_select', './assets/menu_select.wav');
    this.load.audio('sfx_animal_grabbed', './assets/animal_grabbed.wav');
    this.load.audio('sfx_claw_fired', './assets/claw_fired.wav');
  }

  create() {
    this.background = this.add.tileSprite(0,0,640, 480, 'background').setOrigin(0,0);
    this.add.image(0, 0, 'darkenBG').setOrigin(0,0);
    this.title = this.add.image(0, 0, 'title').setOrigin(0,0);

    let menuConfig = {
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

    this.add.text(game.config.width/2, game.config.height/2 + borderUISize*2, 'Player 1: (W)(D) to Move (F) to Fire', menuConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2 + borderUISize*3, 'Player 2: (<-)(->) to Move (Enter) to Fire', menuConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2 + borderUISize*4, 'Press (F) for 1P or (Enter) for 2P', menuConfig).setOrigin(0.5);

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
}