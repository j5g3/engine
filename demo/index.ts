import { webgpu } from '../core/pipeline.js';
import { DrawEngine } from '../core/draw.js';

declare global {
	const canvas: HTMLCanvasElement;
}

export interface DrawNode {
	draw(ng: DrawEngine): void;
}

const demoSelect = document.getElementById('demo') as HTMLSelectElement;
const program = await webgpu({
	canvas: document.getElementById('canvas') as HTMLCanvasElement,
});
const draw = new DrawEngine(program);
let demo: { draw(ng: DrawEngine): void };

async function onChange() {
	const fn = demoSelect.value;
	demo = fn.endsWith('.json')
		? await fetch(fn).then(r => r.json())
		: (await import(`./${fn}.js`)).default;

	try {
		history.pushState(undefined, '', `?${fn}`);
	} catch (e) {}
	demo.draw(draw);
	program.draw();
}

demoSelect.onchange = onChange;
onChange();
