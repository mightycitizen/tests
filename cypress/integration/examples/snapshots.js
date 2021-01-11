let scrollToBottom = require("scroll-to-bottomjs");


const { baseUrl, urls } = require('../../../urls');

for (const path of urls) {
  describe("Lazy loading example", () => {
    it("captures lazy loading images: " + path, () => {
      const url = baseUrl + path;
      cy.visit(url);
      cy.window().then(cyWindow => scrollToBottom({ remoteWindow: cyWindow }));
      cy.percySnapshot("Lazy loading images: " + path);
    });
  });

}
