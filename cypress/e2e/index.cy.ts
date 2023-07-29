import { getDiagrammerView, getElementByDataIdAndType, getPanelById } from '../common/getters';
import { convertTranslate2dToMatrix } from '../common/utils';

describe('Diagrammer', () => {
  beforeEach(() => {
    cy.visit('/iframe.html?id=demos-diagrammer--left-right-rectangular&args=&viewMode=story');
  });

  it('successfully loads Diagrammer', () => {
    getDiagrammerView().should('exist');
  });

  describe('update container', () => {
    it('right aligned panels dont adjust after viewport resize without update container', () => {
      getPanelById('library');
      const newViewport = { width: 1400, height: 900 };
      cy.viewport(newViewport.width, newViewport.height);
      const panelWidth = 250;
      const width = 1200;
      const expectedTransform = convertTranslate2dToMatrix(width - panelWidth - 20, 20);
      getPanelById('library').should('have.css', 'transform').and('eq', expectedTransform);
    });

    it('right aligned panels adjust after viewport resize after update container', () => {
      getPanelById('library');
      const newViewport = { width: 1400, height: 900 };
      cy.viewport(newViewport.width, newViewport.height);
      const panelWidth = 250;
      const width = 1200;
      let expectedTransform = convertTranslate2dToMatrix(width - panelWidth - 20, 20);
      getPanelById('library').should('have.css', 'transform').and('eq', expectedTransform);
      getElementByDataIdAndType('UpdateContainer', 'Diagrammer.Tools').click();
      expectedTransform = convertTranslate2dToMatrix(newViewport.width - panelWidth - 20, 20);
      getPanelById('library').should('have.css', 'transform').and('eq', expectedTransform);
    });
  });

  describe('destroy', () => {
    it('removes all of diagrammer rendered DOM', () => {
      getElementByDataIdAndType('Destroy', 'Diagrammer.Tools').click();
      getDiagrammerView().should('not.exist');
    });
  });
});
