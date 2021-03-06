import Phaser from "phaser"
import DinoSceneKeys from "~/consts/SceneKeys"
import DinoTextureKeys from "~/consts/TextureKeys"
import DinoAudioKeys from "~/consts/AudioKeys"
import DinoAnimationKeys from "~/consts/AnimationKeys"

export default class DinoPreloader extends Phaser.Scene {
    constructor() {
        super(DinoSceneKeys.Preloader)
    }

    preload() {
        // audio
        this.load.audio(DinoAudioKeys.Reach, "assets/reach.m4a")
        this.load.audio(DinoAudioKeys.Hit, "assets/hit.m4a")
        this.load.audio(DinoAudioKeys.Jump, "assets/jump.m4a")
        this.load.audio(DinoAudioKeys.Intro, "assets/8-bit-music/Separated_Files/And_The_Journey_Begins/Intro.wav")
        this.load.audio(DinoAudioKeys.Loop, "assets/8-bit-music/Separated_Files/And_The_Journey_Begins/Loop.wav")
        this.load.audio(DinoAudioKeys.End, "assets/8-bit-music/Separated_Files/And_The_Journey_Begins/End.wav")

        // images - not obstacles
        this.load.image(DinoTextureKeys.Cloud, "assets/cloud.png")
        this.load.image(DinoTextureKeys.Ground, "assets/ground.png")
        this.load.image(DinoTextureKeys.Restart, "assets/restart.png")
        this.load.image(DinoTextureKeys.GameOver, "assets/game-over.png")
        // images - obstacles
        // small
        this.load.image(DinoTextureKeys.Obstacle1, "assets/cactuses_small_1.png")
        this.load.image(DinoTextureKeys.Obstacle2, "assets/cactuses_small_2.png")
        this.load.image(DinoTextureKeys.Obstacle3, "assets/cactuses_small_3.png")
        // big
        this.load.image(DinoTextureKeys.Obstacle4, "assets/cactuses_big_1.png")
        this.load.image(DinoTextureKeys.Obstacle5, "assets/cactuses_big_2.png")
        this.load.image(DinoTextureKeys.Obstacle6, "assets/cactuses_big_3.png")

        // sprite sheet
        this.load.atlas(DinoTextureKeys.Dino, "assets/dino/dino.png", "assets/dino/dino.json")
        this.load.atlas(
            DinoTextureKeys.EnemyBird,
            "assets/enemy_bird/enemy-bird.png",
            "assets/enemy_bird/enemy-bird.json"
        )
        this.load.atlas(DinoTextureKeys.Moon, "assets/moon/moon.png", "assets/moon/moon.json")
        this.load.atlas(DinoTextureKeys.Stars, "assets/stars/stars.png", "assets/stars/stars.json")
    }

    create() {
        // dino animations

        this.anims.create({
            key: DinoAnimationKeys.DinoIdle,
            frames: [
                {
                    key: DinoTextureKeys.Dino,
                    frame: "dino_idle.png",
                },
            ],
        })

        this.anims.create({
            key: DinoAnimationKeys.DinoHurt,
            frames: [
                {
                    key: DinoTextureKeys.Dino,
                    frame: "dino_hurt.png",
                },
            ],
        })

        this.anims.create({
            key: DinoAnimationKeys.DinoRun,
            frames: this.anims.generateFrameNames(DinoTextureKeys.Dino, {
                start: 3,
                end: 4,
                prefix: "dino_run",
                suffix: ".png",
            }),
            frameRate: 10,
            repeat: -1,
        })

        this.anims.create({
            key: DinoAnimationKeys.DinoDown,
            frames: this.anims.generateFrameNames(DinoTextureKeys.Dino, {
                start: 1,
                end: 2,
                prefix: "dino_down",
                suffix: ".png",
            }),
            frameRate: 10,
            repeat: -1,
        })

        // bird

        this.anims.create({
            key: DinoAnimationKeys.EnemyBird,
            frames: this.anims.generateFrameNames(DinoTextureKeys.EnemyBird, {
                start: 0,
                end: 1,
                prefix: "tile",
                zeroPad: 3,
                suffix: ".png",
            }),
            frameRate: 5,
            repeat: -1,
        })

        // moon

        this.anims.create({
            key: DinoAnimationKeys.Moon,
            frames: this.anims.generateFrameNames(DinoTextureKeys.Moon, {
                start: 0,
                end: 7,
                prefix: "tile",
                zeroPad: 3,
                suffix: ".png",
            }),
            frameRate: 10,
            repeat: -1,
        })

        // stars

        this.anims.create({
            key: DinoAnimationKeys.Stars,
            frames: this.anims.generateFrameNames(DinoTextureKeys.Stars, {
                start: 0,
                end: 2,
                prefix: "tile",
                zeroPad: 3,
                suffix: ".png",
            }),
            frameRate: 10,
            repeat: -1,
        })

        this.scene.start(DinoSceneKeys.Loading)
    }
}
