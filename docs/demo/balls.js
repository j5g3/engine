const WIDTH = 1280;
const HEIGHT = 720;
const GRAVITY = 800;
const RESTITUTION = 0.7;
const AIR_DRAG = 0.0;
const BALL_COUNT = 1000;
const R_MIN = 8;
const R_MAX = 20;
const MIN_BOUNCE_SPEED = 25;
const POS_CORRECTION = 0.85;
const PEN_SLOP = 0.01;
const MU_DYNAMIC = 0.35;
const GROUND_STATIC_V = 8;
const GROUND_FRICTION = 14;
const CELL_SIZE = R_MAX * 2;
const COLS = Math.ceil(WIDTH / CELL_SIZE);
const ROWS = Math.ceil(HEIGHT / CELL_SIZE);
const CELL_COUNT = COLS * ROWS;
let gridHead = new Int32Array(CELL_COUNT);
let gridNext = new Int32Array(BALL_COUNT);
let balls = [];
let lastTime = 0;
function rand(min, max) {
    return Math.random() * (max - min) + min;
}
function initBalls() {
    balls = [];
    for (let i = 0; i < BALL_COUNT; i++) {
        const r = rand(R_MIN, R_MAX);
        const x = rand(r, WIDTH - r);
        const y = rand(r, HEIGHT - r - 200);
        const vx = rand(-200, 200);
        const vy = rand(-50, 50);
        const m = r * r;
        balls.push({
            x,
            y,
            vx,
            vy,
            r,
            color: [Math.random(), Math.random(), Math.random(), 1],
            m,
            im: 1 / m,
        });
    }
    if (gridHead.length !== CELL_COUNT)
        gridHead = new Int32Array(CELL_COUNT);
    if (gridNext.length !== balls.length)
        gridNext = new Int32Array(balls.length);
}
function step(dt) {
    const len = balls.length;
    const width = WIDTH;
    const height = HEIGHT;
    const cellSize = CELL_SIZE;
    const cols = COLS;
    const rows = ROWS;
    gridHead.fill(-1);
    for (let i = 0; i < len; i++) {
        const b = balls[i];
        b.vy += GRAVITY * dt;
        if (AIR_DRAG > 0) {
            const drag = Math.max(0, 1 - AIR_DRAG * dt * 60);
            b.vx *= drag;
            b.vy *= drag;
        }
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.x - b.r < 0) {
            b.x = b.r;
            b.vx = -b.vx * RESTITUTION;
        }
        else if (b.x + b.r > width) {
            b.x = width - b.r;
            b.vx = -b.vx * RESTITUTION;
        }
        if (b.y - b.r < 0) {
            b.y = b.r;
            b.vy = -b.vy * RESTITUTION;
        }
        else if (b.y + b.r > height) {
            b.y = height - b.r;
            const e = Math.abs(b.vy) < MIN_BOUNCE_SPEED ? 0 : RESTITUTION;
            b.vy = -b.vy * e;
            if (b.vy === 0) {
                if (Math.abs(b.vx) < GROUND_STATIC_V) {
                    b.vx = 0;
                }
                else {
                    const decay = Math.max(0, 1 - GROUND_FRICTION * dt);
                    b.vx *= decay;
                }
            }
            else {
                b.vx *= 0.98;
            }
        }
        if (Math.abs(b.vx) < 0.01)
            b.vx = 0;
        if (Math.abs(b.vy) < 0.01)
            b.vy = 0;
        let cx = (b.x / cellSize) | 0;
        let cy = (b.y / cellSize) | 0;
        if (cx < 0)
            cx = 0;
        else if (cx >= cols)
            cx = cols - 1;
        if (cy < 0)
            cy = 0;
        else if (cy >= rows)
            cy = rows - 1;
        const c = cy * cols + cx;
        gridNext[i] = gridHead[c];
        gridHead[c] = i;
    }
    for (let c = 0; c < CELL_COUNT; c++) {
        for (let i = gridHead[c]; i !== -1; i = gridNext[i]) {
            const a = balls[i];
            for (let j = gridNext[i]; j !== -1; j = gridNext[j]) {
                const b = balls[j];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const minDist = a.r + b.r;
                const minDist2 = minDist * minDist;
                const dist2 = dx * dx + dy * dy;
                if (dist2 === 0 || dist2 >= minDist2)
                    continue;
                const dist = Math.sqrt(dist2);
                const nx = dx / dist;
                const ny = dy / dist;
                const overlap = minDist - dist;
                const totalM = a.m + b.m;
                const correction = Math.max(0, overlap - PEN_SLOP) * POS_CORRECTION;
                const pushA = correction * (b.m / totalM);
                const pushB = correction * (a.m / totalM);
                a.x -= nx * pushA;
                a.y -= ny * pushA;
                b.x += nx * pushB;
                b.y += ny * pushB;
                const rvx = b.vx - a.vx;
                const rvy = b.vy - a.vy;
                const rvn = rvx * nx + rvy * ny;
                if (rvn > 0)
                    continue;
                const e = Math.abs(rvn) < MIN_BOUNCE_SPEED ? 0 : RESTITUTION;
                const invMassSum = a.im + b.im;
                const jn = (-(1 + e) * rvn) / invMassSum;
                const jnx = jn * nx;
                const jny = jn * ny;
                a.vx -= jnx * a.im;
                a.vy -= jny * a.im;
                b.vx += jnx * b.im;
                b.vy += jny * b.im;
                const tvx = rvx - rvn * nx;
                const tvy = rvy - rvn * ny;
                const tv2 = tvx * tvx + tvy * tvy;
                if (tv2 > 1e-12) {
                    const tv = Math.sqrt(tv2);
                    const tx = tvx / tv;
                    const ty = tvy / tv;
                    let jt = -tv / invMassSum;
                    const maxJt = MU_DYNAMIC * Math.abs(jn);
                    if (jt > maxJt)
                        jt = maxJt;
                    else if (jt < -maxJt)
                        jt = -maxJt;
                    const jtx = jt * tx;
                    const jty = jt * ty;
                    a.vx -= jtx * a.im;
                    a.vy -= jty * a.im;
                    b.vx += jtx * b.im;
                    b.vy += jty * b.im;
                }
            }
        }
        const col = c % cols;
        const row = (c / cols) | 0;
        const collideLists = (n) => {
            for (let i = gridHead[c]; i !== -1; i = gridNext[i]) {
                const a = balls[i];
                for (let j = gridHead[n]; j !== -1; j = gridNext[j]) {
                    const b = balls[j];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const minDist = a.r + b.r;
                    const minDist2 = minDist * minDist;
                    const dist2 = dx * dx + dy * dy;
                    if (dist2 === 0 || dist2 >= minDist2)
                        continue;
                    const dist = Math.sqrt(dist2);
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const overlap = minDist - dist;
                    const totalM = a.m + b.m;
                    const correction = Math.max(0, overlap - PEN_SLOP) * POS_CORRECTION;
                    const pushA = correction * (b.m / totalM);
                    const pushB = correction * (a.m / totalM);
                    a.x -= nx * pushA;
                    a.y -= ny * pushA;
                    b.x += nx * pushB;
                    b.y += ny * pushB;
                    const rvx = b.vx - a.vx;
                    const rvy = b.vy - a.vy;
                    const rvn = rvx * nx + rvy * ny;
                    if (rvn > 0)
                        continue;
                    const e = Math.abs(rvn) < MIN_BOUNCE_SPEED ? 0 : RESTITUTION;
                    const invMassSum = a.im + b.im;
                    const jn = (-(1 + e) * rvn) / invMassSum;
                    const jnx = jn * nx;
                    const jny = jn * ny;
                    a.vx -= jnx * a.im;
                    a.vy -= jny * a.im;
                    b.vx += jnx * b.im;
                    b.vy += jny * b.im;
                    const tvx = rvx - rvn * nx;
                    const tvy = rvy - rvn * ny;
                    const tv2 = tvx * tvx + tvy * tvy;
                    if (tv2 > 1e-12) {
                        const tv = Math.sqrt(tv2);
                        const tx = tvx / tv;
                        const ty = tvy / tv;
                        let jt = -tv / invMassSum;
                        const maxJt = MU_DYNAMIC * Math.abs(jn);
                        if (jt > maxJt)
                            jt = maxJt;
                        else if (jt < -maxJt)
                            jt = -maxJt;
                        const jtx = jt * tx;
                        const jty = jt * ty;
                        a.vx -= jtx * a.im;
                        a.vy -= jty * a.im;
                        b.vx += jtx * b.im;
                        b.vy += jty * b.im;
                    }
                }
            }
        };
        if (col < cols - 1)
            collideLists(c + 1);
        if (row < rows - 1) {
            collideLists(c + cols);
            if (col < cols - 1)
                collideLists(c + cols + 1);
            if (col > 0)
                collideLists(c + cols - 1);
        }
    }
}
export default {
    root: {
        draw({ clear, color, circle }, next) {
            if (balls.length === 0)
                initBalls();
            const now = performance.now();
            if (lastTime === 0)
                lastTime = now;
            let dt = (now - lastTime) / 1000;
            lastTime = now;
            if (dt > 0.05)
                dt = 0.05;
            const fixed = 1 / 120;
            let acc = dt;
            while (acc >= fixed) {
                step(fixed);
                acc -= fixed;
            }
            if (acc > 0)
                step(acc);
            clear();
            for (let i = 0; i < balls.length; i++) {
                const b = balls[i];
                color(b.color);
                circle(b.x, b.y, b.r);
            }
            next();
        },
    },
};
