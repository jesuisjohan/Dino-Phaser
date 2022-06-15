import Phaser from "phaser"
import DinoStateEnum from "~/consts/DinoStateEnum"
import DinoState from "./DinoState"
import Dino from "~/objects/Dino"

export default class BombDroppingState extends DinoState {
    private dino: Dino
    constructor(dino: Dino) {
        super("BOMD-DROPPING")
        this.dino = dino
    }

    public override enter(): void {}

    public override handleInput(): void {}
}
