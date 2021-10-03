import { render, fireEvent } from '@testing-library/svelte';

import Palette from './palette.svelte';

describe('palette', () => {
	test('colors can be selected', async () => {
		const colors = ['#ff0000', '#00ff00', '#0000ff'];
		const { getByTitle } = render(Palette, { colors });
		for (const color of colors) {
			const button = getByTitle(color);
			expect(button).toBeInTheDocument();
			await fireEvent.click(button);
			expect(button).toHaveClass('selected');
		}
	});
	test('eraser can be selected', async () => {
		const colors = [];
		const { getByTitle } = render(Palette, { colors });
		const button = getByTitle('Eraser');
		expect(button).toBeInTheDocument();
		await fireEvent.click(button);
		expect(button).toHaveClass('selected');
	});
});
