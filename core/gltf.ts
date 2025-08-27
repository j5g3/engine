import type { ArrayBufferOptions, Matrix, WebglContext } from './index.js';

export interface Gltf {
	accessors?: Accessor[];
	asset: { version: string };
	nodes?: Node[];
	scene?: number;
	scenes?: Scene[];
	meshes?: Mesh[];
	buffers?: Buffer[];
	bufferViews?: BufferView[];
	materials?: Material[];
	textures?: Texture[];
	samplers?: Sampler[];
	images?: Image[];
}

export type Image = (
	| {
			uri: string;
	  }
	| {
			mimeType?: string;
			bufferView: number;
	  }
) & {
	name?: string;
};

export interface Material {
	name: string;
	pbrMetallicRoughness: {
		baseColorFactor?: [number, number, number, number];
		metallicFactor?: number;
		roughnessFactor?: number;
		baseColorTexture?: { index: number };
		metallicRoughnessTexture?: { index: number };
	};
	normalTexture?: { index: number };
	occlusionTexture?: { index: number };
	emissiveTexture?: { index: number };
	emissiveFactor?: [number, number, number];
	alphaMode?: 'OPAQUE' | 'MASK' | 'BLEND';
	alphaCutoff?: number;
	doubleSided?: boolean;
}

export interface Sampler {
	magFilter?: number;
	minFilter?: number;
	wrapS?: number;
	wrapT?: number;
}

export interface Texture {
	sampler?: number;
	source?: number;
	name?: string;
}

export interface Scene {
	nodes?: number[];
	name?: string;
}

export interface Node {
	matrix?: number[];
	children?: number[];
	mesh?: number;
}

type ResolvedNode = Omit<Node, 'matrix' | 'mesh'> & {
	matrix?: Matrix;
	mesh?: Mesh;
};

export interface MeshPrimitive {
	attributes: Record<string, number>;
	indices?: number;
	material?: number;
	mode?: number;
}

export interface Mesh {
	name?: string;
	primitives?: MeshPrimitive[];
}

export interface Accessor {
	bufferView?: number;
	byteOffset?: number;
	componentType: number;
	count: number;
	type: 'SCALAR' | 'VEC2' | 'VEC3' | 'VEC4' | 'MAT2' | 'MAT3' | 'MAT4';
	max?: number[];
	min?: number[];
	sparse?: AccessorSpare;
}

export interface AccessorSpare {
	count: number;
	indices: number;
	values: number;
}

export interface AccessorSparseValues {
	bufferView: number;
	byteOffset?: number;
}

export interface AccessorSparseIndices extends AccessorSparseValues {
	componentType: number;
}

export type ResolvedAccessor = ArrayBufferOptions & { count?: number };

export interface Buffer {
	uri?: string;
	byteLength: number;
}

export interface BufferView {
	buffer: number;
	byteOffset?: number;
	byteLength: number;
	byteStride?: number;
	target?: number;
	name?: string;
}

const GL = WebGL2RenderingContext;

function uriToBuffer(url: string) {
	return fetch(url).then(r => r.arrayBuffer());
}

/*function getComponentTypeSize(type: number) {
	switch (type) {
		case GL.BYTE:
		case GL.UNSIGNED_BYTE:
			return 1;
		case GL.SHORT:
		case GL.UNSIGNED_SHORT:
			return 2;
		case GL.UNSIGNED_INT:
		case GL.FLOAT:
			return 4;
		default:
			throw new Error(`Unknown component type: ${type}`);
	}
}*/

function getAccessorSize(a: Accessor) {
	switch (a.type) {
		case 'SCALAR':
			return 1;
		case 'VEC3':
			return 3;
		case 'VEC4':
			return 4;
		case 'VEC2':
			return 2;
	}
}

function loadImage(src: string) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		img.src = src;
		img.addEventListener('load', () => resolve(img));
		img.addEventListener('error', () => reject(img));
	});
}

// The orthographic camera in the engine uses a different coordinate system.
// Therefore, we apply this matrix to adjust the y-coordinates of the model, ensuring they align properly.
const M = new Float32Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1]);

/*
 * This function prepares GLTF data for rendering in a WebGL context. It resolves buffers, views, accessors, and nodes, returning a render function.
 */
export async function gltf(ctx: WebglContext, data: Gltf) {
	if (!data.scenes || data.scene === undefined) return () => {};

	const scene = data.scenes[data.scene];

	const buffers =
		data.buffers &&
		(await Promise.all(
			data.buffers.map(b => {
				if (b.uri) return uriToBuffer(b.uri);
			}),
		));
	const views =
		buffers &&
		data.bufferViews?.map(b => {
			const buffer = buffers[b.buffer];
			if (!buffer) throw new Error('Invalid Buffer View');
			const off = b.byteOffset ?? 0;
			return {
				data: buffer.slice(off, off + b.byteLength),
				stride: b.byteStride,
			};
		});
	const accessors: ResolvedAccessor[] | undefined = data.accessors?.map(a => {
		const view = a.bufferView !== undefined && views?.[a.bufferView];
		if (!view) throw 'Invalid bufferView';
		const size = getAccessorSize(a);
		return {
			data: view.data,
			stride: view.stride,
			offset: a.byteOffset,
			type: a.componentType,
			size,
			count: a.count,
		};
	});
	const images =
		data.images &&
		(await Promise.all(
			data.images.map(a => {
				if ('uri' in a) return loadImage(a.uri);
				//return views?.[a.bufferView]?.data;
			}),
		));
	const textures = data.textures?.map(t => {
		const src = t.source !== undefined ? images?.[t.source] : undefined;
		const sampler =
			t.sampler !== undefined ? data.samplers?.[t.sampler] : undefined;
		const tex = ctx.createTexture({
			src,
			...sampler,
		});
		return tex;
	});

	const nodes = data.nodes?.map(loadNode) ?? [];

	/*
	 * The `loadNode` function takes a `Node` from the GLTF data and resolves its
	 * matrix and mesh properties. If a matrix exists, it is converted to a
	 * `Float32Array`. The function also
	 * resolves the mesh based on its index in the GLTF meshes array.
	 */
	function loadNode(n: Node) {
		const matrix = n.matrix && new Float32Array(n.matrix);
		const mesh = n.mesh !== undefined ? data.meshes?.[n.mesh] : undefined;
		return { ...n, mesh, matrix };
	}

	function mapNode(n: number) {
		renderNode(nodes[n]);
	}

	function renderMaterial(index: number) {
		const material = data.materials?.[index];
		if (!material) throw new Error('Invalid material');

		if (material.pbrMetallicRoughness) {
			const p = material.pbrMetallicRoughness;
			if (p.baseColorFactor) ctx.color = p.baseColorFactor;
			else ctx.color = [1, 1, 1, 1];
			if (p.baseColorTexture) {
				const texture = textures?.[p.baseColorTexture.index];
				if (texture) ctx.setTexture(texture);
			}
			/*if (baseColorTexture)
				ctx.setTexture()
			if (metallicFactor)*/
		}
	}

	/*
	 * The `renderPrimitive` function begins by iterating through the primitive's
	 * attributes.
	 * If the primitive has indices (defining the order of vertices for drawing),
	 * it retrieves the corresponding accessor, updates the context with this
	 * index data, and calls the appropriate WebGL draw function to render the
	 * elements. This function is critical for drawing the geometry defined by
	 * the primitive information from the GLTF data.
	 */
	function renderPrimitive(p: MeshPrimitive) {
		if (p.attributes) {
			const { POSITION, NORMAL } = p.attributes;
			if (POSITION !== undefined) {
				const accessor = accessors?.[POSITION];
				if (accessor) ctx.position.set(accessor);
			}
			if (NORMAL) {
				const accessor = accessors?.[NORMAL];
				if (accessor) ctx.normal.set(accessor);
			}
		}

		if (p.material !== undefined) renderMaterial(p.material);

		if (p.indices !== undefined) {
			const accessor = accessors?.[p.indices];
			if (accessor) {
				ctx.setIndices(accessor.data);
				ctx.drawElements(
					p.mode ?? WebGL2RenderingContext.TRIANGLES,
					accessor.count ?? 0,
					accessor.type ?? GL.FLOAT,
					accessor.offset ?? 0,
				);
			}
		} else ctx.draw();
	}

	function renderMesh(n: Mesh) {
		if (n.primitives) for (const p of n.primitives) renderPrimitive(p);
	}

	function renderNode(n: ResolvedNode) {
		if (n.matrix) ctx.pushMatrix(n.matrix);
		if (n.mesh) renderMesh(n.mesh);

		n.children?.forEach(mapNode);

		if (n.matrix) ctx.popMatrix();
	}

	return () => {
		ctx.pushMatrix(M);
		scene?.nodes?.forEach(mapNode);
		ctx.popMatrix();
		ctx.position.reset();
	};
}
