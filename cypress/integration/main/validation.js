//let scrollToBottom = require("scroll-to-bottomjs");


const { baseUrl, urls } = require('../../../urls');

for (const path of urls) {
  describe("Validation", () => {
    it("Validate template: " + path, () => {
      // const url = baseUrl + 'pages-' + path + '/pages-'+ path + '.rendered.html'; // patternlab
      const url = baseUrl + path; // standard
      cy.visit(url);
      //cy.window().then(cyWindow => scrollToBottom({ remoteWindow: cyWindow }));
      cy.htmlvalidate();
    });
  });

}
