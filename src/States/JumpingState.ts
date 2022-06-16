import Phaser from "phaser"
import DinoStateEnum from "~/consts/DinoStateEnum"
import BaseDinoState from "./BaseDinoState"
import Dino from "~/objects/Dino"

export default class JumpingState extends BaseDinoState {
    private dino: Dino
    constructor(dino: Dino) {
        super(DinoStateEnum.JUMPING)
        this.dino = dino
    }

    public override enter(): void {
        this.dino.jump()
    }

    public override handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        if (cursors.down?.isDown) {
            this.dino.setCurrentState(DinoStateEnum.DUCKING)
        } else if (this.dino.onGround()) {
            this.dino.setCurrentState(DinoStateEnum.RUNNING)
        }
    }
}
