import Phaser from "phaser";
import TextureKeys from "~/consts/TextureKey";
import SceneKeys from "~/consts/SceneKeys";
export default class Preloader extends Phaser.Scene {
    constructor() {
        super(SceneKeys.Preloader);
    }

    preload() {
        // the background
        this.load.image(TextureKeys.Background, "house/bg_repeat_340x640.png");

        // the mouse hole
        this.load.image(TextureKeys.MouseHole, "house/object_mousehole.png");

        // the sprite sheet
        this.load.atlas(TextureKeys.RocketMouse, "characters/rocket-mouse.png", "characters/rocket-mouse.json");
    }

    create() {
        this.scene.start(SceneKeys.Game);
    }
}
