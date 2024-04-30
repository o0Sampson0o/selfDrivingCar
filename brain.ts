import Level from "./level"

class Brain {
    levelCount: number;
    levels: Level[];
    constructor(levelsNeuronCount: number[], brain?: Brain, mutation?: number) {
        if (brain) {
            this.levels = brain.levels.map(level => Object.setPrototypeOf(structuredClone(level), Level.prototype));
            this.levelCount = brain.levelCount;
            if (mutation) {
                this.levels.forEach(level => {
                    for (let i = 0; i < level.bias.length; i++) {
                        level.bias[i] += (Math.random() * 2 - 1 - level.bias[i]) * mutation;
                    }

                    level.weight.forEach(input => {
                        for (let i = 0; i < input.length; i++) {
                            input[i] += (Math.random() * 2 - 1 - input[i]) * mutation;
                        }
                    })
                })
            }
        } else {
            this.levelCount = levelsNeuronCount.length - 1;
            this.levels = [];
            for (let i = 0; i < this.levelCount; i++) {
                this.levels.push(new Level(levelsNeuronCount[i], levelsNeuronCount[i + 1]));
            }
        }
    }

    update(inputs: number[]) {
        this.levels[0].update(inputs);
        for (let i = 1; i < this.levelCount; i++) {
            this.levels[i].update(this.levels[i - 1].outputs.map(x => x ? 1 : 0));
        }
    }

    get output() {
        return this.levels.at(-1)?.outputs;
    }
}

export default Brain;