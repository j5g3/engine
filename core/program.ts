import { identity, multiply, orthographic } from './math.js';

import type { Matrix } from './math.js';

type ArrayBufferTextureOptions = TextureBaseOptions & {
	src: ArrayBufferView;
	width: number;
	height: number;
};

type TexImageTextureOptions = TextureBaseOptions & {
	src?: TexImageSource;
};

type ArrayBufferOptions = {
	data: ArrayBuffer;
	size?: number;
	type?: number;
	normalized?: boolean;
	stride?: number;
	offset?: number;
	usage?: GLenum;
};

export type TextureOptions = ArrayBufferTextureOptions | TexImageTextureOptions;

export type UniformType = Float32Array | number[] | number | Texture | Color;

export type Color = readonly [number, number, number, number] | Float32Array;

export type WebglContext = ReturnType<typeof webgl2>;

interface TextureBaseOptions {
	internalFormat?: GLenum;
	minFilter?: GLenum;
	magFilter?: GLenum;
	wrapS?: GLenum;
	wrapT?: GLenum;
	border?: number;
	format?: GLenum;
	type?: GLenum;
}

export enum RenderMode {
	quad = 0,
	line = 1,
	polyline = 2,
}

const whiteColor: Color = [1, 1, 1, 1] as const;
const blackColor: Color = [0, 0, 0, 1] as const;

function getWebGLType(array: ArrayBufferView): GLenum {
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

/**
 * Compiles a shader using the given source code and type.
 *
 * It takes a WebGLRenderingContext, source code string, and shader type as input.
 * Creates a shader object, sets its source code, compiles it, and returns the compiled shader object.
 * If the compilation fails, an error is thrown with the compilation log.
 */
function compileShader(
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

/**
 * Creates a WebGL texture with a single pixel of the given color, used for filling shapes with color.
 */
export function ColorTexture(gl: WebGL2RenderingContext, color: Color) {
	return new Texture(gl, {
		src: color instanceof Float32Array ? color : new Float32Array(color),
		width: 1,
		height: 1,
	});
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

		const vertexShader = compileShader(gl, vtx, gl.VERTEX_SHADER);
		const fragShader = compileShader(gl, frag, gl.FRAGMENT_SHADER);

		gl.attachShader(glProgram, vertexShader);
		gl.attachShader(glProgram, fragShader);
		gl.linkProgram(glProgram);

		if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
			const infoLog = gl.getProgramInfoLog(glProgram);
			console.error(infoLog);
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
		if (!location) throw new Error(`Invalid uniform "${name}"`);
		return location;
	}

	uniformInfo(name: string) {
		const { gl, glProgram } = this;
		const location = gl.getUniformLocation(glProgram, name);
		if (!location)
			throw new Error(`Invalid uniform location for "${name}"`);
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
		if (!location)
			throw new Error(`Invalid uniform location for "${name}"`);
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
		if (!this.stack || this.stack?.length === 0)
			throw new Error('Uniform stack empty');

		const M2 = this.stack.pop();
		if (M2 === undefined) throw new Error('Invalid matrix popped');

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

export const SHADER_CONSTANTS = `
const lowp int RENDER_MODE_QUAD = 0;
const lowp int RENDER_MODE_LINE = 1;
const lowp int RENDER_MODE_POLYLINE = 2;

const float CAP_BUTT = 0.0;
const float CAP_SQUARE = 1.0;
const float CAP_ROUND = 2.0;

const float JOIN_NONE = 0.0;
const float JOIN_MITER = 1.0;
const float JOIN_BEVEL = 2.0;
const float JOIN_ROUND = 3.0;

const float PI = 3.14159265359;
const float TWO_PI = 6.283185307179586;
const float EPSILON = 1e-6;
`;

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
		resolution.set([width, height]);
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
in vec2 v_lineUV;

flat in vec2 v_lineStart;
flat in vec2 v_lineEnd;
flat in lowp int v_lineSegment;
flat in vec2 v_lineDir;
in vec2 v_lineAdj;

uniform sampler2D u_texture;
uniform sampler2D u_normalTexture;
uniform sampler2D u_metallicTexture;
uniform sampler2D u_roughnessTexture;
uniform sampler2D u_aoTexture;
uniform vec3 u_lightPosition;
uniform vec3 u_cameraPosition;
uniform vec4 u_color;

uniform float u_strokeWidth;   // width in pixels
uniform float u_capType;
uniform float u_joinType;      // 0=none, 1=miter, 2=bevel, 3=round
uniform float u_miterLimit;    // miter limit for sharp angles

uniform lowp int u_renderMode;

out vec4 outColor;

${SHADER_CONSTANTS}

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

float renderRoundCap(bool isStart, float halfW, float aaWidth) {
	vec2 d = gl_FragCoord.xy - (isStart ? v_lineStart : v_lineEnd);
	float proj = dot(d, v_normal.xy);
	float dist = length(d);
	return (isStart ? proj < 0.0 : proj >= 0.0)
		? 1.0 - smoothstep(halfW - aaWidth, halfW, dist)
		: 1.0;
}

void renderLine(vec4 albedo, bool oneSegment) {
	float halfW = u_strokeWidth * 0.5;
	float aaWidth = fwidth(v_lineUV.y) * halfW;
	float distY = abs(v_lineUV.y) * halfW;
	float t = v_lineUV.x;
	
	float alpha = (distY <= 0.5) ? 1.0 : 1.0 - smoothstep(halfW - aaWidth, halfW, distY);
	
    // Round caps for start or end segments
	if (
		(v_lineSegment==0 || v_lineSegment==1) && 
		u_capType == CAP_ROUND 
	) {
		alpha = renderRoundCap(v_lineSegment == 0, halfW, aaWidth);
		
		// Additional end cap for single segments
		if (t > 0.5 && u_capType == CAP_ROUND && oneSegment) {
			alpha = renderRoundCap(false, halfW, aaWidth);
		}
	} else if (!oneSegment && (u_joinType != JOIN_NONE)) {
		bool isStartJoin = v_lineSegment != 0 && (t < 0.5);
		bool isEndJoin = v_lineSegment != 1 && (t > 0.5);
		
		if (isStartJoin || isEndJoin) {
			vec2 center, inDir, outDir;

			if (isStartJoin) {
				center = v_lineStart;
				inDir = normalize(v_lineStart - v_lineAdj);
				outDir = v_lineDir;
			} else {
				center = v_lineEnd;
				inDir = v_lineDir;
				outDir = normalize(v_lineAdj - v_lineEnd);
			}
			
			vec2 toFrag = gl_FragCoord.xy - center;
			float len = length(toFrag);
			float distAlongIn = dot(toFrag, inDir);
			float distAlongOut = dot(toFrag, outDir);
			
			/*if (u_joinType == JOIN_MITER && t>0.5) {
				// we need to extend the center point by u_miterLimit in the opposite direction of outDir ,
				// then we add halfW to calculate the line upper vertex, and discard pixels that are above.
				vec2 outDir = normalize(v_lineEnd - v_lineAdj);
				float x = toFrag.x / outDir.x  + u_miterLimit*halfW;
				vec2 point = center + x * -outDir;
				
				if (gl_FragCoord.y > point.y) {
					outColor = vec4(1.0, 0.0, 0.0, 1.0);
					return;
				}
			}*/ 
				
			if (
				(distAlongIn > 0.0 && distAlongOut < 0.0) ||
				(distAlongIn > 0.0 && len > halfW && t>0.5) ||
				(distAlongOut < 0.0 && len > halfW && t<0.5)
			) {
				if (u_joinType == JOIN_ROUND) {
					alpha = 1.0 - smoothstep(halfW-aaWidth, halfW, len);
				} else {
					float angleDot = dot(inDir, outDir);
					vec2 miter = normalize(inDir + outDir);
					vec2 bevelNormal = vec2(-miter.y, miter.x);
					float bevelDist = dot(toFrag, bevelNormal);
					float distToCheck = abs(bevelDist);

					alpha = 1.0 - smoothstep(halfW-aaWidth, halfW, distToCheck);
				}
			}
		}
	}
	
	if (alpha <= 0.0) discard;
	float finalA = albedo.a * alpha;
	outColor = vec4(albedo.rgb * finalA, finalA);
}

void main() {
    vec4 albedo = texture(u_texture, v_texcoord) * u_color;
	
    if (u_renderMode == RENDER_MODE_QUAD) {
        outColor = albedo;
	}
	else if (u_renderMode == RENDER_MODE_LINE || u_renderMode == RENDER_MODE_POLYLINE) {
		renderLine(albedo, u_renderMode == RENDER_MODE_LINE);
	} else {
		// Use the proper normal map transformation
		vec3 normal = getNormalFromMap();

		float metallic = texture(u_metallicTexture, v_texcoord).r;
		float roughness = texture(u_roughnessTexture, v_texcoord).r;
		float ao = texture(u_aoTexture, v_texcoord).r;

		outColor = calculateLighting(albedo, metallic, roughness, ao, normal, v_position);
	}
}
`,
		`#version 300 es
precision highp float;

in vec3 a_position;
in vec3 a_normal;
in vec2 a_texcoord;
in vec3 a_tangent;
in vec4 a_data0;  // p0.xy, p1.xy for line mode
in vec4 a_data1;  // t, side, next.xy for line mode

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_normalMatrix;
uniform lowp int u_renderMode;
uniform vec2 u_resolution;     // viewport resolution for pixel-perfect lines

// Line Uniforms
uniform float u_capType;       // 0=butt, 1=square, 2=round
uniform float u_joinType;      // 0=none, 1=miter, 2=bevel, 3=round
uniform float u_strokeWidth;   // width in pixels
uniform float u_miterLimit;    // miter limit for sharp angles

out vec3 v_position;
out vec3 v_normal;
out vec2 v_texcoord;
out vec3 v_tangent;
out vec2 v_lineUV;

flat out vec2 v_lineStart;
flat out vec2 v_lineEnd;
flat out lowp int v_lineSegment;
flat out vec2 v_lineDir;
out vec2 v_lineAdj;

${SHADER_CONSTANTS}

vec2 safeNormalize(vec2 v) {
    float len = length(v);
    return len > EPSILON ? v / len : vec2(0.0, 1.0);
}

vec2 worldToScreen(vec2 worldPos) {
    vec4 clipPos = u_projection * u_view * u_model * vec4(worldPos, 0.0, 1.0);
    vec2 ndc = clipPos.xy / clipPos.w;
    vec2 screen = (ndc + 1.0) * 0.5 * u_resolution;
    return floor(screen)+0.5;
}

vec4 screenToClip(vec2 screenPos, float w) {
    vec2 ndc = (screenPos / u_resolution) * 2.0 - 1.0;
    return vec4(ndc * w, 0.0, w);
}

vec2 getLineJoinDirection(vec2 dirAdj, vec2 normal) {
    float l = length(dirAdj);
    if (l < EPSILON) return normal;
    vec2 dirNorm = dirAdj / l;
    vec2 nAdj = vec2(-dirNorm.y, dirNorm.x);
    return normalize(normal + nAdj);
}

float getMiterLength(vec2 bisector, vec2 normal, float halfW) {
    float dotProd = dot(bisector, normal);
    return halfW / dotProd;
}

void renderLine() {
    vec2 p0      = a_data0.xy;
    vec2 p1      = a_data0.zw;
    float t      = a_data1.x;
    float side   = a_data1.y;
	// nextPt contains prev point when t=0 and next point when t=1
    vec2 nextPt  = a_data1.zw; 
	
	bool isStartSeg = t >= 2.0;
	bool isEndSeg = t < 0.0;
	
	t = isStartSeg ? t - 2.0 : isEndSeg ? t + 2.0 : t;
	
	bool isStartCap  = t == 0.0 && isStartSeg;
	bool isEndCap    = t == 1.0 && isEndSeg;
	bool isStartJoin = t == 0.0 && !isStartSeg;
	bool isEndJoin = t == 1.0 && !isEndSeg;
	bool isJoin = u_renderMode != RENDER_MODE_LINE && (isStartJoin || isEndJoin);
	
    vec2 screen0 = worldToScreen(p0);
    vec2 screen1 = worldToScreen(p1);
	
    vec2 sc = mix(screen0, screen1, t);
    vec2 dir     = screen1 - screen0;
    float len    = length(dir);
    vec2 ndir    = normalize(dir);
    vec2 normal  = vec2(-ndir.y, ndir.x);

    float halfW = u_strokeWidth * 0.5;
	
    v_lineUV     = vec2(t, side);
	v_lineSegment = isStartSeg ? 0 : isEndSeg ? 1 : 2;
	v_normal = vec3(ndir, 0.0);
	v_lineStart = screen0;
	v_lineEnd = screen1;
	v_lineDir = ndir;
	
    // 6) base offset
    vec2 offset = normal * (halfW * side);
	
	if (u_joinType == JOIN_ROUND || u_joinType == JOIN_BEVEL) {
		v_lineAdj = worldToScreen(nextPt);
	}
		
    if (u_capType != CAP_BUTT && !isJoin) {
        sc += ndir * (halfW * (t==0.0 ? -1.0 : 1.0));
    }
    else if (isJoin && u_joinType != JOIN_NONE) {
		vec2 screenNext = worldToScreen(nextPt);
		vec2 dirAdj = (t == 0.0) ? (screen0 - screenNext) : (screenNext - screen1);
		vec2 bisector = getLineJoinDirection(dirAdj, normal);
		float miterLen = getMiterLength(bisector, normal, halfW);

		if (u_joinType == JOIN_ROUND)
			sc += ndir * halfW *  (t==0.0 ? -1.0 : 1.0);
		else if (isnan(miterLen - miterLen) || miterLen > u_miterLimit * halfW) {
			if (u_joinType== JOIN_BEVEL && t==1.0)
				sc += ndir * halfW *  (t==0.0 ? -1.0 : 1.0);
			else
				offset = bisector * (u_miterLimit * halfW) * side;
		} else 
			offset = bisector * miterLen * side;
    }

    gl_Position = screenToClip(sc + offset, 1.0);
}

void renderQuad() {
    vec4 worldPosition = u_model * vec4(a_position, 1.0);
	v_texcoord = a_texcoord;
    gl_Position = u_projection * u_view * worldPosition;
}

void main() {
	if (u_renderMode == RENDER_MODE_QUAD) { 
		renderQuad();
	} else if (u_renderMode == RENDER_MODE_LINE || u_renderMode == RENDER_MODE_POLYLINE) {
		renderLine();
	} else {
		// Standard mesh rendering
		vec4 worldPosition = u_model * vec4(a_position, 1.0);
		v_position = worldPosition.xyz;
		v_normal = normalize(mat3(u_normalMatrix) * a_normal);
		v_tangent = normalize(mat3(u_normalMatrix) * a_tangent);
		v_texcoord = a_texcoord;
		gl_Position = u_projection * u_view * worldPosition;
	}
}`,
		canvas,
	);
	const { gl } = program;

	program.use();

	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.BLEND);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	const indicesBuffer = createBuffer();
	const resolution = program.uniform('u_resolution', [
		canvas.width,
		canvas.height,
	]);

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

		data0: program.attribute('a_data0', [], 4),
		data1: program.attribute('a_data1', [], 4),

		lightPosition: program.uniform('u_lightPosition', [0.5, 0.5, 1.0]),
		cameraPosition: program.uniform('u_cameraPosition', [0.0, 0.0, 1.0]),
		resolution,

		capType: program.uniform<number>('u_capType', 0),
		joinType: program.uniform<number>('u_joinType', 0),
		strokeWidth: program.uniform<number>('u_strokeWidth', 1.0),
		miterLimit: program.uniform<number>('u_miterLimit', 4),

		model: program.uniformMatrix('u_model', identity),
		view: program.uniformMatrix('u_view', identity),
		projection: program.uniformMatrix(
			'u_projection',
			orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1),
		),
		normalMatrix: program.uniformMatrix('u_normalMatrix', identity),

		color: program.uniform('u_color', whiteColor),
		renderMode: program.uniform<RenderMode>('u_renderMode', 0),

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
