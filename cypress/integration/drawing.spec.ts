import path from 'path';

describe('Drawing', () => {
	it('can draw a figure', () => {
		cy.visit('/');
		cy.get('canvas').should('have.attr', 'data-ready', 'true');
		for (let i = 0; i < 16; i++) {
			cy.get('canvas').click(16 * i + 1, 16 * i + 1);
		}
		cy.get('canvas').matchImageSnapshot('line-drawing');
	});
	it('can save figure as png', () => {
		cy.visit('/');
		cy.get('canvas').should('have.attr', 'data-ready', 'true');
		for (let i = 0; i < 16; i++) {
			cy.get('canvas').click(16 * i + 1, 16 * i + 1);
		}
		cy.window().then(function (p) {
			//stubbing prompt window
			cy.stub(p, 'prompt').returns('new-image');
			cy.contains('Save image').click();

			const downloadsFolder = Cypress.config('downloadsFolder');
			const downloadedFilename = path.join(downloadsFolder, 'new-image.png');

			cy.readFile(downloadedFilename, 'binary').should((buffer) =>
				expect(buffer.length).to.be.gt(100)
			);
		});
	});
});
export {};
