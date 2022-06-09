/**
 * Phaser game objects do not have children
 * But Phaser container do
 */

import Phaser from "phaser";
import TextureKeys from "~/consts/TextureKey";
import AnimationKeys from "~/consts/AnimationKeys";

// Phaser.GameObjects.Container instead of Phaser.Scene
export default class RocketMouse extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        // create the Rocket Mouse sprite
        const mouse = scene.add
            .sprite(0, 0, TextureKeys.RocketMouse)
            .setOrigin(0.5, 1)
            .play(AnimationKeys.RocketMouseRun);

        // for comparison with old Game
        // const mouse = this.physics.add
        // .sprite(
        //     width * 0.5,
        //     height - 30,
        //     TextureKeys.RocketMouse,
        //     "rocketmouse_fly01.png"
        // )
        // .setOrigin(0.5, 1)
        // .play(AnimationKey.RocketMouseRun);

        // create the flame and play the animation
        const flames = scene.add.sprite(-63, -15, TextureKeys.RocketMouse).play(AnimationKeys.RocketFlamesOn);
        
        // add to container
        // add here so flames will layer properly
        this.add(flames);
        this.add(mouse);

        // add a physic body
        scene.physics.add.existing(this);

        // adjust physics body size and effect
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(mouse.width, mouse.height);
        body.setOffset(mouse.width * -0.5, -mouse.height);

    }
}
