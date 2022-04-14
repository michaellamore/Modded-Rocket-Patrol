class PlayerClaw extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame, player){
    super(scene, x, y, texture, frame, player);
    scene.add.existing(this);
    this.scene = scene;
    this.setDepth(1);

    this.isFiring = false;
    this.goingDown = false;
    this.moveSpeed = game.settings.playerSpeed;
    this.player = player;

    // Default means only 1 player
    this.keyLeft = keyP1Left;
    this.keyRight = keyP1Right;
    this.keyAction = keyP1Action;
    this.animOpen = 'p1Open';
    this.animClosed = 'p1Closed';

    if(this.player == 1){
      this.keyLeft = keyP2Left;
      this.keyRight = keyP2Right;
      this.keyAction = keyP2Action;
      this.animOpen = 'p2Open';
      this.animClosed = 'p2Closed';
    }
    if(this.player >= 2) console.error("Max 2 Players. Idk how to code for more players lol");
  }

  update() {
    // left & right movement
    if (!this.isFiring && !this.goingDown){
      if (this.keyLeft.isDown && this.x >= borderUISize + this.width){
        this.x -= this.moveSpeed;
      }
      else if (this.keyRight.isDown && this.x <= game.config.width - borderUISize - this.width){
        this.x += this.moveSpeed;
      }
    }

    // fire button
    if (Phaser.Input.Keyboard.JustDown(this.keyAction) && !this.isFiring && !this.goingDown){
      this.scene.sound.play('sfx_claw_fired');
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
      this.anims.play(this.animClosed);
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