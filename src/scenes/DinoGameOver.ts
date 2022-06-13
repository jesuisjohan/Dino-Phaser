import Phaser from "phaser";

// import SceneKeys from "~/consts/SceneKeys";
import DinoSceneKeys from "~/consts/DinoSceneKeys";

export default class DinoGameOver extends Phaser.Scene {
    constructor() {
        super(DinoSceneKeys.GameOver)
=======
import SceneKeys from "~/consts/SceneKeys";

export default class DinoGameOver extends Phaser.Scene {
    constructor() {
        super(SceneKeys.Game)

    }

    create() {
        
    }
}
