class Cable extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame, target){
    super(scene, x, y, texture, frame, target);
    scene.add.existing(this);
    this.setDepth(-2);
    this.target = target;
  }

  update(){
    this.x = this.target.x;
    this.y = this.target.y;
    this.setAlpha(this.target.alpha);
  }
}