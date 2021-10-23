import type { ColoredPixels } from './types';
const P = 16;
export default function pixelsToSVG(pixels: ColoredPixels, block: number = P): string {
	const size = (pixels.length / 2) * block;
	const colorMap = pixels.reduce((m, [x, y, color]) => {
		if (!m.has(color)) m.set(color, []);
		m.get(color).push([x, y]);
		return m;
	}, new Map<string, Array<[number, number]>>());

	const paths = [...colorMap.entries()].map(
		([color, coords]) => `<path d="${coordsToPath(coords, block)}" fill="${encodeURI(color)}"/>`
	);
	const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${paths.join(
		''
	)}</svg>`;
	return URL.createObjectURL(new Blob([svg], { type: 'image/svg' }));
}

export function coordsToPath(coords: Array<[number, number]>, block: number = P) {
	const P = block;
	let path = '';
	for (const [x, y] of coords) {
		path += `M ${x * P} ${y * P} L ${(x + 1) * P} ${y * P} L ${(x + 1) * P} ${(y + 1) * P} L ${
			x * P
		} ${(y + 1) * P} `;
	}
	return path;
}
