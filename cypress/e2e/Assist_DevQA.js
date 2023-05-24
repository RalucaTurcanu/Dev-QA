const username = "0757776820"
const password = "Assist2023"

const sampleData = {
    firstName: "Roxana",
    lastName: "Test",
    phoneNumber: "0757776820",
    category: "Medicamente",
    description: "Medicamente putine va rog.",
    street: "Strada Mea nr 8",
    details: "Nu am alte detalii",
    county: "Suceava",
    city: "Suceava",
    postalCode: "12345",
};

beforeEach(() => {
    cy.viewport(1280, 720)
    cy.visit("https://iwanttohelp.bim.assistcloud.services/");
   
});

function login() {
    cy.get('a[href="/auth/login"]').should("be.visible").click({
        multiple: true
    }); // go  to Autentificare
    cy.get("#__BVID__66").should("be.visible").type(username);
    cy.get("#__BVID__68").should("be.visible").type(password);
    cy.get('.btn').click();
    cy.contains('Deconectare').should("be.visible");
}

function fillSurvey() {
    //fill in the random survey

    cy.get('#__BVID__188 > div.bv-no-focus-ring > :nth-child(1) > .custom-control-label').should("be.visible").click();
    cy.get('#__BVID__194 > div.bv-no-focus-ring > :nth-child(2) > .custom-control-label').click();
    cy.get('#__BVID__200 > div.bv-no-focus-ring > :nth-child(3) > .custom-control-label').click();
    cy.get('#__BVID__206 > div.bv-no-focus-ring > :nth-child(2) > .custom-control-label').click();
    cy.get('#__BVID__212 > div.bv-no-focus-ring > :nth-child(2) > .custom-control-label').click();

    cy.get('#questions_modal___BV_modal_footer_ > .btn').click();
}

describe("Test Suite", () => {


    it("TC1 - Verify that all header s elements navigate to the correct page.", () => {
        cy.get('a[href="/"]').should("be.visible").click({
            multiple: true
        }); // go to Acasa
        cy.get('a[href="/search"]').should("be.visible").click({
            multiple: true
        }); // go  to Top Voluntari
        cy.get('a[href="/needs_list"]').should("be.visible").click({
            multiple: true
        }); // go  to Lista nevoi
        cy.get('a[href="/about"]').should("be.visible").click({
            multiple: true
        }); // go  to Despre noi
        cy.get('a[href="/contact"]').should("be.visible").click({
            multiple: true
        }); // go  to Ofera Sugestie
        cy.get('a[href="/auth/register"]').should("be.visible").click({
            multiple: true
        }); // go  to Devino voluntar
        cy.get('a[href="/auth/login"]').should("be.visible").click({
            multiple: true
        }); // go  to Autentificare
    });

    it("TC2 - Verify that on “Top Voluntari” page the map and at least one volunteer is displayed.", () => {

        cy.get('a[href="/search"]').should("be.visible").click({
            multiple: true
        }); // Go to Top Voluntari

        //verify the full screen map button is shown
        cy.get(':nth-child(9) > .gm-control-active').should("be.visible");

        // check at least one volunteer element are displayed
        cy.get(':nth-child(1) > .card > .card-body > img').should("have.length.greaterThan", 0);
    });

    it("TC3 - Verify the user is able to Zoom in or out the map", () => {

        cy.get('a[href="/search"]').should("be.visible").click({
            multiple: true
        }); // go to Top Voluntari

        //dismiss GoogleMaps button
        cy.get('.dismissButton').click();

        //click on zoom in/out buttons
        cy.get('[aria-label="Zoom in"]').click();
        cy.get('[aria-label="Zoom out"]').click();

    });

    it("TC4 - Verify that Login functionality works with valid credentials.", () => {

        cy.get('a[href="/auth/login"]').should("be.visible").click({
            multiple: true
        }); // go  to Autentificare

        cy.get("#__BVID__66").should("be.visible").type(username);
        cy.get("#__BVID__68").should("be.visible").type(password);
        cy.get('.btn').click();

        cy.contains('Deconectare').should("be.visible");

    });

    it("TC5 - Verify that Login functionality works with invalid credentials.", () => {

        // store the current URL to compare it later.
        cy.location('pathname').as('currentPath');

        cy.get('a[href="/auth/login"]').should("be.visible").click({
            multiple: true
        }); // go  to Autentificare

        cy.get("#__BVID__66").type("username");
        cy.get("#__BVID__68").should("be.visible").type("password");
        cy.get('.btn').click();

        cy.contains('This field accepts only numeric characters.').should("be.visible");

        // assert that the user is on the same page as before comparing it to first location
        cy.get('@currentPath').then((previousPath) => {
            cy.location('pathname').should('eq', previousPath);
        });


    });

    it("TC6 - Verify that a user is able to add a new Nevoie recomandata.", () => {

        cy.on('uncaught:exception', (err, runnable) => {
            return false;
        });

        login();

        cy.contains('Nevoi recomandate', {
            matchCase: false
        }).click();

        //click Add button
        cy.get('.btn > .tim-icons').click();

        //fill in the form        
        cy.get('input[name="contact_first_name"]').type(sampleData.firstName);
        cy.get('input[name="contact_last_name"]').type(sampleData.lastName);
        cy.get('input[name="contact_phone_number"]').type(sampleData.phoneNumber);
        cy.get('#vs1__combobox') // get the dropdown element
            .click() // click to open the dropdown
            .get('ul#vs1__listbox > li') // get the list of options
            .first() // select the first option
            .click(); // click to select it
        cy.get('textarea[name="description"]').type(sampleData.description);
        cy.get('input[placeholder="Nume strada, numar ..."]').type(sampleData.street);
        cy.get('input[name="details"]').type(sampleData.details);
        cy.get('input[name="county"]').type(sampleData.county);
        cy.get('input[name="city"]').type(sampleData.city);
        cy.get('input[name="postal_code"]').type(sampleData.postalCode);

        cy.contains("Trimite").click();
        cy.contains("Salveaza").click();

        cy.get('.alert > .text-center').should('be.visible').and('contain', 'Succes!');

        cy.contains('Nevoi recomandate', {
            matchCase: false
        }).click();


    });



    it("TC7 - Verify that the Descriere field is required.", () => {

        cy.on('uncaught:exception', (err, runnable) => {
            return false;
        });

        login();

        cy.contains('Nevoi recomandate', {
            matchCase: false
        }).click();

        //click Add button
        cy.get('.btn > .tim-icons').click();

        //fill in the form        
        cy.get('input[name="contact_first_name"]').type(sampleData.firstName);
        cy.get('input[name="contact_last_name"]').type(sampleData.lastName);
        cy.get('input[name="contact_phone_number"]').type(sampleData.phoneNumber);
        cy.get('#vs1__combobox') // get the dropdown element
            .click() // click to open the dropdown
            .get('ul#vs1__listbox > li') // get the list of options
            .first() // select the first option
            .click(); // click to select it

        cy.get('input[placeholder="Nume strada, numar ..."]').type(sampleData.street);
        cy.get('input[name="details"]').type(sampleData.details);
        cy.get('input[name="county"]').type(sampleData.county);
        cy.get('input[name="city"]').type(sampleData.city);
        cy.get('input[name="postal_code"]').type(sampleData.postalCode);

        cy.contains("Trimite").click();

        cy.get('.errors > .text-left').should('be.visible').and('contain', 'Acest camp este obligatoriu.');

        cy.contains('Nevoi recomandate', {
            matchCase: false
        }).click();

    });

    it("TC8 - Verify that the user is able to use “Vizualizeaza” functionality", () => {

        cy.on('uncaught:exception', (err, runnable) => {
            return false;
        });

        login();

        cy.contains('Nevoi recomandate', {
            matchCase: false
        }).click();

        cy.get(':nth-child(1) > [aria-colindex="6"] > div > .fa-eye').click();

        cy.get('.title').should('contain', 'Vizualizare nevoie recomandata');
        cy.get('.card-header > p > span').should('contain', 'Deschis');

        cy.get('input[name="contact_first_name"]').should('have.value', sampleData.firstName);
        cy.get('input[name="contact_first_name"]').should('have.value', sampleData.firstName);
        cy.get('input[name="contact_last_name"]').should('have.value', sampleData.lastName);
        cy.get('input[name="contact_phone_number"]').should('have.value', sampleData.phoneNumber);
        cy.get('input[placeholder="Nume strada, numar ..."]').should('have.value', sampleData.street);
        cy.get('input[name="county"]').should('have.value', sampleData.county);
        cy.get('input[name="city"]').should('have.value', sampleData.city);
        cy.get('input[name="postal_code"]').should('have.value', sampleData.postalCode);

    });

    it("TC9 - Verify that the user is able to use “Sterge” functionality", () => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false;
        });

        login();

        cy.contains('Nevoi recomandate', {
            matchCase: false
        }).click();

        let initialCount = 0;

        cy.get(':nth-child(1) > [aria-colindex="6"] > div > .fa-trash-alt').should('be.visible');

        cy.get('tbody tr').then(($tr) => {
          initialCount = $tr.length;
        });

        // click delete on first entry
        cy.get(':nth-child(1) > [aria-colindex="6"] > div > .fa-trash-alt').click();
        cy.get('#delete_modal___BV_modal_footer_ > .btn-primary').click();
        cy.wait(15000);

        cy.get('tbody tr').then(($tr) => {
            const finalCount = $tr.length;
            expect(finalCount).to.equal(initialCount - 1);
        });

    });

    it("TC10 - Verify search functionality on Nevoi recomandate page", () => {

        cy.on('uncaught:exception', (err, runnable) => {
            return false;
        });

        login();

        cy.contains('Nevoi recomandate', {
            matchCase: false
        }).click();

        cy.get('input[name="Filter"]').type("sampleData.phoneNumber");

        cy.get('div > p').should('contain', 'Nu s-au gasit rezultate pentru cautarea dumneavoastra.');

        cy.get('input[name="Filter"]').clear();

        cy.get('input[name="Filter"]').type(sampleData.phoneNumber);

        cy.get('tbody > :nth-child(1) > [aria-colindex="4"]').should('contain', sampleData.phoneNumber);

    });

    it("TC11 - Verify that the user is able to use “Vizualizeaza” functionality ", () => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false;
        });

        login();

        cy.contains('Nevoi', {
            matchCase: false
        }).click();

        cy.get(':nth-child(1) > [aria-colindex="5"] > div > .fa-eye').click();

        cy.get('input[name="first_name"]').should('exist');
        cy.get('input[name="last_name"]').should('exist');
        cy.get('input[name="phone_number"]').should('exist');
        cy.get('input[name="street_name"]').should('exist');
        cy.get('input[name="county"]').should('exist');
        cy.get('input[name="city"]').should('exist');
        cy.get('input[name="postal_code"]').should('exist');

    });

    it("TC12 - e Verify “Aplica” functionality", () => {

        cy.on('uncaught:exception', (err, runnable) => {
            return false;
        });

        login();

        cy.contains('Nevoi', {
            matchCase: false
        }).click();

        cy.get(':nth-child(1) > [aria-colindex="5"] > div > .fa-user-check').click();

        cy.get('.btn-primary').click();

        cy.get('.alert').should('be.visible').and('contain', 'Succes!');

    });

    it("TC13 - Verify “Completeaza” functionality", () => {
        //was not able to find the Completeaza butotn
    });

    it("TC14 - Verify proper logout", () => {

        login();

        cy.contains('Deconectare').click();

        cy.contains('Autentificare').should('be.visible');

        cy.get(':nth-child(1) > .card > .card-header > .card-title').should('be.visible');

    });


});