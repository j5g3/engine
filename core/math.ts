export type Matrix = Float32Array;

export interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface Box extends Rect {
	sx: number;
	sy: number;
	/** Offset X for rotation. */
	cx: number;
	/** Offset Y for rotation */
	cy: number;
	rotation: number;
}
/**
 * Creates a new matrix from an optional number array input.
 * Returns a copy of the identity matrix if no input is provided.
 */
export function matrix(m?: number[]) {
	return m ? new Float32Array(m) : identity.slice(0);
}

export const identity = new Float32Array([
	1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
]) as Readonly<Matrix>;

/**
 * Creates a matrix that transforms a `Box` to a transformation matrix.
 *
 * This function takes a `Box` object and optionally a destination `Matrix`. It populates the `dst` matrix with the
 * transformations specified by the `Box`. The transformations include:
 * - Rotation: Rotates the box around its center `cx`, `cy` by `rotation` radians.
 * - Scaling: Scales the box by `sx` and `sy` along the x and y axes.
 * - Translation: Translates the box to the position `x`, `y`.
 */
export function composeBox(box: Box, dst: Matrix = new Float32Array(16)) {
	const { x, y, sx, sy, cx, cy, w, h, rotation } = box;
	dst[2] = dst[3] = dst[6] = dst[7] = dst[8] = dst[9] = dst[11] = dst[14] = 0;
	dst[10] = dst[15] = 1;

	// Rotate
	const cos = Math.cos(rotation);
	const sin = Math.sin(rotation);
	dst[0] = sx * cos;
	dst[1] = sx * sin;
	dst[4] = sy * -sin;
	dst[5] = sy * cos;

	// Translate negative origin
	dst[12] = dst[0] * -cx + dst[4] * -cy + x;
	dst[13] = dst[1] * -cx + dst[5] * -cy + y;

	// Scale w and h
	dst[0] *= w;
	dst[1] *= w;
	dst[4] *= h;
	dst[5] *= h;

	return dst;
}

export function Box(box?: Partial<Box>) {
	return {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
		sx: 1,
		sy: 1,
		cx: 0,
		cy: 0,
		rotation: 0,
		...box,
	};
}

/**
 * Multiplies two matrices, `a` and `b`, and stores the result in the `dst` matrix.
 * It assumes that the matrices are 4x4 matrices.
 */
export function multiply(
	a: Matrix,
	b: Matrix,
	dst: Matrix = new Float32Array(16),
) {
	const [
		a0,
		a1,
		a2,
		a3,
		a10,
		a11,
		a12,
		a13,
		a20,
		a21,
		a22,
		a23,
		a30,
		a31,
		a32,
		a33,
	] = a;
	const [
		b0,
		b1,
		b2,
		b3,
		b10,
		b11,
		b12,
		b13,
		b20,
		b21,
		b22,
		b23,
		b30,
		b31,
		b32,
		b33,
	] = b;
	dst[0] = b0 * a0 + b1 * a10 + b2 * a20 + b3 * a30;
	dst[1] = b0 * a1 + b1 * a11 + b2 * a21 + b3 * a31;
	dst[2] = b0 * a2 + b1 * a12 + b2 * a22 + b3 * a32;
	dst[3] = b0 * a3 + b1 * a13 + b2 * a23 + b3 * a33;
	dst[4] = b10 * a0 + b11 * a10 + b12 * a20 + b13 * a30;
	dst[5] = b10 * a1 + b11 * a11 + b12 * a21 + b13 * a31;
	dst[6] = b10 * a2 + b11 * a12 + b12 * a22 + b13 * a32;
	dst[7] = b10 * a3 + b11 * a13 + b12 * a23 + b13 * a33;
	dst[8] = b20 * a0 + b21 * a10 + b22 * a20 + b23 * a30;
	dst[9] = b20 * a1 + b21 * a11 + b22 * a21 + b23 * a31;
	dst[10] = b20 * a2 + b21 * a12 + b22 * a22 + b23 * a32;
	dst[11] = b20 * a3 + b21 * a13 + b22 * a23 + b23 * a33;
	dst[12] = b30 * a0 + b31 * a10 + b32 * a20 + b33 * a30;
	dst[13] = b30 * a1 + b31 * a11 + b32 * a21 + b33 * a31;
	dst[14] = b30 * a2 + b31 * a12 + b32 * a22 + b33 * a32;
	dst[15] = b30 * a3 + b31 * a13 + b32 * a23 + b33 * a33;
	return dst;
}

/**
 * Creates a perspective projection matrix.
 * It returns a `Float32Array` representing a 4x4 matrix that maps 3D points in the specified orthogonal
 * frustum to normalized device coordinates.
 * It allows you to define the viewing area for your scene and map 3D points to 2D coordinates on the screen.
 */
export function orthographic(
	left: number,
	right: number,
	bottom: number,
	top: number,
	near: number,
	far: number,
) {
	return new Float32Array([
		2 / (right - left),
		0,
		0,
		0,
		0,
		2 / (top - bottom),
		0,
		0,
		0,
		0,
		2 / (near - far),
		0,
		(left + right) / (left - right),
		(bottom + top) / (bottom - top),
		(near + far) / (near - far),
		1,
	]);
}

export function intersect(a: Rect, b: Rect) {
	return !(
		a.x + a.w <= b.x ||
		a.x >= b.x + b.w ||
		a.y + a.h <= b.y ||
		a.y >= b.y + b.h
	);
}

/**
 * Returns a vector perpendicular to the vector from (a, b) to (c, d), without normalizing it.
 */
export function perpendicular(
	a: number,
	b: number,
	c: number,
	d: number,
): [number, number] {
	return [-(d - b), c - a];
}

export function normalize(vec: [number, number] | Float32Array) {
	const length = Math.sqrt(vec[0] ** 2 + vec[1] ** 2);
	vec[0] = length ? vec[0] / length : 0;
	vec[1] = length ? vec[1] / length : 0;
	return vec;
}

/**
 * Calculates the unit normal vector perpendicular to the line segment defined by points (x1, y1) and (x2, y2).
 * This normal vector is useful for determining directions orthogonal to edges, often used in geometry computations or rendering.
 */
export function normal(x1: number, y1: number, x2: number, y2: number) {
	return normalize(perpendicular(x1, y1, x2, y2));
}
