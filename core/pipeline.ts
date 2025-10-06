import { identity, multiply } from './math.js';

export type Color = Float32Array<ArrayBufferLike>;

export interface WebGpuContext {
	device: GPUDevice;
	context: GPUCanvasContext;
	format: GPUTextureFormat;
}

const vertexWgsl = `
struct VertexInput {
    @location(0) position: vec4f,
	@location(1) texcoord: vec2f,
	@location(2) modelRow0: vec4f,
	@location(3) modelRow1: vec4f,
	@location(4) modelRow2: vec4f,
	@location(5) modelRow3: vec4f,
	@location(6) instanceColor: vec4f,
};

struct Uniforms {
    viewProj: mat4x4f,
};

struct VertexOutput {
    @builtin(position) position: vec4f,
	@location(0) texcoord: vec2f,
	@location(1) color: vec4f,
};

@group(0) @binding(0)
var<uniform> uniforms : Uniforms;

@vertex
fn main(
    input: VertexInput,
) -> VertexOutput {
    var output: VertexOutput;
	let model = mat4x4f(
		input.modelRow0,
		input.modelRow1,
		input.modelRow2,
		input.modelRow3,
	);
	
	output.position = uniforms.viewProj * model * input.position;
	output.texcoord = input.texcoord;
	output.color = input.instanceColor;	
    return output;
}
`;

const fragmentWgsl = `
struct FragmentInput {
    @builtin(position) position: vec4f,
    @location(0) texcoord: vec2f,
	@location(1) color: vec4f,
};

@group(1) @binding(0) var mySampler: sampler;
@group(1) @binding(1) var myTexture: texture_2d<f32>;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
    let texture_color: vec4f = textureSample(myTexture, mySampler, input.texcoord);
    return texture_color * input.color;
}
	`;

async function createWebGpuContext(
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

export function createRenderPipeline({
	device,
	format,
	vertexWgsl,
	fragmentWgsl,
}: {
	device: GPUDevice;
	format: GPUTextureFormat;
	vertexWgsl: string;
	fragmentWgsl: string;
}) {
	const vertexModule = device.createShaderModule({ code: vertexWgsl });
	const fragmentModule = device.createShaderModule({
		code: fragmentWgsl,
	});

	const pipeline = device.createRenderPipeline({
		layout: 'auto',
		vertex: {
			module: vertexModule,
			entryPoint: 'main',
			buffers: [
				{
					arrayStride: 6 * 4,
					attributes: [
						{ shaderLocation: 0, offset: 0, format: 'float32x4' }, // position
						{
							shaderLocation: 1,
							offset: 4 * 4,
							format: 'float32x2',
						}, // texcoord (2 floats)
					],
					stepMode: 'vertex',
				},
				{
					arrayStride: 20 * 4, // 16 floats for model matrix + 4 floats for color
					attributes: [
						{ shaderLocation: 2, offset: 0, format: 'float32x4' },
						{
							shaderLocation: 3,
							offset: 4 * 4,
							format: 'float32x4',
						},
						{
							shaderLocation: 4,
							offset: 8 * 4,
							format: 'float32x4',
						},
						{
							shaderLocation: 5,
							offset: 12 * 4,
							format: 'float32x4',
						},
						{
							shaderLocation: 6,
							offset: 16 * 4,
							format: 'float32x4',
						}, // color
					],
					stepMode: 'instance',
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
	});

	return pipeline;
}

/**
 * Provides a generic wrapper for GPU-related attributes that tracks changes,
 * enabling efficient updates only when attribute data has been modified.
 */
export class Attribute<T extends Float32Array> {
	public value: T;
	public dirty = true;

	constructor(protected initial: T) {
		this.value = initial;
	}

	set(newValue: T) {
		this.value = newValue;
		this.dirty = true;
	}

	reset() {
		this.set(this.initial);
	}
}

/**
 * Manages a dynamically sized GPU buffer to store per-instance data,
 * growing the buffer as needed and tracking the count of instances to draw.
 */
export class InstanceBuffer {
	readonly buffer;
	readonly count = 0;

	#offset = 0;
	#data;

	constructor(
		protected program: Program,
		instanceSize: number,
		public readonly growth = 4096,
	) {
		this.#data = new Float32Array(instanceSize);
		this.buffer = program.device.createBuffer({
			size: growth,
			usage:
				GPUBufferUsage.VERTEX |
				GPUBufferUsage.COPY_DST |
				GPUBufferUsage.COPY_SRC,
		});
	}

	push(...data: Float32Array[]) {
		const device = this.program.device;
		let offset = 0;
		for (const d of data) {
			this.#data.set(d, offset);
			offset += d.length;
		}

		if (this.#offset + this.#data.byteLength > this.buffer.size) {
			const newBuffer = device.createBuffer({
				size: this.buffer.size + this.growth,
				usage:
					GPUBufferUsage.VERTEX |
					GPUBufferUsage.COPY_DST |
					GPUBufferUsage.COPY_SRC,
			});
			const encoder = device.createCommandEncoder();
			encoder.copyBufferToBuffer(this.buffer, newBuffer);
			device.queue.submit([encoder.finish()]);

			this.buffer.destroy();
			(this.buffer as GPUBuffer) = newBuffer;
		}

		device.queue.writeBuffer(this.buffer, this.#offset, this.#data.buffer);
		this.#offset += this.#data.byteLength;
		(this.count as number)++;
	}

	reset() {
		this.#offset = 0;
		(this.count as number) = 0;
	}
}

/**
 * Encapsulates GPU state and rendering logic, managing shaders, buffers, textures,
 * and uniform data to provide a simple interface for drawing instanced geometry
 * with dynamic transformations and colors while handling resource updates efficiently.
 */
export class Program {
	device;

	readonly color = new Attribute<Float32Array>(
		new Float32Array([1, 1, 1, 1]),
	);
	readonly model = new Attribute(identity);
	readonly view = new Attribute(identity);
	readonly projection = new Attribute(identity);
	readonly whiteTexture;

	readonly canvas;

	protected context;
	protected renderPipeline;

	#defaultVertexBuffer;
	#vertexBindGroup;
	#fragmentBindGroup;
	#instanceBuffer;
	#vertexUniformBuffer;

	constructor({ device, format, context }: WebGpuContext) {
		this.device = device;
		this.context = context;
		this.renderPipeline = createRenderPipeline({
			device,
			format,
			vertexWgsl,
			fragmentWgsl,
		});
		const textureSampler = device.createSampler({
			magFilter: 'nearest',
			minFilter: 'nearest',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge',
		});

		this.canvas = context.canvas;
		this.#defaultVertexBuffer = this.createBuffer({
			size: 144,
			usage: GPUBufferUsage.VERTEX,
			initial: [
				-1, -1, 0, 1, 0, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0, 1, 0, 1, -1, 1,
				0, 1, 0, 1, 1, -1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
			],
		});
		this.whiteTexture = this.createColorTexture(
			new Float32Array([1, 1, 1, 1]),
		);
		this.#vertexUniformBuffer = device.createBuffer({
			size: 64,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});
		this.#vertexBindGroup = device.createBindGroup({
			layout: this.renderPipeline.getBindGroupLayout(0),
			entries: [
				{
					binding: 0,
					resource: { buffer: this.#vertexUniformBuffer },
				},
			],
		});
		this.#fragmentBindGroup = device.createBindGroup({
			layout: this.renderPipeline.getBindGroupLayout(1),
			entries: [
				{
					binding: 0,
					resource: textureSampler,
				},
				{
					binding: 1,
					resource: this.whiteTexture.createView(),
				},
			],
		});
		this.#instanceBuffer = new InstanceBuffer(this, 20);
	}

	/**
	 * Executes the rendering pass.
	 */
	draw() {
		const { projection, view, device, context } = this;
		const commandEncoder = device.createCommandEncoder();

		if (projection.dirty || view.dirty) {
			projection.dirty = view.dirty = false;
			device.queue.writeBuffer(
				this.#vertexUniformBuffer,
				0,
				multiply(
					projection.value,
					view.value,
				) as GPUAllowSharedBufferSource,
			);
		}

		if (this.#instanceBuffer.count === 0) return;

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
		});

		renderPass.setPipeline(this.renderPipeline);
		renderPass.setVertexBuffer(0, this.#defaultVertexBuffer);
		renderPass.setVertexBuffer(1, this.#instanceBuffer.buffer);
		renderPass.setBindGroup(0, this.#vertexBindGroup);
		renderPass.setBindGroup(1, this.#fragmentBindGroup);
		renderPass.draw(6, this.#instanceBuffer.count, 0, 0);
		renderPass.end();

		device.queue.submit([commandEncoder.finish()]);
	}

	pushInstance() {
		this.#instanceBuffer.push(this.model.value, this.color.value);
	}

	destroy() {
		this.#defaultVertexBuffer.destroy();
		this.whiteTexture.destroy();
		this.#vertexUniformBuffer.destroy();
		this.#instanceBuffer.buffer.destroy();
	}

	reset() {
		this.#instanceBuffer.reset();
		this.color.reset();
		this.model.reset();
	}

	createColorTexture(color: Color) {
		const texture = this.device.createTexture({
			size: [1, 1, 1],
			format: 'rgba8unorm',
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
		});
		this.device.queue.writeTexture(
			{ texture },
			new Uint8Array(color.map(c => c * 255)),
			{ bytesPerRow: 4, rowsPerImage: 1 },
			{ width: 1, height: 1, depthOrArrayLayers: 1 },
		);
		return texture;
	}

	protected createBuffer({
		size,
		initial,
		usage,
	}: {
		size: number;
		initial?: ArrayLike<number>;
		usage: number;
	}) {
		const buffer = this.device.createBuffer({
			size,
			usage,
			mappedAtCreation: !!initial,
		});

		if (initial) {
			new Float32Array(buffer.getMappedRange()).set(initial);
			buffer.unmap();
		}

		return buffer;
	}
}

export async function webgpu(p: {
	canvas: OffscreenCanvas | HTMLCanvasElement;
}) {
	return new Program(await createWebGpuContext(p.canvas));
}
