import { normal } from '../core/math.js';
let angle = 0;
export default {
    root: {
        draw({ clear, strokeCap, strokeJoin, strokeWidth, strokeColor, polyline, line, }, next) {
            function drawPolyline(points) {
                strokeWidth(30);
                strokeColor([0, 0, 0, 1]);
                polyline(points);
                strokeWidth(2);
                strokeCap('butt');
                strokeJoin('none');
                strokeColor([0, 1.0, 0, 1.0]);
                polyline(points);
                strokeWidth(5);
                for (let i = 0; i < points.length - 3; i += 2) {
                    const [nx, ny] = normal(points[i], points[i + 1], points[i + 2], points[i + 3]);
                    strokeColor([0, 1.0, 0, 1.0]);
                    line(points[i], points[i + 1], nx * 10 + points[i], ny * 10 + points[i + 1]);
                    strokeColor([0.5, 0.5, 1.0, 1.0]);
                    const [bx, by] = [
                        points[i + 2] - points[i],
                        points[i + 3] - points[i + 1],
                    ];
                    const [cx, cy] = [
                        points[i + 4] - points[i + 2],
                        points[i + 5] - points[i + 3],
                    ];
                    const lengthB = Math.hypot(bx, by);
                    const lengthC = Math.hypot(cx, cy);
                    const nx1 = -by / lengthB;
                    const ny1 = bx / lengthB;
                    const nx2 = -cy / lengthC;
                    const ny2 = cx / lengthC;
                    const bisectorX = (nx1 + nx2) * 10 + points[i + 2];
                    const bisectorY = (ny1 + ny2) * 10 + points[i + 3];
                    line(points[i + 2], points[i + 3], bisectorX, bisectorY);
                    const adjX = points[i + 4] - points[i + 2];
                    const adjY = points[i + 5] - points[i + 3];
                    const lengthAdj = Math.hypot(adjX, adjY);
                    const dirX = adjX / lengthAdj;
                    const dirY = adjY / lengthAdj;
                    line(points[i + 2], points[i + 3], points[i + 2] + dirX * 20, points[i + 3] + dirY * 20);
                }
            }
            function drawRevolvedLines(x, y, d, n) {
                strokeWidth(1);
                const angleStep = (Math.PI * 2) / n;
                for (let i = 0; i < n; i++) {
                    const a = i * angleStep;
                    const x2 = x + Math.cos(a) * d;
                    const y2 = y + Math.sin(a) * d;
                    line(x, y, x2, y2);
                }
                strokeWidth(2);
                strokeColor([0, 1, 0, 1]);
            }
            clear();
            strokeCap('butt');
            strokeJoin('none');
            drawPolyline([50, 500, 150, 400, 250, 500, 350, 400]);
            strokeCap('square');
            strokeJoin('none');
            drawPolyline([50, 400, 150, 300, 250, 400, 350, 300]);
            strokeCap('round');
            strokeJoin('none');
            drawPolyline([50, 300, 150, 200, 250, 300, 350, 200]);
            strokeCap('round');
            strokeJoin('miter');
            drawPolyline([
                450, 200, 450, 150, 550, 180, 530, 120, 650, 200, 810, 100, 850,
                200,
            ]);
            let dy = 100;
            strokeCap('square');
            strokeJoin('bevel');
            drawPolyline([
                450,
                200 + dy,
                450,
                150 + dy,
                550,
                180 + dy,
                530,
                120 + dy,
                650,
                200 + dy,
                810,
                100 + dy,
                850,
                200 + dy,
            ]);
            dy += 100;
            strokeCap('round');
            strokeJoin('round');
            drawPolyline([
                450,
                200 + dy,
                450,
                150 + dy,
                550,
                180 + dy,
                530,
                120 + dy,
                650,
                200 + dy,
                810,
                100 + dy,
                850,
                200 + dy,
            ]);
            strokeCap('butt');
            strokeJoin('none');
            drawPolyline([450, 500, 550, 500]);
            strokeCap('square');
            drawPolyline([450, 550, 550, 550]);
            strokeCap('round');
            drawPolyline([450, 600, 550, 600]);
            strokeCap('butt');
            strokeJoin('bevel');
            drawPolyline([900, 200, 1000, 200, 1000 - 94, 200 + 34]);
            strokeJoin('miter');
            drawPolyline([900, 100, 1000, 100, 1000 - 94, 100 + 34]);
            strokeJoin('round');
            drawPolyline([900, 300, 1000, 300, 1000 - 94, 300 + 14]);
            drawPolyline([900, 400, 1000, 400, 1000 - 94, 400]);
            strokeJoin('bevel');
            drawPolyline([1250, 200, 1150, 200, 1150 + 94, 200 + 34]);
            strokeJoin('miter');
            drawPolyline([1250, 100, 1150, 100, 1150 + 94, 100 + 34]);
            strokeJoin('round');
            drawPolyline([1250, 300, 1150, 300, 1150 + 94, 300 + 14]);
            drawPolyline([1250, 400, 1150, 400, 1150 + 94, 400]);
            strokeJoin('round');
            strokeCap('round');
            drawPolyline([
                820,
                600,
                920,
                600,
                920 + Math.cos(angle) * 100,
                600 + Math.sin(angle) * 100,
            ]);
            strokeJoin('miter');
            strokeCap('butt');
            drawPolyline([
                600,
                600,
                700,
                600,
                700 + Math.cos(angle) * 100,
                600 + Math.sin(angle) * 100,
            ]);
            strokeJoin('bevel');
            drawPolyline([
                1040,
                600,
                1140,
                600,
                1140 + Math.cos(angle) * 100,
                600 + Math.sin(angle) * 100,
            ]);
            angle += 0.01;
            if (angle > Math.PI * 2)
                angle = 0;
            strokeColor([0, 0, 0, 1]);
            drawRevolvedLines(140, 600, 100, 20);
            next();
        },
    },
};
