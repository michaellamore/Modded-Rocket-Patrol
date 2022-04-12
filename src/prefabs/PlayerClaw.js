class PlayerClaw extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y){
    super(scene, x, y)
    scene.add.existing(this);
    this.isFiring = false;
    this.goingDown = false;
    this.moveSpeed = game.settings.playerSpeed;
  }

  update() {
    // left & right movement
    if (!this.isFiring && !this.goingDown){
      if (keyLEFT.isDown && this.x >= borderUISize + this.width){
        this.x -= this.moveSpeed;
      }
      else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width){
        this.x += this.moveSpeed;
      }
    }

    // fire button
    if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring && !this.goingDown){
      this.isFiring = true;
    }

    // if fired, move up
    if (this.isFiring && this.y >= endPos && !this.goingDown) {
      this.y -= this.moveSpeed;
    }

    // If it hits upper barrier, set flags to go down
    if (this.y <= endPos){
      this.goingDown = true;
      this.isFiring = false;
    }
    // Going down
    if (this.goingDown && this.y < startPos && !this.isFiring){
      this.y += this.moveSpeed;
    }

    // Done going down
    if (this.y >= startPos){
      this.goingDown = false;
      this.y = startPos;
    }
  }

  reset() {
    this.isFiring = false;
    this.goingDown = true;
  }
}