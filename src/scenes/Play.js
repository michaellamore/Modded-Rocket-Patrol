class Play extends Phaser.Scene {
  constructor() {
    super ("playScene");
  }

  create() {
    // Define keys
    keyP1Action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyP1Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyP1Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyP2Action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    keyP2Left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyP2Right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    keyExtraAction = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Initialize stuff
    this.bgMovespeed = 30;
    this.gameOver = false;
    this.p1Score = 0;
    this.p2Score = 0;
    this.playerGroup = this.add.group({runChildUpdate: true});
    this.animalGroup = this.add.group({runChildUpdate: true});
    this.cableGroup = this.add.group({runChildUpdate: true});
    this.grabbedAnimalGroup = this.add.group({runChildUpdate: true});

    // place BG sprite
    this.background = this.add.tileSprite(0,0,640, 480, 'background').setOrigin(0,0).setDepth(-10);

    // Hud stuff
    this.hud = this.add.image(0, 0, 'hud', 0).setOrigin(0, 0);
    this.scoreLeft = this.add.text(borderPadding, 5, `P1 Score: 0`, p1Config);
    if (game.settings.multiplayer) this.scoreRight = this.add.text(game.config.width - borderPadding, 5, `P2 Score: 0`, p2Config).setOrigin(1, 0);

    // Instantiate animals
    this.spawnAnimals("hard", 1);
    this.spawnAnimals("med", 2);
    this.spawnAnimals("easy", 3);

    //add claw (player 1)
    this.playerGroup.add(new PlayerClaw(this, game.config.width/3, game.config.height - borderUISize - borderPadding, 'p1Open', 0, 0));
    if(game.settings.multiplayer) {
      this.playerGroup.add(
        new PlayerClaw(this, (game.config.width/3)*2, game.config.height - borderUISize - borderPadding, 'p2Open', 0, 1));
    }

    // Add player cables
    this.playerGroup.children.each((player)=>{
      this.cableGroup.add(new Cable(this, player.x, player.y, 'playerCable', 0, player).setOrigin(0.5, 0))
    });

    // Player + Animal collision
    this.physics.add.overlap(this.playerGroup, this.animalGroup, (player, animal)=>{
      if(animal.taken || player.goingDown || this.gameOver) return;
      player.reset();

      // Grabbing effects
      let explosion = this.add.sprite(animal.x, animal.y, 'explosion').setOrigin(0.5);
      explosion.anims.play('explosion');
      explosion.on('animationcomplete', () => { 
        explosion.destroy(); 
        this.changeSprite(animal);
        animal.reset();
      });
      let scoreEffect = this.add.sprite(animal.x -10, animal.y, `score${animal.value}`).setOrigin(0.5);
      scoreEffect.anims.play(`score${animal.value}`);
      scoreEffect.on('animationcomplete', () => { scoreEffect.destroy(); });

      animal.pulled();  
      this.grabbedAnimalGroup.add(new GrabbedAnimal(this, player.x, player.y, animal.texture.key, animal.frame.name));

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
    });

    // Gameover state
    this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
      this.gameOver = true;
      this.add.rectangle(0, 0, game.config.width, game.config.height, 0x151d28).setOrigin(0,0).setDepth(1).setAlpha(0.5);
      this.add.text(game.config.width/2, 200, 'GAME OVER', gameoverConfig).setOrigin(0.5).setDepth(2);
      this.getHighscore();

      let button1 = new Button(this, game.config.width/2 - 100, startPos-20, 'button', 0, "Restart", ()=>{
        this.scene.start("playScene");
        this.sound.play('sfx_select'); 
      })
      let button2 = new Button(this, game.config.width/2 + 100, startPos-20, 'button', 0, "Menu", ()=>{
        this.scene.start("menuScene");
        this.sound.play('sfx_select');
      })
      this.menuManager = new MenuManager(this, [button1, button2]);

      this.playerGroup.runChildUpdate = false;
      this.animalGroup.runChildUpdate = false;
      this.animalGroup.children.each((animal)=> animal.tween.stop());
      this.grabbedAnimalGroup.runChildUpdate = false;
      
    }, null, this);
    this.timer = this.add.text(game.config.width/2, 2, `${this.clock.delay}`, scoreConfig).setOrigin(0.5, 0);
  }

  update(time, delta) {
    this.background.tilePositionX -= this.bgMovespeed * delta / 1000;
    this.background.tilePositionY -= this.bgMovespeed * delta / 1000;
    this.timer.text = Math.round((this.clock.delay - this.clock.elapsed) / 1000 );

    if(this.gameOver) this.menuManager.update();
  }

  spawnAnimals(type, amount){
    let offset = 80;
    let multiplier = 1;
    if (type == "med"){
      offset = 64;
      multiplier = 2;
    }
    else if (type == "easy") {
      offset = 48;
      multiplier = 3;
    }
    let spacing = (game.config.width+offset) / amount;
    for(let i=0; i<amount; i++){
      let animal = new Animal(this, spacing*i, (borderUISize*2)*(multiplier) + borderPadding, `${type}AnimalSheet`, 0, type);
      this.animalGroup.add(animal);
      this.changeSprite(animal);
      this.cableGroup.add(new Cable(this, animal.x, animal.y, 'animalCable', 0, animal).setOrigin(0.5, 1));
    }
  }

  changeSprite(animal){
    let atlasTexture = this.textures.get(`${animal.type}AnimalSheet`)
    let frames = atlasTexture.getFrameNames();
    let newFrame = Phaser.Utils.Array.GetRandom(frames);
    if(newFrame == animal.frame.name) return this.changeSprite(animal);
    animal.setFrame(newFrame)
  }

  getHighscore(){
    if(highscore == 0) highscoreConfig = scoreConfig;
    if(this.p1Score > this.p2Score && this.p1Score > highscore){
      highscore = this.p1Score;
      highscoreConfig = p1Config;
    }
    if(this.p2Score > this.p1Score && this.p2Score > highscore){
      highscore = this.p2Score;
      highscoreConfig = p2Config;
    }
    this.add.text(game.config.width/2, game.config.height/2 + 32, `Current Highscore: ${highscore}`, highscoreConfig).setOrigin(0.5).setDepth(2);
  }
}