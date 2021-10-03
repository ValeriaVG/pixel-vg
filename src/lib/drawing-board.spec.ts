import { render } from '@testing-library/svelte';

import DrawingBoard from './drawing-board.svelte';

describe('Drawing Board', () => {
	test('renders', async () => {
		const { getByTestId } = render(DrawingBoard, {});
		expect(getByTestId('drawing-board')).toBeInstanceOf(HTMLCanvasElement);
	});
});
