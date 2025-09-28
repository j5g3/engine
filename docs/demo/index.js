import { webgpu } from '../core/pipeline.js';
import { DrawEngine } from '../core/draw.js';
const demoSelect = document.getElementById('demo');
const program = await webgpu({
    canvas: document.getElementById('canvas'),
});
const draw = new DrawEngine(program);
let demo;
async function onChange() {
    const fn = demoSelect.value;
    demo = fn.endsWith('.json')
        ? await fetch(fn).then(r => r.json())
        : (await import(`./${fn}`)).default;
    history.pushState(undefined, '', `?${fn}`);
    demo.draw(draw);
    program.draw();
}
demoSelect.onchange = onChange;
onChange();
