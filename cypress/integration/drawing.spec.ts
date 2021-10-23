import path from 'path';

describe('Drawing', () => {
	it('can draw a figure', () => {
		cy.visit('/');
		cy.get('canvas')
			.should('have.attr', 'data-ready', 'true')
			.then(($canvas) => {
				const width = $canvas[0].clientWidth;
				const size = width / 16;
				for (let i = 0; i < 16; i++) {
					// Click in the center of canvas
					cy.get('canvas').click(size * i + size / 2, size * i + size / 2);
				}
				cy.get('canvas').scrollIntoView();
				cy.get('canvas').matchImageSnapshot('line-drawing', {
					snapshotSizes: [[512, 512]]
				});
			});
	});
	it('can save figure as png', () => {
		cy.visit('/');
		cy.get('canvas')
			.should('have.attr', 'data-ready', 'true')
			.then(($canvas) => {
				const width = $canvas[0].clientWidth;
				const size = width / 16;
				for (let i = 0; i < 16; i++) {
					// Click in the center of canvas
					cy.get('canvas').click(size * i + size / 2, size * i + size / 2);
				}
			});
		cy.window().then(function (p) {
			//stubbing prompt window
			cy.stub(p, 'prompt').returns('new-image');
			cy.contains('Save image').click();

			const downloadsFolder = Cypress.config('downloadsFolder');
			const downloadedFilename = path.join(downloadsFolder, 'new-image.png');
			cy.readFile(downloadedFilename, 'binary').should((buffer) =>
				expect(buffer).to.have.length.greaterThan(0)
			);
		});
	});
});
export {};
