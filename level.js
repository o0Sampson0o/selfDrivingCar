class Level {
    constructor(inputCount, outputCount, weight, bias) {
        this.inputCount = inputCount;
        this.outputCount = outputCount;
        this.outputs = Array(outputCount).fill(false);
        this.weight = weight ??
            Array.from({ length: inputCount }, () => Array.from({ length: outputCount }, () => Math.random() * 2 - 1));
        this.bias = bias ?? Array.from({ length: inputCount }, () => Math.random() * 2 - 1);
    }
    update(inputs) {
        for (let i = 0; i < this.outputCount; i++) {
            let sum = 0;
            for (let j = 0; j < this.inputCount; j++) {
                sum += inputs[j] * this.weight[j][i];
            }
            this.outputs[i] = sum >= this.bias[i];
        }
    }
}
export default Level;
