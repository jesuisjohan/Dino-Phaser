import Phaser from "phaser";
import SceneKeys from "~/consts/SceneKeys";
import AnimationKeys from "~/consts/AnimationKeys";
import TextureKeys from "~/consts/TextureKey";
import RocketMouse from "~/game/RocketMouse";
import LaserObstacle from "~/game/LaserObstacle";
import eventsCenter from "~/events/EventsCenter";

export default class Game extends Phaser.Scene {
    // create background class property
    // Phaser 3's design doesn't let us create a tile sprite in constructor, so use non-null assertion
    private background!: Phaser.GameObjects.TileSprite;

    private mouseHole!: Phaser.GameObjects.Image;

    private window1!: Phaser.GameObjects.Image;
    private window2!: Phaser.GameObjects.Image;

    private bookcase1!: Phaser.GameObjects.Image;
    private bookcase2!: Phaser.GameObjects.Image;

    private laserObstacle!: LaserObstacle;

    private bookcases: Phaser.GameObjects.Image[] = []; // for checking overlapping
    private windows: Phaser.GameObjects.Image[] = []; // for checking overlapping

    private coins!: Phaser.Physics.Arcade.StaticGroup;

    private scoreLabel!: Phaser.GameObjects.Text;
    private score = 0;

    constructor() {
        super(SceneKeys.Game);
    }

    /**
     * init means when restart, init() will be called
     * constructor cannot
     */
    init() {
        this.score = 0;
    }

    // no need anymore because of Preloader class

    create() {
        // this.anims.create({
        //     key: AnimationKeys.RocketMouseRun, // name of this animation
        //     frames: this.anims.generateFrameNames("rocket-mouse", {
        //         start: 1,
        //         end: 4,
        //         prefix: "rocketmouse_run",
        //         zeroPad: 2, // necessary if more than 9 frames
        //         suffix: ".png",
        //     }),
        //     frameRate: 10,
        //     repeat: -1, // -1 to loop forever
        // });

        // +x is to left, -x is to right
        // +y is to top, -y is to bottom

        // this.add.image(0, 0, 'background').setOrigin(0, 0)

        const width = this.scale.width;
        const height = this.scale.height;

        // BACKGROUND SCROLLING

        // store TileSprite in this.background to use it in update
        this.background = this.add
            .tileSprite(0, 0, width, height, TextureKeys.Background)
            .setOrigin(0)
            .setScrollFactor(0, 0); // keep from scrolling

        // image: no animation
        // sprite: has animation

        // this.add
        //     .sprite(
        //         width * 0.5, // middle of screen
        //         height * 0.5,
        //         TextureKeys.RocketMouse, // key given in preload
        //         "rocketmouse_fly01.png"
        //     )
        //     .play(AnimationKey.RocketMouseRun);

        // Create mouse hole here so it will layer properly - after the background & before Rocket Mouse
        this.mouseHole = this.add.image(
            Phaser.Math.Between(900, 1500), // x value
            501, // y value
            TextureKeys.MouseHole
        );

        // Create windows here so it will layer properly - before Rocket Mouse
        this.window1 = this.add.image(Phaser.Math.Between(900, 1300), 200, TextureKeys.Window1);
        this.window2 = this.add.image(Phaser.Math.Between(1600, 2000), 200, TextureKeys.Window2);
        this.windows = [this.window1, this.window2];

        // Create bookcases here so it will layer properly - before Rocket Mouse
        // Set each bookcase's origin to its foot
        this.bookcase1 = this.add.image(Phaser.Math.Between(2200, 2700), 580, TextureKeys.Bookcase1).setOrigin(0.5, 1);
        this.bookcase2 = this.add.image(Phaser.Math.Between(2900, 3400), 580, TextureKeys.Bookcase2).setOrigin(0.5, 1);
        this.bookcases = [this.bookcase1, this.bookcase2];

        // const mouse = this.physics.add // add physic to the above code and store it into a constant
        //     .sprite(
        //         // (0, 0)   is top left
        //         // (1, 1)   is the bottom right
        //         // (0.5, 1) is bottom middle where the feet are
        //         width * 0.5,
        //         height - 30, // set y to top of the floor instead of mid-air
        //         TextureKeys.RocketMouse,
        //         "rocketmouse_fly01.png"
        //     )
        //     .setOrigin(0.5, 1) // set origin to feet
        //     .play(AnimationKey.RocketMouseRun);

        // create laser obstacle

        this.laserObstacle = new LaserObstacle(this, 900, 100);
        this.add.existing(this.laserObstacle);

        // create coins

        this.coins = this.physics.add.staticGroup();
        this.spawnCoins();

        // add new RocketMouse
        // initially, this mouse doesn't have body property -> add physics to Container
        const mouse = new RocketMouse(this, width * 0.5, height - 30);
        this.add.existing(mouse);

        // mouse.body can be static or not, type casting helps VS Code give us accurate autocomplete
        const body = mouse.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true); // body will collide with world bound set on the next line
        // set the x velocity to 200 to make mouse move right as soon as he is create
        body.setVelocityX(200);
        this.physics.world.setBounds(
            0, // x
            0, // y
            Number.MAX_SAFE_INTEGER, // width - computer memory is finite, so max integer is enough
            height - 55 // height - make mouse middle of the floor
        );

        // CAMERA

        // camera follows mouse
        this.cameras.main.startFollow(mouse);
        this.cameras.main.setBounds(
            0,
            0,
            Number.MAX_SAFE_INTEGER, // upper bound
            height // lower bound
        );

        // just like onCollisionEnter on Unity
        this.physics.add.overlap(this.laserObstacle, mouse, this.handleOverlapLaser, undefined, this);
        this.physics.add.overlap(this.coins, mouse, this.handleCollectCoin, undefined, this);

        this.scoreLabel = this.add
            .text(10, 10, `Score: ${this.score}`, {
                fontSize: "24px",
                color: "#080808",
                backgroundColor: "#F8E71C",
                shadow: { fill: true, blur: 0, offsetY: 0 },
                padding: { left: 15, right: 15, top: 10, bottom: 10 },
            })
            .setScrollFactor(0);

        this.listenMouseDead();
        this.listenRestart();
    }
    /**
     * update function
     * @param t time
     * @param dt deltaTime
     */
    update(t: number, dt: number) {
        // this.checkIfMouseDead()

        this.wrapMouseHole();
        this.wrapWindows();
        this.wrapBookcases();
        this.wrapLaserObstacle();
        // scroll the background based on camera' scrollX
        this.background.setTilePosition(this.cameras.main.scrollX);
    }

    // determine when the mouseHole scrolls off the left side of the screen
    // and give it a new position ahead of Rocket Mouse
    private wrapMouseHole() {
        const scrollX = this.cameras.main.scrollX;
        // right side of the screen
        const rightEdge = scrollX + this.scale.width;

        // check when the mouse hole has scroll of the left side of the screen
        if (this.mouseHole.x + this.mouseHole.width < scrollX) {
            // 100 - 1000 px past the right side of the screen
            this.mouseHole.x = Phaser.Math.Between(rightEdge + 100, rightEdge + 1000);
        }
    }

    private wrapWindows() {
        const scrollX = this.cameras.main.scrollX;
        // right side of the screen
        const rightEdge = scrollX + this.scale.width;

        let width = this.window1.width * 2;
        if (this.window1.x + width < scrollX) {
            this.window1.x = Phaser.Math.Between(rightEdge + width, rightEdge + width + 800);

            // look for a bookcase that overlaps with the new window position
            /**
             * any distance smaller than the width of the window is considered an overlap
             */
            const overlap = this.bookcases.find((bookcase) => {
                return Math.abs(this.window1.x - bookcase.x) <= this.window1.width;
            });

            // if no overlap, set visible to true, else false
            this.window1.visible = !overlap;
        }
        width = this.window2.width;
        if (this.window2.x + width < scrollX) {
            this.window2.x = Phaser.Math.Between(this.window1.x + width, this.window1.x + width + 800);

            // similar to above
            const overlap = this.bookcases.find((bookcase) => {
                return Math.abs(this.window2.x - bookcase.x) <= this.window2.width;
            });

            this.window2.visible = !overlap;
        }
    }

    private wrapBookcases() {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        let width = this.bookcase1.width * 2;
        if (this.bookcase1.x + width < scrollX) {
            this.bookcase1.x = Phaser.Math.Between(rightEdge + width, rightEdge + 800);

            const overlap = this.windows.find((window) => {
                // use window width because window width is greater than bookcase width
                return Math.abs(this.bookcase1.x - window.x) <= window.width;
            });

            this.bookcase1.visible = !overlap;
        }
        width = this.bookcase1.width;
        if (this.bookcase2.x + width < scrollX) {
            this.bookcase2.x = Phaser.Math.Between(this.bookcase1.x + width, this.bookcase1.x + width + 800);

            const overlap = this.windows.find((window) => {
                // use window width because window width is greater than bookcase width
                return Math.abs(this.bookcase2.x - window.x) <= window.width;
            });

            this.bookcase2.visible = !overlap;
        }
    }

    private wrapLaserObstacle() {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        // because body is static, so have to update it
        const body = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody;
        const width = this.laserObstacle.width;
        if (this.laserObstacle.x + width < scrollX) {
            this.laserObstacle.x = Phaser.Math.Between(rightEdge + width, rightEdge + width + 1000);
            this.laserObstacle.y = Phaser.Math.Between(0, 300);

            body.position.x = this.laserObstacle.x + body.offset.x;
            body.position.y = this.laserObstacle.y;
        }
    }

    private handleOverlapLaser(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        console.log("overlap");
        const mouse = obj2 as RocketMouse;
        mouse.kill();
        this.game;
    }

    // using event
    private listenMouseDead() {
        eventsCenter.once("dead", () => {
            this.scene.run(SceneKeys.GameOver);
        });
    }

    private listenRestart() {
        eventsCenter.once("gameOver", () => {
            this.scene.stop(SceneKeys.GameOver);
            this.scene.restart();
        });
    }

    spawnCoins() {
        // make sure all coins are inactive and hidden
        this.coins.children.each((child) => {
            const coin = child as Phaser.Physics.Arcade.Sprite;
            this.coins.killAndHide(coin);
            coin.body.enable = false;
        });

        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        // start at 100 px past right side of the screen
        let x = rightEdge + 100;

        const numCoins = Phaser.Math.Between(1, 20);

        // the coins based on random number from 1-20
        for (let i = 0; i < numCoins; i++) {
            const coin = this.coins.get(
                x,
                Phaser.Math.Between(100, this.scale.height - 100),
                TextureKeys.Coin
            ) as Phaser.Physics.Arcade.Sprite;

            // make sure coin is active and visible
            coin.setVisible(true);
            coin.setActive(true);

            // enable and adjust physics body to be a circle
            const body = coin.body as Phaser.Physics.Arcade.StaticBody;
            body.setCircle(body.width * 0.5);
            body.enable = true;

            // move x a random amount
            // next coin will be spaced away from the previous one
            x += coin.width * 1.5;
        }
    }

    private handleCollectCoin(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const coin = obj2 as Phaser.Physics.Arcade.Sprite;
        // use the group to hide it
        this.coins.killAndHide(coin);
        // turn off body
        coin.body.enable = false;

        this.score++;
        this.scoreLabel.text = `Score: ${this.score}`;
    }
}
