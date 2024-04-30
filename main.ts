import Brain from "./brain";
import Car from "./car";
import Level from "./level";
import Road, { Border } from "./road";
import Vector from "./vector";

const INFINITY = 1000000;
const ROAD_WIDTH = 100;
const MUTATION = 0.05;
const AI_COUNT = 100;

//** CAR SETTINGS **//
const MAX_SPEED: number = 6;
const CAR_WIDTH: number = 50;

const preset = [
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 1, -100, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 0, -100, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 1, -420, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 2, -420, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 0, -740, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 2, -740, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 1, -1060, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 0, -1060, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 1, -1380, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 2, -1380, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 0, -1700, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 2, -1700, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 0, -2020, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 1, -2020, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 1, -2340, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 2, -2340, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 0, -2660, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 2, -2660, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 0, -2980, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 1, -2980, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
    new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * 0, -3090, CAR_WIDTH, 80, MAX_SPEED / 4, "npc"),
]

//** CANVASES **//
const trafficCanvas: HTMLCanvasElement = document.getElementById("traffic") as HTMLCanvasElement;
const brainCanvas: HTMLCanvasElement = document.getElementById("brain") as HTMLCanvasElement;

const trafficCtxNullable = trafficCanvas.getContext("2d");
const brainCtxNullable = brainCanvas.getContext("2d");

if (!trafficCtxNullable) throw new Error("TRAFFIC CANVAS NOT EXIST!");
if (!brainCtxNullable) throw new Error("BRAIN CANVAS NOT EXIST!");

//** CANVAS SETTINGS **//
trafficCanvas.height = window.innerHeight;
trafficCanvas.width = ROAD_WIDTH * 3 + 20;
brainCanvas.height = 300;
brainCanvas.width = 300;


//** TRAFFIC SETTINGS **//
const border: Border = {
    topLeft: new Vector(10, INFINITY),
    bottomLeft: new Vector(10, -INFINITY),
    topRight: new Vector(trafficCanvas.width - 10, INFINITY),
    bottomRight: new Vector(trafficCanvas.width - 10, -INFINITY)
};

const road = new Road(3, border);

let npcCars = Array(200).fill(0).map((x, i) => new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * Math.floor(Math.random() * 3), -100 - Math.floor(i / 2) * 320 * (1 + (+(console.log(Math.floor(i / 2))) || 0)), CAR_WIDTH, 80, MAX_SPEED / 4, "npc"))

//** TRAFFIC DRAW **//
let aiCars: Car[];
const itemString = localStorage.getItem("bestCar");
if (!itemString) {
    aiCars = Array.from({ length: AI_COUNT }, () => new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH, 160, CAR_WIDTH, 80, MAX_SPEED, "ai"));
} else {
    const brainJson: JSON = JSON.parse(itemString);
    const brain: Brain = Object.setPrototypeOf(brainJson, Brain.prototype);
    brain.levels.forEach(level => { level = Object.setPrototypeOf(level, Level.prototype) })
    aiCars = Array.from({ length: AI_COUNT }, () => new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH, 160, CAR_WIDTH, 80, MAX_SPEED, "ai", brain ?? undefined, MUTATION));
    aiCars[0].brain = brain;
}

const trafficCtx = trafficCtxNullable;
animateTraffic();
function animateTraffic() {
    trafficCtx.clearRect(0, 0, trafficCanvas.width, trafficCanvas.height);
    trafficCtx.save();
    trafficCtx.translate(0, -aiCars[0].pos.y + 3 * trafficCanvas.height / 4);
    npcCars.forEach(car => car.update([], []));
    aiCars.forEach(car => car.update([border], npcCars));
    road.draw(trafficCtx);
    npcCars.forEach(car => car.draw(false, trafficCtx));
    aiCars.forEach((car, i) => car.draw(i == 0, trafficCtx));
    trafficCtx.restore();
    aiCars.sort((a, b) => (a.die ? 1000 : a.pos.y) - (b.die ? 1000 : b.pos.y));
    aiCars.forEach(car => {
        if (car.pos.y - aiCars[0].pos.y > trafficCanvas.height) car.die = true;
        if (car.pos.x > trafficCanvas.width || car.pos.x < 0) car.die = true;
    });
    if (aiCars[0].die) {
        const bestCar = aiCars[0];
        aiCars = Array.from({ length: AI_COUNT }, () => new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH, 160, CAR_WIDTH, 80, MAX_SPEED, "ai", bestCar.brain ?? undefined, MUTATION));
        aiCars[0].brain = bestCar.brain;
        npcCars = Array(200).fill(0).map((x, i) => new Car(10 + ROAD_WIDTH / 2 + ROAD_WIDTH * Math.floor(Math.random() * 3), -100 - Math.floor(i / 2) * 320 * (1 + (+(console.log(Math.floor(i / 2))) || 0)), CAR_WIDTH, 80, MAX_SPEED / 4, "npc"))

    }
    requestAnimationFrame(animateTraffic);
}

const brainCtx = brainCtxNullable;
animateBrain();
function animateBrain() {

}

//** SAVE BUTTON **//
const button = document.getElementById("save");
if (button) {
    button.onclick = () => {
        localStorage.setItem("bestCar", JSON.stringify(aiCars[0].brain));
    }
}