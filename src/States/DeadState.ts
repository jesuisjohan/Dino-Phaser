import Phaser from "phaser"
import DinoStateEnum from "~/consts/DinoStateEnum"
import DinoState from "./DinoState"
import Dino from "~/objects/Dino"

export default class DeadState extends DinoState {
    private dino: Dino
    constructor(dino: Dino) {
        super("DEAD")
        this.dino = dino
    }

    public override enter() {
        this.dino.dead()
    }
}
