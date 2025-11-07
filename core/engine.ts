import { Matrix, Box, composeBox } from './math.js';
import { DrawEngine } from './draw.js';

import type { TextureInit } from './texture-atlas.js';
import type { Color, Program } from './pipeline.js';

type UpdateFn = string | ((node: Node, get: (id: string) => Node) => void);

export interface EngineJson {
	root: Node;
}

export interface TextureComponent {
	width?: number;
	height?: number;
	src: string;
}

export interface Node {
	readonly id?: string;

	/**
	 * Defines a transform for this node, including position (x, y), size (w, h), scale (sx, sy),
	 * origin offsets (cx, cy), and rotation (in radians).
	 */
	box?: Partial<Box>;

	texture?: TextureComponent;

	/**
	 * Specifies child `Node` objects to be recursively loaded and rendered under this node.
	 */
	readonly children?: Node[];

	/**
	 * Specifies a custom update callback or script to run after this node and its children are loaded.
	 */
	readonly update?: UpdateFn;

	fill?: Color;

	draw?: (ng: DrawEngine) => void;
}

interface CompiledNode extends Node {
	box?: Box & { dirty: boolean; parentM: Matrix };
	_instanceIndex: number;
}

export async function imageLoad({ src, width, height }: TextureComponent) {
	return new Promise<TextureInit>(resolve => {
		const img = new Image();
		img.src = src;
		img.addEventListener('load', () => {
			resolve({
				data: img,
				width: width ?? img.naturalWidth,
				height: height ?? img.naturalHeight,
			});
		});
	});
}

export async function imageDataFromDataURL({
	src,
	width,
	height,
}: TextureComponent): Promise<ImageData> {
	const response = await fetch(src);
	const blob = await response.blob();

	const bitmap = await createImageBitmap(blob, {
		resizeWidth: width,
		resizeHeight: height,
	});

	const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Invalid context');
	ctx.drawImage(bitmap, 0, 0);

	return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}

export class Engine {
	protected pipeline: (() => void)[] = [];
	protected commit: (() => void)[] = [];

	#renderId = 0;
	#renderPending = false;
	#draw;
	#instances = new Map<string, Node>();

	constructor(public readonly program: Program) {
		this.#draw = new DrawEngine(program);
	}

	async load(node: Node) {
		const program = this.program;
		const compiledNode = node as CompiledNode;

		if (compiledNode.box) {
			node.box = Box(node.box);
			compiledNode.box.dirty = false;
			compiledNode.box.parentM = program.model.value;
			const M = composeBox(compiledNode.box);
			program.model.pushMultiply(M);
		}

		if (node.fill) {
			program.color.set(node.fill);
		}

		if (node.texture) {
			const txt = program.textureAtlas.add(await imageLoad(node.texture));
			program.textureId = txt.id;
		}

		compiledNode._instanceIndex = program.instanceBuffer.count;
		program.pushInstance(node.box?.w ?? 1, node.box?.h ?? 1).slice(0);
		if (node.id) this.#instances.set(node.id, node);

		program.textureId = 0;

		node.draw?.(this.#draw);

		if (node.children)
			for (const child of node.children) await this.load(child);

		if (node.box) program.model.pop();
		if (node.fill) program.color.reset();

		if (node.update) {
			const get = (id: string) => {
				const record = this.#instances.get(id);
				if (!record) throw new Error(`Invalid id: "${id}"`);
				return record;
			};

			const fn =
				typeof node.update === 'function'
					? node.update
					: new Function('node', 'get', node.update);
			this.#push(() => fn(node, get));
		}

		this.commit.push(() => {
			if (compiledNode.box?.dirty) {
				const M = composeBox(compiledNode.box);
				program.model.set(compiledNode.box.parentM);
				program.model.pushMultiply(M);
				program.instanceBuffer.setInstance(
					compiledNode._instanceIndex,
					program.model.value,
				);
				compiledNode.box.dirty = false;
				this.requestRender();
			}
		});
	}

	reset() {
		this.stop();
		this.program.reset();
		this.pipeline.length = 0;
		this.commit.length = 0;
	}

	requestRender() {
		if (this.#renderPending) return;
		this.#renderPending = true;
		cancelAnimationFrame(this.#renderId);
		this.#renderId = requestAnimationFrame(() => {
			this.#renderPending = false;
			for (const p of this.pipeline) p();
			for (const p of this.commit) p();
			this.program.draw();
		});
	}

	stop() {
		cancelAnimationFrame(this.#renderId);
		this.#renderPending = false;
	}

	#push = (cb: () => void) => {
		this.pipeline.push(cb);
	};
}
