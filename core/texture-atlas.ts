import { Rect, contains } from './math.js';

export interface Texture extends Rect {
	readonly id: number;
	readonly layer: number;
}

export interface Layer {
	freeRects: Rect[];
	usedRects: Texture[];
	layerIndex: number;
}

export interface TextureInit {
	data: GPUCopyExternalImageSource | ArrayBuffer; //GPUAllowSharedBufferSource;
	width: number;
	height: number;
}

export class TextureAtlas {
	readonly size: number;
	readonly textureFormat = 'rgba8unorm' as GPUTextureFormat;

	textureArray: GPUTexture;
	textureMetaBuffer: GPUBuffer;
	needsUpdate = false;

	protected layers: Layer[] = [];

	#textureMetaData: Float32Array;
	#initialLayers = 4;
	#nextId = 0;
	#oldTexture: GPUTexture | undefined;
	#growMeta = false;

	constructor(public readonly device: GPUDevice) {
		this.size = device.limits.maxTextureDimension2D;
		this.textureArray = this.createGPUTexture(this.#initialLayers);
		for (let i = 0; i < this.#initialLayers; i++) this.createNewLayer();

		this.#textureMetaData = new Float32Array(100 * 8);
		this.textureMetaBuffer = this.device.createBuffer({
			size: this.#textureMetaData.byteLength,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
		});
	}

	get layerCount() {
		return this.layers.length;
	}

	update(encoder: GPUCommandEncoder) {
		if (this.#oldTexture) {
			// Copy all old layers' data to the new texture array
			for (let layer = 0; layer < this.layers.length; layer++) {
				encoder.copyTextureToTexture(
					{
						texture: this.#oldTexture,
						origin: { x: 0, y: 0, z: layer },
					},
					{
						texture: this.textureArray,
						origin: { x: 0, y: 0, z: layer },
					},
					{
						width: this.size,
						height: this.size,
						depthOrArrayLayers: 1,
					},
				);
			}

			this.#oldTexture.destroy();
			this.#oldTexture = undefined;
		}

		if (this.#growMeta) {
			this.textureMetaBuffer.destroy();
			this.textureMetaBuffer = this.device.createBuffer({
				size: this.#textureMetaData.byteLength,
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
			});
			this.#growMeta = false;
		}

		this.device.queue.writeBuffer(
			this.textureMetaBuffer,
			0,
			this.#textureMetaData.buffer,
		);

		this.needsUpdate = false;
	}

	add(texture: TextureInit): Texture {
		const result = this.findNext(texture.width, texture.height);
		if (texture.data instanceof ArrayBuffer)
			this.device.queue.writeTexture(
				{
					texture: this.textureArray,
					origin: { x: result.x, y: result.y, z: result.layer },
				},
				texture.data,
				{ bytesPerRow: texture.width * 4 }, // rgba8unorm -> 4 bytes per pixel
				{
					width: texture.width,
					height: texture.height,
					depthOrArrayLayers: 1,
				},
			);
		else
			this.device.queue.copyExternalImageToTexture(
				{
					source: texture.data,
				},
				{
					texture: this.textureArray,
					origin: { x: result.x, y: result.y, z: result.layer },
				},
				{
					width: texture.width,
					height: texture.height,
				},
			);
		this.updateTextureMeta(result);
		return result;
	}

	reset() {
		this.layers = [];
		this.#nextId = 0;
		this.#textureMetaData.fill(0);
		this.#oldTexture = undefined;
		this.textureArray.destroy();
		this.textureArray = this.createGPUTexture(this.#initialLayers);
		for (let i = 0; i < this.#initialLayers; i++) this.createNewLayer();
		this.needsUpdate = true;
	}

	protected updateTextureMeta(txt: Texture) {
		// 5 + padding
		const floatsPerMeta = 8;
		const offset = txt.id * floatsPerMeta;

		if (this.#textureMetaData.length < offset + floatsPerMeta) {
			const newMeta = new Float32Array(this.#textureMetaData.length * 2);
			newMeta.set(this.#textureMetaData);
			this.#textureMetaData = newMeta;
			this.#growMeta = true;
		}

		const size = this.size;
		this.#textureMetaData[offset] = txt.x / size;
		this.#textureMetaData[offset + 1] = txt.y / size;
		this.#textureMetaData[offset + 2] = txt.w / size;
		this.#textureMetaData[offset + 3] = txt.h / size;
		this.#textureMetaData[offset + 4] = txt.layer;

		this.needsUpdate = true;
	}

	protected createGPUTexture(layers: number): GPUTexture {
		return this.device.createTexture({
			size: [this.size, this.size, layers],
			format: this.textureFormat,
			usage:
				GPUTextureUsage.TEXTURE_BINDING |
				GPUTextureUsage.COPY_DST |
				GPUTextureUsage.RENDER_ATTACHMENT,
			dimension: '2d',
		});
	}

	protected pruneFreeList(layer: Layer) {
		const freeRects = layer.freeRects;
		for (let i = 0; i < freeRects.length; i++) {
			const rectA = freeRects[i];
			for (let j = i + 1; j < freeRects.length; j++) {
				const rectB = freeRects[j];
				if (contains(rectA, rectB)) {
					freeRects.splice(i, 1);
					i--;
					break;
				}
				if (contains(rectB, rectA)) {
					freeRects.splice(j, 1);
					j--;
				}
			}
		}
	}

	protected findNext(width: number, height: number): Texture {
		type Score = { freeRectIndex: number; score1: number; score2: number };

		let bestScore: Score | undefined;
		let bestRect: Rect | undefined;
		let bestIndex = -1;
		let bestLayer: Layer | undefined;

		for (const layer of this.layers) {
			for (let i = 0; i < layer.freeRects.length; i++) {
				const freeRect = layer.freeRects[i];
				if (freeRect.w >= width && freeRect.h >= height) {
					const leftoverHoriz = freeRect.w - width;
					const leftoverVert = freeRect.h - height;
					const shortSideFit = Math.min(leftoverHoriz, leftoverVert);
					const longSideFit = Math.max(leftoverHoriz, leftoverVert);

					if (
						bestScore === undefined ||
						shortSideFit < bestScore.score1 ||
						(shortSideFit === bestScore.score1 &&
							longSideFit < bestScore.score2)
					) {
						bestScore = {
							freeRectIndex: i,
							score1: shortSideFit,
							score2: longSideFit,
						};
						bestRect = {
							x: freeRect.x,
							y: freeRect.y,
							w: width,
							h: height,
						};
						bestIndex = i;
						bestLayer = layer;
					}
				}
			}
		}

		if (!bestLayer || !bestRect || bestIndex === -1) {
			const newLayer = this.createNewLayer();
			this.#oldTexture = this.textureArray;
			this.textureArray = this.createGPUTexture(this.layers.length);
			const freeRect = newLayer.freeRects[0];

			bestRect = { x: freeRect.x, y: freeRect.y, w: width, h: height };
			bestIndex = 0;
			bestLayer = newLayer;

			this.needsUpdate = true;
		}

		this.placeRect(bestLayer, bestRect, bestIndex);

		const texture: Texture = {
			id: this.#nextId++,
			layer: bestLayer.layerIndex,
			...bestRect,
		};
		bestLayer.usedRects.push(texture);
		return texture;
	}

	protected placeRect(layer: Layer, rect: Rect, freeRectIndex: number) {
		const freeRect = layer.freeRects[freeRectIndex];

		// Split the free rect into up to two smaller rects after placement
		const rightRect: Rect = {
			x: rect.x + rect.w,
			y: rect.y,
			w: freeRect.w - rect.w,
			h: rect.h,
		};
		const bottomRect: Rect = {
			x: rect.x,
			y: rect.y + rect.h,
			w: freeRect.w,
			h: freeRect.h - rect.h,
		};

		// Remove the used free rectangle
		layer.freeRects.splice(freeRectIndex, 1);

		// Add new free rectangles if they have positive area
		if (rightRect.w > 0 && rightRect.h > 0) {
			layer.freeRects.push(rightRect);
		}
		if (bottomRect.w > 0 && bottomRect.h > 0) {
			layer.freeRects.push(bottomRect);
		}

		this.pruneFreeList(layer);
	}

	protected createNewLayer() {
		const layer = {
			freeRects: [{ x: 0, y: 0, w: this.size, h: this.size }],
			usedRects: [],
			layerIndex: this.layers.length,
		};
		this.layers.push(layer);
		return layer;
	}
}
