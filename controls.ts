import Brain from "./brain";

export type ControlsType = "manual" | "ai" | "npc";

class Controls {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    controlsType: ControlsType;
    brain: Brain | null = null;

    constructor(controlsType: ControlsType, brain: Brain | null = null) {
        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;
        this.controlsType = controlsType;
        switch (controlsType) {
            case "npc": {
                this.forward = true;
            } break;
            case "manual": {
                this.addKeyboardListener();
            } break;
            case "ai": {
                this.brain = brain;
            } break;
        }
    }

    update() {
        if (!(this.controlsType === "ai")) return;
        this.forward = this.brain?.output?.[0] ?? false;
        this.backward = this.brain?.output?.[1] ?? false;
        this.left = this.brain?.output?.[2] ?? false;
        this.right = this.brain?.output?.[3] ?? false;
    }

    private addKeyboardListener() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft": this.left = true; break;
                case "ArrowRight": this.right = true; break;
                case "ArrowUp": this.forward = true; break;
                case "ArrowDown": this.backward = true; break;
            }
        };

        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowLeft": this.left = false; break;
                case "ArrowRight": this.right = false; break;
                case "ArrowUp": this.forward = false; break;
                case "ArrowDown": this.backward = false; break;
            }
        };

    }
}

export default Controls;