import { DrawEngine, Node, drawEngine, engine } from '../core/index.js';

declare global {
	const canvas: HTMLCanvasElement;
}

export interface DrawNode extends Node {
	draw(ng: DrawEngine): void;
}

const demoSelect = document.getElementById('demo') as HTMLSelectElement;
const ng = engine({
	canvas: document.getElementById('canvas') as HTMLCanvasElement,
});
const draw = drawEngine(ng.program);

ng.plugin({
	clear() {},
	set() {},
	begin(n: DrawNode, push) {
		if (n.draw) {
			push(() => n.draw(draw));
		}
	},
});

if (location.search) demoSelect.value = location.search.slice(1);

async function onChange() {
	const fn = demoSelect.value;
	const demo = fn.endsWith('.json')
		? await fetch(fn).then(r => r.json())
		: (await import(`./${fn}`)).default;

	history.pushState(undefined, '', `?${fn}`);
	console.log(demo);

	ng.reset();
	draw.reset();
	ng.load(demo);
	ng.render();
}

document.getElementById('btnRender')!.onclick = () => ng.render();

demoSelect.onchange = onChange;
onChange();
