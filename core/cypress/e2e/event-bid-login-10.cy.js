const loginNumber = 10;

describe('Event - Bid', () => {
    let totalResponseTime = 0;
    let responseCount = 0;

    beforeEach(() => {
        cy.login(loginNumber);
    });

    function bidAutobidTest() {
        cy.visit(Cypress.env('EVENT_URL'));
    
        cy.wait(1000);

        for (let i = 0; i < 40; i++) {
            cy.get('.cmn--btn.btn--sm.bid_now.bid-with-anim').then($buttons => {
                const randomIndex = Math.floor(Math.random() * $buttons.length);
                cy.wrap($buttons[randomIndex]).click();
            });
            cy.wait(2000);
            cy.get('.modal_submit').click();
            cy.wait(2000);
            
            // Measure time for the button click and response
            const startTime = performance.now();

            cy.get('#bid_form > .modal-footer > .btn--base').click().then(() => {
                cy.waitUntil(() => {
                    // Assuming there's some visual indicator that the response is back, such as modal closing
                    return  cy.get('.iziToast-message').contains('Your Bid Added Successfully');

                }).then(() => {
                    const endTime = performance.now();
                    const responseTime = endTime - startTime;
                    cy.log(`response time: ${responseTime}ms`);
                    totalResponseTime += responseTime;
                    responseCount++;
                });
            });

            cy.wait(5000);
            cy.get('.cmn--btn.btn--sm.auto_bid_now.bid-with-anim').then($buttons => {
                const randomIndex = Math.floor(Math.random() * $buttons.length);
                cy.wrap($buttons[randomIndex]).click();
            });
            cy.wait(500);
            
            cy.get('.d-flex.final-total-price.animate-value > .text-truncate').first().should('exist').invoke('text').then((priceText) => {
                const price = parseFloat(priceText.replace(/[^0-9.-]+/g, "")); // Remove any non-numeric characters
                const max_bid = price + 10;
                cy.get('#max_bid_in_').type(max_bid.toString());
            });
            cy.wait(500);
            
            cy.get('#bidding_step_').type('0.1');
            cy.wait(500);
            cy.get('#autobid_form > .modal-footer > .btn--base').click();
            cy.wait(5000);
        }
    }

    Cypress._.times(25, (i) => {
        it(`Bid - Autobid Iteration ${i + 1}`, () => {
            bidAutobidTest();
        });
    });

    after(() => {
        const averageResponseTime = totalResponseTime / responseCount;
        cy.log(`Average response time: ${averageResponseTime}ms`);
    });
});
