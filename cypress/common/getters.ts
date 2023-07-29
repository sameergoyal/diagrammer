/**
 * Gets DOM element based on data-id & data-type
 * @param {string} id
 * @return {Cypress.Chainable} A Cypress object
 */
export function getElementByDataIdAndType(id: string, type: string): Cypress.Chainable {
  return cy.get(`[data-id="${id}"][data-type="${type}"]`);
}

/**
 * Gets DOM element based on data-type
 * @param {string} id
 * @return {Cypress.Chainable} A Cypress object
 */
export function getElementByType(type: string): Cypress.Chainable {
  return cy.get(`[data-type="${type}"]`);
}

/**
 * Gets top level container rendered by diagrammer
 * @param {string} id
 * @return {Cypress.Chainable} A Cypress object
 */
export function getDiagrammerView(): Cypress.Chainable {
  return getElementByType('Diagrammer.View');
}

/**
 * Gets DOM element for diagrammer workspace
 * @return {Cypress.Chainable} A Cypress object
 */
export function getWorkspace() {
  return getElementByType('Diagrammer.Workspace');
}

/**
 * Gets DOM element for diagrammer selection marquee
 * @return {Cypress.Chainable} A Cypress object
 */
export function getSelectionMarquee() {
  return getElementByType('Diagrammer.SelectionMarquee');
}

/**
 * Gets DOM element for the currently rendered context menu
 * @return {Cypress.Chainable} A Cypress object
 */
export function getContextMenu() {
  return getElementByType('Diagrammer.ContextMenu');
}

/**
 * Gets DOM element for diagrammer nodes based on data-id
 * @param {string} id
 * @return {Cypress.Chainable} A Cypress object
 */
export function getNodeById(id: string): Cypress.Chainable {
  return getElementByDataIdAndType(id, 'Diagrammer.Node');
}

/**
 * Gets DOM element for diagrammer edges based on data-id
 * @param {string} id
 * @return {Cypress.Chainable} A Cypress object
 */
export function getEdgeById(id: string): Cypress.Chainable {
  return getElementByDataIdAndType(id, 'Diagrammer.Edge');
}

/**
 * Gets DOM element for diagrammer edge badges based on data-id
 * @param {string} id
 * @return {Cypress.Chainable} A Cypress object
 */
export function getEdgeBadgeById(id: string): Cypress.Chainable {
  return getElementByDataIdAndType(id, 'Diagrammer.EdgeBadge');
}

/**
 * Gets DOM element for diagrammer potential nodes based on data-id
 * @param {string} id
 * @return {Cypress.Chainable} A Cypress object
 */
export function getPotentialNodeById(id: string): Cypress.Chainable {
  return getElementByDataIdAndType(id, 'Diagrammer.PotentialNode');
}

/**
 * Gets DOM element for diagrammer potential edges
 * @return {Cypress.Chainable} A Cypress object
 */
export function getPotentialEdge(): Cypress.Chainable {
  return getElementByType('Diagrammer.PotentialEdge');
}

/**
 * Gets DOM element for diagrammer panels based on data-id
 * @param {string} id
 * @return {Cypress.Chainable} A Cypress object
 */
export function getPanelById(id: string): Cypress.Chainable {
  return getElementByDataIdAndType(id, 'Diagrammer.Panel');
}

/**
 * Gets DOM element for diagrammer panel drag handle based on data-id
 * @param {string} id
 * @return {Cypress.Chainable} A Cypress object
 */
export function getPanelDragHandleById(id: string): Cypress.Chainable {
  return getElementByDataIdAndType(id, 'Diagrammer.PanelDragHandle');
}

/**
 * Gets DOM elements for all diagrammer nodes
 * @return {Cypress.Chainable} A Cypress object
 */
export function getAllNodes(): Cypress.Chainable {
  return getElementByType('Diagrammer.Node');
}

/**
 * Gets DOM elements for all diagrammer edges
 * @return {Cypress.Chainable} A Cypress object
 */
export function getAllEdges(): Cypress.Chainable {
  return getElementByType('Diagrammer.Edge');
}
