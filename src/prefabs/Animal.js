class Animal extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, type){
    super(scene, x, y, texture, frame, type);
    scene.add.existing(this);
    this.type = type;
    this.startY = y;
    this.taken = false;

    // Set move speed
    if (type in game.settings.animalSpeed) this.moveSpeed = game.settings.animalSpeed[type];
    else {
      console.error("Invalid animal type. Reverting to default values.");
      this.moveSpeed = 3;
    }

    // Set direction
    if (type == "hard" || type == "easy") this.direction = 0;
    if (type == "med") this.direction = 1;

    // Set value
    if (type == "hard") this.value = 100;
    if (type == "med") this.value = 50;
    if (type == "easy") this.value = 20;

    // Set time added
    if (type == "hard") this.addedTime = 5000;
    if (type == "med") this.addedTime = 2000; 
    if (type == "easy") this.addedTime = 100;
  }

  update() {
    // If player hits, move down
    if (this.taken){
      if(this.y < startPos) this.y += game.settings.playerSpeed;
      if(this.y >= startPos) this.reset();
      return;
    }

    // Left vs Right movement
    if(this.direction == 0){
      this.x -= this.moveSpeed;
      if(this.x <= 0 - this.width) this.x = game.config.width;
    }
    if(this.direction == 1){
      this.x += this.moveSpeed;
      if(this.x >= game.config.width + this.width) this.x = 0;
    }
  }
  
  pulled(xPlayer, yPlayer) {
    this.x = xPlayer - this.width/2;
    this.y = yPlayer - this.height/2;
    this.taken = true;
  }

  reset(){
    this.x = game.config.width;
    this.y = this.startY;
    this.taken = false;
  }
}