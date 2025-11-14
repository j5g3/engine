import { orthographic, matrix } from './math.js';

import type { Color, Program } from './pipeline.js';

export type LineCap = 'butt' | 'square' | 'round';
export type LineJoin = 'none' | 'bevel' | 'round' | 'miter';

/**
 * Encapsulates all drawing operations and manages transformation state, color settings,
 * and viewport configurations.
 */
export class DrawEngine {
	#strokeColor?: Color;
	#strokeWidth = 1;
	#unitY = 1;
	#originX = 0;
	#originY = 0;
	#scaleX = 1;
	#scaleY = 1;

	#lineM = matrix();
	#lineCap: LineCap = 'butt';
	#lineJoin: LineJoin = 'none';
	#bevel = {
		Ax: 0,
		Ay: 0,
		Bx: 0,
		By: 0,
		uxIn: 0,
		uyIn: 0,
		uxOut: 0,
		uyOut: 0,
		turn: 1 as 1 | -1,
	};

	constructor(protected ctx: Program) {
		this.resetViewport();
	}

	/**
	 * Sets the fill color for subsequent drawing operations.
	 */
	readonly color = (fill: Color, stroke = fill) => {
		this.ctx.color.set(fill);
		this.#strokeColor = stroke;
	};

	/**
	 * Updates the current fill color used for rendering shapes.
	 */
	fillColor = (newColor: Color) => {
		this.ctx.color.set(newColor);
	};

	/**
	 * Prepares the transformation matrix for rendering a rectangle by setting its scale and position
	 * based on the specified coordinates and dimensions.
	 */
	rect = (x: number, y: number, w: number, h: number) => {
		this.pushM(w, 0, 0, h, x - this.#originX, y - this.#originY);
	};

	strokeColor = (color: Color | [number, number, number, number]) => {
		this.#strokeColor = Array.isArray(color)
			? new Float32Array(color)
			: color;
	};

	strokeWidth = (width: number) => {
		this.#strokeWidth = width;
	};

	strokeCap = (cap: LineCap) => {
		this.#lineCap = cap;
	};

	strokeJoin = (join: LineJoin) => {
		this.#lineJoin = join;
	};

	line = (x0: number, y0: number, x1: number, y1: number) => {
		this.polyline([x0, y0, x1, y1]);
	};

	/**
	 * Draws a polyline from a sequence of points using quads to represent thick line segments.
	 * @param points ArrayLike<number> where points are [x0, y0, x1, y1, ..., xn, yn]
	 */
	polyline = (points: ArrayLike<number>) => {
		if (points.length < 4) throw new Error('Need at least two points.');

		const thickness = this.#strokeWidth * this.#unitY;
		const ox = this.#originX;
		const oy = this.#originY;
		const sx = this.#scaleX;
		const sy = this.#scaleY;

		if (this.#strokeColor) {
			this.ctx.color.set(this.#strokeColor);
		}

		// First Segment
		if (this.#lineCap !== 'butt') {
			this.drawCap(
				(points[0] - ox) / sx,
				(points[1] - oy) / sy,
				(points[2] - ox) / sx,
				(points[3] - oy) / sy,
				thickness,
				'start',
			);
		}

		for (let i = 0; i < points.length - 2; i += 2) {
			const x0 = (points[i] - ox) / sx;
			const y0 = (points[i + 1] - oy) / sy;
			const x1 = (points[i + 2] - ox) / sx;
			const y1 = (points[i + 3] - oy) / sy;

			this.lineSegment(x0, y0, x1, y1, thickness);

			if (i < points.length - 4) {
				const x2 = (points[i + 4] - ox) / sx;
				const y2 = (points[i + 5] - oy) / sy;

				if (this.#lineJoin === 'round') {
					this.drawRoundJoin(x1, y1, thickness);
				} else if (
					this.#lineJoin === 'bevel' ||
					this.#lineJoin === 'miter'
				) {
					this.drawBevelJoin(x0, y0, x1, y1, x2, y2, thickness);
				}
				if (this.#lineJoin === 'miter') {
					this.drawMiterJoin(x0, y0, x1, y1, x2, y2, thickness);
				}
			}
		}

		if (this.#lineCap !== 'butt') {
			const last = points.length - 2;
			this.drawCap(
				(points[last - 2] - ox) / sx,
				(points[last - 1] - oy) / sy,
				(points[last] - ox) / sx,
				(points[last + 1] - oy) / sy,
				thickness,
				'end',
			);
		}
	};

	/**
	 * Sets a custom orthographic projection matrix defining a rendering window.
	 * Updates internal parameters to map logical coordinates into normalized device coordinates,
	 * allowing rendering to be confined within the specified subregion of the canvas.
	 */
	viewport = (x: number, y: number, x2: number, y2: number) => {
		const dx = x2 - x;
		const dy = y2 - y;

		this.#scaleX = dx / this.ctx.canvas.width;
		this.#scaleY = dy / this.ctx.canvas.height;
		this.#originX = x;
		this.#originY = y;

		this.ctx.projection.set(
			orthographic(
				0,
				this.ctx.canvas.width,
				this.ctx.canvas.height,
				0,
				-1,
				1,
			),
		);
	};

	/**
	 * Resets the viewport to cover the entire canvas,
	 * restoring the default drawing area to match the full rendering surface.
	 */
	resetViewport = () => {
		this.viewport(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	};

	clear = () => {
		this.ctx.clear();
	};

	/**
	 * Resets the drawing context to its default state by restoring the full viewport
	 * and clearing any pending drawing operations or transformations
	 */
	reset = () => {
		this.resetViewport();
		this.ctx.reset();
	};

	protected lineSegment(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		thickness: number,
	) {
		const dx = x1 - x0;
		const dy = y1 - y0;
		let len = Math.sqrt(dx * dx + dy * dy);

		const cos = dx / len;
		const sin = dy / len;

		if (len < 1) len = 1;

		const m4 = thickness * -sin;
		const m5 = thickness * cos;

		this.pushM(
			len * cos,
			len * sin,
			m4,
			m5,
			m4 * -0.5 + x0,
			m5 * -0.5 + y0,
		);
	}

	protected drawRoundJoin(x: number, y: number, thickness: number) {
		this.pushM(
			thickness,
			0,
			0,
			thickness,
			x - thickness / 2,
			y - thickness / 2,
			3,
		);
	}

	protected getBevelPoints(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		thickness: number,
	) {
		const b = this.#bevel;
		const Vx_in = x1 - x0;
		const Vy_in = y1 - y0;
		const len_in = Math.sqrt(Vx_in * Vx_in + Vy_in * Vy_in);
		if (len_in === 0) return;

		const Ux_in = (b.uxIn = Vx_in / len_in);
		const Uy_in = (b.uyIn = Vy_in / len_in);

		const Vx_out = x2 - x1;
		const Vy_out = y2 - y1;
		const len_out = Math.sqrt(Vx_out * Vx_out + Vy_out * Vy_out);
		if (len_out === 0) return;

		const Ux_out = (b.uxOut = Vx_out / len_out);
		const Uy_out = (b.uyOut = Vy_out / len_out);

		// Positive result means a Left (CCW) turn. Negative means a Right (CW) turn.
		const crossProduct = Vx_in * Vy_out - Vy_in * Vx_out;

		b.turn = crossProduct <= 0 ? 1 : -1;

		const w = (thickness / 2) * b.turn;

		b.Ax = x1 + -Uy_in * w;
		b.Ay = y1 + Ux_in * w;
		b.Bx = x1 + -Uy_out * w;
		b.By = y1 + Ux_out * w;

		return b;
	}

	protected drawBevelJoin(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		thickness: number,
	) {
		const bevel = this.getBevelPoints(x0, y0, x1, y1, x2, y2, thickness);
		if (!bevel) return;
		const { Ax, Ay, Bx, By } = bevel;

		const Cx = (Ax + Bx) / 2;
		const Cy = (Ay + By) / 2;

		const dx = Bx - Ax;
		const dy = By - Ay;
		const thick = Math.sqrt(dx * dx + dy * dy);

		this.lineSegment(x1, y1, Cx, Cy, thick);
	}

	protected pushM(
		m0: number,
		m1: number,
		m4: number,
		m5: number,
		m12: number,
		m13: number,
		sdf = 0, // 0 = none, 1 = start-cap, 2 = end-cap, 4 = circle
	) {
		const m = this.#lineM;

		m[0] = m0;
		m[1] = m1;
		m[4] = m4;
		m[5] = m5;
		m[12] = m12;
		m[13] = m13;

		this.ctx.model.pushMultiply(m);
		this.ctx.pushInstance(1, 1, sdf);
		this.ctx.model.pop();
	}

	protected drawMiterJoin(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		thickness: number,
		miterLimit = thickness * 5.0,
	) {
		const w = thickness / 2;
		const bevel = this.getBevelPoints(x0, y0, x1, y1, x2, y2, thickness);
		if (!bevel) return;
		const { Ax, Ay, Bx, By, uxIn, uyIn, uxOut, uyOut, turn } = bevel;

		const dp = uxIn * uxOut + uyIn * uyOut;
		if (dp < -0.9510565162951536) return;

		// Miter vector along bisector pointing outside
		const Mx = (-uyIn - uyOut) * turn;
		const My = (uxIn + uxOut) * turn;

		const Mlen = Math.sqrt(Mx * Mx + My * My);

		if (Mlen === 0) return;

		const sinHalfAngle = Mlen / 2;
		const miterLen = w / sinHalfAngle;

		// Clamp to limit
		if (miterLen > miterLimit) return;

		/*const angleThreshold = Math.PI * 0.9; // ~162 degrees
		const angle = Math.acos(
			Math.max(-1, Math.min(1, uxIn * uxOut + uyIn * uyOut)),
		);

		if (angle > angleThreshold) return;*/

		// Miter/bevel point
		const Px = x1 + (Mx / Mlen) * miterLen;
		const Py = y1 + (My / Mlen) * miterLen;

		this.pushM(Px - Ax, Py - Ay, Bx - Px, By - Py, Ax, Ay);
	}

	protected drawCap(
		x: number,
		y: number,
		x2: number,
		y2: number,
		thickness: number,
		direction: 'start' | 'end',
	) {
		const isStart = direction === 'start';
		const x0 = isStart ? x : x2;
		const y0 = isStart ? y : y2;
		const angle = Math.atan2(y2 - y, x2 - x);
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const off = (thickness / 2) * (isStart ? -1 : 1);
		const m4 = thickness * -sin;
		const m5 = thickness * cos;

		this.pushM(
			off * cos,
			off * sin,
			m4,
			m5,
			m4 * -0.5 + x0,
			m5 * -0.5 + y0,
			this.#lineCap === 'round' ? (isStart ? 1 : 2) : 0,
		);
	}
}
