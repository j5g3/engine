import { orthographic, matrix } from './math.js';

import type { Matrix } from './math.js';
import type { Color, Program } from './pipeline.js';

/**
 * Configures the transformation matrix to scale and position a rectangle
 * by adjusting scale factors and translation components to fit within the given coordinates.
 */
function scaleM(m: Matrix, x: number, y: number, w: number, h: number) {
	m[0] = w / 2;
	m[5] = h / 2;
	m[12] = x + w / 2;
	m[13] = y + h / 2;
}

/**
 * Encapsulates all drawing operations and manages transformation state, color settings,
 * and viewport configurations.
 */
export class DrawEngine {
	#RECT_M = matrix();

	constructor(protected ctx: Program) {
		this.resetViewport();
	}

	/**
	 * Sets the fill color for subsequent drawing operations.
	 */
	readonly color = (fill: Color, _stroke?: Color) => {
		this.ctx.color.set(fill);
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
		scaleM(this.#RECT_M, x, y, w, h);
		this.ctx.model.pushMultiply(this.#RECT_M);
		this.ctx.pushInstance();
		this.ctx.model.pop();
	};

	/**
	 * Sets a custom orthographic projection matrix defining a rendering window.
	 * Updates internal parameters to map logical coordinates into normalized device coordinates,
	 * allowing rendering to be confined within the specified subregion of the canvas.
	 */
	viewport = (x: number, y: number, x2: number, y2: number) => {
		this.ctx.projection.set(orthographic(x, x2, y2, y, -1, 1));
	};

	/**
	 * Resets the viewport to cover the entire canvas,
	 * restoring the default drawing area to match the full rendering surface.
	 */
	resetViewport = () => {
		this.viewport(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	};

	/**
	 * Resets the drawing context to its default state by restoring the full viewport
	 * and clearing any pending drawing operations or transformations
	 */
	reset = () => {
		this.resetViewport();
		this.ctx.reset();
	};
}
