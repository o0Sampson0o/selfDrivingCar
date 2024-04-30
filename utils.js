import Vector from './vector';
function getIntersectionPoint(p1, p2, q1, q2) {
    const a1 = p2.y - p1.y;
    const b1 = p1.x - p2.x;
    const c1 = -(a1 * p1.x + b1 * p1.y);
    const a2 = q2.y - q1.y;
    const b2 = q1.x - q2.x;
    const c2 = -(a2 * q1.x + b2 * q1.y);
    const denominator = a1 * b2 - a2 * b1;
    if (!denominator)
        return null;
    const point = new Vector((b1 * c2 - b2 * c1) / denominator, (a2 * c1 - a1 * c2) / denominator);
    const p1_p2 = Vector.substrct(p2, p1);
    const p1_point = Vector.substrct(point, p1);
    const q1_q2 = Vector.substrct(q2, q1);
    const q1_point = Vector.substrct(point, q1);
    if (p1_p2.dot(p1_point) < 0 || p1_point.length > p1_p2.length || q1_q2.dot(q1_point) < 0 || q1_point.length > q1_q2.length)
        return null;
    return point;
}
export { getIntersectionPoint };
