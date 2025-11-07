import type { Color, EngineJson } from '../core/index.js';

const Black: Color = new Float32Array([0, 0, 0, 1]);
const White: Color = new Float32Array([1, 1, 1, 1]);

const cols = 320;
const rows = 240;
let seed = 100000;

const LEN = cols * rows;
const map = new Float32Array(LEN * 4);
let points = new Int8Array(LEN);
let newPoints = new Int8Array(LEN);

function get(i: number) {
	if (i < 0 || i >= LEN) i = ((i % LEN) + LEN) % LEN;
	return points[i];
}

/* Returns sum of alive cells */
function neighbours(i: number) {
	return (
		get(i - cols - 1) +
		get(i - cols) +
		get(i - cols + 1) +
		get(i + 1) +
		get(i + cols + 1) +
		get(i + cols) +
		get(i + cols - 1) +
		get(i - 1)
	);
}

function setColor(pos: number, color: Color) {
	map.set(color, pos * 4);
}

for (let y = 0; y < rows; y++)
	for (let x = 0; x < cols; x++) {
		const pos = y * cols + x;
		setColor(pos, White);
		points[pos] = 0;
	}

while (seed--) {
	const pos = (Math.random() * LEN) | 0;
	setColor(pos, Black);
	points[pos] = 1;
}

export default {
	root: {
		texture: {
			src: map,
			width: cols,
			height: rows,
		},
		update(node) {
			for (let i = 0; i < LEN; i++) {
				const a = neighbours(i);
				const live = (a === 2 && points[i]) || a === 3;
				newPoints[i] = live ? 1 : 0;
				setColor(i, live ? Black : White);
			}
			const a = points;
			points = newPoints;
			newPoints = a;
			node.texture.dirty = true;
		},
	},
} satisfies EngineJson;
