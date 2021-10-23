import { coordsToPath } from '../lib/pixelsToSVG';

describe('pixelsToSVG', () => {
	it('can convert simple drawing to SVG path', () => {
		expect(
			coordsToPath(
				[
					[0, 0],
					[1, 1]
				],
				1
			)
		).toEqual(`M 0 0 L 1 0 L 1 1 L 0 1 M 1 1 L 2 1 L 2 2 L 1 2 `);
	});
});
export {};
