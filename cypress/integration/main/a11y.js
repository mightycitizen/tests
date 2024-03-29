let scrollToBottom = require("scroll-to-bottomjs");


const { baseUrl, urls } = require('../../../urls');



for (const path of urls) {
  describe("A11y: "+path, () => {
    it("Validation: " + path, () => {
      const url = baseUrl + path; // standard
      cy.visit(url);
      cy.injectAxe();
      cy.window().then(cyWindow => scrollToBottom({ remoteWindow: cyWindow }));
      cy.checkA11y(null, {
        runOnly: {
          // type: 'tag',
          values: ['wcag2a','wcag2aa']
        },
        includedImpacts: ['critical', 'serious']
      })
    });
  });

}
