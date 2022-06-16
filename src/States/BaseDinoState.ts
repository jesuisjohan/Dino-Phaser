import Phaser from "phaser"
import DinoStateEnum from "~/consts/DinoStateEnum"

export default class BaseDinoState {
    state: DinoStateEnum

    constructor(state: DinoStateEnum) {
        this.state = state
    }

    public enter() {}

    // jump() {
    //     //implement
    // }

    // dash() {
    //     //
    // }

    public handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {}
}
