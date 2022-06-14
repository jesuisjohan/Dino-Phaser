import Phaser from "phaser"
import DinoAnimationKeys from "~/consts/DinoAnimationKeys"
import DinoAudioKeys from "~/consts/DinoAudioKeys"
import DinoTextureKeys from "~/consts/DinoTextureKeys"

enum DinoState {
    Idle,
    Run,
    Jump,
    Duck,
    Dead,
}

export default class Dino extends Phaser.GameObjects.Container {
    private dino!: Phaser.GameObjects.Sprite
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private dinoState = DinoState.Idle
    private jumpSound!: Phaser.Sound.BaseSound
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y)
        // this.dino = scene.physics.add
        //     .sprite(0, 0, DinoTextureKeys.Dino)
        //     .play(DinoAnimationKeys.DinoIdle)
        //     .setCollideWorldBounds(true)
        //     .setGravityY(5000)
        //     .setBodySize(88, 92)
        //     .setDepth(1)
        //     .setOrigin(0, 1)

        this.jumpSound = scene.sound.add(DinoAudioKeys.Jump, { volume: 1 })
        this.dino = scene.add.sprite(0, 0, DinoTextureKeys.Dino).setOrigin(0, 0).play(DinoAnimationKeys.DinoIdle).setDepth(1)

        this.add(this.dino)

        scene.physics.add.existing(this)
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(88, 92)
        body.setOffset(0, 92)
        this.cursors = scene.input.keyboard.createCursorKeys()
    }

    playAnimation(key: DinoAnimationKeys) {
        this.dino.play(key, true)
    }

    public pressSpace() {
        const body = this.body as Phaser.Physics.Arcade.Body
        if (this.cursors.space?.isDown || this.cursors.up?.isDown) {
            this.jumpSound.play()
            body.setVelocityY(-1600)
        }
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

        switch (this.dinoState) {
            case DinoState.Idle: {
                break
            }
            case DinoState.Run: {
                break
            }
            case DinoState.Jump: {
                break
            }
            case DinoState.Duck: {
                break
            }
            case DinoState.Dead: {
                break
            }
        }
    }
}
