class PlayerClaw extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame, player){
    super(scene, x, y, texture, frame, player);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene;
    this.setDepth(1);
    this.setOrigin(0.5, 0)
    this.body.setSize(24, 24, false);
    this.body.setOffset(12, 10);

    this.isFiring = false;
    this.goingDown = false;
    this.moveSpeed = game.settings.playerSpeed;
    this.player = player;

    if (this.player == 0){
      this.keyLeft = keyP1Left;
      this.keyRight = keyP1Right;
      this.keyAction = keyP1Action;
      this.animOpen = 'p1Open';
      this.animClosed = 'p1Closed';
    }
    if(this.player == 1){
      this.keyLeft = keyP2Left;
      this.keyRight = keyP2Right;
      this.keyAction = keyP2Action;
      this.animOpen = 'p2Open';
      this.animClosed = 'p2Closed';
    }
  }

  update(time, delta) {
    // fire button
    if (Phaser.Input.Keyboard.JustDown(this.keyAction) && !this.isFiring && !this.goingDown){
      this.scene.sound.play('sfx_claw_fired');
      this.isFiring = true;
    }

    // horizontal movement
    if (!this.isFiring && !this.goingDown){
      if (this.keyLeft.isDown && this.x >= borderUISize + this.width){
        this.x -= this.moveSpeed * delta / 1000;
      }
      else if (this.keyRight.isDown && this.x <= game.config.width - borderUISize - this.width){
        this.x += this.moveSpeed * delta / 1000;
      }
    }

    // vertical movement
    if (this.isFiring && this.y >= endPos && !this.goingDown) {
      this.y -= this.moveSpeed * delta / 1000;
    }
    if (this.goingDown && this.y < startPos && !this.isFiring){
      this.y += this.moveSpeed * delta / 1000;
      this.anims.play(this.animClosed);
    }

    // If it hits upper barrier, set flags to go down
    if (this.y <= endPos){
      this.goingDown = true;
      this.isFiring = false;
    }

    // Done going down
    if (this.y >= startPos){
      this.goingDown = false;
      this.y = startPos;
      this.anims.play(this.animOpen);
    }
  }

  reset() {
    this.isFiring = false;
    this.goingDown = true;
  }
}