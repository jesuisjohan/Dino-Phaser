import Phaser from "phaser"
import DinoAnimationKeys from "~/consts/DinoAnimationKeys"
import DinoAudioKeys from "~/consts/DinoAudioKeys"
import DinoTextureKeys from "~/consts/DinoTextureKeys"

import IdlingState from "~/States/IdlingState"
import JumpingState from "~/States/JumpingState"
import RunningState from "~/States/RunningState"
import DuckingState from "~/States/DuckingState"
import DeadState from "~/States/DeadState"

import DinoState from "~/States/DinoState"
import DinoStateEnum from "~/consts/DinoStateEnum"

export default class Dino extends Phaser.GameObjects.Container {
    private dino!: Phaser.GameObjects.Sprite
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private jumpSound!: Phaser.Sound.BaseSound
    private currentState!: DinoState

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)
        this.scene = scene
        this.createSound(scene)
        this.createDinoSprite(scene)
        this.addDinoPhysicsBody(scene)
        this.setCurrentState(DinoStateEnum.IDLING)
        this.cursors = scene.input.keyboard.createCursorKeys()
    }

    private createSound(scene: Phaser.Scene) {
        this.jumpSound = scene.sound.add(DinoAudioKeys.Jump, { volume: 1 })
    }

    private createDinoSprite(scene: Phaser.Scene) {
        this.dino = scene.add
            .sprite(0, 0, DinoTextureKeys.Dino)
            .setOrigin(0, 0)
            .play(DinoAnimationKeys.DinoIdle)
            .setDepth(1)
        this.add(this.dino)
    }

    private addDinoPhysicsBody(scene: Phaser.Scene) {
        scene.physics.add.existing(this)
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setSize(88, 92)
        body.setOffset(0, 92)
    }

    public playAnimation(key: DinoAnimationKeys) {
        this.dino.play(key, true)
    }

    // utils

    public kill() {
        this.setCurrentState(DinoStateEnum.DEAD)
    }

    public onGround() {
        return (this.body as Phaser.Physics.Arcade.Body).blocked.down
    }

    public isMovingRight() {
        return (this.body as Phaser.Physics.Arcade.Body).velocity.x > 0
    }

    // update
    preUpdate() {
        this.currentState.handleInput(this.cursors)
        console.log(this.currentState.state)
    }

    // handleInput() {
    //     if (cursors.down?.isDown) {
    //         this.state.ducking()
    //     }

    //     if (cursor.space?.isDown) {
    //         this.state.jump()
    //     }
    // }

    // state management

    public idle() {
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setSize(88, 92)
        body.offset.y = 0

        this.dino.play(DinoAnimationKeys.DinoIdle, true)
    }

    public duck() {
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setSize(118, 58)
        body.offset.y = 34

        const vy = 1600
        body.setVelocityY(vy)

        this.dino.play(DinoAnimationKeys.DinoDown, true)
    }

    public jump() {
        this.jumpSound.play()

        const body = this.body as Phaser.Physics.Arcade.Body
        const vy = 1600
        body.setVelocityY(-vy)

        this.dino.anims.stop()
    }

    public run() {
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setSize(88, 92)
        body.offset.y = 0

        this.dino.play(DinoAnimationKeys.DinoRun, true)
    }

    public dead() {
        this.dino.play(DinoAnimationKeys.DinoHurt, true)
    }

    public setCurrentState(state: DinoStateEnum) {
        switch (state) {
            case DinoStateEnum.RUNNING: {
                this.currentState = new RunningState(this)
                break
            }
            case DinoStateEnum.JUMPING: {
                this.currentState = new JumpingState(this)
                break
            }
            case DinoStateEnum.DUCKING: {
                this.currentState = new DuckingState(this)
                break
            }
            case DinoStateEnum.DEAD: {
                this.currentState = new DeadState(this)
                break
            }
            case DinoStateEnum.IDLING:
            default: {
                this.currentState = new IdlingState(this)
                break
            }
        }
        this.currentState.enter()
    }
}
