import Phaser from "phaser"
import DinoAnimationKeys from "~/consts/DinoAnimationKeys"
import DinoAudioKeys from "~/consts/DinoAudioKeys"
import DinoTextureKeys from "~/consts/DinoTextureKeys"

export default class Dino extends Phaser.GameObjects.Container {
    private dino!: Phaser.GameObjects.Sprite
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private jumpSound!: Phaser.Sound.BaseSound

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)
        this.jumpSound = scene.sound.add(DinoAudioKeys.Jump, { volume: 1 })
        this.dino = scene.add
            .sprite(0, 0, DinoTextureKeys.Dino)
            .setOrigin(0, 0)
            .play(DinoAnimationKeys.DinoIdle)
            .setDepth(1)
        this.add(this.dino)
        scene.physics.add.existing(this)
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setSize(88, 92)
        body.setOffset(0, 92)
        this.cursors = scene.input.keyboard.createCursorKeys()
    }

    playAnimation(key: DinoAnimationKeys) {
        this.dino.play(key, true)
    }

    public kill() {
        this.dino.play(DinoAnimationKeys.DinoHurt, true)
    }

    preUpdate() {
        const body = this.body as Phaser.Physics.Arcade.Body
        const vy = 1600
        if (this.cursors.down?.isDown) {
            body.setVelocityY(vy)
            this.dino.play(DinoAnimationKeys.DinoDown, true)
            body.setSize(118, 58)
            body.offset.y = 34
        } else if (this.cursors.space?.isDown || this.cursors.up?.isDown) {
            if (!body.blocked.down || body.velocity.x > 0 || this.cursors.down.isDown) return
            this.jumpSound.play()
            body.setVelocityY(-vy)
            this.dino.anims.stop()
        } else {
            this.dino.play(DinoAnimationKeys.DinoRun, true)
            body.setSize(88, 92)
            body.offset.y = 0
        }
    }
}
