import Phaser from "phaser";
import SceneKeys from "~/consts/SceneKeys";

export default class DinoGame extends Phaser.Scene {
    constructor() {
        super(SceneKeys.Game);
    }

    create() {
        const {width, height} = this.scale
    }

    update() {
        
    }
}
