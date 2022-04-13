class Cable extends Phaser.GameObjects.Sprite{
  constructor(scene, x, y, texture, frame, animal){
    console.log(animal);
    super(scene, x, y, texture, frame, animal);
    scene.add.existing(this);
    this.setDepth(-2);
    this.animal = animal;
  }

  update(){
    this.x = this.animal.x;
    this.setAlpha(this.animal.alpha);
  }
}