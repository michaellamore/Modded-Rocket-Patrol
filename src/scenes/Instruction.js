class Instruction extends Phaser.Scene {
  constructor() {
    super ("instructionScene");
  }
  create() {
    this.bgMovespeed = 50;

    keyP1Action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyP2Action = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.background = this.add.tileSprite(0,0,640, 480, 'background').setOrigin(0,0);
    this.add.rectangle(0, 0, game.config.width, game.config.height, 0x151d28).setOrigin(0,0).setDepth(0).setAlpha(0.5);

    let button1 = new Button(this, game.config.width/2, startPos-20, 'button', 0, "Menu", ()=>{
      this.sound.play('sfx_select');
      this.scene.start('menuScene');
    });
    this.menuManager = new MenuManager(this, [button1]);

    this.add.image(0, 0, 'instructions').setOrigin(0, 0);
  }

  update(time, delta){
    this.background.tilePositionX -= this.bgMovespeed * delta / 1000;
    this.background.tilePositionY -= this.bgMovespeed * delta / 1000;

    this.menuManager.update();
  }
}