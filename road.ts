import Vector from "./vector";

export type Border = {
    topRight: Vector;
    bottomRight: Vector;
    topLeft: Vector;
    bottomLeft: Vector;
}

class Road {
    border: Border;
    count: number;
    constructor(count = 3, border: Border) {
        this.border = border;
        this.count = count;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 10;
        ctx.moveTo(this.border.topLeft.x, this.border.topLeft.y);
        ctx.lineTo(this.border.bottomLeft.x, this.border.bottomLeft.y);
        ctx.stroke();
        ctx.beginPath();
        for (let i = 1; i < this.count; i++) {
            const vec1 = Vector.add(this.border.topLeft, Vector.substrct(this.border.topRight, this.border.topLeft).mult(i / this.count));
            const vec2 = Vector.add(this.border.bottomLeft, Vector.substrct(this.border.bottomRight, this.border.bottomLeft).mult(i / this.count));
            ctx.setLineDash([20, 20]);
            ctx.moveTo(vec1.x, vec1.y);
            ctx.lineTo(vec2.x, vec2.y);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(this.border.topRight.x, this.border.topRight.y);
        ctx.lineTo(this.border.bottomRight.x, this.border.bottomRight.y);
        ctx.stroke();
    }
}

export default Road;