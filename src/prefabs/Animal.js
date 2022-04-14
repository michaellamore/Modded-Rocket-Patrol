class Animal extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, type){
    super(scene, x, y, texture, frame, type);
    scene.add.existing(this);
    this.setDepth(-1);
    this.type = type;
    this.startY = y;
    this.taken = false;
    this.addedTime = game.settings.addedTime[type];
    this.rotateSpeed = 0.5;
    this.maxAngle = 30;

    // Set move speed
    if (type in game.settings.animalSpeed) this.moveSpeed = game.settings.animalSpeed[type];
    else {
      console.error("Invalid animal type. Reverting to default values.");
      this.moveSpeed = 3;
    }

    if (type == "hard"){
      this.direction = 0;
      this.value = 100;
      this.rotatingLeft = true;
      this.rotatingRight = false;
    }
    if (type == "med"){
      this.direction = 1;
      this.value = 50;
      this.rotatingLeft = false;
      this.rotatingRight = true;
    }
    if (type == "easy"){
      this.direction = 0;
      this.value = 20;
      this.rotatingLeft = true;
      this.rotatingRight = false;
    }
  }

  update() {
    // Left vs Right movement
    if(this.direction == 0){
      this.x -= this.moveSpeed;
      if(this.x <= 0 - this.width) this.x = game.config.width;
    }
    if(this.direction == 1){
      this.x += this.moveSpeed;
      if(this.x >= game.config.width + this.width) this.x = 0;
    }
    this.rotate();
  }
  
  pulled() {
    this.setAlpha(0);
    this.taken = true;
  }

  reset(){
    this.setAlpha(1);
    this.taken = false;
  }

  rotate(){
    if(this.rotatingLeft){
      this.angle -= this.rotateSpeed; 
      if (this.angle <= -this.maxAngle){
        this.rotatingLeft = false;
        this.rotatingRight = true;
      }
    }
    if(this.rotatingRight){
      this.angle += this.rotateSpeed; 
      if (this.angle >= this.maxAngle){
        this.rotatingRight = false;
        this.rotatingLeft = true;
      }
    }
  }
}