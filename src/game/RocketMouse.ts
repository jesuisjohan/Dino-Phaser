/**
 * Phaser game objects do not have children
 * But Phaser container do
 */

import Phaser from "phaser";
import TextureKeys from "~/consts/TextureKey";
import AnimationKeys from "~/consts/AnimationKeys";
import SceneKeys from "~/consts/SceneKeys";

import eventsCenter from "~/events/EventsCenter";

enum MouseState {
    Running,
    Killed,
    Dead,
}

// Phaser.GameObjects.Container instead of Phaser.Scene
export default class RocketMouse extends Phaser.GameObjects.Container {
    private mouse: Phaser.GameObjects.Sprite;
    private flames: Phaser.GameObjects.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    private mouseState = MouseState.Running;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        // create the Rocket Mouse sprite
        this.mouse = scene.add
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
        this.flames = scene.add.sprite(-63, -15, TextureKeys.RocketMouse).play(AnimationKeys.RocketFlamesOn);
        // turn off jet pack
        this.enableJetpack(false);

        // add to container
        // add here so flames will layer properly
        this.add(this.flames);
        this.add(this.mouse);

        // add a physic body
        scene.physics.add.existing(this);

        // adjust physics body size and effect
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(this.mouse.width * 0.5, this.mouse.height * 0.7);
        body.setOffset(this.mouse.width * -0.3, -this.mouse.height+ 15);

        // get cursor key instance
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    enableJetpack(enabled: boolean) {
        this.flames.setVisible(enabled);
    }

    kill() {
        // State Machine
        if (this.mouseState !== MouseState.Running) {
            return;
        }
        this.mouseState = MouseState.Killed;

        this.mouse.play(AnimationKeys.RocketMouseDead);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setAccelerationY(0);
        body.setVelocity(1000, 0);
        this.enableJetpack(false);
    }

    // A Container does not normally implement a preUpdate() method but it will get called if we create one.
    // you can call it manually by update() like TypeScript Engine
    preUpdate() {
        const body = this.body as Phaser.Physics.Arcade.Body;
        switch (this.mouseState) {
            case MouseState.Running: {
                if (this.cursors.space?.isDown || this.cursors.up?.isDown) {
                    body.setAccelerationY(-1000);
                    this.enableJetpack(true);

                    // play the fly animation - if already played, it will be ignored
                    this.mouse.play(AnimationKeys.RocketMouseFly, true);
                }
                else if (this.cursors.down?.isDown) {
                    body.setAccelerationY(2000);
                    this.enableJetpack(false);
                } 
                else {
                    body.setAccelerationY(0);
                    this.enableJetpack(false);
                }

                // check if touch the ground
                if (body.blocked.down) {
                    // play run
                    this.mouse.play(AnimationKeys.RocketMouseRun, true);
                } else if (body.velocity.y > 0) {
                    this.mouse.play(AnimationKeys.RocketMouseFall, true);
                }
                break;
            }
            case MouseState.Killed: {
                body.velocity.x *= 0.99;
                if (body.velocity.x <= 5) {
                    this.mouseState = MouseState.Dead;
                }
                break;
            }
            case MouseState.Dead: {
                body.setVelocity(0, 0);

                if (!this.scene.scene.isActive(SceneKeys.GameOver)) {
                    // this.scene.scene.run(SceneKeys.GameOver);
                    eventsCenter.emit('dead')
                }
                break;
            }
        }
    }
}
