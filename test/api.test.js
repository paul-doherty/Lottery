/**
 * Test the API by starting the server and invoking requests
 */
process.env.NODE_ENV = 'test';
require('../controllers/api');
let expect = require('chai').expect;
let request = require('request');
require('../server');

describe('Get all Tickets', function() {
    let url = 'http://localhost:8080/api/tickets/';

    it('Returns status 200', function() {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
      });
    });
    it('Response is valid JSON', function() {
      request(url, function(error, response, body) {
        expect(JSON.parse(response.body).to.not.be.null);
      });
    });
    it('Response contains tickets', function() {
      request(url, function(error, response, body) {
          let ticketsResponse = JSON.parse(response.body);
        expect(ticketsResponse.tickets.to.not.be.null);
      });
    });
    it('Add a ticket', function() {
      request(url, function(error, response, body) {
          let ticketsResponse = JSON.parse(response.body);
        expect(ticketsResponse.tickets.to.not.be.null);
      });
    });
});

describe('Post Tickets', function() {
    let url = 'http://localhost:8080/api/tickets';

    it('Add a ticket', function() {
      request.post({
        headers: {
            'Content-Type': 'application/json'},
            url: url,
            body: '{ "quantity": 5 }',
        },
        function(error, response, body) {
            expect(response.statusCode).to.equal(201);
            let ticketsResponse = JSON.parse(response.body);
            expect(ticketsResponse.ticket.open.to.be(true));
            expect(ticketsResponse.ticket.allLines.length.to.be(5));
        }
      );
    });
    it('Add ticket invalid body key', function() {
      request.post({
        headers: {
            'Content-Type': 'application/json'},
            url: url,
            body: '{ "quan": 5 }',
        },
        function(error, response, body) {
            expect(response.statusCode).to.equal(400);
        }
      );
    });
    it('Add ticket invalid body json', function() {
      request.post({
        headers: {
            'Content-Type': 'application/json'},
            url: url,
            body: '{ "quantity: 5 }',
        },
        function(error, response, body) {
            expect(response.statusCode).to.equal(400);
        }
      );
    });
    it('Add ticket invalid content type', function() {
      request.post({
        headers: {
            'Content-Type': 'application/xml'},
            url: url,
            body: '<quantity>5</quantity>',
        },
        function(error, response, body) {
            expect(response.statusCode).to.equal(400);
        }
      );
    });
});

describe('Get ticket', function() {
    it('Create a ticket and get it', function() {
        createTicket(function(error, response, body) {
            expect(response.statusCode).to.equal(201);
            let ticket = JSON.parse(response.body);
            updateTicket(ticket.ticket._id, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                ticket = JSON.parse(response.body);
            });
        });
    });
    it('Get invalid ticket', function() {
        let ticketId = '123456789012345678901234';
        updateTicket(ticketId, function(error, response, body) {
            expect(response.statusCode).to.equal(400);
        });
    });
});

describe('Update ticket', function() {
    it('Add lines to an open ticket', function() {
        // create a ticket
        createTicket(function(error, response, body) {
            expect(response.statusCode).to.equal(201);
            let ticketResponse = JSON.parse(response.body);
            // attempt to update the ticket
            updateTicket(ticketResponse.ticket._id,
            function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                updateResponse = JSON.parse(response.body);
                expect(updateResponse.lineCount).to.equal(10);
            });
        });
    });

    it('Add lines to an closed ticket', function() {
        // create a ticket
        createTicket(function(error, response, body) {
            expect(response.statusCode).to.equal(201);
            let ticketResponse = JSON.parse(response.body);
            // open the ticket thereby making it unalterable
            getTicket(ticketResponse.ticket._id,
            function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                // attempt to update the ticket
                updateTicket(ticketResponse.ticket._id,
                function(error, response, body) {
                    expect(response.statusCode).to.equal(400);
                });
            });
        });
    });
});

/**
 * Create a ticket
 * @param {function} callback once request completes
 */
function createTicket(callback) {
    let url = 'http://localhost:8080/api/tickets';
    request.post({
        headers: {
            'Content-Type': 'application/json'},
            url: url,
            body: '{ "quantity": 5 }',
        },
        callback
    );
}

/**
 * Get the ticket with the given id
 * @param {string} ticketId The id of the ticket to update
 * @param {function} callback The function to call once the request completes
 */
function getTicket(ticketId, callback) {
    let url = 'http://localhost:8080/api/tickets/'+ticketId;
    request.patch({
        headers: {
            'Content-Type': 'application/json'},
            url: url,
            body: '',
        },
        callback
    );
}

/**
 * Update the ticket with the given id
 * @param {string} ticketId The id of the ticket to update
 * @param {function} callback The function to call once the request completes
 */
function updateTicket(ticketId, callback) {
    let url = 'http://localhost:8080/api/tickets/'+ticketId+'/add';
    request.patch({
        headers: {
            'Content-Type': 'application/json'},
            url: url,
            body: '{ "quantity": 5 }',
        },
        callback
    );
}
