/// <reference types="cypress" />

import { addMatchImageSnapshotPlugin } from 'cypress-img-snapshot/dist/plugin';

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
export default (on, config) => {
	addMatchImageSnapshotPlugin(on, config);
};
