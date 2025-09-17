import { Box, composeBox, orthographic, matrix } from './matrix.js';

import type { Matrix } from './matrix.js';
import type { Color, Texture, WebglContext } from './program.js';

export type DrawEngine = ReturnType<typeof drawEngine>;

interface Stroke {
	width?: number;
	color?: Color;
	cap?: 'butt' | 'round' | 'square';
	join?: 'none' | 'miter' | 'round' | 'bevel';
}

const GL = WebGL2RenderingContext;

export function drawEngine(ctx: WebglContext) {
	function color(newColor: Color) {
		ctx.color.set(newColor);
	}

	function texture(newTexture: Texture) {
		ctx.texture.set(newTexture);
	}

	function stroke({ width, color, cap, join }: Stroke) {
		if (width !== undefined) _strokeWidth = width;
		if (color) _strokeColor = color;
		if (cap)
			ctx.capType.set(cap === 'round' ? 2 : cap === 'square' ? 1 : 0);
		if (join)
			ctx.joinType.set(
				join === 'miter'
					? 1
					: join === 'bevel'
					? 2
					: join === 'round'
					? 3
					: 0,
			);
	}

	function pushDraw(m: Matrix) {
		ctx.model.pushMult(m);
		ctx.draw();
		ctx.model.pop();
	}

	function putpixel(x: number, y: number) {
		PIXEL_M[12] = x;
		PIXEL_M[13] = y;
		pushDraw(PIXEL_M);
	}

	function line(x0: number, y0: number, x1: number, y1: number) {
		//polyline([x0, y0, x1, y1]);
		const d = Math.hypot(x1 - x0, y1 - y0);
		const a = Math.atan2(y1 - y0, x1 - x0);
		const h = _strokeWidth * unitY;

		LINE_BOX.x = x0;
		LINE_BOX.y = y0;
		LINE_BOX.w = d;
		LINE_BOX.h = h;
		LINE_BOX.cy = h / 2;
		LINE_BOX.rotation = a;

		composeBox(LINE_BOX, LINE_M);
		pushDraw(LINE_M);
	}

	function polyline(points: ArrayLike<number>) {
		const nPoints = points.length >> 1;
		if (nPoints < 2) return;

		// Calculate vertices needed: 6 per segment + potential cap vertices
		const segCount = nPoints - 1;
		let totalVerts = segCount * 6;

		// Add cap vertices if needed (for round caps, you'd need more)
		if (ctx.capType.value !== 0) {
			totalVerts += 12; // 6 vertices for start cap + 6 for end cap
		}

		// each vertex carries 4 floats for data0 and 4 for data1
		const buf0 = new Float32Array(totalVerts * 4);
		const buf1 = new Float32Array(totalVerts * 4);
		let o0 = 0,
			o1 = 0;

		// Helper function to add vertices
		function addVertex(
			x0: number,
			y0: number,
			x1: number,
			y1: number,
			t: number,
			side: number,
			nx: number,
			ny: number,
		) {
			buf0[o0++] = x0;
			buf0[o0++] = y0;
			buf0[o0++] = x1;
			buf0[o0++] = y1;
			buf1[o1++] = t;
			buf1[o1++] = side;
			buf1[o1++] = nx;
			buf1[o1++] = ny;
		}

		const corner = [
			[0, 1],
			[1, 1],
			[1, -1],
			[0, 1],
			[1, -1],
			[0, -1],
		];

		// Add start cap if needed
		if (ctx.capType.value !== 0) {
			const x0 = points[0],
				y0 = points[1];
			const x1 = points[2],
				y1 = points[3];
			for (let k = 0; k < corner.length; k++) {
				const [t, side] = corner[k] as [number, number];
				// Use negative t values for start cap
				addVertex(x0, y0, x1, y1, t - 1, side, 0, 0);
			}
		}

		for (let i = 0; i < segCount; i++) {
			const x0 = points[2 * i],
				y0 = points[2 * i + 1];
			const x1 = points[2 * i + 2],
				y1 = points[2 * i + 3];

			let nx: number, ny: number;
			if (i < segCount - 1) {
				nx = points[2 * (i + 2)];
				ny = points[2 * (i + 2) + 1];
			} else {
				nx = 0; // No next segment
				ny = 0;
			}

			for (let k = 0; k < corner.length; k++) {
				const [t, side] = corner[k] as [number, number];

				addVertex(x0, y0, x1, y1, t, side, nx, ny);
			}
		}

		// Add end cap if needed
		if (ctx.capType.value !== 0) {
			const x0 = points[points.length - 4],
				y0 = points[points.length - 3];
			const x1 = points[points.length - 2],
				y1 = points[points.length - 1];
			for (let k = 0; k < corner.length; k++) {
				const [t, side] = corner[k] as [number, number];
				// Use t values > 1 for end cap
				addVertex(x0, y0, x1, y1, t + 1, side, 0, 0);
			}
		}

		ctx.data0.enable();
		ctx.data1.enable();
		ctx.data0.set({
			data: buf0.buffer,
			size: 4,
			usage: GL.STREAM_DRAW,
		});
		ctx.data1.set({
			data: buf1.buffer,
			size: 4,
			usage: GL.STREAM_DRAW,
		});

		// switch into the line‐drawing shader path
		ctx.renderMode.set(1);
		ctx.strokeWidth.set(_strokeWidth);
		if (_strokeColor) ctx.color.push(_strokeColor);

		ctx.draw(totalVerts, 0, GL.TRIANGLES);

		if (_strokeColor) ctx.color.pop();

		ctx.data0.disable();
		ctx.data1.disable();
	}

	function rect(x: number, y: number, w: number, h: number) {
		if (w < 0) {
			x = x + w;
			w = -w;
		}
		if (h < 0) {
			y = y + h;
			h = -h;
		}
		scaleM(RECT_M, x, y, w, h);
		const nw = RECT_M[0];
		const nh = RECT_M[5];
		const nx = RECT_M[12];
		const ny = RECT_M[13];
		RECT_M[5] = unitY;
		pushDraw(RECT_M);

		RECT_M[13] = ny + nh - unitY;
		pushDraw(RECT_M);

		RECT_M[0] = unitX;
		RECT_M[5] = unitY - nh;
		pushDraw(RECT_M);

		RECT_M[12] = nx + nw - unitX;
		pushDraw(RECT_M);
	}

	function scaleM(m: Matrix, x: number, y: number, w: number, h: number) {
		m[0] = w; // * viewScaleX;
		m[5] = h; // * viewScaleY;
		m[12] = x; //(x - viewMinX) * viewScaleX;
		m[13] = y; //(y - viewMinY) * viewScaleY;
	}

	function fillRect(x: number, y: number, w: number, h: number) {
		scaleM(RECT_M, x, y, w, h);
		pushDraw(RECT_M);
	}

	function arc(
		x0: number,
		y0: number,
		rx: number,
		ry: number,
		start: number,
		stop: number,
	) {
		start = ((start % TWOPI) + TWOPI) % TWOPI;
		stop = ((stop % TWOPI) + TWOPI) % TWOPI;
		if (stop <= start) stop += TWOPI;
		const angleRange = stop - start;

		const screenRx = Math.abs(rx / unitX); // * viewScaleX * ctx.canvas.width;
		const screenRy = Math.abs(ry / unitY); // * viewScaleY * ctx.canvas.height;
		// how many pixels per segment you’re comfortable with
		const maxPixelPerSegment = 1;
		// number of segments so that each spans at most maxPixelPerSegment
		const segments = Math.max(
			4,
			Math.ceil(
				(angleRange * Math.max(screenRx, screenRy)) /
					maxPixelPerSegment,
			),
		);

		const delta = angleRange / segments;

		// NDC center and radii
		const cx = x0;
		const cy = y0;
		const ndcRx = rx; // * viewScaleX;
		const ndcRy = ry; // * viewScaleY;

		// stroke half‐sizes
		const halfStrokeX = (_strokeWidth * unitX) / 2;
		const halfStrokeY = (_strokeWidth * unitY) / 2;
		const outerRx = ndcRx + halfStrokeX;
		const outerRy = ndcRy + halfStrokeY;
		const innerRx = Math.max(0, ndcRx - halfStrokeX);
		const innerRy = Math.max(0, ndcRy - halfStrokeY);

		const fillCount = segments + 2; // center + segments + duplicate first
		const strokeCount = _strokeWidth > 0 ? (segments + 1) * 2 : 0;
		const verts = new Float32Array((fillCount + strokeCount) * 3);
		let o = 0;

		verts[o++] = cx;
		verts[o++] = cy;
		verts[o++] = 0;

		// rim of the fill‐fan
		for (let i = 0; i <= segments; i++) {
			const a = start + delta * i;
			const cosA = Math.cos(a);
			const sinA = Math.sin(a);
			verts[o++] = cx + cosA * ndcRx;
			verts[o++] = cy - sinA * ndcRy;
			verts[o++] = 0;
		}

		// stroke ring (triangle-strip) immediately after
		if (strokeCount) {
			for (let i = 0; i <= segments; i++) {
				const a = start + delta * i;
				const cosA = Math.cos(a);
				const sinA = Math.sin(a);
				// outer
				verts[o++] = cx + cosA * outerRx;
				verts[o++] = cy - sinA * outerRy;
				verts[o++] = 0;
				// inner
				verts[o++] = cx + cosA * innerRx;
				verts[o++] = cy - sinA * innerRy;
				verts[o++] = 0;
			}
		}

		ctx.position.set({
			data: verts.buffer,
			size: 3,
			usage: WebGL2RenderingContext.STREAM_DRAW,
		});

		ctx.draw(fillCount, 0, WebGL2RenderingContext.TRIANGLE_FAN);

		// draw stroke strip if needed
		if (strokeCount) {
			if (_strokeColor) ctx.color.push(_strokeColor);
			ctx.draw(
				strokeCount,
				fillCount,
				WebGL2RenderingContext.TRIANGLE_STRIP,
			);
			if (_strokeColor) ctx.color.pop();
		}

		ctx.position.reset();
	}

	function ellipse(x: number, y: number, rx: number, ry: number) {
		arc(x, y, rx, ry, 0, 2 * Math.PI);
	}

	function circle(x: number, y: number, radius: number) {
		arc(x, y, radius, radius, 0, 2 * Math.PI);
	}

	/*function readScreen() {
		if (!screenTexture) {
			screenTexture = ctx.frag.createTexture();
			screenData = new ImageData(ctx.width, ctx.height);
		}
		ctx.frag.readPixels(screenData.data);
		return screenData;
	}

	function drawScreen(image: ImageData) {
		RECT_M[0] = image.width;
		RECT_M[5] = image.height;
		RECT_M[12] = 0;
		RECT_M[13] = 0;
		const hasWindow = windowActive;

		if (hasWindow) resetWindow();
		ctx.vtx.pushMatrix(RECT_M);
		ctx.frag.updateTexture(screenTexture, image);
		ctx.frag.setColor(WhiteColor);
		ctx.draw();
		ctx.vtx.popMatrix();
		if (hasWindow) restoreWindow();
	}

	function boundaryFill(x: number, y: number, color: Color, border = color) {
		readScreen();
		softBoundaryFill(
			screenData,
			windowActive ? getScreenX(x) : Math.round(x),
			windowActive ? getScreenY(y) : Math.round(y),
			color,
			border
		);
		drawScreen(screenData);
	}

	function floodFill(x: number, y: number, color: Color) {
		readScreen();
		softFloodFill(
			screenData,
			windowActive ? getScreenX(x) : Math.round(x),
			windowActive ? getScreenY(y) : Math.round(y),
			color
		);
		drawScreen(screenData);
	}*/

	/*function draw2DTexture(
		texture: WebGLTexture,
		x: number,
		y: number,
		w: number,
		h: number,
	) {
		scaleM(RECT_M, x, y, w, h);
		ctx.texture.set(texture);
		ctx.color.set(whiteColor);
		pushDraw(RECT_M);
	}

	/*function drawImage(
		src: TexImageSource,
		x: number,
		y: number,
		w: number,
		h: number
	) {
		if (!drawTexture) drawTexture = ctx.createTexture(src);
		else ctx.updateTexture(drawTexture, src);
		draw2DTexture(drawTexture, x, y, w, h);
	}*/

	/**
	 * Sets a custom orthographic projection matrix defining a rendering window.
	 * Updates internal parameters to map logical coordinates into normalized device coordinates,
	 * allowing rendering to be confined within the specified subregion of the canvas.
	 */
	function window(x: number, y: number, x2: number, y2: number) {
		const w = x2 - x;
		const h = y2 - y;
		//windowM = orthographic(x, x2, y, y2, -1, 1);
		windowM = orthographic(x, x2, y, y2, -1, 1);
		ctx.projection.set(windowM);

		activeWindow.x = x;
		activeWindow.y = y;
		activeWindow.x2 = x2;
		activeWindow.y2 = y2;

		PIXEL_M[0] = unitX = w / ctx.canvas.width;
		PIXEL_M[5] = unitY = h / ctx.canvas.height;

		// how many pixels per world‐unit
		activeWindow.pw = unitX;
		activeWindow.ph = unitY;

		LINE_BOX.h = unitY;
		LINE_BOX.cx = unitX * 0.5;
	}

	function resetWindow() {
		window(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	const PIXEL_M = matrix();
	const LINE_M = matrix();
	const RECT_M = matrix();
	const LINE_BOX = Box();
	const whiteTexture = ctx.createColorTexture([1, 1, 1, 1]);
	const activeWindow = { x: 0, y: 0, x2: 0, y2: 0, pw: 0, ph: 0 };
	const TWOPI = Math.PI * 2;

	let windowM: Matrix;
	// width and height of 1 pixel
	let unitX = 1,
		unitY = 1;
	let _strokeWidth = 1,
		_strokeColor: Color | undefined;

	texture(whiteTexture);
	resetWindow();

	ctx.normal.disable();
	ctx.texcoord.disable();
	ctx.tangent.disable();

	return {
		color,
		putpixel,
		texture,
		line,
		polyline,
		rect,
		fillRect,
		arc,
		circle,
		window,
		resetWindow,
		stroke,
		activeWindow,
		ellipse,
	};
}
