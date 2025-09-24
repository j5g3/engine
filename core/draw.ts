import { orthographic, matrix } from './math.js';

import type { Matrix } from './math.js';
import { RenderMode, Color, Texture, WebglContext } from './program.js';

export type DrawEngine = ReturnType<typeof drawEngine>;

const GL = WebGL2RenderingContext;

export function drawEngine(ctx: WebglContext) {
	function color(fill: Color, stroke?: Color) {
		ctx.color.set(fill);
		if (stroke !== undefined) _strokeColor = stroke;
	}

	function fillColor(newColor: Color) {
		ctx.color.set(newColor);
	}

	function strokeColor(color: Color) {
		_strokeColor = color;
	}

	function strokeWidth(width: number) {
		ctx.strokeWidth.set(width);
	}

	function strokeCap(cap: 'round' | 'square' | 'butt') {
		ctx.capType.set(cap === 'round' ? 2 : cap === 'square' ? 1 : 0);
	}

	function strokeJoin(join: 'none' | 'bevel' | 'round' | 'miter') {
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

	function texture(newTexture: Texture) {
		ctx.texture.set(newTexture);
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
		polyline([x0, y0, x1, y1]);
	}

	function polyline(points: ArrayLike<number>) {
		const nPoints = points.length >> 1;
		if (nPoints < 2) return;

		// Calculate vertices needed: 6 per segment + potential cap vertices
		const segCount = nPoints - 1;
		let totalVerts = segCount * 6;

		// each vertex carries 4 floats for data0 and 4 for data1
		const buf0 = new Float32Array(totalVerts * 4);
		const buf1 = new Float32Array(totalVerts * 4);
		let o0 = 0,
			o1 = 0;

		const corner = [
			[0, 1],
			[1, 1],
			[1, -1],
			[0, 1],
			[1, -1],
			[0, -1],
		];

		for (let i = 0; i < segCount; i++) {
			const x0 = points[2 * i],
				y0 = points[2 * i + 1];
			const x1 = points[2 * i + 2],
				y1 = points[2 * i + 3];

			// Determine previous and next points
			let px = points[2 * i - 2];
			let py = points[2 * i - 1];
			let nx = points[2 * (i + 2)];
			let ny = points[2 * (i + 2) + 1];

			for (let k = 0; k < corner.length; k++) {
				const [t, side] = corner[k] as [number, number];

				buf0[o0++] = x0;
				buf0[o0++] = y0;
				buf0[o0++] = x1;
				buf0[o0++] = y1;

				// This value represents the line's t parameter: 0 at the segment start, 1 at the end.
				// It also signals whether to apply a start cap or end cap on the line.
				buf1[o1++] = i === 0 ? t + 2 : i === segCount - 1 ? t - 2 : t;
				// Side of the line from -1 to 1
				buf1[o1++] = side;
				if (i === 0 && t === 0) {
					buf1[o1++] = nx; //x0 - (x1 - x0);
					buf1[o1++] = ny; //y0 - (y1 - y0);
				} else if (i === segCount - 1 && t === 1) {
					buf1[o1++] = px; //x1 + (x1 - x0);
					buf1[o1++] = py; //y1 + (y1 - y0);
				} else {
					buf1[o1++] = t === 0 ? px : nx;
					buf1[o1++] = t === 0 ? py : ny;
				}
			}
		}

		ctx.position.disable();
		ctx.normal.disable();
		ctx.texcoord.disable();
		ctx.tangent.disable();
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
		ctx.renderMode.push(nPoints > 2 ? 2 : 1);
		if (_strokeColor) ctx.color.push(_strokeColor);

		ctx.draw(totalVerts, 0, GL.TRIANGLES);

		if (_strokeColor) ctx.color.pop();

		ctx.renderMode.pop();
		ctx.position.enable();
		ctx.data0.disable();
		ctx.data1.disable();
	}

	function rect(x: number, y: number, w: number, h: number) {
		ctx.renderMode.set(RenderMode.quad);
		scaleM(RECT_M, x, y, w, h);
		pushDraw(RECT_M);

		if (ctx.strokeWidth.value > 0) {
			polyline([x, y, x + w, y, x + w, y + h, x, y + h, x, y]);
		}
	}

	function scaleM(m: Matrix, x: number, y: number, w: number, h: number) {
		m[0] = w;
		m[5] = h;
		m[12] = x;
		m[13] = y;
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
		const strokeW = ctx.strokeWidth.value;
		const halfStrokeX = (strokeW * unitX) / 2;
		const halfStrokeY = (strokeW * unitY) / 2;
		const outerRx = ndcRx + halfStrokeX;
		const outerRy = ndcRy + halfStrokeY;
		const innerRx = Math.max(0, ndcRx - halfStrokeX);
		const innerRy = Math.max(0, ndcRy - halfStrokeY);

		const fillCount = segments + 2; // center + segments + duplicate first
		const strokeCount = strokeW > 0 ? (segments + 1) * 2 : 0;
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
			usage: GL.STREAM_DRAW,
		});

		ctx.draw(fillCount, 0, GL.TRIANGLE_FAN);

		// draw stroke strip if needed
		if (strokeCount) {
			if (_strokeColor) ctx.color.push(_strokeColor);
			ctx.draw(strokeCount, fillCount, GL.TRIANGLE_STRIP);
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
	function viewport(x: number, y: number, x2: number, y2: number) {
		const w = x2 - x;
		const h = y2 - y;
		ctx.projection.set(orthographic(x, x2, y, y2, -1, 1));

		activeViewport.x = x;
		activeViewport.y = y;
		activeViewport.x2 = x2;
		activeViewport.y2 = y2;

		PIXEL_M[0] = unitX = w / ctx.canvas.width;
		PIXEL_M[5] = unitY = h / ctx.canvas.height;

		// how many pixels per world‐unit
		activeViewport.pw = unitX;
		activeViewport.ph = unitY;
	}

	function resetViewport() {
		viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	function reset() {
		resetViewport();
		ctx.strokeWidth.reset();
		ctx.color.reset();
		_strokeColor = undefined;
	}

	const PIXEL_M = matrix();
	const RECT_M = matrix();
	const whiteTexture = ctx.createColorTexture([1, 1, 1, 1]);
	const activeViewport = { x: 0, y: 0, x2: 0, y2: 0, pw: 0, ph: 0 };
	const TWOPI = Math.PI * 2;

	// width and height of 1 pixel
	let unitX = 1,
		unitY = 1;
	let _strokeColor: Color | undefined;

	texture(whiteTexture);
	resetViewport();

	ctx.normal.disable();
	ctx.texcoord.disable();
	ctx.tangent.disable();
	ctx.data0.disable();
	ctx.data1.disable();

	return {
		color,
		fillColor,
		strokeCap,
		strokeColor,
		strokeWidth,
		strokeJoin,
		putpixel,
		texture,
		line,
		polyline,
		rect,
		arc,
		circle,
		viewport,
		resetViewport,
		activeViewport,
		ellipse,
		reset,
	};
}
