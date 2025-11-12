import { Matrix, identity, multiply } from './math.js';
import { TextureAtlas, Texture } from './texture-atlas.js';

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
	@location(7) textureId: f32,
	@location(8) width: f32,
	@location(9) height: f32,
	@location(10) sdf: f32, // 0=rect, 1=start cap, 2=end cap
};

struct Uniforms {
    viewProj: mat4x4f,
};

struct VertexOutput {
    @builtin(position) position: vec4f,
	@location(0) texcoord: vec2f,
	@location(1) color: vec4f,
	@location(2) @interpolate(flat) textureId: u32,
	@location(3) @interpolate(flat) capType: u32, // 0=rect, 1=start cap, 2=end cap
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
	
	let scale = vec3f(input.width, input.height, 1.0);
	let scaledPosition = vec4f(input.position.xyz * scale, input.position.w);

	output.position = uniforms.viewProj * model * scaledPosition;
	output.texcoord = input.texcoord;
	output.color = input.instanceColor;
	output.textureId = u32(input.textureId);
	output.capType = u32(input.sdf);
    return output;
}
`;

const fragmentWgsl = `
struct FragmentInput {
    @builtin(position) position: vec4f,
    @location(0) texcoord: vec2f,
	@location(1) color: vec4f,
	@location(2) @interpolate(flat) textureId: u32,
	@location(3) @interpolate(flat) capType: u32, // 0=rect, 1=start cap, 2=end cap
};

struct TextureMeta {
	uvOffset: vec2f,
	uvSize: vec2f,
	layer: f32,
    _pad0: f32,       // offset 20, size 4
    _pad1: f32,       // offset 24, size 4
    _pad2: f32,       // offset 28, size 4	
};

@group(1) @binding(0) var mySampler: sampler;
@group(1) @binding(1) var textureArray: texture_2d_array<f32>;
@group(1) @binding(2) var<storage, read> textureMeta: array<TextureMeta>;

fn halfDiscSDF(uv: vec2f, dir: f32) -> f32 {
    let center = vec2f(0.0, 0.5);
    let radius_x = 1.0;
    let radius_y = 0.5;
    let p = vec2((uv.x - center.x) / radius_x, (uv.y - center.y) / radius_y);
    return length(p) - 1.0; 
}

fn circleSDF(uv: vec2f) -> f32 {
    let center = vec2f(0.5, 0.5);
    let radius = 0.5;
    return length(uv - center) - radius;
}

fn roundShapeSDF(uv: vec2f, dir: f32) -> f32 {
    // When dir = 0 → full circle at (0.5, 0.5)
    // When dir = -1 → half-disc facing left
    // When dir =  1 → half-disc facing right

    // Interpolate between the two centers depending on |dir|
    let isHalf = abs(dir);
    let center = mix(vec2f(0.5, 0.5), vec2f(0.5 - 0.5 * dir, 0.5), isHalf);

    // Scale radii: full circle = 0.5 radius, half-disc uses full width
    let radius_x = mix(0.5, 1.0, isHalf);
    let radius_y = 0.5;

    // Elliptical distance
    let p = vec2f((uv.x - center.x) / radius_x, (uv.y - center.y) / radius_y);
    var d = length(p) - 1.0;

    // For half-disc, mask out the opposite side smoothly
    // planeDist = (uv.x - center.x) * dir → >0 is outside half
    let planeDist = (uv.x - center.x) * dir;
    d = mix(d, max(d, planeDist), isHalf);

    return d;
}

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
	let tMeta = textureMeta[input.textureId];
	var uv = tMeta.uvOffset + input.texcoord * tMeta.uvSize;
	var color = textureSample(textureArray, mySampler, uv, u32(tMeta.layer)) * input.color;
	
    var mask: f32 = 1.0;
    if (input.capType == 1u) {
        let d = halfDiscSDF(input.texcoord, -1.0);
        mask = step(0.0, -d); // 1 inside, 0 outside
    } else if (input.capType == 2u) {
        let d = halfDiscSDF(input.texcoord, 1.0);
        mask = step(0.0, -d); // 1 inside, 0 outside
    } else if (input.capType == 3u) {
        let d = circleSDF(input.texcoord);
        mask = step(0.0, -d); // 1 inside, 0 outside
	}
    // capType == 0 → mask stays 1.0

    color.a *= mask;

    return color;
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
					arrayStride: 96,
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
						{
							shaderLocation: 7,
							offset: 20 * 4,
							format: 'float32',
						}, // textureIndex
						{
							shaderLocation: 8,
							offset: 21 * 4,
							format: 'float32',
						},
						{
							shaderLocation: 9,
							offset: 22 * 4,
							format: 'float32',
						},
						{
							shaderLocation: 10,
							offset: 23 * 4,
							format: 'float32',
						},
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

export class MatrixAttribute {
	public value: Matrix;
	public dirty = true;

	#stack: Matrix[];

	constructor(protected initial: Matrix) {
		this.value = initial;
		this.#stack = [initial];
	}

	push(m: Matrix) {
		this.#stack.push(this.value);
		this.set(m);
	}

	pop() {
		const M2 = this.#stack.pop();
		if (!M2) throw new Error('Uniform stack empty');
		this.set(M2);
	}

	pushMultiply(m: Matrix) {
		this.push(this.value === identity ? m : multiply(this.value, m));
	}

	set(newValue: Matrix) {
		this.value = newValue;
		this.dirty = true;
	}

	reset() {
		this.#stack.length = 0;
		this.set(this.initial);
	}
}

export class Instance {}

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

		if (this.#offset + this.#data.byteLength > this.buffer.size)
			this.grow();

		device.queue.writeBuffer(this.buffer, this.#offset, this.#data.buffer);
		this.#offset += this.#data.byteLength;
		(this.count as number)++;
		return this.#data;
	}

	setInstance(index: number, data: Float32Array) {
		const offset = index * this.#data.byteLength;
		if (offset + data.byteLength > this.buffer.size) {
			throw new Error('Instance index out of range');
		}
		this.program.device.queue.writeBuffer(this.buffer, offset, data.buffer);
	}

	clear() {
		this.#offset = 0;
		(this.count as number) = 0;
	}

	reset() {
		this.#offset = 0;
		(this.count as number) = 0;
	}

	protected grow() {
		const device = this.program.device;
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
}

/**
 * Encapsulates GPU state and rendering logic, managing shaders, buffers, textures,
 * and uniform data to provide a simple interface for drawing instanced geometry
 * with dynamic transformations and colors.
 */
export class Program {
	device;

	readonly color = new Attribute<Float32Array>(
		new Float32Array([1, 1, 1, 1]),
	);
	readonly model = new MatrixAttribute(identity);
	readonly view = new Attribute(identity);
	readonly projection = new Attribute(identity);
	readonly whiteTexture;
	readonly textureAtlas: TextureAtlas;
	readonly instanceBuffer;
	readonly canvas;

	textureId = 0;

	protected context;
	protected renderPipeline;

	#defaultVertexBuffer;
	#vertexBindGroup;
	#fragmentBindGroup;
	#vertexUniformBuffer;
	#textureSampler;

	constructor({ device, format, context }: WebGpuContext) {
		this.device = device;
		this.context = context;
		this.renderPipeline = createRenderPipeline({
			device,
			format,
			vertexWgsl,
			fragmentWgsl,
		});
		this.#textureSampler = device.createSampler({
			magFilter: 'nearest',
			minFilter: 'nearest',
			addressModeU: 'clamp-to-edge',
			addressModeV: 'clamp-to-edge',
		});

		this.canvas = context.canvas;
		this.textureAtlas = new TextureAtlas(device);
		this.#defaultVertexBuffer = this.createBuffer({
			size: 144,
			usage: GPUBufferUsage.VERTEX,
			initial: [
				0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0,
				1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
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
		this.#fragmentBindGroup = this.device.createBindGroup({
			layout: this.renderPipeline.getBindGroupLayout(1),
			entries: [
				{ binding: 0, resource: this.#textureSampler },
				{
					binding: 1,
					resource: this.textureAtlas.textureArray.createView({
						dimension: '2d-array',
						baseArrayLayer: 0,
						arrayLayerCount: this.textureAtlas.layerCount,
					}),
				},
				{
					binding: 2,
					resource: {
						buffer: this.textureAtlas.textureMetaBuffer,
					},
				},
			],
		});
		this.instanceBuffer = new InstanceBuffer(this, 24);
	}

	updateTextureBindGroup() {
		this.#fragmentBindGroup = this.device.createBindGroup({
			layout: this.renderPipeline.getBindGroupLayout(1),
			entries: [
				{ binding: 0, resource: this.#textureSampler },
				{
					binding: 1,
					resource: this.textureAtlas.textureArray.createView({
						dimension: '2d-array',
						baseArrayLayer: 0,
						arrayLayerCount: this.textureAtlas.layerCount,
					}),
				},
				{
					binding: 2,
					resource: {
						buffer: this.textureAtlas.textureMetaBuffer,
					},
				},
			],
		});
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

		if (this.textureAtlas.needsUpdate) {
			this.textureAtlas.update(commandEncoder);
			this.updateTextureBindGroup();
		}

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
		renderPass.setVertexBuffer(1, this.instanceBuffer.buffer);
		renderPass.setBindGroup(0, this.#vertexBindGroup);
		renderPass.setBindGroup(1, this.#fragmentBindGroup);
		renderPass.draw(6, this.instanceBuffer.count, 0, 0);
		renderPass.end();

		device.queue.submit([commandEncoder.finish()]);
	}

	pushInstance(width: number, height: number, sdf = 0) {
		return this.instanceBuffer.push(
			this.model.value,
			this.color.value,
			new Float32Array([this.textureId, width, height, sdf]),
		);
	}

	destroy() {
		this.#defaultVertexBuffer.destroy();
		this.#vertexUniformBuffer.destroy();
		this.instanceBuffer.buffer.destroy();
	}

	resize(width: number, height: number) {
		// Set the canvas's actual drawing buffer size.
		if (this.canvas.width !== width || this.canvas.height !== height) {
			this.canvas.width = width;
			this.canvas.height = height;
		}

		const format = navigator.gpu.getPreferredCanvasFormat();
		// Re-configure the canvas context with the new size.
		this.context.configure({
			device: this.device,
			format,
			alphaMode: 'premultiplied',
		});
	}

	clear() {
		this.instanceBuffer.clear();
	}

	reset() {
		this.instanceBuffer.reset();
		this.textureAtlas.reset();
		(this.whiteTexture as Texture) = this.createColorTexture(
			new Float32Array([1, 1, 1, 1]),
		);
		this.color.reset();
		this.model.reset();
	}

	createColorTexture(color: Color) {
		return this.textureAtlas.add({
			width: 1,
			height: 1,
			data: new Uint8Array(color.map(c => c * 255)).buffer,
		});
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
