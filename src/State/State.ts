import Phaser from "phaser"
import Dino from "~/objects/Dino"

export enum DinoStateEnum {
    IDLING,
    RUNNING,
    JUMPING,
    DUCKING,
    DEAD,
}

export default class DinoState {
    state: string

    constructor(state: string) {
        this.state = state
    }

    enter() {}

    handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {}
}

export class Idling extends DinoState {
    dino: Dino
    constructor(dino: Dino) {
        super("IDLING")
        this.dino = dino
    }

    override enter(): void {
        this.dino.idle()
    }

    override handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        if (cursors.space?.isDown || cursors.up?.isDown) {
            this.dino.setCurrentState(DinoStateEnum.JUMPING)
        }
    }
}

export class Jumping extends DinoState {
    dino: Dino
    constructor(dino: Dino) {
        super("JUMPING")
        this.dino = dino
    }

    override enter(): void {
        this.dino.jump()
    }

    override handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        if (cursors.down?.isDown) {
            this.dino.setCurrentState(DinoStateEnum.DUCKING)
        } else if (this.dino.onGround()) {
            this.dino.setCurrentState(DinoStateEnum.RUNNING)
        }
    }
}

export class Running extends DinoState {
    dino: Dino
    constructor(dino: Dino) {
        super("RUNNING")
        this.dino = dino
    }

    override enter(): void {
        this.dino.run()
    }

    override handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        if (cursors.down?.isDown) {
            this.dino.setCurrentState(DinoStateEnum.DUCKING)
        } else if ((cursors.space?.isDown || cursors.up?.isDown) && this.dino.onGround()) {
            this.dino.setCurrentState(DinoStateEnum.JUMPING)
        }
    }
}

export class Ducking extends DinoState {
    dino: Dino
    constructor(dino: Dino) {
        super("DUCKING")
        this.dino = dino
    }

    override enter(): void {
        this.dino.duck()
    }

    override handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
        if (cursors.down?.isUp) {
            this.dino.setCurrentState(DinoStateEnum.RUNNING)
        }
    }
}

export class Dead extends DinoState {
    dino: Dino
    constructor(dino: Dino) {
        super("DEAD")
        this.dino = dino
    }

    override enter() {
        this.dino.dead()
    }
}
