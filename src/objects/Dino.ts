import Phaser from "phaser"
import DinoAnimationKeys from "~/consts/AnimationKeys"
import DinoAudioKeys from "~/consts/AudioKeys"
import DinoTextureKeys from "~/consts/TextureKeys"

import IdlingState from "~/states/IdlingState"
import JumpingState from "~/states/JumpingState"
import RunningState from "~/states/RunningState"
import DuckingState from "~/states/DuckingState"
import DeadState from "~/states/DeadState"

import BaseDinoState from "~/states/BaseDinoState"
import DinoStateEnum from "~/consts/DinoStateEnum"

export default class Dino extends Phaser.GameObjects.Container {
    private dino!: Phaser.GameObjects.Sprite
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private jumpSound!: Phaser.Sound.BaseSound
    private currentState!: BaseDinoState

    private feetCollider!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    private headCollider!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)
        this.scene = scene
        this.createSound()
        this.createDino()
        this.setCurrentState(DinoStateEnum.IDLING)
        this.createInput()
    }

    private createInput() {
        this.cursors = this.scene.input.keyboard.createCursorKeys()
    }

    private createSound() {
        this.jumpSound = this.scene.sound.add(DinoAudioKeys.Jump, { volume: 1 })
    }

    private createDino() {
        this.createDinoSprite()
        this.addDinoPhysicsBody()
        this.createFeetCollider()
        this.createHeadCollider()
    }

    private createDinoSprite() {
        this.dino = this.scene.add
            .sprite(0, 0, DinoTextureKeys.Dino)
            .setOrigin(0, 0)
            .play(DinoAnimationKeys.DinoIdle)
            .setDepth(1)
        this.add(this.dino)
    }

    private addDinoPhysicsBody() {
        this.scene.physics.add.existing(this)
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setSize(88, 92)
        body.setOffset(0, 92)
    }

    // utils

    public playAnimation(key: DinoAnimationKeys) {
        this.dino.play(key, true)
    }

    public kill() {
        this.setCurrentState(DinoStateEnum.DEAD)
    }

    public onGround() {
        return (this.body as Phaser.Physics.Arcade.Body).blocked.down
    }

    public isMovingRight() {
        return (this.body as Phaser.Physics.Arcade.Body).velocity.x > 0
    }

    private changeBodyIdleRun() {
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setSize(88, 92)
        body.offset.y = 0
    }

    // state management

    // handleInput() {
    //     if (cursors.down?.isDown) {
    //         this.state.ducking()
    //     }

    //     if (cursor.space?.isDown) {
    //         this.state.jump()
    //     }
    // }

    public idle() {
        this.changeBodyIdleRun()
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
        this.changeBodyIdleRun()
        this.dino.play(DinoAnimationKeys.DinoRun, true)
    }

    public dead() {
        // this.dino.play(DinoAnimationKeys.DinoHurt, true)

        const body = this.body as Phaser.Physics.Arcade.Body
        const headBody = this.headCollider.body as Phaser.Physics.Arcade.Body
        const feetBody = this.feetCollider.body as Phaser.Physics.Arcade.Body

        body.position.x = feetBody.position.x - 15
        body.position.y = headBody.position.y - 2
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

    preUpdate() {
        this.currentState.handleInput(this.cursors)
        console.log(this.currentState.state)

        this.updateFeetColliderPosition()
        this.updateHeadColliderPosition()
    }

    private createFeetCollider() {
        this.feetCollider = this.scene.physics.add.sprite(0, 0, "").setVisible(false).setOrigin(0, 0).setImmovable()
        this.feetCollider.body.setCircle(20)
        this.feetCollider.body.setCollideWorldBounds(true)
        this.scene.physics.add.existing(this.feetCollider, true)
    }

    private updateFeetColliderPosition() {
        const body = this.body as Phaser.Physics.Arcade.Body
        this.feetCollider.setPosition(
            body.position.x + 15,
            body.position.y + body.height - 2 * this.feetCollider.body.radius
        )
    }

    public getFeetCollider() {
        return this.feetCollider
    }

    private createHeadCollider() {
        this.headCollider = this.scene.physics.add.sprite(0, 0, "").setVisible(false).setOrigin(0, 0).setImmovable()
        this.headCollider.body.setSize(44, 30)
        this.headCollider.body.setCollideWorldBounds(true)
        this.scene.physics.add.existing(this.headCollider, true)
    }

    private updateHeadColliderPosition() {
        const body = this.body as Phaser.Physics.Arcade.Body
        this.headCollider.setPosition(
            body.position.x + (body.width - this.headCollider.body.width) + 5,
            body.position.y + 2
        )
    }

    public getHeadCollider() {
        return this.headCollider
    }
}
