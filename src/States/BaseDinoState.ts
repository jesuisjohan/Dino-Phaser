import Phaser from "phaser"

export default class BaseDinoState {
    state: string

    constructor(state: string) {
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
