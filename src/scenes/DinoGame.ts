import DinoAnimationKeys from "~/consts/DinoAnimationKeys"
import Phaser from "phaser"
import DinoSceneKeys from "~/consts/DinoSceneKeys"
import DinoAudioKeys from "~/consts/DinoAudioKeys"
import DinoTextureKeys from "~/consts/DinoTextureKeys"
import Dino from "~/objects/Dino"

export default class DinoGame extends Phaser.Scene {
    // audio
    private hitSound!: Phaser.Sound.BaseSound
    private reachSound!: Phaser.Sound.BaseSound
    private bgm!: Phaser.Sound.BaseSound
    private endSound!: Phaser.Sound.BaseSound

    private ground!: Phaser.GameObjects.TileSprite
    private dino!: Dino
    private startTrigger!: Phaser.GameObjects.Sprite
    private clouds!: Phaser.GameObjects.Group
    private obstacles!: Phaser.Physics.Arcade.Group

    private scoreLabel!: Phaser.GameObjects.Text
    private highScoreLabel!: Phaser.GameObjects.Text

    private score = 0
    private gameSpeed = 5
    private isGameRunning = false
    private respawnTime = 0
    private hasHitSoundPlayed = false

    constructor() {
        super(DinoSceneKeys.Game)
    }

    init() {
        this.physics.resume()
        this.anims.resumeAll()
        this.hasHitSoundPlayed = false
    }

    create() {
        this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, this.scale.height - 1)
        this.createSounds()
        this.createClouds()
        this.createGround()
        this.createDino()
        this.createStartTrigger()
        this.createObstacles()
        this.createUI()
    }

    private createSounds() {
        this.hitSound = this.sound.add(DinoAudioKeys.Hit, { volume: 1 })
        this.reachSound = this.sound.add(DinoAudioKeys.Reach, { volume: 1 })
        this.bgm = this.sound.add(DinoAudioKeys.Loop, { volume: 0.2 })
        this.endSound = this.sound.add(DinoAudioKeys.End, { volume: 0.2 })

        this.bgm.play()
    }

    private createGround() {
        const { height } = this.scale
        this.ground = this.add.tileSprite(0, height, 88, 26, DinoTextureKeys.Ground).setOrigin(0, 1)
    }

    private createDino() {
        const { height } = this.scale
        this.dino = new Dino(this, 20, height)
        this.add.existing(this.dino)
        const body = this.dino.body as Phaser.Physics.Arcade.Body
        body.setCollideWorldBounds(true)
        body.setGravityY(5000)
    }

    private createClouds() {
        const { width } = this.scale
        this.clouds = this.add.group()
        this.clouds.addMultiple([
            this.add.image(width / 2, 170, DinoTextureKeys.Cloud),
            this.add.image(width - 80, 80, DinoTextureKeys.Cloud),
            this.add.image(width / 1.3, 100, DinoTextureKeys.Cloud),
        ])
        this.clouds.setAlpha(0)
    }

    private createObstacles() {
        this.obstacles = this.physics.add.group()
        this.physics.add.collider(this.obstacles, this.dino, this.handleLose, undefined, this)
    }

    private createUI() {
        this.createScoreLabel()
        this.createHighScoreLabel()
    }

    private createScoreLabel() {
        const { width } = this.scale
        this.scoreLabel = this.add
            .text(width, 0, "00000", {
                color: "#535353",
                font: "900 35px Courier",
                resolution: 5,
            })
            .setOrigin(1, 0)
            .setAlpha(1)
        this.handleScore()
    }

    private createHighScoreLabel() {
        this.highScoreLabel = this.add
            .text(0, 0, "00000", {
                color: "#535353",
                font: "900 35px Courier",
                resolution: 5,
            })
            .setOrigin(1, 0)
            .setAlpha(0)
    }

    private createStartTrigger() {
        this.startTrigger = this.physics.add.sprite(1, 10, "").setOrigin(0, 0).setImmovable().setVisible(false)
        this.physics.add.overlap(this.startTrigger, this.dino, this.handleStart, undefined, this)
    }

    /**
     * Turn off start trigger when start the game
     * @returns None
     */
    private handleStart(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        console.log("handleStart")
        const { width, height } = this.scale
        const startTriggerBody = this.startTrigger.body as Phaser.Physics.Arcade.Body
        if (this.startTrigger.y == 10) {
            this.startTrigger.setOrigin(0, 1)
            startTriggerBody.reset(0, height) // bring trigger start to foot of dino for else branch
            return
        }
        // dino step on the trigger for a second time, so start the game
        this.startTrigger.setActive(false)
        const body = this.dino.body as Phaser.Physics.Arcade.Body

        const startEvent = this.time.addEvent({
            delay: 1000 / 60,
            loop: true,
            callbackScope: this,
            callback: () => {
                body.setVelocityX(80)
                if (this.ground.width < width) this.ground.width += 5
                if (this.ground.width >= 1000) {
                    this.ground.width = width
                    this.isGameRunning = true
                    body.setVelocityX(0)
                    this.clouds.setAlpha(1)
                    startEvent.remove()
                }
            },
        })
    }

    private getHighScore() {
        const highScoreKey = "high-score"
        const localHighScore = localStorage.getItem(highScoreKey)
        if (!localHighScore || this.score > Number(localHighScore))
            localStorage.setItem(highScoreKey, this.score.toString())
        return Number(localStorage.getItem(highScoreKey))
    }

    private handleLose() {
        this.highScoreLabel.x = this.scoreLabel.x - this.scoreLabel.width - 20
        this.highScoreLabel.setText(this.zerosPaddingScore(this.getHighScore(), 5))
        this.highScoreLabel.setAlpha(1)
        this.physics.pause()
        this.isGameRunning = false
        this.anims.pauseAll()
        this.dino.kill()
        this.respawnTime = 0
        this.gameSpeed = 5
        this.score = 0
        if (!this.hitSound.isPlaying && !this.hasHitSoundPlayed) {
            this.hitSound.play()
            this.hasHitSoundPlayed = true
            this.bgm.stop()
            if (this.hitSound.isPlaying) this.endSound.play()
        }
        this.scene.run(DinoSceneKeys.GameOver)
    }

    private handleScore() {
        this.time.addEvent({
            delay: 1000 / 10,
            loop: true,
            callbackScope: this,
            callback: () => {
                if (!this.isGameRunning) return
                this.score++
                this.gameSpeed += 0.01
                if (this.score % 100 == 0) {
                    this.reachSound.play()
                    this.runScoreBlinkAnimation()
                }
                if (this.score % 500) {
                }
                this.scoreLabel.setText(this.zerosPaddingScore(this.score, 5))
            },
        })
    }

    private zerosPaddingScore(score: number, width: number) {
        const numArr = Array.from(score.toString(), Number)
        for (let i = 0; i < width - score.toString().length; i++) numArr.unshift(0)
        return numArr.join("")
    }

    private runScoreBlinkAnimation() {
        this.tweens.add({ targets: this.scoreLabel, duration: 100, repeat: 3, alpha: 0, yoyo: true })
    }

    /**
     * get random integer
     * @param max not include this max
     * @returns all numbers less than max
     */
    private getRandomInt(max: number) {
        return Math.floor(Math.random() * max)
    }

    private spawnObstacles() {
        const { width, height } = this.scale
        const numObstacles = this.getRandomInt(6) + 1
        const distance = Phaser.Math.Between(100, 300)

        let obstacle: Phaser.Physics.Arcade.Sprite
        if (numObstacles > 5) {
            const enemyHeight = [20, 70, 100]
            obstacle = this.obstacles
                .create(
                    width + distance,
                    height - enemyHeight[this.getRandomInt(enemyHeight.length)],
                    DinoTextureKeys.EnemyBird
                )
                .setOrigin(0, 1)
            obstacle.play(DinoAnimationKeys.EnemyBird, true)
        } else {
            let textureKey: DinoTextureKeys
            let cactusHeight: number
            switch (numObstacles) {
                case 1: {
                    textureKey = DinoTextureKeys.Obstacle1
                    cactusHeight = 70
                    break
                }
                case 2: {
                    textureKey = DinoTextureKeys.Obstacle2
                    cactusHeight = 70
                    break
                }
                case 3: {
                    textureKey = DinoTextureKeys.Obstacle3
                    cactusHeight = 70
                    break
                }
                case 4: {
                    textureKey = DinoTextureKeys.Obstacle4
                    cactusHeight = 96
                    break
                }
                case 5: {
                    textureKey = DinoTextureKeys.Obstacle5
                    cactusHeight = 96
                    break
                }
                case 6: {
                    textureKey = DinoTextureKeys.Obstacle6
                    cactusHeight = 98
                    break
                }
                default: {
                    textureKey = DinoTextureKeys.Obstacle6
                    cactusHeight = 98
                    break
                }
            }
            obstacle = this.obstacles.create(width + distance, height - cactusHeight + 34, textureKey)
        }
        const obstacleBody = obstacle.body as Phaser.Physics.Arcade.Body
        obstacleBody.setImmovable()
    }

    private handleExcessObstacles() {
        this.obstacles.getChildren().forEach((obstacle) => {
            const body = obstacle.body as Phaser.Physics.Arcade.Body
            if (body.enable == false) return
            const rightEdge = body.x + body.width
            if (rightEdge > 0) return
            console.log("killed" + body.x)
            this.obstacles.killAndHide(obstacle)
            body.enable = false
        })
    }

    private wrapClouds() {
        this.clouds.getChildren().forEach((object) => {
            const cloud = object as Phaser.GameObjects.Image
            const rightEdge = cloud.x + cloud.width
            if (rightEdge < 0) {
                const { width, height } = this.scale
                cloud.x = width + 30
            }
        })
    }

    update(t: number, dt: number) {
        if (!this.isGameRunning) {
            return
        }
        // if (this.dinoState === DEAD) return
        if (!this.bgm.isPlaying) this.bgm.play()
        this.ground.tilePositionX += this.gameSpeed
        Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed)
        Phaser.Actions.IncX(this.clouds.getChildren(), -0.5)
        this.respawnTime += dt * this.gameSpeed * 0.05
        if (this.respawnTime >= 1500) {
            this.spawnObstacles()
            this.respawnTime = 0
        }
        this.handleExcessObstacles()
        this.wrapClouds()
    }
}
