class MenuManager {
  constructor(scene, buttonArray, spriteArray){
    this.scene = scene;
    this.buttonArray = buttonArray;
    this.currentButton = 0;
    this.updateSelectedButton();

    this.spriteTweenDuration = 100;
    this.spriteArray = spriteArray;
    if(this.spriteArray != null){
      this.spriteTargetY = this.spriteArray[0].y;
      this.tweenIn(this.spriteArray[0]);
    }
    
  }

  update(){
    if(Phaser.Input.Keyboard.JustDown(keyP1Left)
        || Phaser.Input.Keyboard.JustDown(keyP2Left)){
      this.changeSelectedButton("left");
    }
    if(Phaser.Input.Keyboard.JustDown(keyP1Right)
        || Phaser.Input.Keyboard.JustDown(keyP2Right)){
      this.changeSelectedButton("right");
    }
    if(Phaser.Input.Keyboard.JustDown(keyP1Action)
        || Phaser.Input.Keyboard.JustDown(keyP2Action)){
      this.buttonArray[this.currentButton].pressed();
    }
  }

  changeSelectedButton(direction){
    if(direction == "left"){
      if(this.currentButton <= 0) return;
      this.currentButton--;
    } else if (direction == "right") {
      if(this.currentButton >= this.buttonArray.length-1) return;
      this.currentButton++;
    }
    this.updateSelectedButton();
    this.updateMenuSprite();
  }

  updateSelectedButton(){
    for(const button of this.buttonArray){ button.deselect(); }
    this.buttonArray[this.currentButton].select();
  }

  updateMenuSprite(){
    if (this.spriteArray == null) return; 
    // Tween out the current active sprite
    for (const sprite of this.spriteArray){
      if (sprite.alpha > 0) this.tweenOut(sprite);
    }
    // Tween in the next sprite
    this.tweenIn(this.spriteArray[this.currentButton]);
  }

  tweenIn(sprite){
    if (this.spriteArray == null) return; 
    this.scene.add.tween({
      targets: sprite,
      y: {from: this.spriteTargetY+50, to: this.spriteTargetY},
      alpha: {from: 0, to: 1},
      duration: this.spriteTweenDuration,
    });
  }
  tweenOut(sprite){
    if (this.spriteArray == null) return; 
    this.scene.add.tween({
      targets: sprite,
      y: {from: this.spriteTargetY, to: this.spriteTargetY+50},
      alpha: {from: 1, to: 0},
      duration: this.spriteTweenDuration,
      ease: "Ease.easeOut",
    });
  }
}