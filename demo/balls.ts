import type { EngineJson } from '../core/index.js';

type Ball = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	r: number;
	color: [number, number, number, number];
	m: number;
};

const WIDTH = 1280; // 720p canvas width
const HEIGHT = 720; // 720p canvas height

const GRAVITY = 800; // px/s^2
const RESTITUTION = 0.7; // bounciness 0..1
const AIR_DRAG = 0.0; // 0 for none

const BALL_COUNT = 500;
const R_MIN = 8;
const R_MAX = 20;

const MIN_BOUNCE_SPEED = 25; // px/s: below this, treat as inelastic
const POS_CORRECTION = 0.85; // 0..1: how aggressively to resolve overlap
const PEN_SLOP = 0.01; // px: ignore tiny penetrations
const MU_DYNAMIC = 0.35; // ball-ball dynamic friction
const GROUND_STATIC_V = 8; // px/s: snap-to-rest on ground when slower than this
const GROUND_FRICTION = 14; // per second: decay rate for ground sliding

let balls: Ball[] = [];
let lastTime = 0;

function rand(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

// h, s, l in 0..1, returns rgba in 0..1
function hsla(
	h: number,
	s: number,
	l: number,
	a = 1,
): [number, number, number, number] {
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	const c = (t: number) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};
	return [c(h + 1 / 3), c(h), c(h - 1 / 3), a];
}

function initBalls() {
	balls = [];
	for (let i = 0; i < BALL_COUNT; i++) {
		const r = rand(R_MIN, R_MAX);
		const x = rand(r, WIDTH - r);
		const y = rand(r, HEIGHT - r - 200);
		const vx = rand(-200, 200);
		const vy = rand(-50, 50);
		const color = hsla(Math.random(), 0.65, 0.55, 1);
		const m = r * r; // mass ~ area
		balls.push({ x, y, vx, vy, r, color, m });
	}
}

function step(dt: number) {
	// integrate
	for (const b of balls) {
		b.vy += GRAVITY * dt;

		if (AIR_DRAG > 0) {
			const drag = Math.max(0, 1 - AIR_DRAG * dt * 60);
			b.vx *= drag;
			b.vy *= drag;
		}

		b.x += b.vx * dt;
		b.y += b.vy * dt;

		// walls
		if (b.x - b.r < 0) {
			b.x = b.r;
			b.vx = -b.vx * RESTITUTION;
		} else if (b.x + b.r > WIDTH) {
			b.x = WIDTH - b.r;
			b.vx = -b.vx * RESTITUTION;
		}

		if (b.y - b.r < 0) {
			b.y = b.r;
			b.vy = -b.vy * RESTITUTION;
		} else if (b.y + b.r > HEIGHT) {
			// ground contact
			b.y = HEIGHT - b.r;

			// kill micro-bounce on small impacts
			const e = Math.abs(b.vy) < MIN_BOUNCE_SPEED ? 0 : RESTITUTION;
			b.vy = -b.vy * e;

			// continuous ground friction + stickiness
			if (Math.abs(b.vy) === 0) {
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
	}

	// ball-ball collisions
	for (let i = 0; i < balls.length; i++) {
		for (let j = i + 1; j < balls.length; j++) {
			const a = balls[i];
			const b = balls[j];
			const dx = b.x - a.x;
			const dy = b.y - a.y;
			const dist = Math.hypot(dx, dy);
			const minDist = a.r + b.r;
			if (dist === 0 || dist >= minDist) continue;

			const nx = dx / dist;
			const ny = dy / dist;
			const overlap = minDist - dist;

			// positional correction with slop and percent (reduces jitter)
			const totalM = a.m + b.m;
			const correction = Math.max(0, overlap - PEN_SLOP) * POS_CORRECTION;
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
			const invMassSum = 1 / a.m + 1 / b.m;
			const jn = (-(1 + e) * rvn) / invMassSum;
			const jnx = jn * nx;
			const jny = jn * ny;

			a.vx -= jnx / a.m;
			a.vy -= jny / a.m;
			b.vx += jnx / b.m;
			b.vy += jny / b.m;

			// tangential (friction) impulse to kill sliding jitter
			const tvx = rvx - rvn * nx;
			const tvy = rvy - rvn * ny;
			const tv = Math.hypot(tvx, tvy);
			if (tv > 1e-6) {
				const tx = tvx / tv;
				const ty = tvy / tv;

				// desired friction impulse (clamped by Coulomb)
				let jt = -tv / invMassSum;
				const maxJt = MU_DYNAMIC * Math.abs(jn);
				if (jt > maxJt) jt = maxJt;
				if (jt < -maxJt) jt = -maxJt;

				const jtx = jt * tx;
				const jty = jt * ty;

				a.vx -= jtx / a.m;
				a.vy -= jty / a.m;
				b.vx += jtx / b.m;
				b.vy += jty / b.m;
			}
		}
	}
}

export default {
	root: {
		draw({ clear, color, circle }, next) {
			if (balls.length === 0) initBalls();

			const now = Date.now();
			if (lastTime === 0) lastTime = now;
			let dt = (now - lastTime) / 1000;
			lastTime = now;

			// clamp big gaps (tab switch, etc.)
			if (dt > 0.05) dt = 0.05;

			// fixed substeps for stability
			const fixed = 1 / 120;
			let acc = dt;
			while (acc > 0) {
				const sdt = Math.min(acc, fixed);
				step(sdt);
				acc -= sdt;
			}

			clear();

			for (const b of balls) {
				color(b.color);
				circle(b.x, b.y, b.r);
			}

			next();
		},
	},
} satisfies EngineJson;
