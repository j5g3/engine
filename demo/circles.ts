import type { EngineJson } from '../core/index.js';

let t = 0;

export default {
	root: {
		draw(
			{
				clear,
				color,
				strokeWidth,
				strokeColor,
				line,
				arc,
				circle,
				ellipse,
			},
			next,
		) {
			function crosshair(x: number, y: number, d = 6) {
				strokeWidth(1.5);
				strokeColor([0.2, 0.6, 1.0, 1]);
				line(x - d, y, x + d, y);
				line(x, y - d, x, y + d);
			}

			clear();
			const a0 = -Math.PI * 0.25;
			const a1 = a0 + Math.PI * 1.25 + Math.sin(t) * 0.5; // animate sweep

			color([0, 0, 0, 1]);
			arc(180, 360, a0, a1, 80);
			arc(380, 360, a0 + Math.sin(t) * 0.5, a1, 80, 10);
			arc(580, 360, a0, a1, 80, 10 * t);

			const centerY = 160;
			const sweepsDeg = [30, 45, 60, 90, 120, 180, 270, 360];

			sweepsDeg.forEach((deg, i) => {
				const a1 = (deg * Math.PI) / 180;
				const x = 140 + i * 140;
				color([0, 0, 0, 1]);
				arc(x, centerY, 0, a1, 60);
				crosshair(x, centerY);
			});

			color([0, 0, 0, 1]);
			ellipse(180, 540, 140, 70);

			crosshair(180, 540);

			color([0, 0, 0, 1]);
			circle(800, 600, 50);
			crosshair(800, 600);

			t += 0.01;
			if (t > Math.PI * 2) t -= Math.PI * 2;

			next();
		},
	},
} satisfies EngineJson;
