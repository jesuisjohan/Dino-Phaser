import Phaser from "phaser"
import DinoAnimationKeys from "~/consts/DinoAnimationKeys"
import DinoAudioKeys from "~/consts/DinoAudioKeys"
import DinoTextureKeys from "~/consts/DinoTextureKeys"

import { Idling, Jumping, Running, Ducking, Dead } from "~/State/State"
import DinoState from "~/State/State"
import { DinoStateEnum } from "~/State/State"

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

    public idle() {
        this.dino.play(DinoAnimationKeys.DinoIdle, true)
    }

    public duck() {
        const body = this.body as Phaser.Physics.Arcade.Body
        const vy = 1600
        body.setVelocityY(vy)
        this.dino.play(DinoAnimationKeys.DinoDown, true)
        body.setSize(118, 58)
        body.offset.y = 34
    }

    public jump() {
        const body = this.body as Phaser.Physics.Arcade.Body
        const vy = 1600
        this.jumpSound.play()
        body.setVelocityY(-vy)
        this.run()
        this.dino.anims.stop()
    }

    public run() {
        const body = this.body as Phaser.Physics.Arcade.Body
        this.dino.play(DinoAnimationKeys.DinoRun, true)
        body.setSize(88, 92)
        body.offset.y = 0
    }

    public kill() {
        this.setCurrentState(DinoStateEnum.DEAD)
        this.dino.play(DinoAnimationKeys.DinoHurt, true)
    }

    public onGround() {
        return (this.body as Phaser.Physics.Arcade.Body).blocked.down
    }

    public isMovingRight() {
        return (this.body as Phaser.Physics.Arcade.Body).velocity.x > 0
    }

    preUpdate() {
        if (this.cursors.down?.isDown) {
            this.duck()
        } else if (this.cursors.space?.isDown || this.cursors.up?.isDown) {
            if (!this.onGround() || this.isMovingRight() || this.cursors.down.isDown) return
            this.jump()
        } else {
            this.run()
        }

        this.currentState.handleInput(this.cursors)

        console.log(this.currentState.state)
    }

    public setCurrentState(state: DinoStateEnum) {
        switch (state) {
            case DinoStateEnum.RUNNING: {
                this.currentState = new Running(this)
                break
            }
            case DinoStateEnum.JUMPING: {
                this.currentState = new Jumping(this)
                break
            }
            case DinoStateEnum.DUCKING: {
                this.currentState = new Ducking(this)
                break
            }
            case DinoStateEnum.DEAD: {
                this.currentState = new Dead(this)
                break
            }
            case DinoStateEnum.IDLING:
            default: {
                this.currentState = new Idling(this)
                break
            }
        }
        this.currentState.enter()
    }
}
