import { engine } from '../core/index.js';

declare global {
	const canvas: HTMLCanvasElement;
}

const demoSelect = document.getElementById('demo') as HTMLSelectElement;
const ng = engine({
	canvas: document.getElementById('canvas') as HTMLCanvasElement,
});

async function onChange() {
	const fn = demoSelect.value;
	const demo = fn.endsWith('.json')
		? await fetch(fn).then(r => r.json())
		: (await import(`./${fn}`)).default;
	ng.reset();
	ng.load(demo);
	ng.render();
}

demoSelect.onchange = onChange;
onChange();
