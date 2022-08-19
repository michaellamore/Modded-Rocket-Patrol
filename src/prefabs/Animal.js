class Animal extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, type){
    super(scene, x, y, texture, frame, type);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(-1);
    this.setOrigin(0.5);
    this.type = type;
    this.startY = y;
    this.taken = false;
    this.addedTime = game.settings.addedTime[type];
    this.goingDown = false;

    // Set move speed
    if (type in game.settings.animalSpeed) this.moveSpeed = game.settings.animalSpeed[type];
    else {
      console.error("Invalid animal type. Reverting to default values.");
      this.moveSpeed = 3;
    }
    this.rotationDuration = 2000;

    if (type == "hard"){
      this.direction = 0;
      this.value = 100;
      this.maxAngle = 30;
    }
    if (type == "med"){
      this.direction = 1;
      this.value = 50;
      this.maxAngle = -30;
    }
    if (type == "easy"){
      this.direction = 0;
      this.value = 20;
      this.maxAngle = 30;
    }
    
    // Rotation tween
    this.angle = -this.maxAngle;
    this.tween = scene.tweens.add({
      targets: this,
      angle: this.maxAngle,
      duration: this.rotationDuration,
      repeat: -1,
      yoyo: true
    })
  }

  update(time, delta) {
    // Left vs Right movement
    if(this.direction == 0){
      this.x -= this.moveSpeed * delta / 1000;
      if(this.x <= 0 - this.width) this.x = game.config.width;
    }
    if(this.direction == 1){
      this.x += this.moveSpeed * delta / 1000;
      if(this.x >= game.config.width + this.width) this.x = 0;
    }

    if(this.goingDown){
      this.y += this.moveSpeed * delta / 1000;
      if(this.y > this.startY){
        this.goingDown = false;
        this.y = this.startY;
      }
    }
  }
  
  pulled() {
    this.setAlpha(0);
    this.taken = true;
  }

  reset(){
    this.setAlpha(1);
    this.taken = false;
    this.goingDown = true;
    this.y = 0;
  }
}