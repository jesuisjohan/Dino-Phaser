import Phaser from "phaser"
import DinoStateEnum from "~/consts/DinoStateEnum"
import BaseDinoState from "./BaseDinoState"
import Dino from "~/objects/Dino"

export default class IdlingState extends BaseDinoState {
    private dino: Dino
    constructor(dino: Dino) {
        super("IDLING")
        this.dino = dino
    }

    public override enter(): void {
        this.dino.idle()
    }

    public override handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        if (cursors.space?.isDown || cursors.up?.isDown) {
            this.dino.setCurrentState(DinoStateEnum.JUMPING)
        }
    }
}
