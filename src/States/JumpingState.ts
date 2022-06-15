import Phaser from "phaser"
import DinoStateEnum from "~/consts/DinoStateEnum"
import DinoState from "./DinoState"
import Dino from "~/objects/Dino"

export default class JumpingState extends DinoState {
    private dino: Dino
    constructor(dino: Dino) {
        super("JUMPING")
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
