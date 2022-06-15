import Phaser from "phaser"
import Dino from "~/objects/Dino"

enum DinoState {
    IDLE,
    RUN,
    JUMP,
    DUCK,
    DEAD,
}

interface IEnterable {
    enter(): void
}

interface IInputManageable {
    handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void
}

class State {
    state: DinoState

    constructor(state: DinoState) {
        this.state = state
    }
}

class Idle extends State implements IEnterable, IInputManageable {
    constructor(dino: Dino) {
        super(DinoState.IDLE)
    }

    enter(): void {}

    handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {

    }
}

class Jump extends State implements IEnterable, IInputManageable {
    constructor(dino: Dino) {
        super(DinoState.JUMP)
    }

    enter(): void {}

    handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        
    }
}

class Run extends State implements IEnterable, IInputManageable {
    constructor(dino: Dino) {
        super(DinoState.RUN)
    }

    enter(): void {}

    handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {

    }
}

class Duck extends State implements IEnterable, IInputManageable {
    constructor(dino: Dino) {
        super(DinoState.DUCK)
    }

    enter(): void {}

    handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {

    }
}

class Dead extends State implements IEnterable, IInputManageable {
    constructor(dino: Dino) {
        super(DinoState.DEAD)
    }

    enter() {}

    handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {

    }
}
