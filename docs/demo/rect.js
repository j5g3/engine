export default {
    root: {
        draw({ rect, color }) {
            color(new Float32Array([0, 0, 0, 1]));
            rect(0, 0, canvas.width, canvas.height);
            color(new Float32Array([1, 1, 1, 1]));
            rect(10, 10, canvas.width - 20, canvas.height - 20);
            color(new Float32Array([0, 0, 0, 1]));
            rect(canvas.width / 2, 0, 1, canvas.height);
            rect(0, canvas.height / 2, canvas.width, 1);
            color(new Float32Array([1, 0, 0, 1]));
            rect(canvas.width / 2 - 10, canvas.height / 2 - 50, 20, 100);
        },
    },
};
