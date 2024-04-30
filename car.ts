import Controls, { ControlsType } from "./controls";
import Vector from "./vector";
import Sensors from "./sensors";
import { Border } from "./road";
import Brain from "./brain";
import { getIntersectionPoint } from "./utils";

const FRICTION: number = 0.05;
const ACCELARATION: number = 0.2;
const DELTA_ANGLE: number = 0.1;
const SENSOR_COUNT = 15;
class Car {
    pos: Vector;
    vel: number;
    acc: number;
    dim: Vector;
    maxSpeed: number;
    angle: number;
    controlsType: ControlsType;
    brain: Brain | null = null;
    dimRatio: number;
    dimRatioLength: number;
    dimAngle: number;
    die: boolean;
    private sensors: Sensors | null = null;
    private control: Controls;

    constructor(x: number, y: number, w: number, h: number, maxSpeed: number, controlsType: ControlsType, brain?: Brain, mutation?: number) {
        this.pos = new Vector(x, y);
        this.maxSpeed = maxSpeed;
        this.vel = 0;
        this.acc = 0;
        this.dim = new Vector(w, h);
        this.angle = -Math.PI / 2;
        this.dimRatio = w / h;
        this.dimAngle = Math.atan(this.dimRatio);
        this.dimRatioLength = Math.sqrt(w * w + h * h) / 2;
        this.controlsType = controlsType;
        this.control = new Controls(controlsType, this.brain);
        this.die = false;
        if (controlsType !== "npc") {
            this.sensors = new Sensors(this, SENSOR_COUNT, Math.PI / 10);
        }
        if (controlsType === "ai") {
            this.brain = brain ? new Brain([], brain, mutation ?? 0) : new Brain([SENSOR_COUNT, 6, 4]);
            this.control.brain = this.brain;
        }
    }

    draw(sensor: boolean, ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle - Math.PI / 2);
        ctx.beginPath();
        ctx.fillStyle = this.die ? "#FFFFFF11" : this.controlsType === "ai" ? "#FFFFFF33" : "#0000FF";
        ctx.rect(- this.dim.x / 2, - this.dim.y / 2, this.dim.x, this.dim.y);
        ctx.fill();
        if (!this.die && sensor) this.sensors?.draw(ctx);
        ctx.restore();
        if (this.die || !sensor) return;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        this.sensors?.intersectionPoints.forEach(point => {
            ctx.beginPath();
            ctx.fillStyle = "green";
            if (!point) return;
            ctx.rect(point.x - 5, point.y - 5, 10, 10);
            ctx.fill();
        })
        ctx.restore();
    }

    move() {
        this.acc = 0;

        if (this.control.forward) this.acc += ACCELARATION;
        if (this.control.backward) this.acc -= ACCELARATION;
        if (this.control.left) this.angle -= DELTA_ANGLE;
        if (this.control.right) this.angle += DELTA_ANGLE;

        this.vel += this.acc;

        if (Math.abs(this.vel) >= FRICTION)
            this.vel -= Math.sign(this.vel) * FRICTION;
        else
            this.vel = 0;

        if (Math.abs(this.vel) > this.maxSpeed) this.vel = Math.sign(this.vel) * this.maxSpeed;

        this.pos.add(Vector.fromAngle(this.angle).mult(this.vel));
    }

    update(borders: Border[], cars: Car[]) {
        if (this.die) return;
        this.sensors?.update(borders, cars);
        if (this.controlsType === "ai") {
            this.brain?.update(this.sensors?.readings as number[]);
            this.control.update();
        }
        this.move();
        borders.forEach((border) => {
            const { bottomLeft: borderBottomLeft, bottomRight: borderBottomRight, topLeft: borderTopLeft, topRight: borderTopRight } = border;
            const carTopLeft = Vector.add(this.pos, Vector.fromAngle(this.angle - this.dimAngle).mult(this.dimRatioLength));
            const carTopRight = Vector.add(this.pos, Vector.fromAngle(this.angle + this.dimAngle).mult(this.dimRatioLength));
            const carBottomRight = Vector.add(this.pos, Vector.fromAngle(-this.angle - this.dimAngle).mult(this.dimRatioLength));
            const carBottomLeft = Vector.add(this.pos, Vector.fromAngle(-this.angle + this.dimAngle).mult(this.dimRatioLength));

            const polygon = [carTopLeft, carTopRight, carBottomRight, carBottomLeft];

            for (let i = 0; i < polygon.length; i++) {
                const p1 = getIntersectionPoint(polygon[i], polygon[(i + 1) % polygon.length], borderBottomLeft, borderTopLeft);
                const p2 = getIntersectionPoint(polygon[i], polygon[(i + 1) % polygon.length], borderBottomRight, borderTopRight);
                if (p1 || p2) {
                    this.die = true;
                    break;
                }
            }
        });

        cars.forEach(car => {
            const carRatio = car.dim.x / car.dim.y;
            const carRatioLength = Math.sqrt(car.dim.x * car.dim.x + car.dim.y * car.dim.y) / 2;
            const carDimAngle = Math.atan(carRatio);
            const carTopLeft = Vector.add(car.pos, Vector.fromAngle(car.angle - carDimAngle).mult(carRatioLength));
            const carTopRight = Vector.add(car.pos, Vector.fromAngle(car.angle + carDimAngle).mult(carRatioLength));
            const carBottomRight = Vector.add(car.pos, Vector.fromAngle(-car.angle - carDimAngle).mult(carRatioLength));
            const carBottomLeft = Vector.add(car.pos, Vector.fromAngle(-car.angle + carDimAngle).mult(carRatioLength));

            const thisCarTopLeft = Vector.add(this.pos, Vector.fromAngle(this.angle - this.dimAngle).mult(this.dimRatioLength));
            const thisCarTopRight = Vector.add(this.pos, Vector.fromAngle(this.angle + this.dimAngle).mult(this.dimRatioLength));
            const thisCarBottomRight = Vector.add(this.pos, Vector.fromAngle(-this.angle - this.dimAngle).mult(this.dimRatioLength));
            const thisCarBottomLeft = Vector.add(this.pos, Vector.fromAngle(-this.angle + this.dimAngle).mult(this.dimRatioLength));

            const carPolygon = [carTopLeft, carTopRight, carBottomRight, carBottomLeft];
            const thisCarPolygon = [thisCarTopLeft, thisCarTopRight, thisCarBottomRight, thisCarBottomLeft];

            if (this.die) return;
            loop1: for (let i = 0; i < carPolygon.length; i++) {
                loop2: for (let j = 0; j < thisCarPolygon.length; j++) {
                    const p = getIntersectionPoint(thisCarPolygon[j], thisCarPolygon[(j + 1) % thisCarPolygon.length], carPolygon[i], carPolygon[(i + 1) % carPolygon.length]);
                    if (p) {
                        this.die = true;
                        break loop1;
                    }
                }
            }
        })
    }
}

export default Car;