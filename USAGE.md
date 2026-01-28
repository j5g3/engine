## Features

### Engine

- **Scene graph**: compose your scene as a tree of nodes (`children`)
- **Transforms**: per-node position/size/scale/origin/rotation via `box`
- **Textures**: per-node image textures (`texture.src`, optional `width`/`height`)
- **Solid fills**: per-node `fill` color
- **Custom drawing**: per-node `draw(ng, requestRender)` hook
- **Updates / scripting**: per-node `update` as a function or inline script string
- **Render scheduling**: `requestRender()` to trigger a rerender (frame-coalesced)

### DrawEngine (immediate-mode drawing)

- **Basic shapes**: rectangles, circles, ellipses, arcs/rings
- **Lines & polylines**: configurable stroke width, caps, and joins
    - caps: `butt | square | round`
    - joins: `none | bevel | round | miter`
- **Viewport control**: set a custom viewport window or reset to full canvas
- **State helpers**: set fill/stroke color, clear, reset

## Node schema

```ts
type Node = {
	id?: string;

	box?: {
		x?: number;
		y?: number;
		w?: number;
		h?: number;
		sx?: number;
		sy?: number;
		cx?: number;
		cy?: number;
		r?: number; // radians
	};

	texture?: { src: string; width?: number; height?: number };

	fill?: Color;

	children?: Node[];

	update?: string | ((node: Node, get: (id: string) => Node) => void);

	draw?: (ng: DrawEngine, requestRender: () => void) => void;
};
```

## Basic usage

```ts
import { Engine } from './core/engine.js';

const engine = new Engine(program);

await engine.load({
	children: [
		{
			id: 'sprite',
			box: { x: 100, y: 80, w: 64, h: 64 },
			texture: { src: '/assets/sprite.png' },
			update: node => {
				node.box!.x! += 1;
				// call requestRender() from draw/update via provided callback if needed
			},
		},
	],
});

engine.requestRender();
```
