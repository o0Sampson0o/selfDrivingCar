class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(b) {
        this.x += b.x;
        this.y += b.y;
        this.z += b.z;
        return this;
    }
    subtract(b) {
        this.x -= b.x;
        this.y -= b.y;
        this.z -= b.z;
        return this;
    }
    mult(c) {
        this.x *= c;
        this.y *= c;
        this.z *= c;
        return this;
    }
    dot(a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }
    norm() {
        const length = this.length;
        this.x /= length;
        this.y /= length;
        this.z /= length;
        return this;
    }
    zero() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    static substrct(a, b) {
        return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    static mult(a, c) {
        return new Vector(a.x * c, a.y * c, a.z * c);
    }
    static dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    static norm(a) {
        const length = a.length;
        return new Vector(a.x / length, a.y / length, a.z / length);
    }
    static fromAngle(radian) {
        return new Vector(Math.cos(radian), Math.sin(radian));
    }
}
export default Vector;
