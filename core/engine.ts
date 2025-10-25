import { Box, composeBox } from './math.js';
import { DrawEngine } from './draw.js';

import type { Color, Program } from './pipeline.js';

type UpdateFn =
	| string
	| ((node: Node, set: (prop: string, value?: unknown) => void) => void);

export interface EngineJson {
	root: Node;
}

export interface TextureInit {
	width?: number;
	height?: number;
	src: string;
}

export interface Node {
	/**
	 * Defines a transform for this node, including position (x, y), size (w, h), scale (sx, sy),
	 * origin offsets (cx, cy), and rotation (in radians).
	 */
	box?: Partial<Box>;

	texture?: TextureInit;

	/**
	 * Specifies child `Node` objects to be recursively loaded and rendered under this node.
	 */
	children?: Node[];

	/**
	 * Specifies a custom update callback or script to run after this node and its children are loaded,
	 * invoked with (node, set, global) for dynamic updates.
	 */
	update?: UpdateFn;

	fill?: Color;

	draw?: (ng: DrawEngine) => void;
}

async function loadArrayBufferFromDataURL({ src, width, height }: TextureInit) {
	const response = await fetch(src);
	const blob = await response.blob();

	const bitmap = await createImageBitmap(blob, {
		resizeWidth: width,
		resizeHeight: height,
	});

	/*const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Invalid context');
	ctx.drawImage(bitmap, 0, 0);

	const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);*/
	return {
		data: bitmap,
		width: bitmap.width,
		height: bitmap.height,
	};
}

export class Engine {
	protected pipeline: (() => void)[] = [];

	#renderId = 0;
	#renderPending = true;
	#draw;

	constructor(public readonly program: Program) {
		this.#draw = new DrawEngine(program);
	}

	async load(node: Node) {
		let needsPush = false;
		const program = this.program;

		if (node.box) {
			const M = composeBox(Box(node.box));
			program.model.pushMultiply(M);
			needsPush = true;
		}

		if (node.fill) {
			program.color.set(node.fill);
			needsPush = true;
		}

		if (node.texture) {
			const txt = program.textureAtlas.add(
				await loadArrayBufferFromDataURL(node.texture),
			);
			program.textureId = txt.id;
			needsPush = true;
		}

		if (needsPush) {
			program.pushInstance();
			program.textureId = 0;
		}

		node.draw?.(this.#draw);

		if (node.children)
			for (const child of node.children) await this.load(child);

		if (node.box) program.model.pop();
		if (node.fill) program.color.reset();

		if (node.update) {
			const set = (_prop: string, _value: unknown) => {
				this.requestRender();
			};

			const fn =
				typeof node.update === 'function'
					? node.update
					: new Function('node', 'global', node.update);
			this.#push(() => fn(node, set));
		}
	}

	reset() {
		this.stop();
		this.program.reset();
		this.pipeline.length = 0;
	}

	resize(_width: number, _height: number) {}

	requestRender() {
		if (this.#renderPending) return;
		this.#renderPending = true;
		cancelAnimationFrame(this.#renderId);
		this.#renderId = requestAnimationFrame(() => {
			this.#renderPending = false;
			for (const p of this.pipeline) p();
		});
	}

	stop() {
		cancelAnimationFrame(this.#renderId);
	}

	#push = (cb: () => void) => {
		this.pipeline.push(cb);
	};
}
