describe('Gallery', () => {
	it('lists images', () => {
		cy.visit('/gallery');
		cy.get('img').should('have.length.at.least', 1);
		cy.get('img')
			.should('be.visible')
			.and(($img) => {
				// "naturalWidth" and "naturalHeight" are set when the image loads
				expect($img[0].naturalWidth).to.be.greaterThan(0);
				expect($img[0].alt).to.be.not.empty;
			});
	});
});

export {};
