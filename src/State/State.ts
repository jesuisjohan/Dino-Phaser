import Phaser from "phaser"
import Dino from "~/objects/Dino"

export enum DinoState {
    IDLE,
    RUN,
    JUMP,
    DUCK,
    DEAD,
}

export default class State {
    state: DinoState

    constructor(state: DinoState) {
        this.state = state
    }

    enter() {}

    handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {}
}

export class Idle extends State {
    dino: Dino
    constructor(dino: Dino) {
        super(DinoState.IDLE)
        this.dino = dino
    }

    override enter(): void {}
}

export class Jump extends State {
    dino: Dino
    constructor(dino: Dino) {
        super(DinoState.JUMP)
        this.dino = dino
    }

    override enter(): void {}

    override handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        if (cursors.space?.isDown || cursors.up?.isDown) {
            this.dino.setCurrentState(DinoState.JUMP)
        }
    }
}

export class Run extends State {
    dino: Dino
    constructor(dino: Dino) {
        super(DinoState.RUN)
        this.dino = dino
    }

    override enter(): void {}

    override handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {

    }
}

export class Duck extends State {
    dino: Dino
    constructor(dino: Dino) {
        super(DinoState.DUCK)
        this.dino = dino
    }

    override enter(): void {}

    override handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        if (cursors.down?.isDown) {
            this.dino.setCurrentState(DinoState.DUCK)
        }
    }
}

export class Dead extends State {
    dino: Dino
    constructor(dino: Dino) {
        super(DinoState.DEAD)
        this.dino = dino
    }

    override enter() {}
}
