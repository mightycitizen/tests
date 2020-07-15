/// <reference types="cypress" />
const logoutSelector = 'button.button';
const formSubmitSelector = '.form-controls-submit';
const shortWait = 250;
// const wait = 500;
const wait = 700;
const eid = 1509511;
const baseUrl = 'https://localhost:3000/';
// const baseUrl = 'http://168.44.252.105/';

const admin = {
  username: 'kfernandez@mightycitizen.com',
  password: 'testtest'
}

context('Register', () => {
  const operations = [
    {
      'name': 'Admin Approves; Insurer does not certify',
      'adminApproval': true,
      'insurerCertify': false,
      'creditUsage': false,
      'adminCertify': true
    },

    {
      'name': 'Admin Approves; Insurer certifies',
      'adminApproval': true,
      'insurerCertify': true,
      'creditUsage': true,
      'adminCertify': false
    },

    {
      'name': 'Admin Rejects',
      'adminApproval': false,
      'insurerCertify': true,
      'creditUsage': true,
      'adminCertify': false
    }
  ]

  const certifyData = (operation, insurer, insurerUrl, recertify) => {

    cy.get('#certify').check()
    cy.get('[data-cy="certifyButton"]').click()

    // Logout
    cy.get('button.button').first().click();

    // Login as admin
    cy.get('[name="email"]').type(admin.username)
    cy.get('[name="password"]').type(admin.password);
    cy.get(formSubmitSelector).click()
    cy.wait(wait)

    cy.visit(insurerUrl + '/admin')

    // Approve

    if (operation.adminCertify || recertify){
      cy.get('.l-main button.button').first().click();
      cy.wait(wait)
    }else{
      cy.get('.l-main button.button').eq(1).click();
      cy.wait(wait)
      cy.go('back')
      // Log out
      cy.get('button.button').first().click()
      cy.get('[name="email"]').type(insurer.username)
      cy.get('[name="password"]').type(insurer.password);
      cy.get(formSubmitSelector).click()
      cy.wait(wait)
      certifyData(operation, insurer, insurerUrl, true)
    }
  }

  const uploadFile = (operation, insurer, recertify = false, reapprove = false) => {
    cy.get('#rates .button').first().click()


    if (recertify || reapprove) cy.get('[data-cy="fileUpdateButton"]').first().click();
    cy.get('input[type="file"]').first().attachFile('rate.csv');
    cy.get('[data-cy="uploadButton"]').first().click()

    if (!recertify && !reapprove){
      cy.go('back')
      cy.get('#rates [data-cy="submissionStatus"]').should('contain.text','Incomplete')
      cy.get('#rates .button').first().click()
      cy.get('input[type="file"]').first().attachFile('rate.csv');
      cy.get('[data-cy="uploadButton"]').first().click()

    }
    cy.go('back')

    let expectedSubmissionStatus = 'Pending submission';
    if (reapprove){
      expectedSubmissionStatus = 'Rejected'
    }
    cy.get('#rates [data-cy="submissionStatus"]').should('contain.text',expectedSubmissionStatus)
    cy.get('#rates .button').first().click()
    cy.get('[data-cy="submitButton"]').first().click()
    cy.wait(wait)
    cy.go('back')
    cy.get('#rates [data-cy="submissionStatus"]').should('contain.text','Submitted')

    let insurerUrl;
    cy.url().then(url => {
      insurerUrl = url;

      // Login as admin to run fake batch process actions
      cy.visit(insurerUrl + '/rates/test')
      cy.get(logoutSelector).first().click()
      cy.get('[name="email"]').type(admin.username)
      cy.get('[name="password"]').type(admin.password);
      cy.get(formSubmitSelector).click()
      cy.wait(wait)

      // Batch process: load
      cy.get('.l-main .button').first().click();
      cy.wait(wait)

      // Admin approve rates
      cy.visit(insurerUrl + '/rates/admin')
      if (operation.adminApproval || reapprove){
        cy.get('.l-main button.button').first().click()
      }else{
        cy.get('.l-main button.button').eq(1).click()

        cy.visit(insurerUrl)
        uploadFile(operation, insurer, false, true);
      }

      if (operation.adminApproval || reapprove){
        cy.wait(wait)

        // Check review status
        cy.visit(insurerUrl);
        cy.get('#rates [data-cy="submissionStatus"]').should('contain.text','Approved')
        cy.get('#rates [data-cy="reviewStatus"]').should('contain.text','Pending import')

        // Batch process: import
        cy.visit(insurerUrl + '/rates/test')
        cy.get('.l-main .button:not([disabled]').click();
        cy.get(logoutSelector).first().click()

        // Login as insurer
        cy.get('[name="email"]').type(insurer.username)
        cy.get('[name="password"]').type(insurer.password);
        cy.get(formSubmitSelector).click()
        cy.wait(wait)

        // Go to rates review page
        cy.visit(insurerUrl)
        cy.get('#rates [data-cy="reviewStatus"]').should('contain.text', 'Pending certification')
        cy.wait(wait);
        cy.get('#rates .button').eq(1).click()
        cy.get(formSubmitSelector).first().click()
        cy.wait(wait);

        // Certify rates
        if (operation.insurerCertify || recertify){
          cy.get('[data-cy="certifyButton"]').click();
          cy.go('back')
          cy.get('#rates [data-cy="reviewStatus').should('contain.text', 'Certified')

          // Rates are done; move on

          const autoButtonSelector = '#auto .button';
          // Policy
          cy.get(autoButtonSelector).first().click()
          cy.wait(shortWait)
          cy.get('[for="MOST_SOLD_POLICY_ID"]').next().click();
          cy.get('#choices--MOST_SOLD_POLICY_ID-item-choice-2').click();
          cy.get('[name="INIT_RATE_CHG_PCT_12"]').type('2');
          cy.get('[name="INIT_RATE_CHG_PCT_24"]').type('2');
          cy.get('[name="INIT_RATE_CHG_PCT_36"]').type('2');
          cy.get(formSubmitSelector).click();
          cy.wait(500);
          cy.go('back')
          cy.go('back')
          cy.get('[data-cy="policyStatus').should('contain.text','Incomplete')
          cy.get(autoButtonSelector).first().click()
          cy.get(formSubmitSelector).click();
          cy.get('fieldset .radioButton:nth-child(2) label').each(($el) => {
            cy.wrap($el).click()
          }) // Iterate through each 'li'
          cy.get('.form-controls-submit').click();
          cy.wait(wait)
          cy.go('back')
          cy.go('back')
          cy.get('[data-cy="policyStatus"]').should('contain.text', 'Completed')

          // Credit
          cy.get(autoButtonSelector).eq(1).click()

          if (operation.creditUsage){
            cy.get('.l-main .button').first().click()
            cy.get('.checkPanel-heading').first().click()
            cy.get(formSubmitSelector).click();
            cy.wait(wait)
            cy.go('back');
            cy.get('[data-cy="creditStatus"]').should('contain.text','Incomplete')
            cy.get(autoButtonSelector).eq(1).click()
            cy.get('[for="INS_CREDIT_MODEL_ID"]').next().click();
            cy.get('#choices--INS_CREDIT_MODEL_ID-item-choice-2').click();
            cy.get('[name="INSR_CRED_MODEL_YEAR"]').type('1999');
            cy.get('[name="INSR_CRED_MODEL_TRACKING"]').type('Tracking');
            cy.get(formSubmitSelector).click();
            cy.go('back');
            cy.get('[data-cy="creditStatus"]').should('contain.text','Completed')
          }else{
            // No credit usage
            cy.get('.l-main .button').eq(1).click()
            cy.go('back')
            cy.get('[data-cy="creditStatus"]').should('contain.text','Completed')
          }

          // Contact update
          cy.get('[data-cy="contactEdit"]').click()
          cy.get('[name="AREA_CODE"]').type('222')
          cy.get('[name="PHONE"]').type('459-7000')
          cy.get('[name="INSR_CNTC_PHONE_NBR"]').type('459-7000')
          cy.get(formSubmitSelector).click()
          cy.wait(wait)
          cy.go('back')
          cy.get('[data-cy="contactStatus"]').should('contain.text','Incomplete')

          cy.get('[data-cy="contactEdit"]').click()
          cy.get('[name="INSR_CNTC_WEB_ADDR"]').type('http://test.com')
          cy.get(formSubmitSelector).click()
          cy.wait(wait)
          cy.go('back')
          cy.get('[data-cy="contactStatus"]').should('contain.text','Completed')

          certifyData(operation, insurer, insurerUrl);


        }else{
          cy.get('[data-cy="restartButton"]').click();
          cy.get('[data-cy="restartButton-confirm"]').click();
          cy.wait(wait)
          cy.go('back')
          cy.get('#rates [data-cy="submissionStatus"]').should('contain.text', 'Pending submission')
          cy.get('#rates [data-cy="reviewStatus"]').should('contain.text', 'Pending')
          uploadFile(operation, insurer, true);
        }

      }


    })
  }

  operations.forEach((operation, i) => {
    const insurer = {
      username: 'test'+ Date.now() + i + '@mightycitizen.dev',
      password: 'Testpassw0rd'
    }
    it(operation.name + ': Register Insurer', () => {
      // https://on.cypress.io/blur
      cy.visit(baseUrl+'portal/register')
      cy.get('[name="NAME"]').type('Kristine')
      cy.get('[name="EMAIL"]').type(insurer.username);
      cy.get('[name="PASSWORD"]').type(insurer.password);
      cy.get('[name="password_confirm"]').type(insurer.password);
      cy.get('[name="insurer_eid_0"]').type(eid).blur()
      cy.get('[name="insurer_mga_0"]').type(Math.floor(Math.random() * 999)).blur()
      cy.wait(wait)
      cy.get(formSubmitSelector).click();
      cy.get('h1').should('contain.text', 'We are reviewing');
    })


    it(operation.name + ': Login Admin and Approve', () => {
      // https://on.cypress.io/blur
      cy.visit(baseUrl+'portal/login');
      cy.get('[name="email"]').type(admin.username)
      cy.get('[name="password"]').type(admin.password);
      cy.get(formSubmitSelector).click();
      cy.wait(wait)
      cy.get('h1').should('contain.text', 'Admin Portal')
      cy.get('a[href="/portal/admin/users/2/P/all"]').click()
      cy.get('a[href="mailto:' + insurer.username + '"]').parents('tr').find('a[href*="/portal/admin/insurers/edit"]').click()
      cy.get('[name="MGA_NM"]').clear().type('Test MGA');
      cy.get(formSubmitSelector).click();
      cy.wait(wait);
      cy.go('back');
      cy.get('a[href="mailto:' + insurer.username + '"]').parents('tr').find('button.button').click()
      cy.wait(wait);
      cy.get(logoutSelector).first().click()
    })

    it(operation.name + ': Insurer Submit Rates and Admin Loads', () => {
      cy.visit(baseUrl+'portal/login');
      cy.get('[name="email"]').type(insurer.username)
      cy.get('[name="password"]').type(insurer.password);
      cy.get(formSubmitSelector).click();
      cy.wait(wait)
      cy.get('table a').first().click();
      cy.get('h1').should('contain.text', 'Test MGA')
      cy.get('.checkPanel-heading').first().click()
      cy.wait(wait)
      uploadFile(operation, insurer);
    });

  })




})
