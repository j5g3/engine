//import type { Gltf } from './gltf.js';

export interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface Box extends Rect {
	sx: number;
	sy: number;
	/** Offset X for rotation. */
	cx: number;
	/** Offset Y for rotation */
	cy: number;
	rotation: number;
}

export type Matrix = Float32Array;
export type Color = readonly [number, number, number, number] | Float32Array;

export type ArrayBufferOptions = {
	data: ArrayBuffer;
	size?: number;
	type?: number;
	normalized?: boolean;
	stride?: number;
	offset?: number;
	usage?: GLenum;
};

export type TextureComponent = TextureOptions & {
	src: TexImageSource;
};
export type ImageComponent = Omit<TextureOptions, 'src'> & {
	readonly src: string | TexImageSource;
};
export type BoxComponent = Partial<Box>;

export type UpdateFn =
	| string
	| ((
			node: Node,
			set: (node: Node, prop: string, value: unknown) => void,
	  ) => void);
export type WebglContext = ReturnType<typeof webgl2>;
export type DrawEngine = ReturnType<typeof drawEngine>;
export type UniformType = Float32Array | number[] | number | Texture | Color;
export type Engine = ReturnType<typeof engine>;

export interface TextureBaseOptions {
	internalFormat?: GLenum;
	minFilter?: GLenum;
	magFilter?: GLenum;
	wrapS?: GLenum;
	wrapT?: GLenum;
	border?: number;
	format?: GLenum;
	type?: GLenum;
}

export type ArrayBufferTextureOptions = TextureBaseOptions & {
	src: ArrayBufferView;
	width: number;
	height: number;
};

export type TexImageTextureOptions = TextureBaseOptions & {
	src?: TexImageSource;
};

export type TextureOptions = ArrayBufferTextureOptions | TexImageTextureOptions;

export interface Node {
	/**
	 * Defines a transform for this node, including position (x, y), size (w, h), scale (sx, sy),
	 * origin offsets (cx, cy), and rotation (in radians).
	 */
	box?: BoxComponent;

	/**
	 * Specifies a `TextureComponent` for this node, providing the image or buffer source (`src`)
	 * and texture parameters (filters, wrapping, format) for rendering.
	 */
	texture?: TextureComponent;

	/**
	 * Specifies child `Node` objects to be recursively loaded and rendered under this node.
	 */
	children?: Node[];

	/**
	 * Specifies a custom update callback or script to run after this node and its children are loaded,
	 * invoked with (node, set, global) for dynamic updates.
	 */
	update?: UpdateFn;

	fill?: Color;
}

/*export interface ModelComponent {
	gltf: Gltf;
}*/

export const identity = new Float32Array([
	1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
]) as Readonly<Matrix>;
export const whiteColor: Color = [1, 1, 1, 1] as const;
export const blackColor: Color = [0, 0, 0, 1] as const;

export function Matrix(m?: number[]) {
	return m ? new Float32Array(m) : identity.slice(0);
}

export function createCanvas(
	width: number,
	height: number,
	container?: Element,
) {
	const element = document.createElement('canvas');
	element.width = width;
	element.height = height;
	if (container) container.appendChild(element);
	return element;
}

export function createCanvasContext(width: number, height: number) {
	const canvas = createCanvas(width, height);
	const gl = canvas.getContext('webgl2')!;
	if (!gl) throw new Error('Could not create webgl2 canvas context');
	return gl;
}

export function loadImage(src: string) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		img.src = src;
		img.addEventListener('load', () => resolve(img));
		img.addEventListener('error', () => reject(img));
	});
}

export function intersect(a: Rect, b: Rect) {
	return !(
		a.x + a.w <= b.x ||
		a.x >= b.x + b.w ||
		a.y + a.h <= b.y ||
		a.y >= b.y + b.h
	);
}

/**
 * Compiles a shader using the given source code and type.
 *
 * It takes a WebGLRenderingContext, source code string, and shader type as input.
 * Creates a shader object, sets its source code, compiles it, and returns the compiled shader object.
 * If the compilation fails, an error is thrown with the compilation log.
 */
export function Shader(
	gl: WebGLRenderingContext,
	source: string,
	type: number,
) {
	const result = gl.createShader(type);
	if (!result) throw new Error(`Could not create shader.`);
	gl.shaderSource(result, source);
	gl.compileShader(result);

	if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
		const info = gl.getShaderInfoLog(result);
		throw new Error(`Could not compile shader.\n${info}`);
	}

	return result;
}

/**
 * Creates a perspective projection matrix.
 * It returns a `Float32Array` representing a 4x4 matrix that maps 3D points in the specified orthogonal
 * frustum to normalized device coordinates.
 * It allows you to define the viewing area for your scene and map 3D points to 2D coordinates on the screen.
 */
export function orthographic(
	left: number,
	right: number,
	bottom: number,
	top: number,
	near: number,
	far: number,
) {
	return new Float32Array([
		2 / (right - left),
		0,
		0,
		0,
		0,
		2 / (top - bottom),
		0,
		0,
		0,
		0,
		2 / (near - far),
		0,
		(left + right) / (left - right),
		(bottom + top) / (bottom - top),
		(near + far) / (near - far),
		1,
	]);
}

/**
 * Creates a WebGL program with the given fragment and vertex shaders.
 *
 * It initializes a WebGL context, sets up the rendering pipeline with basic configurations,
 * compiles the shaders, links the program, and returns an object containing the WebGL context and program.
 * It also handles error scenarios during shader compilation and program linking.
 *
 */
export class Program {
	readonly gl: WebGL2RenderingContext;
	readonly glProgram: WebGLProgram;
	protected textureUnit = 0;

	constructor(
		frag: string,
		vtx: string,
		public readonly canvas: HTMLCanvasElement | OffscreenCanvas,
	) {
		const gl = canvas.getContext('webgl2');
		if (!gl) throw new Error('Could not create webgl2 canvas context');
		const glProgram = gl.createProgram();
		if (!glProgram) throw new Error('Could not create WebGL Program');

		this.gl = gl;
		this.glProgram = glProgram;

		const vertexShader = Shader(gl, vtx, gl.VERTEX_SHADER);
		const fragShader = Shader(gl, frag, gl.FRAGMENT_SHADER);

		gl.attachShader(glProgram, vertexShader);
		gl.attachShader(glProgram, fragShader);
		gl.linkProgram(glProgram);

		if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
			gl.deleteProgram(glProgram);
			throw new Error('Could not create WebGL Program');
		}
	}

	use() {
		this.gl.useProgram(this.glProgram);
	}

	attribute(name: string, data: number[], size = 3) {
		return new Attribute(this, name, data, size);
	}

	uniform<T extends UniformType>(name: string, data: T) {
		return new Uniform<T>(this, name, data);
	}

	uniformMatrix(name: string, data: Float32Array) {
		return new UniformMatrix(this, name, data);
	}

	uniformTexture(name: string, data: Texture) {
		return new UniformTexture(this, name, data, this.textureUnit++);
	}

	location(name: string) {
		const location = this.gl.getUniformLocation(this.glProgram, name);
		if (!location) throw new Error('Invalid uniform location');
		return location;
	}

	uniformInfo(name: string) {
		const { gl, glProgram } = this;
		const location = gl.getUniformLocation(glProgram, name);
		if (!location) throw new Error('Invalid uniform location');
		const index = gl.getUniformIndices(glProgram, [name])?.[0] ?? -1;
		const type = gl.getActiveUniform(glProgram, index)?.type ?? -1;
		const method = getUniformMethod(gl, type);

		return {
			location,
			index,
			type,
			method,
		};
	}
}

/**
 * Multiplies two matrices, `a` and `b`, and stores the result in the `dst` matrix.
 * It assumes that the matrices are 4x4 matrices.
 */
export function multiply(
	a: Matrix,
	b: Matrix,
	dst: Matrix = new Float32Array(16),
) {
	const [
		a0,
		a1,
		a2,
		a3,
		a10,
		a11,
		a12,
		a13,
		a20,
		a21,
		a22,
		a23,
		a30,
		a31,
		a32,
		a33,
	] = a;
	const [
		b0,
		b1,
		b2,
		b3,
		b10,
		b11,
		b12,
		b13,
		b20,
		b21,
		b22,
		b23,
		b30,
		b31,
		b32,
		b33,
	] = b;
	dst[0] = b0 * a0 + b1 * a10 + b2 * a20 + b3 * a30;
	dst[1] = b0 * a1 + b1 * a11 + b2 * a21 + b3 * a31;
	dst[2] = b0 * a2 + b1 * a12 + b2 * a22 + b3 * a32;
	dst[3] = b0 * a3 + b1 * a13 + b2 * a23 + b3 * a33;
	dst[4] = b10 * a0 + b11 * a10 + b12 * a20 + b13 * a30;
	dst[5] = b10 * a1 + b11 * a11 + b12 * a21 + b13 * a31;
	dst[6] = b10 * a2 + b11 * a12 + b12 * a22 + b13 * a32;
	dst[7] = b10 * a3 + b11 * a13 + b12 * a23 + b13 * a33;
	dst[8] = b20 * a0 + b21 * a10 + b22 * a20 + b23 * a30;
	dst[9] = b20 * a1 + b21 * a11 + b22 * a21 + b23 * a31;
	dst[10] = b20 * a2 + b21 * a12 + b22 * a22 + b23 * a32;
	dst[11] = b20 * a3 + b21 * a13 + b22 * a23 + b23 * a33;
	dst[12] = b30 * a0 + b31 * a10 + b32 * a20 + b33 * a30;
	dst[13] = b30 * a1 + b31 * a11 + b32 * a21 + b33 * a31;
	dst[14] = b30 * a2 + b31 * a12 + b32 * a22 + b33 * a32;
	dst[15] = b30 * a3 + b31 * a13 + b32 * a23 + b33 * a33;
	return dst;
}

export function getWebGLType(array: ArrayBufferView): GLenum {
	const gl = WebGL2RenderingContext;
	if (array instanceof Uint8Array) return gl.UNSIGNED_BYTE;
	if (array instanceof Int8Array) return gl.BYTE;
	if (array instanceof Uint16Array) return gl.UNSIGNED_SHORT;
	if (array instanceof Int16Array) return gl.SHORT;
	if (array instanceof Uint32Array) return gl.UNSIGNED_INT;
	if (array instanceof Int32Array) return gl.INT;
	if (array instanceof Float32Array) return gl.FLOAT;
	// WebGL2 supports half float, but you can’t directly create a Float16Array in JS.
	throw new Error('Unsupported typed array type for WebGL texture upload');
}

function defaultTextureFormat(array: ArrayBufferView) {
	const gl = WebGL2RenderingContext;

	if (array instanceof Uint8Array) return gl.RGBA8;
	if (array instanceof Float32Array) return gl.RGBA32F;
	if (array instanceof Uint16Array) return gl.RGBA16UI;
	if (array instanceof Int16Array) return gl.RGBA16I;
	if (array instanceof Uint32Array) return gl.RGBA32UI;
	if (array instanceof Int32Array) return gl.RGBA32I;

	throw new Error('Unsupported typed array type');
}

export class Texture {
	readonly texture: WebGLTexture;

	protected options: TextureOptions = {};

	constructor(
		protected readonly gl: WebGL2RenderingContext,
		o: TextureOptions,
	) {
		this.texture = gl.createTexture();
		this.update({
			wrapS: gl.CLAMP_TO_EDGE,
			wrapT: o.wrapT ?? gl.CLAMP_TO_EDGE,
			minFilter: gl.NEAREST,
			magFilter: gl.NEAREST,
			...o,
		});
	}

	update(o2?: TextureOptions) {
		const o = this.options;
		const gl = this.gl;

		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		if (o2) {
			if (o2.wrapS !== undefined && o.wrapS !== o2.wrapS)
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, o2.wrapS);

			if (o2.wrapT !== undefined && o.wrapT !== o2.wrapT)
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, o2.wrapT);

			if (o2.minFilter !== undefined && o.minFilter !== o2.minFilter)
				gl.texParameteri(
					gl.TEXTURE_2D,
					gl.TEXTURE_MIN_FILTER,
					o2.minFilter,
				);

			if (o2.magFilter !== undefined && o.magFilter !== o2.magFilter)
				gl.texParameteri(
					gl.TEXTURE_2D,
					gl.TEXTURE_MAG_FILTER,
					o.magFilter ?? gl.NEAREST,
				);

			Object.assign(this.options, o2);
		}

		if (!o.src) return;

		if (ArrayBuffer.isView(o.src)) {
			const format = o.internalFormat ?? defaultTextureFormat(o.src);
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				format,
				(o as ArrayBufferTextureOptions).width,
				(o as ArrayBufferTextureOptions).height,
				o.border ?? 0,
				o.format ?? gl.RGBA,
				o.type ?? getWebGLType(o.src),
				o.src,
			);
		} else if (o.src)
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				o.internalFormat ?? gl.RGBA,
				o.internalFormat ?? gl.RGBA,
				gl.UNSIGNED_BYTE,
				o.src,
			);
	}
}

/**
 * Creates a WebGL texture with a single pixel of the given color, used for filling shapes with color.
 */
function ColorTexture(gl: WebGL2RenderingContext, color: Color) {
	return new Texture(gl, {
		src: color instanceof Float32Array ? color : new Float32Array(color),
		width: 1,
		height: 1,
	});
}

export class Attribute {
	protected location: number;
	protected buffer: WebGLBuffer;
	protected initial: ArrayBufferOptions;

	constructor(
		protected program: Program,
		public readonly name: string,
		data: number[],
		size = 3,
	) {
		const gl = program.gl;
		this.location = gl.getAttribLocation(program.glProgram, name);
		const buffer = gl.createBuffer();
		if (!buffer) throw new Error('Could not create buffer');
		this.buffer = buffer;
		this.initial = { data: new Float32Array(data).buffer, size };
		this.set(this.initial);
		this.enable();
	}

	enable() {
		this.program.gl.enableVertexAttribArray(this.location);
	}

	disable() {
		this.program.gl.disableVertexAttribArray(this.location);
	}

	reset() {
		this.set(this.initial);
	}

	set({
		data,
		size,
		normalized,
		type,
		stride,
		offset,
		usage,
	}: ArrayBufferOptions) {
		const gl = this.program.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, data, usage ?? gl.STATIC_DRAW);
		gl.vertexAttribPointer(
			this.location,
			size ?? 3,
			type ?? gl.FLOAT,
			normalized ?? false,
			stride ?? 0,
			offset ?? 0,
		);
	}
}

export class Uniform<T extends UniformType> {
	readonly location: WebGLUniformLocation;
	readonly type: GLenum;
	readonly index: number;

	protected initial: T;
	protected method: ReturnType<typeof getUniformMethod>;
	protected unit = 0;

	protected stack?: T[];

	constructor(
		protected program: Program,
		public readonly name: string,
		public readonly value: T,
	) {
		const { gl, glProgram } = program;
		const location = gl.getUniformLocation(glProgram, name);
		if (!location) throw new Error('Invalid uniform location');
		this.location = location;
		this.index = gl.getUniformIndices(glProgram, [name])?.[0] ?? -1;
		this.type = gl.getActiveUniform(glProgram, this.index)?.type ?? -1;
		this.method = getUniformMethod(gl, this.type);
		this.initial = value;
		this.initialize(value);
	}

	reset() {
		this.set(this.initial);
	}

	set(value: T) {
		const gl = this.program.gl;
		(this.value as T) = value;
		gl[this.method as 'uniform1i'](this.location, value as number);
	}

	protected initialize(value: T) {
		this.set(value);
	}

	pop() {
		const M2 = (this.stack ??= []).pop();
		if (!M2) throw new Error('Uniform stack empty');
		this.set(M2);
	}

	push(m: T) {
		(this.stack ??= []).push(this.value);
		this.set(m);
	}
}

export class UniformMatrix extends Uniform<Float32Array> {
	push(m: Matrix) {
		(this.stack ??= []).push(this.value);
		if (m !== identity) this.set(m); //this.value === identity ? m : multiply(this.value, m));
	}

	pushMult(m: Matrix) {
		this.push(this.value === identity ? m : multiply(this.value, m));
	}

	set(value: Float32Array) {
		this.program.gl[this.method as 'uniformMatrix4x3fv'](
			this.location,
			false,
			value,
		);
	}
}

export class UniformTexture {
	protected location: WebGLUniformLocation;
	protected stack?: Texture[];

	constructor(
		protected program: Program,
		public readonly name: string,
		public readonly value: Texture,
		protected unit: number,
	) {
		this.location = program.location(name);
		this.program.gl.uniform1i(this.location, this.unit);
		this.set(value);
	}

	pop() {
		const M2 = (this.stack ??= []).pop();
		if (!M2) throw new Error('Uniform stack empty');
		this.set(M2);
	}

	push(m: Texture) {
		(this.stack ??= []).push(this.value);
		this.set(m);
	}

	set(value: Texture) {
		const gl = this.program.gl;
		gl.activeTexture(gl.TEXTURE0 + this.unit);
		gl.bindTexture(gl.TEXTURE_2D, value.texture);
	}
}

function getUniformMethod(gl: WebGL2RenderingContext, type: number) {
	switch (type) {
		case gl.FLOAT:
			return 'uniform1f';
		case gl.FLOAT_VEC2:
			return 'uniform2fv';
		case gl.FLOAT_VEC3:
			return 'uniform3fv';
		case gl.FLOAT_VEC4:
			return 'uniform4fv';

		case gl.INT_VEC2:
		case gl.BOOL_VEC2:
			return 'uniform2iv';
		case gl.BOOL_VEC3:
		case gl.INT_VEC3:
			return 'uniform3iv';
		case gl.BOOL_VEC4:
		case gl.INT_VEC4:
			return 'uniform4iv';

		case gl.UNSIGNED_INT:
			return 'uniform1ui';
		case gl.UNSIGNED_INT_VEC2:
			return 'uniform2uiv';
		case gl.UNSIGNED_INT_VEC3:
			return 'uniform3uiv';
		case gl.UNSIGNED_INT_VEC4:
			return 'uniform4uiv';

		case gl.FLOAT_MAT2:
			return 'uniformMatrix2fv';
		case gl.FLOAT_MAT3:
			return 'uniformMatrix3fv';
		case gl.FLOAT_MAT4:
			return 'uniformMatrix4fv';
		case gl.FLOAT_MAT2x3:
			return 'uniformMatrix2x3fv';
		case gl.FLOAT_MAT2x4:
			return 'uniformMatrix2x4fv';
		case gl.FLOAT_MAT3x2:
			return 'uniformMatrix3x2fv';
		case gl.FLOAT_MAT3x4:
			return 'uniformMatrix3x4fv';
		case gl.FLOAT_MAT4x2:
			return 'uniformMatrix4x2fv';
		case gl.FLOAT_MAT4x3:
			return 'uniformMatrix4x3fv';

		case gl.INT:
		case gl.BOOL:
		case gl.SAMPLER_2D:
		case gl.SAMPLER_CUBE:
		case gl.SAMPLER_3D:
		case gl.SAMPLER_2D_SHADOW:
		case gl.SAMPLER_2D_ARRAY:
		case gl.SAMPLER_2D_ARRAY_SHADOW:
		case gl.INT_SAMPLER_2D:
		case gl.INT_SAMPLER_3D:
		case gl.INT_SAMPLER_CUBE:
		case gl.INT_SAMPLER_2D_ARRAY:
		case gl.UNSIGNED_INT_SAMPLER_2D:
		case gl.UNSIGNED_INT_SAMPLER_3D:
		case gl.UNSIGNED_INT_SAMPLER_CUBE:
		case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY:
			return 'uniform1i';
	}
	throw new Error(`Unknown uniform type: ${type}`);
}

/**
 * Creates a WebGL 2.0 context with default shaders.
 *
 * This function initializes a WebGL 2.0 context, sets up a default shader program,
 * creates and binds buffers for vertex position and texture coordinates, and configures
 * initial state for rendering.
 * It also provides methods for manipulating the model-view matrix (`pushMatrix` and `popMatrix`)
 * for transformations.
 */
export function webgl2({
	canvas,
}: {
	canvas: OffscreenCanvas | HTMLCanvasElement;
}) {
	function createBuffer() {
		const buffer = gl.createBuffer();
		if (!buffer) throw new Error('Could not create buffer');
		return buffer;
	}

	function setIndices(data: ArrayBuffer | ArrayBufferView) {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
	}

	function resizeViewport(width: number, height: number) {
		gl.viewport(0, 0, width, height);
	}

	function clear() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	const program = new Program(
		`#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_position;
in vec2 v_texcoord;
in vec3 v_tangent;  

uniform sampler2D u_texture;
uniform sampler2D u_normalTexture;
uniform sampler2D u_metallicTexture;
uniform sampler2D u_roughnessTexture;
uniform sampler2D u_aoTexture;
uniform vec3 u_lightPosition;
uniform vec3 u_cameraPosition;
uniform vec4 u_color;

uniform int u_renderMode; // 0 = unlit, 1 = PBR lit

out vec4 outColor;

#define PI 3.14159265359

// Function to transform normal from tangent space to world space
vec3 getNormalFromMap() {
    vec3 tangentNormal = texture(u_normalTexture, v_texcoord).rgb * 2.0 - 1.0;
    
    vec3 N = normalize(v_normal);
    vec3 T = normalize(v_tangent);
    vec3 B = normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);
    
    return normalize(TBN * tangentNormal);
}

vec4 calculateLighting(vec4 albedo, float metallic, float roughness, float ao, vec3 normal, vec3 fragPos) {
    vec3 lightColor = vec3(1.0);
    vec3 lightDir = normalize(u_lightPosition - fragPos);
    vec3 viewDir = normalize(u_cameraPosition - fragPos);
    vec3 halfwayDir = normalize(lightDir + viewDir);
    
    float distance = max(length(u_lightPosition - fragPos), 1e-6);
    float attenuation = 1.0 / (distance * distance);
    vec3 radiance = lightColor * attenuation;
    
    // Ambient
    vec4 ambient = ao * albedo;
    
    // Diffuse (Lambertian)
    float dotNormalLight = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = dotNormalLight * albedo.rgb;
    
    // Specular (Cook-Torrance BRDF)
    float roughnessSq = roughness * roughness;
    
    // Avoid division by zero
    float NdotH = max(dot(normal, halfwayDir), 0.0001);
    float dotNormalView = max(dot(normal, viewDir), 0.0001);
    float VdotH = max(dot(viewDir, halfwayDir), 0.0001);
    
    // Distribution (Trowbridge-Reitz / GGX)
    float nom = roughnessSq;
    float denom = (NdotH * NdotH * (roughnessSq - 1.0) + 1.0);
    denom = PI * denom * denom;
    float distribution = nom / max(denom, 1e-6);
    
    // Fresnel-Schlick approximation with metallic
    vec3 F0 = mix(vec3(0.04), albedo.rgb, metallic);
    // Fixed: Use VdotH instead of dot(normal, viewDir)
    vec3 fresnel = F0 + (1.0 - F0) * pow(1.0 - VdotH, 5.0);
    
    // Geometry (Smith's method with Schlick-GGX)
    float k = (roughness + 1.0) * (roughness + 1.0) / 8.0;
    float GGX1 = dotNormalView / (dotNormalView * (1.0 - k) + k);
    float GGX2 = dotNormalLight / (dotNormalLight * (1.0 - k) + k);
    float geometry = GGX1 * GGX2;
    
    vec3 specular = (distribution * geometry * fresnel) / max(4.0 * dotNormalLight * dotNormalView, 0.0001);
    
    // Only add specular if dotNormalLight is positive
    vec3 finalSpecular = dotNormalLight > 0.0 ? specular : vec3(0.0);
    
    return vec4(ambient.rgb + radiance * (diffuse + finalSpecular), albedo.a);
}

void main() {
    vec4 albedo = texture(u_texture, v_texcoord) * u_color;
	
	// UNLIT BRANCH
    if (u_renderMode == 0) {
        outColor = albedo;
        return;
    }
    
    // Use the proper normal map transformation
    vec3 normal = getNormalFromMap();
    
    float metallic = texture(u_metallicTexture, v_texcoord).r;
    float roughness = texture(u_roughnessTexture, v_texcoord).r;
    float ao = texture(u_aoTexture, v_texcoord).r;
    
    outColor = calculateLighting(albedo, metallic, roughness, ao, normal, v_position);
}
`,
		`#version 300 es
precision highp float;

in vec3 a_position;
in vec3 a_normal;
in vec2 a_texcoord;
in vec3 a_tangent;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_normalMatrix;

out vec3 v_position;
out vec3 v_normal;
out vec2 v_texcoord;
out vec3 v_tangent;

void main() {
    vec4 worldPosition = u_model * vec4(a_position, 1.0);
    v_position = worldPosition.xyz;
    v_normal = normalize(mat3(u_normalMatrix) * a_normal);
    v_tangent = normalize(mat3(u_normalMatrix) * a_tangent);
    v_texcoord = a_texcoord;

    gl_Position = u_projection * u_view * worldPosition;
}
		`,
		canvas,
	);
	const { gl } = program;

	program.use();

	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.BLEND);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	const indicesBuffer = createBuffer();

	return {
		position: program.attribute(
			'a_position',
			[0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0],
		),
		normal: program.attribute(
			'a_normal',
			[0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		),
		tangent: program.attribute(
			'a_tangent',
			[1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
		),
		texcoord: program.attribute(
			'a_texcoord',
			[0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0],
			2,
		),

		lightPosition: program.uniform('u_lightPosition', [0.5, 0.5, 1.0]),
		cameraPosition: program.uniform('u_cameraPosition', [0.0, 0.0, 1.0]),

		model: program.uniformMatrix('u_model', identity),
		view: program.uniformMatrix('u_view', identity),
		projection: program.uniformMatrix(
			'u_projection',
			orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1),
		),
		normalMatrix: program.uniformMatrix('u_normalMatrix', identity),

		color: program.uniform('u_color', whiteColor),
		renderMode: program.uniform('u_renderMode', 0),

		texture: program.uniformTexture(
			'u_texture',
			ColorTexture(gl, whiteColor),
		),
		normalTexture: program.uniformTexture(
			'u_normalTexture',
			ColorTexture(gl, blackColor),
		),
		metallicTexture: program.uniformTexture(
			'u_metallicTexture',
			ColorTexture(gl, blackColor),
		),
		roughnessTexture: program.uniformTexture(
			'u_roughnessTexture',
			ColorTexture(gl, blackColor),
		),
		aoTexture: program.uniformTexture(
			'u_aoTexture',
			ColorTexture(gl, whiteColor),
		),

		canvas: gl.canvas,
		clear,
		resizeViewport,
		setIndices,
		createTexture(o: TextureOptions) {
			return new Texture(gl, o);
		},
		createColorTexture: ColorTexture.bind(0, gl),
		draw(count = 6, offset = 0, mode: number = gl.TRIANGLES) {
			gl.drawArrays(mode, offset, count);
		},
		drawElements: gl.drawElements.bind(gl),
	};
}

/**
 * Creates a matrix that transforms a `Box` to a transformation matrix.
 *
 * This function takes a `Box` object and optionally a destination `Matrix`. It populates the `dst` matrix with the
 * transformations specified by the `Box`. The transformations include:
 * - Rotation: Rotates the box around its center `cx`, `cy` by `rotation` radians.
 * - Scaling: Scales the box by `sx` and `sy` along the x and y axes.
 * - Translation: Translates the box to the position `x`, `y`.
 */
export function composeBox(box: Box, dst: Matrix = new Float32Array(16)) {
	const { x, y, sx, sy, cx, cy, w, h, rotation } = box;
	dst[2] = dst[3] = dst[6] = dst[7] = dst[8] = dst[9] = dst[11] = dst[14] = 0;
	dst[10] = dst[15] = 1;

	// Rotate
	const cos = Math.cos(rotation);
	const sin = Math.sin(rotation);
	dst[0] = sx * cos;
	dst[1] = sx * sin;
	dst[4] = sy * -sin;
	dst[5] = sy * cos;

	// Translate negative origin
	dst[12] = dst[0] * -cx + dst[4] * -cy + x;
	dst[13] = dst[1] * -cx + dst[5] * -cy + y;

	// Scale w and h
	dst[0] *= w;
	dst[1] *= w;
	dst[4] *= h;
	dst[5] *= h;

	return dst;
}

export function Box(box?: Partial<Box>) {
	return {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
		sx: 1,
		sy: 1,
		cx: 0,
		cy: 0,
		rotation: 0,
		...box,
	};
}

export function drawEngine(ctx: WebglContext) {
	function color(newColor: Color) {
		ctx.color.set(newColor);
	}

	function texture(newTexture: Texture) {
		ctx.texture.set(newTexture);
	}

	function stroke({ width, color }: { width?: number; color?: Color }) {
		if (width !== undefined) _strokeWidth = width;
		if (color) _strokeColor = color;
	}

	function pushDraw(m: Matrix) {
		ctx.model.pushMult(m);
		ctx.draw();
		ctx.model.pop();
	}

	function putpixel(x: number, y: number) {
		PIXEL_M[12] = x;
		PIXEL_M[13] = y;
		pushDraw(PIXEL_M);
	}

	function line(x0: number, y0: number, x1: number, y1: number) {
		//polyline([x0, y0, x1, y1]);
		const d = Math.hypot(x1 - x0, y1 - y0);
		const a = Math.atan2(y1 - y0, x1 - x0);
		const h = _strokeWidth * unitY;

		LINE_BOX.x = x0;
		LINE_BOX.y = y0;
		LINE_BOX.w = d;
		LINE_BOX.h = h;
		LINE_BOX.cy = h / 2;
		LINE_BOX.rotation = a;

		composeBox(LINE_BOX, LINE_M);
		pushDraw(LINE_M);
	}

	function polyline(points: ArrayLike<number>) {
		const n = points.length;
		if (n < 2) return;

		// Each segment is a quad = 2 triangles = 6 vertices
		const verts = new Float32Array((n / 2 - 1) * 18);
		let o = 0;

		// Calculate half stroke width in world units for each axis independently
		// to account for non-square aspect ratios.
		const halfWx = (_strokeWidth * unitX) / 2;
		const halfWy = (_strokeWidth * unitY) / 2;

		for (let i = 2; i < n; i += 2) {
			const x0 = points[i - 2];
			const y0 = points[i - 1];
			const x1 = points[i];
			const y1 = points[i + 1];

			if (Number.isNaN(x0 + y0 + x1 + y1)) continue;

			// direction & normal
			const dx = x1 - x0;
			const dy = y1 - y0;
			const L = Math.hypot(dx, dy) || 1;
			const nx = -(dy / L);
			const ny = dx / L;

			// build two triangles: A+normal, B+normal, B-normal
			verts[o++] = x0 + nx * halfWx;
			verts[o++] = y0 + ny * halfWy;
			verts[o++] = 0;

			verts[o++] = x1 + nx * halfWx;
			verts[o++] = y1 + ny * halfWy;
			verts[o++] = 0;

			verts[o++] = x1 - nx * halfWx;
			verts[o++] = y1 - ny * halfWy;
			verts[o++] = 0;

			// then A+normal, B-normal, A-normal
			verts[o++] = x0 + nx * halfWx;
			verts[o++] = y0 + ny * halfWy;
			verts[o++] = 0;

			verts[o++] = x1 - nx * halfWx;
			verts[o++] = y1 - ny * halfWy;
			verts[o++] = 0;

			verts[o++] = x0 - nx * halfWx;
			verts[o++] = y0 - ny * halfWy;
			verts[o++] = 0;
		}

		ctx.position.set({
			data: verts.buffer,
			size: 3,
			usage: WebGL2RenderingContext.STREAM_DRAW,
		});
		ctx.normal.disable();
		ctx.texcoord.disable();
		ctx.tangent.disable();
		ctx.draw(verts.length / 3);
		ctx.normal.enable();
		ctx.texcoord.enable();
		ctx.tangent.enable();
		ctx.position.reset();
	}

	function rect(x: number, y: number, w: number, h: number) {
		if (w < 0) {
			x = x + w;
			w = -w;
		}
		if (h < 0) {
			y = y + h;
			h = -h;
		}
		scaleM(RECT_M, x, y, w, h);
		const nw = RECT_M[0];
		const nh = RECT_M[5];
		const nx = RECT_M[12];
		const ny = RECT_M[13];
		RECT_M[5] = unitY;
		pushDraw(RECT_M);

		RECT_M[13] = ny + nh - unitY;
		pushDraw(RECT_M);

		RECT_M[0] = unitX;
		RECT_M[5] = unitY - nh;
		pushDraw(RECT_M);

		RECT_M[12] = nx + nw - unitX;
		pushDraw(RECT_M);
	}

	function scaleM(m: Matrix, x: number, y: number, w: number, h: number) {
		m[0] = w; // * viewScaleX;
		m[5] = h; // * viewScaleY;
		m[12] = x; //(x - viewMinX) * viewScaleX;
		m[13] = y; //(y - viewMinY) * viewScaleY;
	}

	function fillRect(x: number, y: number, w: number, h: number) {
		scaleM(RECT_M, x, y, w, h);
		pushDraw(RECT_M);
	}

	function arc(
		x0: number,
		y0: number,
		rx: number,
		ry: number,
		start: number,
		stop: number,
	) {
		start = ((start % TWOPI) + TWOPI) % TWOPI;
		stop = ((stop % TWOPI) + TWOPI) % TWOPI;
		if (stop <= start) stop += TWOPI;
		const angleRange = stop - start;

		const screenRx = Math.abs(rx / unitX); // * viewScaleX * ctx.canvas.width;
		const screenRy = Math.abs(ry / unitY); // * viewScaleY * ctx.canvas.height;
		// how many pixels per segment you’re comfortable with
		const maxPixelPerSegment = 1;
		// number of segments so that each spans at most maxPixelPerSegment
		const segments = Math.max(
			4,
			Math.ceil(
				(angleRange * Math.max(screenRx, screenRy)) /
					maxPixelPerSegment,
			),
		);

		const delta = angleRange / segments;

		// NDC center and radii
		const cx = x0;
		const cy = y0;
		const ndcRx = rx; // * viewScaleX;
		const ndcRy = ry; // * viewScaleY;

		// stroke half‐sizes
		const halfStrokeX = (_strokeWidth * unitX) / 2;
		const halfStrokeY = (_strokeWidth * unitY) / 2;
		const outerRx = ndcRx + halfStrokeX;
		const outerRy = ndcRy + halfStrokeY;
		const innerRx = Math.max(0, ndcRx - halfStrokeX);
		const innerRy = Math.max(0, ndcRy - halfStrokeY);

		const fillCount = segments + 2; // center + segments + duplicate first
		const strokeCount = _strokeWidth > 0 ? (segments + 1) * 2 : 0;
		const verts = new Float32Array((fillCount + strokeCount) * 3);
		let o = 0;

		verts[o++] = cx;
		verts[o++] = cy;
		verts[o++] = 0;

		// rim of the fill‐fan
		for (let i = 0; i <= segments; i++) {
			const a = start + delta * i;
			const cosA = Math.cos(a);
			const sinA = Math.sin(a);
			verts[o++] = cx + cosA * ndcRx;
			verts[o++] = cy - sinA * ndcRy;
			verts[o++] = 0;
		}

		// stroke ring (triangle-strip) immediately after
		if (strokeCount) {
			for (let i = 0; i <= segments; i++) {
				const a = start + delta * i;
				const cosA = Math.cos(a);
				const sinA = Math.sin(a);
				// outer
				verts[o++] = cx + cosA * outerRx;
				verts[o++] = cy - sinA * outerRy;
				verts[o++] = 0;
				// inner
				verts[o++] = cx + cosA * innerRx;
				verts[o++] = cy - sinA * innerRy;
				verts[o++] = 0;
			}
		}

		// now draw everything with one position.set
		ctx.normal.disable();
		ctx.texcoord.disable();
		ctx.tangent.disable();

		ctx.position.set({
			data: verts.buffer,
			size: 3,
			usage: WebGL2RenderingContext.STREAM_DRAW,
		});

		// draw fill fan
		ctx.draw(fillCount, 0, WebGL2RenderingContext.TRIANGLE_FAN);

		// draw stroke strip if needed
		if (strokeCount) {
			if (_strokeColor) ctx.color.push(_strokeColor);
			ctx.draw(
				strokeCount,
				fillCount,
				WebGL2RenderingContext.TRIANGLE_STRIP,
			);
			if (_strokeColor) ctx.color.pop();
		}

		// restore
		ctx.normal.enable();
		ctx.texcoord.enable();
		ctx.tangent.enable();
		ctx.position.reset();
	}

	function ellipse(x: number, y: number, rx: number, ry: number) {
		arc(x, y, rx, ry, 0, 2 * Math.PI);
	}

	function circle(x: number, y: number, radius: number) {
		arc(x, y, radius, radius, 0, 2 * Math.PI);
	}

	/*function readScreen() {
		if (!screenTexture) {
			screenTexture = ctx.frag.createTexture();
			screenData = new ImageData(ctx.width, ctx.height);
		}
		ctx.frag.readPixels(screenData.data);
		return screenData;
	}

	function drawScreen(image: ImageData) {
		RECT_M[0] = image.width;
		RECT_M[5] = image.height;
		RECT_M[12] = 0;
		RECT_M[13] = 0;
		const hasWindow = windowActive;

		if (hasWindow) resetWindow();
		ctx.vtx.pushMatrix(RECT_M);
		ctx.frag.updateTexture(screenTexture, image);
		ctx.frag.setColor(WhiteColor);
		ctx.draw();
		ctx.vtx.popMatrix();
		if (hasWindow) restoreWindow();
	}

	function boundaryFill(x: number, y: number, color: Color, border = color) {
		readScreen();
		softBoundaryFill(
			screenData,
			windowActive ? getScreenX(x) : Math.round(x),
			windowActive ? getScreenY(y) : Math.round(y),
			color,
			border
		);
		drawScreen(screenData);
	}

	function floodFill(x: number, y: number, color: Color) {
		readScreen();
		softFloodFill(
			screenData,
			windowActive ? getScreenX(x) : Math.round(x),
			windowActive ? getScreenY(y) : Math.round(y),
			color
		);
		drawScreen(screenData);
	}*/

	/*function draw2DTexture(
		texture: WebGLTexture,
		x: number,
		y: number,
		w: number,
		h: number,
	) {
		scaleM(RECT_M, x, y, w, h);
		ctx.texture.set(texture);
		ctx.color.set(whiteColor);
		pushDraw(RECT_M);
	}

	/*function drawImage(
		src: TexImageSource,
		x: number,
		y: number,
		w: number,
		h: number
	) {
		if (!drawTexture) drawTexture = ctx.createTexture(src);
		else ctx.updateTexture(drawTexture, src);
		draw2DTexture(drawTexture, x, y, w, h);
	}*/

	/**
	 * Sets a custom orthographic projection matrix defining a rendering window.
	 * Updates internal parameters to map logical coordinates into normalized device coordinates,
	 * allowing rendering to be confined within the specified subregion of the canvas.
	 */
	function window(x: number, y: number, x2: number, y2: number) {
		windowM = orthographic(x, x2, y, y2, -1, 1);
		ctx.projection.set(windowM);

		activeWindow.x = x;
		activeWindow.y = y;
		activeWindow.x2 = x2;
		activeWindow.y2 = y2;

		PIXEL_M[0] = unitX = (x2 - x) / ctx.canvas.width;
		PIXEL_M[5] = unitY = (y2 - y) / ctx.canvas.height;

		// how many pixels per world‐unit
		activeWindow.pw = unitX; // (x2 - x);
		activeWindow.ph = unitY; // (y2 - y);

		LINE_BOX.h = unitY;
		LINE_BOX.cx = unitX * 0.5;
	}

	function resetWindow() {
		window(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	const PIXEL_M = Matrix();
	const LINE_M = Matrix();
	const RECT_M = Matrix();
	const LINE_BOX = Box();
	const whiteTexture = ctx.createColorTexture(whiteColor);
	const activeWindow = { x: 0, y: 0, x2: 0, y2: 0, pw: 0, ph: 0 };
	const TWOPI = Math.PI * 2;

	let windowM: Matrix;
	// width and height of 1 pixel
	let unitX = 1,
		unitY = 1;
	let _strokeWidth = 1,
		_strokeColor: Color | undefined;

	texture(whiteTexture);
	resetWindow();

	return {
		color,
		putpixel,
		texture,
		line,
		polyline,
		rect,
		fillRect,
		arc,
		circle,
		window,
		resetWindow,
		stroke,
		activeWindow,
		ellipse,
	};
}

export type Plugin = {
	clear(): void;
	set(node: Node, prop: string, value: unknown): void;
	begin(node: Node, push: (cb: () => void) => void): void;
	end?(node: Node, push: (cb: () => void) => void): void;
	resize?(width: number, height: number): void;
};

export interface EngineOptions {
	canvas: HTMLCanvasElement | OffscreenCanvas;

	//readonly root: Node;
	// Defaults to false
	autoStart?: boolean;
	// If present the canvas will be attached to the specified element.
	container?: HTMLElement | string;

	// For JSON only, will be passed to update functions.
	global?: string;
}

export function engine(p: EngineOptions) {
	/**
	 * Renders an image at the specified location.
	 * Takes an image source (`src`) as input.
	 */
	/*async function image(p: ImageComponent) {
		const img = typeof p.src === 'string' ? await loadImage(p.src) : p.src;
		texture({ ...p, src: img });
	}*/

	/**
	 * Renders a texture to the screen.
	 * It creates a WebGL texture, uploads the image data, sets the texture parameters, and draws the texture to the screen.
	 * It also handles updating the texture if the `dirty` flag is set in the `TextureComponent` object.
	 */
	function texture(p: TextureComponent) {
		const texture = program.createTexture(p);
		push(() => program.texture.push(texture));
	}

	function boxComponent(box: BoxComponent) {
		const M = composeBox(Box(box));

		push(() => {
			program.model.pushMult(M);
		});
	}

	function set(node: Node, prop: string, value: unknown) {
		for (const plug of plugins) plug.set(node, prop, value);
		requestRender();
	}

	async function load(node: Node) {
		const { update, fill } = node;

		if (node.texture) texture(node.texture);
		if (fill) push(() => program.color.push(fill));

		if (node.box) boxComponent(node.box);

		if (plugins) for (const plug of plugins) plug.begin(node, push);

		if (node.children) for (const child of node.children) await load(child);

		if (node.box) push(() => program.model.pop());
		if (fill) push(() => program.color.pop());
		if (node.texture) push(() => program.texture.pop());

		if (plugins) for (const plug of plugins) plug.end?.(node, push);

		if (update) {
			const fn =
				typeof update === 'function'
					? update
					: new Function('node', 'global', update);
			push(() => fn(node, set, global));
		}
	}

	function push(cb: () => void) {
		pipeline.push(cb);
	}

	function render() {
		renderPending = false;
		program.clear();
		for (const plug of plugins) plug.clear();
		for (const p of pipeline) p();
	}

	function reset() {
		stop();
		pipeline.length = 0;
	}

	function resize(width: number, height: number) {
		program.resizeViewport(width, height);
		for (const plug of plugins) plug.resize?.(width, height);
	}

	function requestRender() {
		if (renderPending) return;
		renderPending = true;
		cancelAnimationFrame(renderId);
		renderId = requestAnimationFrame(render);
	}

	function stop() {
		cancelAnimationFrame(renderId);
	}

	function plugin(plug: Plugin) {
		plugins.push(plug);
	}

	const program = webgl2(p);
	const canvas = program.canvas;
	const global = p.global && new Function(p.global)();
	const pipeline: (() => void)[] = [];
	const plugins: Plugin[] = [];
	let renderId = 0;
	let renderPending = true;

	return {
		canvas,
		load,
		reset,
		render,
		resize,
		program,
		stop,
		plugin,
	};
}
