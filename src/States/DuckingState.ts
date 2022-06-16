import Phaser from "phaser"
import DinoStateEnum from "~/consts/DinoStateEnum"
import BaseDinoState from "./BaseDinoState"
import Dino from "~/objects/Dino"

export default class DuckingState extends BaseDinoState {
    private dino: Dino
    constructor(dino: Dino) {
        super(DinoStateEnum.DUCKING)
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
