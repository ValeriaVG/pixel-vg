import { render } from '@testing-library/svelte';

import Gallery from '../routes/gallery/index.svelte';
import images from '../routes/gallery/images';

describe('Gallery', () => {
	test('all images are rendered', async () => {
		expect(images?.length).toBeGreaterThan(0);
		const { getByAltText, getByText } = render(Gallery, {});
		for (const image of images) {
			const img = getByAltText(image.title) as HTMLImageElement;
			expect(img).toBeInTheDocument();
			expect(img.src).toMatch(image.image);
		}
	});
});
