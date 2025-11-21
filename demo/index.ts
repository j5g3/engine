import { webgpu } from '../core/pipeline.js';
import { Engine, EngineJson } from '../core/engine.js';

declare global {
	const canvas: HTMLCanvasElement;
}

const demoSelect = document.getElementById('demo') as HTMLSelectElement;
const program = await webgpu({
	canvas: document.getElementById('canvas') as HTMLCanvasElement,
});
let engine: Engine;
const url = new URL(location.href);
let demo: EngineJson;

const demos = {
	lines: () => import('./lines.js'),
	rect: () => import('./rect.js'),
	circles: () => import('./circles.js'),
} as const;

async function onChange() {
	const fn = demoSelect.value;

	demo = fn.endsWith('.json')
		? await fetch(fn).then(r => r.json())
		: (await demos[fn as keyof typeof demos]()).default;

	url.searchParams.set('demo', fn);

	try {
		history.pushState(undefined, '', url.search);
	} catch (e) {
		console.error(e);
	}

	engine?.reset();
	engine ??= new Engine(program);
	await engine.load(demo.root);
	engine.requestRender();
}

const initialDemo = url.searchParams.get('demo');
if (initialDemo) demoSelect.value = initialDemo;

demoSelect.onchange = onChange;
onChange();
