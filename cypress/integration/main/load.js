//let scrollToBottom = require("scroll-to-bottomjs");


const { baseUrl, urls } = require('../../../urls');
for (const path of urls) {
  describe("Default: "+path, () => {
    it("Load: " + path, () => {
      const url = baseUrl + path;
      cy.visit(url);
      cy.get('h1').should('exist');
    });
  });

}
