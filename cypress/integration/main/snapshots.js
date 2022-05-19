let scrollToBottom = require("scroll-to-bottomjs");


const { baseUrl, urls } = require('../../../urls');

for (const path of urls) {
  describe("Visual Regression Testing", () => {
    it("Page: " + path, () => {
      //const url = baseUrl + 'pages-' + path + '/pages-'+ path + '.rendered.html'; // patternlab
      const url = baseUrl + path; // standard
      cy.visit(url);
      cy.viewport(1200, 800);
      cy.wait(1000);
      cy.window().then(cyWindow => scrollToBottom({ frequency: 170, timing: 40, remoteWindow: cyWindow }));
      cy.percySnapshot("Desktop screenshot: " + path, {
        widths: [1200]
      });

      cy.viewport(375, 600);
      cy.wait(1000);
      cy.window().then(cyWindow => scrollToBottom({ frequency: 170, timing: 40, remoteWindow: cyWindow }));
      cy.percySnapshot("Mobile screenshot: " + path, {
        widths: [375]
      });
    });
  });

}
