/**
 * Phaser game objects do not have children
 * But Phaser container do
 */

import Phaser from "phaser";

import TextureKeys from "~/consts/TextureKey";
import AnimationKey from "~/consts/AnimationKey";

// Phaser.GameObjects.Container instead of Phaser.Scene
export default class RocketMouse extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        // create the Rocket Mouse sprite
        const mouse = scene.add
            .sprite(0, 0, TextureKeys.RocketMouse)
            .setOrigin(0.5, 1)
            .play(AnimationKey.RocketMouseRun);

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
        
        // add to container
        this.add(mouse);
    }
}
