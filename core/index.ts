export * from './matrix.js';
export * from './engine.js';
export * from './program.js';
export * from './draw.js';

/*export function loadImage(src: string) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		img.src = src;
		img.addEventListener('load', () => resolve(img));
		img.addEventListener('error', () => reject(img));
	});
}*/
