/**
 * Test the Ticket model directly
 */
let Ticket = require('../models/ticket');
let expect = require('chai').expect;

describe('Create a Ticket model', function() {
    it('Creation succeeds 0 length ticket', function() {
        let zeroTicket = Ticket.createTicket();
        expect(zeroTicket).to.not.be.null;
        expect(zeroTicket.allLines.length).to.be.equal(0);
    });
    it('Creation succeeds 1 length ticket', function() {
        let twoTicket = Ticket.createTicket(1);
        expect(twoTicket).to.not.be.null;
        expect(twoTicket.allLines.length).to.be.equal(1);
    });
    it('Creation succeeds 2 length ticket', function() {
        let threeTicket = Ticket.createTicket(2);
        expect(threeTicket).to.not.be.null;
        expect(threeTicket.allLines.length).to.be.equal(2);
    });
});

describe('Add lines to ticket', function() {
    it('Add 0 lines to ticket', function() {
        let ticket = Ticket.createTicket(0);
        ticket.addLines(0);
        expect(ticket.allLines.length).to.be.equal(0);
    });
    it('Add 1 lines to ticket', function() {
        let ticket = Ticket.createTicket(0);
        ticket.addLines(1);
        expect(ticket.allLines.length).to.be.equal(1);
    });
    it('Add 2 lines to ticket', function() {
        let ticket = Ticket.createTicket(0);
        ticket.addLines(2);
        expect(ticket.allLines.length).to.be.equal(2);
    });
    it('Add 3 lines to ticket', function() {
        let ticket = Ticket.createTicket(0);
        ticket.addLines(3);
        expect(ticket.allLines.length).to.be.equal(3);
    });
    it('Add 1 lines to populated ticket', function() {
        let ticket = Ticket.createTicket(10);
        ticket.addLines(1);
        expect(ticket.allLines.length).to.be.equal(11);
    });
    it('Add 2 lines to populated ticket', function() {
        let ticket = Ticket.createTicket(10);
        ticket.addLines(2);
        expect(ticket.allLines.length).to.be.equal(12);
    });
    it('Add 3 lines to populated ticket', function() {
        let ticket = Ticket.createTicket(10);
        ticket.addLines(3);
        expect(ticket.allLines.length).to.be.equal(13);
    });
});

describe('View state of ticket', function() {
    it('Open ticket open', function() {
        let ticket = Ticket.createTicket();
        expect(ticket.open).to.be.equal(true);
    });
    it('Closed ticket closed', function() {
        let ticket = Ticket.createTicket();
        ticket.view();
        expect(ticket.open).to.be.equal(false);
    });
    it('Add lines to closed ticket', function() {
        let ticket = Ticket.createTicket();
        ticket.view();
        ticket.addLines(3);
        expect(ticket.allLines.length).to.be.equal(0);
    });
});

