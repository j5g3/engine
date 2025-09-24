export async function createWebGPUContext(
	canvas: HTMLCanvasElement | OffscreenCanvas,
) {
	if (!navigator.gpu) throw new Error('WebGPU not supported');
	const adapter = await navigator.gpu.requestAdapter();
	if (!adapter) throw new Error('Failed to get GPU adapter');
	const device = await adapter.requestDevice();
	const context = canvas.getContext('webgpu');

	if (!context) throw new Error('Could not create WebGPU context');

	const format = navigator.gpu.getPreferredCanvasFormat();

	context.configure({
		device,
		format,
		alphaMode: 'premultiplied',
	});

	return { device, context, format };
}

function createUniformBuffer(device: GPUDevice, data: Float32Array) {
	const buffer = device.createBuffer({
		size: (data.byteLength + 3) & ~3,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	});
	device.queue.writeBuffer(
		buffer,
		0,
		data.buffer,
		data.byteOffset,
		data.byteLength,
	);
	return buffer;
}

function draw(
	device: GPUDevice,
	context: GPUCanvasContext,
	pipeline: GPURenderPipeline,
	vertexBuffer: GPUBuffer,
	bindGroup: GPUBindGroup,
	vertexCount: number,
) {
	const commandEncoder = device.createCommandEncoder();
	const textureView = context.getCurrentTexture().createView();
	const renderPass = commandEncoder.beginRenderPass({
		colorAttachments: [
			{
				view: textureView,
				clearValue: { r: 0, g: 0, b: 0, a: 0 },
				loadOp: 'clear',
				storeOp: 'store',
			},
		],
		depthStencilAttachment: {
			view: depthTexture.createView(),
			depthLoadOp: 'clear',
			depthClearValue: 1.0,
			depthStoreOp: 'store',
		},
	});

	renderPass.setPipeline(pipeline);
	renderPass.setVertexBuffer(0, vertexBuffer);
	renderPass.setBindGroup(0, bindGroup);
	renderPass.draw(vertexCount, 1, 0, 0);
	renderPass.end();

	device.queue.submit([commandEncoder.finish()]);
}

const bindGroupLayout = device.createBindGroupLayout({
	entries: [
		{
			binding: 0,
			visibility: GPUShaderStage.VERTEX,
			buffer: { type: 'uniform' },
		},
		{ binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {} },
		{ binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
	],
});

const bindGroup = device.createBindGroup({
	layout: bindGroupLayout,
	entries: [
		{ binding: 0, resource: { buffer: uniformBuffer } },
		{ binding: 1, resource: texture.createView() },
		{ binding: 2, resource: sampler },
	],
});

// For textures:
function createTextureFromImage(device: GPUDevice, imageBitmap: ImageBitmap) {
	const texture = device.createTexture({
		size: [imageBitmap.width, imageBitmap.height, 1],
		format: 'rgba8unorm',
		usage:
			GPUTextureUsage.TEXTURE_BINDING |
			GPUTextureUsage.COPY_DST |
			GPUTextureUsage.RENDER_ATTACHMENT,
	});

	device.queue.copyExternalImageToTexture(
		{ source: imageBitmap },
		{ texture },
		[imageBitmap.width, imageBitmap.height, 1],
	);
	return texture;
}

function createSampler(device: GPUDevice) {
	return device.createSampler({
		magFilter: 'nearest',
		minFilter: 'nearest',
		addressModeU: 'clamp-to-edge',
		addressModeV: 'clamp-to-edge',
	});
}

export async function createRenderPipeline(
	device: GPUDevice,
	format: GPUTextureFormat,
	vertexShaderWGSL: string,
	fragmentShaderWGSL: string,
) {
	const vertexModule = device.createShaderModule({ code: vertexShaderWGSL });
	const fragmentModule = device.createShaderModule({
		code: fragmentShaderWGSL,
	});

	const pipeline = device.createRenderPipeline({
		layout: 'auto',
		vertex: {
			module: vertexModule,
			entryPoint: 'main',
			buffers: [
				{
					arrayStride: 5 * 4,
					attributes: [
						{ shaderLocation: 0, offset: 0, format: 'float32x3' }, // position
						{
							shaderLocation: 1,
							offset: 3 * 4,
							format: 'float32x2',
						},
					],
				},
			],
		},
		fragment: {
			module: fragmentModule,
			entryPoint: 'main',
			targets: [
				{
					format,
					blend: {
						color: {
							srcFactor: 'one',
							dstFactor: 'one-minus-src-alpha',
							operation: 'add',
						},
						alpha: {
							srcFactor: 'one',
							dstFactor: 'one-minus-src-alpha',
							operation: 'add',
						},
					},
				},
			],
		},
		primitive: {
			topology: 'triangle-list',
		},
		depthStencil: {
			depthWriteEnabled: true,
			depthCompare: 'less',
			format: 'depth24plus',
		},
	});
	return pipeline;
}
