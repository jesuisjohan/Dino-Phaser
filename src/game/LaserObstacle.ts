import Phaser from "phaser";
import TextureKeys from "~/consts/TextureKey";

export default class LaserObstacle extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        const top = scene.add.image(0, 0, TextureKeys.LaserEnd).setOrigin(0.5, 0);
        // middle is below top
        const middle = scene.add.image(0, top.y + top.displayHeight, TextureKeys.LaserMiddle).setOrigin(0.5, 0);
        // change size of middle
        middle.setDisplaySize(middle.width, 200);
        // bottom is flipped top and below middle
        const bottom = scene.add
            .image(0, middle.y + middle.displayHeight, TextureKeys.LaserEnd)
            .setOrigin(0.5, 0)
            .setFlipY(true)

        this.add(top);
        this.add(middle);
        this.add(bottom);

        scene.physics.add.existing(this, true)
        const body = this.body as Phaser.Physics.Arcade.StaticBody // will not be moved or pushed
        const width = top.displayWidth
        const height = top.displayHeight + middle.displayHeight + bottom.displayHeight
        body.setSize(width, height)
        body.setOffset(-width * 0.5, 0)
        body.position.x = this.x + body.offset.x
        body.position.y = this.y
    }
}
