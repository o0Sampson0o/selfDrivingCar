import Car from "./car";
import { Border } from "./road";
import Vector from "./vector";
import { getIntersectionPoint } from "./utils";
const DISTANCE = 200;

class Sensors {
    count: number;
    angle: number;
    car: Car;
    intersectionDistances: number[];
    readings: number[] = [];
    intersectionPoints: (Vector | null)[];
    constructor(car: Car, count: number = 4, angle: number = Math.PI / 8) {
        this.car = car;
        this.count = count;
        this.angle = angle;
        this.intersectionDistances = new Array(count).fill(DISTANCE);
        this.intersectionPoints = new Array(count).fill(new Vector());
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 5;
        ctx.rotate((-this.count + 1) * this.angle / 2);
        for (let i = 0; i < this.count; i++) {
            ctx.beginPath();
            ctx.strokeStyle = "yellow";
            ctx.moveTo(0, 0);
            ctx.lineTo(0, this.intersectionDistances[i]);
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.moveTo(0, this.intersectionDistances[i]);
            ctx.lineTo(0, DISTANCE);
            ctx.stroke();
            ctx.rotate(this.angle);
        }
    }

    update(borders: Border[], cars: Car[]) {
        this.intersectionDistances.fill(DISTANCE);
        this.intersectionPoints.fill(null);
        borders.forEach((border) => {
            const { bottomLeft, bottomRight, topLeft, topRight } = border;
            for (let i = 0; i < this.count; i++) {
                const sensorEndPoint = Vector.add(this.car.pos, Vector.fromAngle(this.car.angle + (-this.count + 1) * this.angle / 2 + this.angle * i).mult(DISTANCE));
                const intersetionPointRight = getIntersectionPoint(this.car.pos, sensorEndPoint, bottomRight, topRight);
                const intersetionPointLeft = getIntersectionPoint(this.car.pos, sensorEndPoint, bottomLeft, topLeft);
                if (intersetionPointRight && Math.min(this.intersectionDistances[i], Vector.substrct(intersetionPointRight, this.car.pos).length) === Vector.substrct(intersetionPointRight, this.car.pos).length) {
                    this.intersectionPoints[i] = intersetionPointRight;
                    this.intersectionDistances[i] = intersetionPointRight.subtract(this.car.pos).length;
                }
                if (intersetionPointLeft && Math.min(this.intersectionDistances[i], Vector.substrct(intersetionPointLeft, this.car.pos).length) === Vector.substrct(intersetionPointLeft, this.car.pos).length) {
                    this.intersectionPoints[i] = intersetionPointLeft;
                    this.intersectionDistances[i] = intersetionPointLeft.subtract(this.car.pos).length;
                }
            }
        })

        cars.forEach(car => {
            const carRatio = car.dim.x / car.dim.y;
            const carRatioLength = Math.sqrt(car.dim.x * car.dim.x + car.dim.y * car.dim.y) / 2;
            const carDimAngle = Math.atan(carRatio);
            const topLeft = Vector.add(car.pos, Vector.fromAngle(car.angle - carDimAngle).mult(carRatioLength));
            const topRight = Vector.add(car.pos, Vector.fromAngle(car.angle + carDimAngle).mult(carRatioLength));
            const bottomRight = Vector.add(car.pos, Vector.fromAngle(-car.angle - carDimAngle).mult(carRatioLength));
            const bottomLeft = Vector.add(car.pos, Vector.fromAngle(-car.angle + carDimAngle).mult(carRatioLength));
            for (let i = 0; i < this.count; i++) {
                const sensorEndPoint = Vector.add(this.car.pos, Vector.fromAngle(this.car.angle + (-this.count + 1) * this.angle / 2 + this.angle * i).mult(DISTANCE));
                const intersetionPointRight = getIntersectionPoint(this.car.pos, sensorEndPoint, bottomRight, topRight);
                const intersetionPointLeft = getIntersectionPoint(this.car.pos, sensorEndPoint, bottomLeft, topLeft);
                const intersetionPointTop = getIntersectionPoint(this.car.pos, sensorEndPoint, topRight, topLeft);
                const intersetionPointBottom = getIntersectionPoint(this.car.pos, sensorEndPoint, bottomRight, bottomLeft);
                if (intersetionPointRight && Math.min(this.intersectionDistances[i], Vector.substrct(intersetionPointRight, this.car.pos).length) === Vector.substrct(intersetionPointRight, this.car.pos).length) {
                    this.intersectionPoints[i] = new Vector(intersetionPointRight?.x || 0, intersetionPointRight?.y || 0);
                    this.intersectionDistances[i] = Vector.substrct(intersetionPointRight, this.car.pos).length;
                }
                if (intersetionPointLeft && Math.min(this.intersectionDistances[i], Vector.substrct(intersetionPointLeft, this.car.pos).length) === Vector.substrct(intersetionPointLeft, this.car.pos).length) {
                    this.intersectionPoints[i] = intersetionPointLeft;
                    this.intersectionDistances[i] = intersetionPointLeft.subtract(this.car.pos).length;
                }
                if (intersetionPointTop && Math.min(this.intersectionDistances[i], Vector.substrct(intersetionPointTop, this.car.pos).length) === Vector.substrct(intersetionPointTop, this.car.pos).length) {
                    this.intersectionPoints[i] = intersetionPointTop;
                    this.intersectionDistances[i] = intersetionPointTop.subtract(this.car.pos).length;
                }
                if (intersetionPointBottom && Math.min(this.intersectionDistances[i], Vector.substrct(intersetionPointBottom, this.car.pos).length) === Vector.substrct(intersetionPointBottom, this.car.pos).length) {
                    this.intersectionPoints[i] = intersetionPointBottom;
                    this.intersectionDistances[i] = intersetionPointBottom.subtract(this.car.pos).length;
                }
            }
        })

        this.readings = this.intersectionDistances.map(x => 1 - x / DISTANCE);
    }
}

export default Sensors;