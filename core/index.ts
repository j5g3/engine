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
export type Color = readonly [number, number, number, number];

export type ArrayBufferOptions = {
	data: ArrayBuffer;
	size?: number;
	type?: number;
	normalized?: boolean;
	stride?: number;
	offset?: number;
};

export type Mutable = { dirty?: boolean };
export type TextureComponent = TextureOptions & {
	src: TexImageSource;
} & Mutable;
export type ImageComponent = Omit<TextureOptions, 'src'> & {
	readonly src: string | TexImageSource;
};
export type FillComponent = {
	color: Color;
} & Mutable;
export type BoxComponent = Partial<Box> & Mutable;
export type UpdateFn = string | ((node: Node) => void);
export type WebglContext = ReturnType<typeof webgl2>;
export type DrawEngine = ReturnType<typeof drawEngine>;

export interface Node {
	box?: BoxComponent;
	image?: ImageComponent;
	texture?: TextureComponent;
	children?: Record<string | number, Node>;
	update?: UpdateFn;
	fill?: FillComponent;
	//model?: ModelComponent;
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

export function createCanvas(width: number, height: number) {
	const element = document.createElement('canvas');
	element.width = width;
	element.height = height;
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
export function Program({
	frag,
	vtx,
	canvas,
}: {
	frag: string;
	vtx: string;
	canvas: HTMLCanvasElement | OffscreenCanvas;
}) {
	const gl = canvas.getContext('webgl2')!;
	if (!gl) throw new Error('Could not create webgl2 canvas context');
	const glProgram = gl.createProgram();
	if (!glProgram) throw new Error('Could not create WebGL Program');

	const vertexShader = Shader(gl, vtx, gl.VERTEX_SHADER);
	const fragShader = Shader(gl, frag, gl.FRAGMENT_SHADER);

	gl.attachShader(glProgram, vertexShader);
	gl.attachShader(glProgram, fragShader);
	gl.linkProgram(glProgram);

	if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
		gl.deleteProgram(glProgram);
		throw new Error('Could not create WebGL Program');
	}

	return { gl, glProgram };
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

export function updateTexture(
	gl: WebGL2RenderingContext,
	texture: WebGLTexture,
	{ internalFormat, src }: { internalFormat?: GLenum; src: TexImageSource },
) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		internalFormat ?? gl.RGBA,
		internalFormat ?? gl.RGBA,
		gl.UNSIGNED_BYTE,
		src,
	);
}

export interface TextureOptions {
	src?: TexImageSource;
	internalFormat?: GLenum;
	minFilter?: GLenum;
	magFilter?: GLenum;
	wrapS?: GLenum;
	wrapT?: GLenum;
}

/**
 * This function creates a WebGL texture, sets its parameters, and optionally uploads the provided image source.
 */
export function Texture(gl: WebGL2RenderingContext, o: TextureOptions) {
	o.wrapS ??= gl.CLAMP_TO_EDGE;
	o.wrapT ??= o.wrapS;

	const texture = gl.createTexture();
	if (!texture) throw new Error('Could not create texture');
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, o.wrapS);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, o.wrapT);
	gl.texParameteri(
		gl.TEXTURE_2D,
		gl.TEXTURE_MIN_FILTER,
		o.minFilter ?? gl.NEAREST,
	);
	if (o.magFilter)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, o.magFilter);

	if (o.src)
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			o.internalFormat ?? gl.RGBA,
			o.internalFormat ?? gl.RGBA,
			gl.UNSIGNED_BYTE,
			o.src,
		);

	return texture;
}

/**
 * Creates a WebGL texture with a single pixel of the given color, used for filling shapes with color.
 */
function ColorTexture(gl: WebGL2RenderingContext, color: Color) {
	return Texture(gl, {
		src: new ImageData(
			new Uint8ClampedArray(color.map(c => c * 255)),
			1,
			1,
		),
		minFilter: gl.NEAREST,
	});
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

	function bindTexture(
		texture: WebGLTexture,
		location: WebGLUniformLocation,
		unit: number,
	) {
		gl.activeTexture(gl.TEXTURE0 + unit);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(location, unit);
	}

	function setProjectionMatrix(m: Matrix) {
		gl.uniformMatrix4fv(projectionLocation, false, m);
	}

	function setNormalMatrix(m: Matrix) {
		gl.uniformMatrix4fv(normalMatrixLocation, false, m);
	}

	function setArrayBuffer(
		buffer: WebGLBuffer,
		location: number,
		{ data, size, normalized, type, stride, offset }: ArrayBufferOptions,
	) {
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(
			location,
			size ?? 2,
			type ?? gl.FLOAT,
			normalized ?? false,
			stride ?? 0,
			offset ?? 0,
		);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	}

	function setPosition(options: ArrayBufferOptions) {
		setArrayBuffer(positionBuffer, positionLocation, options);
	}
	function setNormal(options: ArrayBufferOptions) {
		options.size ??= 3;
		setArrayBuffer(normalBuffer, normalLocation, options);
	}

	function setIndices(data: ArrayBuffer | ArrayBufferView) {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
	}

	function setTexture(texture: WebGLTexture) {
		if (u_texture !== texture) {
			if (textureLocation) bindTexture(texture, textureLocation, 0);
			u_texture = texture;
		}
	}

	function resetPosition() {
		setPosition({ data: positionBufferData });
	}

	function resizeViewport(width: number, height: number) {
		gl.viewport(0, 0, width, height);
	}

	function clear() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	const { gl, glProgram } = Program({
		frag: `#version 300 es
precision mediump float;

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
    
    // Use the proper normal map transformation
    vec3 normal = getNormalFromMap();
    
    float metallic = texture(u_metallicTexture, v_texcoord).r;
    float roughness = texture(u_roughnessTexture, v_texcoord).r;
    float ao = texture(u_aoTexture, v_texcoord).r;
    
    outColor = calculateLighting(albedo, metallic, roughness, ao, normal, v_position);
}
`,
		vtx: `#version 300 es
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
    v_tangent = normalize(mat3(u_model) * a_tangent);
    v_texcoord = a_texcoord;

    gl_Position = u_projection * u_view * worldPosition;
}
		`,
		canvas,
	});
	gl.useProgram(glProgram);

	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.BLEND);

	// Tell WebGL to pre-multiply alpha so that we can use the alpha value as the
	// final color weight.
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

	// Enable blending to allow transparency in the shader.
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	const modelLocation = gl.getUniformLocation(glProgram, 'u_model');
	const viewLocation = gl.getUniformLocation(glProgram, 'u_view');
	const projectionLocation = gl.getUniformLocation(glProgram, 'u_projection');
	const normalMatrixLocation = gl.getUniformLocation(
		glProgram,
		'u_normalMatrix',
	);
	const textureLocation = gl.getUniformLocation(glProgram, 'u_texture');

	const positionLocation = gl.getAttribLocation(glProgram, 'a_position');
	const texCoordLocation = gl.getAttribLocation(glProgram, 'a_texcoord');
	const normalLocation = gl.getAttribLocation(glProgram, 'a_normal');
	const colorLocation = gl.getUniformLocation(glProgram, 'u_color');
	const tangentLocation = gl.getAttribLocation(glProgram, 'a_tangent');
	const tangentBuffer = createBuffer();
	const positionBuffer = createBuffer();
	const texCoordBuffer = createBuffer();
	const normalBuffer = createBuffer();
	const indicesBuffer = createBuffer();
	const orthographicM = orthographic(
		0,
		gl.canvas.width,
		gl.canvas.height,
		0,
		-1,
		1,
	);

	// The data represents the vertices of a unit square in normalized device coordinates.
	const positionBufferData = new Float32Array([
		0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,
	]);

	let u_color = whiteColor;
	let u_texture: WebGLTexture;
	const u_normalTexture = ColorTexture(gl, blackColor);
	const u_metallicTexture = ColorTexture(gl, blackColor);
	const u_roughnessTexture = ColorTexture(gl, blackColor);
	const u_aoTexture = ColorTexture(gl, whiteColor);

	// Initialize the buffer with texture coordinate data.
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		// The data represents the vertices of a unit square in normalized texture coordinates.
		new Float32Array([
			// First triangle
			0,
			1, // Bottom-left
			1,
			1, // Bottom-right
			0,
			0, // Top-left

			// Second triangle
			0,
			0, // Top-left
			1,
			1, // Bottom-right
			1,
			0, // Top-right
		]),
		gl.STATIC_DRAW,
	);
	const tangentData = new Float32Array([
		1,
		0,
		0, // Bottom-left
		1,
		0,
		0, // Top-left
		1,
		0,
		0, // Bottom-right
		1,
		0,
		0, // Top-right
		1,
		0,
		0, // Top-left (for triangle 2)
		1,
		0,
		0, // Bottom-right (for triangle 2)
	]);
	const normalData = new Float32Array([
		0,
		0,
		1, // All normals point toward camera
		0,
		0,
		1,
		0,
		0,
		1,
		0,
		0,
		1,
		0,
		0,
		1,
		0,
		0,
		1,
	]);

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, positionBufferData, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

	// Set up normal attribute
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, normalData, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(normalLocation);
	gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

	// Set up tangent attribute
	gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, tangentData, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(tangentLocation);
	gl.vertexAttribPointer(tangentLocation, 3, gl.FLOAT, false, 0, 0);

	// Set matrices
	gl.uniformMatrix4fv(modelLocation, false, identity);
	gl.uniformMatrix4fv(viewLocation, false, identity);
	gl.uniformMatrix4fv(projectionLocation, false, orthographicM);
	gl.uniformMatrix4fv(normalMatrixLocation, false, identity);

	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.enableVertexAttribArray(texCoordLocation);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
	gl.uniform4fv(colorLocation, u_color as unknown as number[]);

	const matrixStack: Matrix[] = [];
	const normalTextureLoc = gl.getUniformLocation(
		glProgram,
		'u_normalTexture',
	);
	const metallicLoc = gl.getUniformLocation(glProgram, 'u_metallicTexture');
	const roughnessLoc = gl.getUniformLocation(glProgram, 'u_roughnessTexture');
	const aoLoc = gl.getUniformLocation(glProgram, 'u_aoTexture');
	const lightPosLoc = gl.getUniformLocation(glProgram, 'u_lightPosition');
	const cameraPosLoc = gl.getUniformLocation(glProgram, 'u_cameraPosition');

	let M = identity;

	gl.uniform3fv(lightPosLoc, [0.5, 0.5, 1.0]);
	gl.uniform3fv(cameraPosLoc, [0.0, 0.0, 1.0]);

	if (normalTextureLoc) bindTexture(u_normalTexture, normalTextureLoc, 1);
	if (metallicLoc) bindTexture(u_metallicTexture, metallicLoc, 2);
	if (roughnessLoc) bindTexture(u_roughnessTexture, roughnessLoc, 3);
	if (aoLoc) bindTexture(u_aoTexture, aoLoc, 4);

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.activeTexture(gl.TEXTURE0);

	setProjectionMatrix(orthographicM);
	resetPosition();

	return {
		canvas: gl.canvas,
		clear,
		resizeViewport,
		pushMatrix(m: Matrix) {
			matrixStack.push(M);
			if (m !== identity) {
				M = M === identity ? m : multiply(M, m);
				gl.uniformMatrix4fv(modelLocation, false, M);
			}
		},
		popMatrix() {
			const M2 = matrixStack.pop();
			if (!M2) throw new Error('Matrix stack empty');
			M = M2;
			gl.uniformMatrix4fv(modelLocation, false, M2);
		},
		get color() {
			return u_color;
		},
		set color(color: Color) {
			if (color !== u_color)
				gl.uniform4fv(
					colorLocation,
					(u_color = color) as unknown as number[],
				);
		},

		setIndices,
		setPosition,
		setNormal,
		setProjectionMatrix,
		setNormalMatrix,
		resetPosition,
		resetProjectionMatrix() {
			setProjectionMatrix(orthographicM);
		},
		setTexture,
		createTexture: Texture.bind(0, gl),
		createColorTexture: ColorTexture.bind(0, gl),
		updateTexture(
			texture: WebGLTexture,
			p: { internalFormat?: GLenum; src: TexImageSource },
		) {
			setTexture(texture);
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				p.internalFormat ?? gl.RGBA,
				p.internalFormat ?? gl.RGBA,
				gl.UNSIGNED_BYTE,
				p.src,
			);
		},
		draw() {
			gl.drawArrays(gl.TRIANGLES, 0, 6);
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
		ctx.setTexture(whiteTexture);
		ctx.color = newColor;
	}

	function pushDraw(m: Matrix) {
		ctx.pushMatrix(m);
		ctx.draw();
		ctx.popMatrix();
	}

	function putpixel(x: number, y: number) {
		PIXEL_M[12] = (x - viewMinX) * viewScaleX;
		PIXEL_M[13] = (y - viewMinY) * viewScaleY;
		pushDraw(PIXEL_M);
	}

	function line(x0: number, y0: number, x1: number, y1: number) {
		const nx0 = (x0 - viewMinX) * viewScaleX;
		const ny0 = (y0 - viewMinY) * viewScaleY;
		const nx1 = (x1 - viewMinX) * viewScaleX;
		const ny1 = (y1 - viewMinY) * viewScaleY;

		const d = Math.hypot(nx1 - nx0, ny1 - ny0);
		const a = Math.atan2(ny1 - ny0, nx1 - nx0);

		LINE_BOX.x = nx0; // - unitXHalf;
		LINE_BOX.y = ny0; //- unitYHalf;
		LINE_BOX.w = d;
		LINE_BOX.rotation = a;

		composeBox(LINE_BOX, LINE_M);
		pushDraw(LINE_M);
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
		m[0] = w * viewScaleX;
		m[5] = h * viewScaleY;
		m[12] = (x - viewMinX) * viewScaleX;
		m[13] = (y - viewMinY) * viewScaleY;
	}

	function fillRect(x: number, y: number, w: number, h: number) {
		scaleM(RECT_M, x, y, w, h);
		pushDraw(RECT_M);
	}

	function arc(
		x0: number,
		y0: number,
		r: number,
		start: number,
		stop: number,
		_aspect: number,
	) {
		const interval = Math.PI / r / 4;
		start = start % (Math.PI * 2);
		stop = stop % (Math.PI * 2);

		if (start >= stop) stop += Math.PI * 2;
		let px = x0 + Math.cos(start) * r;
		let py = y0 - Math.sin(start) * r;
		for (let i = start + interval; i < stop; i += interval) {
			line(
				px,
				py,
				(px = x0 + Math.cos(i) * r),
				(py = y0 - Math.sin(i) * r),
			);
		}
	}
	function circle(x0: number, y0: number, radius: number) {
		arc(x0, y0, radius, 0, 2 * Math.PI, 1);
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

	function draw2DTexture(
		texture: WebGLTexture,
		x: number,
		y: number,
		w: number,
		h: number,
	) {
		scaleM(RECT_M, x, y, w, h);
		ctx.setTexture(texture);
		ctx.color = whiteColor;
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
		windowM = orthographic(0, 1, 0, 1, -1, 1);
		viewMinX = x;
		viewMinY = y;
		viewScaleX = 1 / (x2 - x);
		viewScaleY = 1 / (y2 - y);
		prevUnitX = 1 / ctx.canvas.width;
		prevUnitY = 1 / ctx.canvas.height;

		restoreWindow();
	}

	function restoreWindow() {
		PIXEL_M[0] = unitX = prevUnitX;
		PIXEL_M[5] = unitY = prevUnitY;
		LINE_BOX.h = unitY;
		LINE_BOX.cx = /*unitXHalf =*/ unitX / 2;
		LINE_BOX.cy = /*unitYHalf =*/ unitY / 2;
		ctx.setProjectionMatrix(windowM);
	}

	function resetWindow() {
		window(0, 0, ctx.canvas.width, ctx.canvas.height);
		/*viewScaleX = viewScaleY = PIXEL_M[0] = PIXEL_M[5] = unitX = unitY = LINE_BOX.h = 1;
		unitXHalf = unitYHalf = LINE_BOX.cx = LINE_BOX.cy = 0.5;
		viewMinX = viewMinY = 0;
		
		ctx.setProjectionMatrix(
			orthographic(0, ctx.canvas.width, ctx.canvas.height, 0, -1, 1),
		);*/
	}

	const PIXEL_M = Matrix();
	const LINE_M = Matrix();
	const RECT_M = Matrix();
	const LINE_BOX = Box();
	const whiteTexture = ctx.createColorTexture(whiteColor);

	let windowM = Matrix();
	let unitX = 1,
		unitY = 1,
		//unitXHalf = 0.5,
		//unitYHalf = 0.5,
		prevUnitX = 1,
		prevUnitY = 1;
	let viewMinX = 0,
		viewMinY = 0;
	let viewScaleX = 1,
		viewScaleY = 1;

	PIXEL_M[0] = 1;
	PIXEL_M[5] = 1;
	LINE_BOX.h = 1;
	LINE_BOX.cx = 0.5;
	LINE_BOX.cy = 0.5;

	return {
		color,
		putpixel,
		draw2DTexture,
		line,
		rect,
		fillRect,
		arc,
		circle,
		window,
		resetWindow,
		restoreWindow,
	};
}

export interface EngineOptions<T> {
	canvas: HTMLCanvasElement | OffscreenCanvas;
	readonly root: T;
	// Defaults to false
	autoStart?: boolean;
	// If present the canvas will be attached to the specified element.
	container?: HTMLElement | string;
}

export async function engine<T extends Node>(p: EngineOptions<T>) {
	const program = webgl2(p);
	const { render, start, stop } = renderer();
	const whiteTexture = program.createColorTexture(whiteColor);
	const canvas = program.canvas as HTMLCanvasElement;

	if (p.container) {
		const container =
			typeof p.container === 'string'
				? document.querySelector(p.container)
				: p.container;
		if (!container)
			throw new Error('Could not find container element: ' + p.container);
		container.append(canvas);
	}

	/**
	 * Renders an image at the specified location.
	 * Takes an image source (`src`) as input.
	 */
	async function image(p: ImageComponent) {
		const img = typeof p.src === 'string' ? await loadImage(p.src) : p.src;
		texture({ ...p, src: img });
	}

	/**
	 * Renders a texture to the screen.
	 * It creates a WebGL texture, uploads the image data, sets the texture parameters, and draws the texture to the screen.
	 * It also handles updating the texture if the `dirty` flag is set in the `TextureComponent` object.
	 */
	function texture(p: TextureComponent) {
		const texture = program.createTexture(p);

		render(() => {
			if (p.dirty) program.updateTexture(texture, p);
			program.setTexture(texture);
			program.color = whiteColor;
			program.draw();
		});
	}

	function fill(p: FillComponent) {
		render(() => {
			program.color = p.color || whiteColor;
			program.setTexture(whiteTexture);
			program.draw();
		});
	}

	function boxComponent(box: BoxComponent) {
		let M = composeBox(Box(box));
		render(() => {
			if (box.dirty) M = composeBox(Box(box));
			program.pushMatrix(M);
		});
	}

	/*async function model(model: ModelComponent) {
		const { gltf } = await import('./gltf.js');
		render(await gltf(program, model.gltf));
	}*/

	async function load(node: Node) {
		const { update } = node;

		if (update) {
			const fn =
				typeof update === 'function'
					? update
					: new Function('node', update);
			render(() => fn(node));
		}
		if (node.box) boxComponent(node.box);
		if (node.fill) fill(node.fill);
		if (node.texture) texture(node.texture);
		if (node.image) await image(node.image);
		//if (node.model) await model(node.model);

		if (node.children) {
			const nodes = Array.isArray(node.children)
				? node.children
				: Object.values(node.children);
			for (const child of nodes) await load(child);
		}
		if (node.box) render(() => program.popMatrix());
	}

	await load(p.root);

	if (p.autoStart) start();

	return {
		canvas,
		start,
		pause: stop,
		destroy() {
			stop();
			canvas.remove();
		},
	};
}

/**
 * Creates a render context that provides a `render` function to add rendering callbacks to a queue.
 * The `render` function accepts a callback function that will be executed during the render loop.
 */
export function renderer() {
	const render: (() => void)[] = [];
	let af: number;
	let running = false;

	function renderLoop() {
		for (const p of render) p();
		af = requestAnimationFrame(renderLoop);
	}

	return {
		render(cb: () => void) {
			render.push(cb);
		},
		start() {
			if (running) throw 'Engine already started';
			renderLoop();
			running = true;
		},
		stop() {
			cancelAnimationFrame(af);
			running = false;
		},
	};
}
