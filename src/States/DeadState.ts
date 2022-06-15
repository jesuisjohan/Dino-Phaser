import Phaser from "phaser"
import DinoStateEnum from "~/consts/DinoStateEnum"
import BaseDinoState from "./BaseDinoState"
import Dino from "~/objects/Dino"

export default class DeadState extends BaseDinoState {
    private dino: Dino
    constructor(dino: Dino) {
        super("DEAD")
        this.dino = dino
    }

    public override enter() {
        this.dino.dead()
    }
}
