class GrabbedAnimal extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame){
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    this.setOrigin(0.5);
  }

  update(time, delta){
    this.y += game.settings.playerSpeed * delta / 1000;
    if(this.y > startPos){
      this.destroy(); 
    } 
  }
}