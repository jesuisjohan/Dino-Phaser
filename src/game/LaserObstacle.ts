import Phaser from "phaser";
import TextureKeys from "~/consts/TextureKey";

export default class LaserObstacle extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        const top = scene.add.sprite(0, 0, TextureKeys.LaserEnd).setOrigin(0.5, 1);
        // middle is below top
        const middle = scene.add.sprite(0, top.y + top.displayHeight, TextureKeys.LaserMiddle).setOrigin(0.5, 1);
        // change size of middle
        middle.setDisplaySize(middle.width, 200);
        // bottom is flipped top and below middle
        const bottom = scene.add
            .sprite(0, middle.y + middle.displayHeight, TextureKeys.LaserEnd)
            .setOrigin(0.5, 1)
            .setFlipY(true);

        this.add(top);
        this.add(middle);
        this.add(bottom);
    }
}
