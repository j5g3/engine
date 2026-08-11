import { spec } from '@cxl/spec';
import { Box, composeBox, TextureAtlas } from './index.js';

export default spec('core', s => {
	s.test('updates an existing texture from a typed array', async a => {
		a.ok(navigator.gpu);
		const adapter = await navigator.gpu.requestAdapter();
		if (!adapter) return;
		const device = await adapter.requestDevice();
		const atlas = new TextureAtlas(device);
		const texture = atlas.add({
			width: 1,
			height: 1,
			data: Uint8Array.of(255, 0, 0, 255),
		});
		atlas.write(texture, Uint8Array.of(0, 255, 0, 255));

		const output = device.createBuffer({
			size: 256,
			usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
		});
		const encoder = device.createCommandEncoder();
		encoder.copyTextureToBuffer(
			{
				texture: atlas.textureArray,
				origin: { x: texture.x, y: texture.y, z: texture.layer },
			},
			{ buffer: output, bytesPerRow: 256 },
			{ width: 1, height: 1, depthOrArrayLayers: 1 },
		);
		device.queue.submit([encoder.finish()]);
		await output.mapAsync(GPUMapMode.READ);
		a.equalValues(
			new Uint8Array(output.getMappedRange()).slice(0, 4),
			Uint8Array.of(0, 255, 0, 255),
		);
		output.unmap();
		output.destroy();
		device.destroy();
	});

	s.test('composeBox', it => {
		it.should('return a Matrix (Float32Array) of length 16', a => {
			const box: Box = {
				x: 0,
				y: 0,
				sx: 1,
				sy: 1,
				cx: 0,
				cy: 0,
				w: 1,
				h: 1,
				rotation: 0,
			};
			const result = composeBox(box);
			a.ok(result instanceof Float32Array);
			a.equal(result.length, 16);
		});

		it.should('set correct values for identity transformation', a => {
			const box: Box = {
				x: 0,
				y: 0,
				sx: 1,
				sy: 1,
				cx: 0,
				cy: 0,
				w: 1,
				h: 1,
				rotation: 0,
			};
			const result = composeBox(box);
			const expected = new Float32Array([
				1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
			]);
			a.equalValues(result, expected);
		});

		it.should('apply translation correctly', a => {
			const box: Box = {
				x: 10,
				y: 20,
				sx: 1,
				sy: 1,
				cx: 0,
				cy: 0,
				w: 1,
				h: 1,
				rotation: 0,
			};
			const result = composeBox(box);
			a.equal(result[12], 10);
			a.equal(result[13], 20);
		});

		it.should('apply scaling correctly', a => {
			const box: Box = {
				x: 0,
				y: 0,
				sx: 2,
				sy: 3,
				cx: 0,
				cy: 0,
				w: 1,
				h: 1,
				rotation: 0,
			};
			const result = composeBox(box);
			a.equal(result[0], 2);
			a.equal(result[5], 3);
		});

		it.should('apply rotation correctly', a => {
			const box: Box = {
				x: 0,
				y: 0,
				sx: 1,
				sy: 1,
				cx: 0,
				cy: 0,
				w: 1,
				h: 1,
				rotation: Math.PI / 2,
			};
			const result = composeBox(box);
			//expect(result[0]).toBeCloseTo(0);
			//expect(result[1]).toBeCloseTo(1);
			//expect(result[4]).toBeCloseTo(-1);
			//expect(result[5]).toBeCloseTo(0);
			a.equal(result[0] | 0, 0);
			a.equal(result[1], 1);
			a.equal(result[4], -1);
			a.equal(result[5] | 0, 0);
		});

		it.should('handle center offset correctly', a => {
			const box: Box = {
				x: 10,
				y: 20,
				sx: 1,
				sy: 1,
				cx: 5,
				cy: 5,
				w: 1,
				h: 1,
				rotation: 0,
			};
			const result = composeBox(box);
			a.equal(result[12], 5);
			a.equal(result[13], 15);
		});

		it.should('use provided destination matrix if given', a => {
			const box: Box = {
				x: 0,
				y: 0,
				sx: 1,
				sy: 1,
				cx: 0,
				cy: 0,
				w: 1,
				h: 1,
				rotation: 0,
			};
			const dst = new Float32Array(16);
			const result = composeBox(box, dst);
			a.equalValues(result, dst);
		});
	});
});
