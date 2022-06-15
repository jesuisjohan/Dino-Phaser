import Phaser from "phaser"
import DinoStateEnum from "~/consts/DinoStateEnum"
import DinoState from "./DinoState"
import Dino from "~/objects/Dino"

export default class DuckingState extends DinoState {
    private dino: Dino
    constructor(dino: Dino) {
        super("DUCKING")
        this.dino = dino
    }

    public override enter(): void {
        this.dino.duck()
    }

    // jump() {
    //     //
    // }

    // ducking() {
    //     //
    // }

    public override handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        if (cursors.down?.isUp) {
            this.dino.setCurrentState(DinoStateEnum.RUNNING)
        }
    }
}
