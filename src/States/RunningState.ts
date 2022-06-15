import Phaser from "phaser"
import DinoStateEnum from "~/consts/DinoStateEnum"
import BaseDinoState from "./BaseDinoState"
import Dino from "~/objects/Dino"

export default class RunningState extends BaseDinoState {
    private dino: Dino
    constructor(dino: Dino) {
        super("RUNNING")
        this.dino = dino
    }

    public override enter(): void {
        this.dino.run()
    }

    // jump() {
    //     this.dino.jump()
    // }

    // ducking() {
    //     this.dino.duck();
    // }

    public override handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        if (cursors.down?.isDown) {
            this.dino.setCurrentState(DinoStateEnum.DUCKING)
        } else if (cursors.space?.isDown || cursors.up?.isDown) {
            this.dino.setCurrentState(DinoStateEnum.JUMPING)
        }
    }
}
