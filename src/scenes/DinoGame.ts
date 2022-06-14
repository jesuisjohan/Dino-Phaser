import DinoAnimationKeys from "~/consts/DinoAnimationKeys"
import Phaser from "phaser"
import DinoSceneKeys from "~/consts/DinoSceneKeys"
import DinoAudioKeys from "~/consts/DinoAudioKeys"
import DinoTextureKeys from "~/consts/DinoTextureKeys"



export default class DinoGame extends Phaser.Scene {
    // audio
    private jumpSound!: Phaser.Sound.BaseSound
    private hitSound!: Phaser.Sound.BaseSound
    private reachSound!: Phaser.Sound.BaseSound
    private bgm!: Phaser.Sound.BaseSound
    private endSound!: Phaser.Sound.BaseSound

    private ground!: Phaser.GameObjects.TileSprite
    private dino!: Phaser.GameObjects.Sprite
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

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    constructor() {
        super(DinoSceneKeys.Game)
    }

    init() {
        this.physics.resume()
        // this.obstacles.clear(true, true)
        this.anims.resumeAll()
        this.hasHitSoundPlayed = false
    }

    create() {
        this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, this.scale.height - 1)
        this.cursors = this.input.keyboard.createCursorKeys()
        this.createSounds()
        this.createGround()
        this.createDino()
        this.createStartTrigger()
        this.createClouds()
        this.createObstacles()
        this.createUI()
    }

    private createSounds() {
        this.jumpSound = this.sound.add(DinoAudioKeys.Jump, { volume: 1 })
        this.hitSound = this.sound.add(DinoAudioKeys.Hit, { volume: 1 })
        this.reachSound = this.sound.add(DinoAudioKeys.Reach, { volume: 1 })
        this.bgm = this.sound.add(DinoAudioKeys.Loop, { volume: 0.2 })
        this.bgm.play()
        this.endSound = this.sound.add(DinoAudioKeys.End, { volume: 0.2 })
    }

    private createGround() {
        const { height } = this.scale
        this.ground = this.add.tileSprite(0, height, 88, 26, DinoTextureKeys.Ground).setOrigin(0, 1)
    }

    private createDino() {
        const { height } = this.scale
        this.dino = this.physics.add
            .sprite(20, height, DinoTextureKeys.Dino)
            .play(DinoAnimationKeys.DinoIdle)
            .setCollideWorldBounds(true)
            .setGravityY(5000)
            .setBodySize(88, 92)
            .setDepth(1)
            .setOrigin(0, 1)
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
        this.physics.add.collider(this.dino, this.obstacles, this.handleLose, undefined, this)
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

    private createUI() {
        this.createScoreLabel()
        this.createHighScoreLabel()
    }

    private createStartTrigger() {
        this.startTrigger = this.physics.add.sprite(1, 10, "").setOrigin(0, 0).setImmovable().setVisible(false)
        this.physics.add.overlap(this.dino, this.startTrigger, this.handleStart, undefined, this)
    }

    /**
     * Turn off start trigger when start the game
     * @returns None
     */
    private handleStart() {
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
                this.dino.play(DinoAnimationKeys.DinoRun, true)
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

    private pressSpace2Start() {
        const body = this.dino.body as Phaser.Physics.Arcade.Body
        if (this.cursors.space?.isDown || this.cursors.up?.isDown) {
            this.jumpSound.play()
            body.setVelocityY(-1600)
        }
    }

    private handleLose() {
        this.highScoreLabel.x = this.scoreLabel.x - this.scoreLabel.width - 20
        const highScoreKey = "high-score"
        const localHighScore = localStorage.getItem(highScoreKey)
        if (!localHighScore || this.score > Number(localHighScore)) {
            localStorage.setItem(highScoreKey, this.score.toString())
        }
        const highScore = Number(localStorage.getItem(highScoreKey))
        this.highScoreLabel.setText(this.zerosPaddingScore(highScore, 5))
        this.highScoreLabel.setAlpha(1)
        this.physics.pause
        this.isGameRunning = false
        this.anims.pauseAll()
        this.dino.play(DinoAnimationKeys.DinoHurt, true)
        this.respawnTime = 0
        this.gameSpeed = 5
        this.score = 0
        if (!this.hitSound.isPlaying && !this.hasHitSoundPlayed) {
            this.hitSound.play()
            this.hasHitSoundPlayed = true
            this.bgm.stop()
            setTimeout(() => {
                this.endSound.play()
            }, 1000)
        }
        this.scene.run(DinoSceneKeys.GameOver)
    }

    private handleInputs() {
        const body = this.dino.body as Phaser.Physics.Arcade.Body
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
            if (this.highScoreLabel.alpha == 0) this.pressSpace2Start()
            return
        }
        this.ground.tilePositionX += this.gameSpeed
        this.handleInputs()
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
