//let scrollToBottom = require("scroll-to-bottomjs");


const { baseUrl, type, urls } = require('../../../urls');

for (const path of urls) {
  describe("Validation", () => {
    it("Validate template: " + path, () => {
      const url = type === 'patternlab' ? baseUrl + 'pages-' + path + '/pages-'+ path + '.rendered.html' : baseUrl + path; // standard
      cy.visit(url);
      //cy.window().then(cyWindow => scrollToBottom({ remoteWindow: cyWindow }));
      cy.htmlvalidate();
    });
  });

}
