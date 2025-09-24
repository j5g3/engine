import { Node, Color } from '../core/index.js';

const Black = [0, 0, 0, 1] as const;
const White = [1, 1, 1, 1] as const;

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

function setColor(pos: number, color: Readonly<Color>) {
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
	box: { w: canvas.width, h: canvas.height },
	texture: {
		src: map,
		width: cols,
		height: rows,
	},
	update(_node, set) {
		for (let i = 0; i < LEN; i++) {
			const a = neighbours(i);
			const live = (a === 2 && points[i]) || a === 3;
			newPoints[i] = live ? 1 : 0;
			setColor(i, live ? Black : White);
		}
		const a = points;
		points = newPoints;
		newPoints = a;
		set('texture');
	},
} satisfies Node;
