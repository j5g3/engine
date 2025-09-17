import { Box, composeBox } from './matrix.js';
import { webgl2 } from './program.js';

import type { Color, Texture, TextureOptions } from './program.js';

type UpdateFn =
	| string
	| ((node: Node, set: (prop: string, value?: unknown) => void) => void);

export type Engine = ReturnType<typeof engine>;

export interface Node {
	/**
	 * Defines a transform for this node, including position (x, y), size (w, h), scale (sx, sy),
	 * origin offsets (cx, cy), and rotation (in radians).
	 */
	box?: Partial<Box>;

	/**
	 * Specifies a `TextureComponent` for this node, providing the image or buffer source (`src`)
	 * and texture parameters (filters, wrapping, format) for rendering.
	 */
	texture?: TextureOptions;

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
}

export type Plugin = {
	clear(): void;
	set(node: Node, prop: string, value: unknown): void;
	begin(node: Node, push: (cb: () => void) => void): void;
	end?(node: Node, push: (cb: () => void) => void): void;
	resize?(width: number, height: number): void;
};

export interface EngineOptions {
	canvas: HTMLCanvasElement | OffscreenCanvas;

	// If present the canvas will be attached to the specified element.
	container?: HTMLElement | string;

	// For JSON only, will be passed to update functions.
	global?: string;
}

export function engine(p: EngineOptions) {
	function boxComponent(box: Partial<Box>) {
		const M = composeBox(Box(box));
		push(() => {
			program.model.pushMult(M);
			program.draw();
		});
	}

	async function load(node: Node) {
		const { update, fill } = node;
		let _texture: Texture;

		if (node.texture) {
			_texture = program.createTexture(node.texture);
			push(() => program.texture.push(_texture));
		}
		if (fill) push(() => program.color.push(fill));

		if (node.box) boxComponent(node.box);

		if (plugins) for (const plug of plugins) plug.begin(node, push);

		if (node.children) for (const child of node.children) await load(child);

		if (node.box) push(() => program.model.pop());
		if (fill) push(() => program.color.pop());
		if (node.texture) push(() => program.texture.pop());

		if (plugins) for (const plug of plugins) plug.end?.(node, push);

		if (update) {
			function set(prop: string, value: unknown) {
				switch (prop) {
					case 'texture':
						_texture?.update();
						break;
					default:
						for (const plug of plugins) plug.set(node, prop, value);
				}
				requestRender();
			}

			const fn =
				typeof update === 'function'
					? update
					: new Function('node', 'global', update);
			push(() => fn(node, set, global));
		}
	}

	function push(cb: () => void) {
		pipeline.push(cb);
	}

	function render() {
		renderPending = false;
		program.clear();
		for (const plug of plugins) plug.clear();
		for (const p of pipeline) p();
	}

	function reset() {
		stop();
		pipeline.length = 0;
	}

	function resize(width: number, height: number) {
		program.resizeViewport(width, height);
		for (const plug of plugins) plug.resize?.(width, height);
	}

	function requestRender() {
		if (renderPending) return;
		renderPending = true;
		cancelAnimationFrame(renderId);
		renderId = requestAnimationFrame(render);
	}

	function stop() {
		cancelAnimationFrame(renderId);
	}

	function plugin(plug: Plugin) {
		plugins.push(plug);
	}

	const program = webgl2(p);
	const canvas = program.canvas;
	const global = p.global && new Function(p.global)();
	const pipeline: (() => void)[] = [];
	const plugins: Plugin[] = [];
	let renderId = 0;
	let renderPending = true;

	return {
		canvas,
		load,
		reset,
		render,
		resize,
		program,
		stop,
		plugin,
	};
}
