class Button extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame, text, func){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.setOrigin(0.5);
    this.setDepth(2);
    this.scene = scene;
    this.func = func;
    this.isSelected = false;

    this.buttonText = this.scene.add.text(x, y-6, text, menuConfig).setOrigin(0.5, 1).setDepth(2);
    this.buttonOutline = this.scene.add.sprite(x, y-6, 'buttonOutline', 0).setOrigin(0.5).setDepth(2);
    this.outlineTween = this.scene.add.tween({
      targets: this.buttonOutline,
      y: "+=6",
      duration: 500,
      repeat: -1,
      yoyo: true
    });
  }

  select(){
    this.isSelected = true;
    this.buttonOutline.alpha = 1;
  }

  deselect(){
    this.isSelected = false
    this.buttonOutline.alpha = 0;
  }

  pressed(){ this.func() }
}