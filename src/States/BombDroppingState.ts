import Phaser from "phaser"
import DinoStateEnum from "~/consts/DinoStateEnum"
import BaseDinoState from "./BaseDinoState"
import Dino from "~/objects/Dino"

export default class BombDroppingState extends BaseDinoState {
    private dino: Dino
    constructor(dino: Dino) {
        super(DinoStateEnum.BOMB_DROPPING)
        this.dino = dino
    }

    public override enter(): void {}

    public override handleInput(): void {}
}
