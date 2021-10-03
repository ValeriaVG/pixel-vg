describe('Drawing', () => {
	it('can draw a figure', () => {
		cy.visit('/');
		cy.get('canvas').should('have.attr', 'data-ready', 'true');
		for (let i = 0; i < 16; i++) {
			cy.get('canvas').click(16 * i + 1, 16 * i + 1);
		}
		cy.get('canvas').matchImageSnapshot('line-drawing');
	});
});
export {};
