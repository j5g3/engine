import type { EngineJson } from '../core/index.js';

type Ball = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	r: number;
	color: [number, number, number, number];
	m: number;
	im: number; // inverse mass
};

const WIDTH = 1280; // 720p canvas width
const HEIGHT = 720; // 720p canvas height

const GRAVITY = 800; // px/s^2
const RESTITUTION = 0.7; // bounciness 0..1
const AIR_DRAG = 0 as number; // 0 for none

const BALL_COUNT = 1000;
const R_MIN = 8;
const R_MAX = 20;

const MIN_BOUNCE_SPEED = 1; // px/s: below this, treat as inelastic
const POS_CORRECTION = 1; // 0..1: how aggressively to resolve overlap
const PEN_SLOP = 0.01; // px: ignore tiny penetrations
const MU_DYNAMIC = 0.35; // ball-ball dynamic friction
const GROUND_STATIC_V = 8; // px/s: snap-to-rest on ground when slower than this
const GROUND_FRICTION = 14; // per second: decay rate for ground sliding

// Spatial hash grid (uniform grid) for broad-phase
const CELL_SIZE = R_MAX * 2; // enough so collisions happen in same or neighbor cells
const COLS = Math.ceil(WIDTH / CELL_SIZE);
const ROWS = Math.ceil(HEIGHT / CELL_SIZE);
const CELL_COUNT = COLS * ROWS;
let gridHead = new Int32Array(CELL_COUNT);
let gridNext = new Int32Array(BALL_COUNT); // linked list “next” for each ball

let balls: Ball[] = [];
let lastTime = 0;

function rand(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

function initBalls() {
	balls = [];
	for (let i = 0; i < BALL_COUNT; i++) {
		const r = rand(R_MIN, R_MAX);
		const x = rand(r, WIDTH - r);
		const y = rand(r, HEIGHT - r - 200);
		const vx = rand(-200, 200);
		const vy = rand(-50, 50);
		const m = r * r;
		balls.push({
			x,
			y,
			vx,
			vy,
			r,
			color: [Math.random(), Math.random(), Math.random(), 1],
			m,
			im: 1 / m,
		});
	}

	// ensure grid buffers sized (in case constants ever change)
	if (gridHead.length !== CELL_COUNT) gridHead = new Int32Array(CELL_COUNT);
	if (gridNext.length !== balls.length)
		gridNext = new Int32Array(balls.length);
}

function step(dt: number) {
	const len = balls.length;
	const width = WIDTH;
	const height = HEIGHT;
	const cellSize = CELL_SIZE;
	const cols = COLS;
	const rows = ROWS;

	// clear spatial grid heads
	gridHead.fill(-1);

	// integrate and insert into grid
	for (let i = 0; i < len; i++) {
		const b = balls[i];

		// gravity
		b.vy += GRAVITY * dt;

		// air drag (optional)
		if (AIR_DRAG > 0) {
			const drag = Math.max(0, 1 - AIR_DRAG * dt * 60);
			b.vx *= drag;
			b.vy *= drag;
		}

		// integrate position
		b.x += b.vx * dt;
		b.y += b.vy * dt;

		// walls
		if (b.x - b.r < 0) {
			b.x = b.r;
			b.vx = -b.vx * RESTITUTION;
		} else if (b.x + b.r > width) {
			b.x = width - b.r;
			b.vx = -b.vx * RESTITUTION;
		}

		if (b.y - b.r < 0) {
			b.y = b.r;
			b.vy = -b.vy * RESTITUTION;
		} else if (b.y + b.r > height) {
			// ground contact
			b.y = height - b.r;

			// kill micro-bounce on small impacts
			const e = Math.abs(b.vy) < MIN_BOUNCE_SPEED ? 0 : RESTITUTION;
			b.vy = -b.vy * e;

			// continuous ground friction + stickiness
			if (b.vy === 0) {
				// static friction snap
				if (Math.abs(b.vx) < GROUND_STATIC_V) {
					b.vx = 0;
				} else {
					// dynamic friction decay while sliding
					const decay = Math.max(0, 1 - GROUND_FRICTION * dt);
					b.vx *= decay;
				}
			} else {
				// sliding during bounce
				b.vx *= 0.98;
			}
		}

		// tiny velocity cleanup (prevents sub-pixel drift)
		if (Math.abs(b.vx) < 0.01) b.vx = 0;
		if (Math.abs(b.vy) < 0.01) b.vy = 0;

		// insert into spatial grid
		let cx = (b.x / cellSize) | 0;
		let cy = (b.y / cellSize) | 0;
		if (cx < 0) cx = 0;
		else if (cx >= cols) cx = cols - 1;
		if (cy < 0) cy = 0;
		else if (cy >= rows) cy = rows - 1;
		const c = cy * cols + cx;

		gridNext[i] = gridHead[c];
		gridHead[c] = i;
	}

	// narrow-phase: resolve collisions using grid
	for (let c = 0; c < CELL_COUNT; c++) {
		// pairs inside the same cell
		for (let i = gridHead[c]; i !== -1; i = gridNext[i]) {
			const a = balls[i];
			for (let j = gridNext[i]; j !== -1; j = gridNext[j]) {
				const b = balls[j];

				const dx = b.x - a.x;
				const dy = b.y - a.y;
				const minDist = a.r + b.r;
				const minDist2 = minDist * minDist;
				const dist2 = dx * dx + dy * dy;
				if (dist2 === 0 || dist2 >= minDist2) continue;

				const dist = Math.sqrt(dist2);
				const nx = dx / dist;
				const ny = dy / dist;
				const overlap = minDist - dist;

				// positional correction
				const totalM = a.m + b.m;
				const correction =
					Math.max(0, overlap - PEN_SLOP) * POS_CORRECTION;
				const pushA = correction * (b.m / totalM);
				const pushB = correction * (a.m / totalM);
				a.x -= nx * pushA;
				a.y -= ny * pushA;
				b.x += nx * pushB;
				b.y += ny * pushB;

				// relative velocity
				const rvx = b.vx - a.vx;
				const rvy = b.vy - a.vy;

				// normal component
				const rvn = rvx * nx + rvy * ny;
				if (rvn > 0) continue;

				// inelastic below threshold to avoid micro-bounce
				const e = Math.abs(rvn) < MIN_BOUNCE_SPEED ? 0 : RESTITUTION;

				// normal impulse
				const invMassSum = a.im + b.im;
				const jn = (-(1 + e) * rvn) / invMassSum;
				const jnx = jn * nx;
				const jny = jn * ny;

				a.vx -= jnx * a.im;
				a.vy -= jny * a.im;
				b.vx += jnx * b.im;
				b.vy += jny * b.im;

				// tangential (friction) impulse
				const tvx = rvx - rvn * nx;
				const tvy = rvy - rvn * ny;
				const tv2 = tvx * tvx + tvy * tvy;
				if (tv2 > 1e-12) {
					const tv = Math.sqrt(tv2);
					const tx = tvx / tv;
					const ty = tvy / tv;

					let jt = -tv / invMassSum;
					const maxJt = MU_DYNAMIC * Math.abs(jn);
					if (jt > maxJt) jt = maxJt;
					else if (jt < -maxJt) jt = -maxJt;

					const jtx = jt * tx;
					const jty = jt * ty;

					a.vx -= jtx * a.im;
					a.vy -= jty * a.im;
					b.vx += jtx * b.im;
					b.vy += jty * b.im;
				}
			}
		}

		// pairs with neighbor cells (right, down, down-right, down-left)
		const col = c % cols;
		const row = (c / cols) | 0;

		// helper to collide lists from cell c and cell n
		const collideLists = (n: number) => {
			for (let i = gridHead[c]; i !== -1; i = gridNext[i]) {
				const a = balls[i];
				for (let j = gridHead[n]; j !== -1; j = gridNext[j]) {
					const b = balls[j];

					const dx = b.x - a.x;
					const dy = b.y - a.y;
					const minDist = a.r + b.r;
					const minDist2 = minDist * minDist;
					const dist2 = dx * dx + dy * dy;
					if (dist2 === 0 || dist2 >= minDist2) continue;

					const dist = Math.sqrt(dist2);
					const nx = dx / dist;
					const ny = dy / dist;
					const overlap = minDist - dist;

					const totalM = a.m + b.m;
					const correction =
						Math.max(0, overlap - PEN_SLOP) * POS_CORRECTION;
					const pushA = correction * (b.m / totalM);
					const pushB = correction * (a.m / totalM);
					a.x -= nx * pushA;
					a.y -= ny * pushA;
					b.x += nx * pushB;
					b.y += ny * pushB;

					const rvx = b.vx - a.vx;
					const rvy = b.vy - a.vy;
					const rvn = rvx * nx + rvy * ny;
					if (rvn > 0) continue;

					const e =
						Math.abs(rvn) < MIN_BOUNCE_SPEED ? 0 : RESTITUTION;

					const invMassSum = a.im + b.im;
					const jn = (-(1 + e) * rvn) / invMassSum;
					const jnx = jn * nx;
					const jny = jn * ny;

					a.vx -= jnx * a.im;
					a.vy -= jny * a.im;
					b.vx += jnx * b.im;
					b.vy += jny * b.im;

					const tvx = rvx - rvn * nx;
					const tvy = rvy - rvn * ny;
					const tv2 = tvx * tvx + tvy * tvy;
					if (tv2 > 1e-12) {
						const tv = Math.sqrt(tv2);
						const tx = tvx / tv;
						const ty = tvy / tv;

						let jt = -tv / invMassSum;
						const maxJt = MU_DYNAMIC * Math.abs(jn);
						if (jt > maxJt) jt = maxJt;
						else if (jt < -maxJt) jt = -maxJt;

						const jtx = jt * tx;
						const jty = jt * ty;

						a.vx -= jtx * a.im;
						a.vy -= jty * a.im;
						b.vx += jtx * b.im;
						b.vy += jty * b.im;
					}
				}
			}
		};

		if (col < cols - 1) collideLists(c + 1); // right
		if (row < rows - 1) {
			collideLists(c + cols); // down
			if (col < cols - 1) collideLists(c + cols + 1); // down-right
			if (col > 0) collideLists(c + cols - 1); // down-left
		}
	}
}

export default {
	root: {
		draw({ clear, color, circle }, next) {
			if (balls.length === 0) initBalls();

			const now = performance.now();
			if (lastTime === 0) lastTime = now;
			let dt = (now - lastTime) / 1000;
			lastTime = now;

			// clamp big gaps (tab switch, etc.)
			if (dt > 0.05) dt = 0.05;

			// fixed substeps for stability
			const fixed = 1 / 120;
			let acc = dt;
			// process full fixed steps
			while (acc >= fixed) {
				step(fixed);
				acc -= fixed;
			}
			// process remainder
			if (acc > 0) step(acc);

			clear();

			for (let i = 0; i < balls.length; i++) {
				const b = balls[i];
				color(b.color);
				circle(b.x, b.y, b.r);
			}

			next();
		},
	},
} satisfies EngineJson;
