import Phaser from "phaser";
import SceneKeys from "~/consts/SceneKeys";
import AnimationKey from "~/consts/AnimationKey";
import TextureKeys from "~/consts/TextureKey";
export default class Game extends Phaser.Scene {
    // create background class property
    // Phaser 3's design doesn't let us create a tile sprite in constructor, so use non-null assertion
    private background!: Phaser.GameObjects.TileSprite;

    constructor() {
        super(SceneKeys.Game);
    }

    // no need anymore because of Preloader class

    create() {
        this.anims.create({
            key: AnimationKey.RocketMouseRun, // name of this animation
            frames: this.anims.generateFrameNames("rocket-mouse", {
                start: 1,
                end: 4,
                prefix: "rocketmouse_run",
                zeroPad: 2, // necessary if more than 9 frames
                suffix: ".png",
            }),
            frameRate: 10,
            repeat: -1, // -1 to loop forever
        });

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


        const mouse = this.physics.add // add physic to the above code and store it into a constant
            .sprite(
                // (0, 0)   is top left
                // (1, 1)   is the bottom right
                // (0.5, 1) is bottom middle where the feet are
                width * 0.5,
                height - 30, // set y to top of the floor instead of mid-air
                TextureKeys.RocketMouse,
                "rocketmouse_fly01.png"
            )
            .setOrigin(0.5, 1) // set origin to feet
            .play(AnimationKey.RocketMouseRun);

        // mouse.body can be static or not, type casting helps VS Code give us accurate autocomplete
        const body = mouse.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true); // body will collide with world bound set on the next line
        // set the x velocity to 200 to make mouse move right as soon as he is create
        body.setVelocityX(200);
        this.physics.world.setBounds(
            0, // x
            0, // y
            Number.MAX_SAFE_INTEGER, // width - computer memory is finite, so max integer is enough
            height - 30 // height - make mouse middle of the floor
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
    }
    /**
     * update function
     * @param t time
     * @param dt deltaTime
     */
    update(t: number, dt: number) {
        // scroll the background based on camera' scrollX
        this.background.setTilePosition(this.cameras.main.scrollX);
    }


}
