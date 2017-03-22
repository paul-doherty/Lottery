/**
 * Ticket API 
 */

var mongoose = require('mongoose');
var config = require('../config');
var ticketModel = require('../models/ticket');

mongoose.connect(config.database);

//Create models
var Line = mongoose.model('Line');
var Ticket  = mongoose.model('Ticket');

exports.api = {};

/**
 * GET /api/tickets
 * Returns all tickets
 */
exports.api.getTickets = function(req, res) {
    Ticket.find(null, { __v: 0, allLines:0 }).exec(function(error, data) {
    res.json({ tickets: data});
    });
};

/**
 * POST /api/tickets
 * Creates a new ticket
 */
exports.api.postTicket = function(req, res) {
    
    if(isValidTicketQuantity(req)) {
        let ticket = Ticket.createTicket(req.body.quantity);
        res.json({ ticket: ticket});
    } else {
        res.json(400, { mesage: "Invalid ticket quantity"});
    }
};
 
/**
 * GET /api/tickets/<id>
 * Returns the ticket with the specified id
 */
exports.api.getTicket = function(req, res) {
    
    if(isValidTicketId(req)) {
        var ticketId = req.params.id;
        Ticket.findOne({ _id: ticketId}, { __v: 0 }).populate('allLines', 'entry').exec(function(error, ticket) {
            ticket.view();
            let ticketWithResults = ticket.toObject({ virtuals:true });
            ticketWithResults.allLines.sort((a,b)=> a.result - b.result);
            res.json({ ticket: ticketWithResults});
        });
    } else {
        res.json(404, { mesage: "Invalid ticket id"});
    }
};

/**
 * PATCH /api/tickets/<id>
 * Updates a ticket to add a required number of lines to it
 */
exports.api.patchTicket = function(req, res) {
    
    if(!isValidTicketId(req)) {
        res.json(404, { mesage: "Invalid ticket id"});
    }
    if(!isValidTicketQuantity(req)) {
        res.json(400, { mesage: "Invalid ticket quantity"});
    }

    let ticketId = req.params.id;
    let quantity = req.body.quantity;
    Ticket.findOne({ _id: ticketId}, { __v: 0 }).exec(function(error, ticket) {
        if(ticket.open) { 
            ticket.addLines(quantity);
            var ticketObject = ticket.toObject();
            delete ticketObject.allLines;
            res.json({ ticket: ticketObject});
        } else {
            res.json(400, { mesage: "Cannot modify closed tickets"});
        }
    }); 
};

/**
 * Check the request to ensure the quantity supplied is valid
 */
function isValidTicketQuantity(req) {
    console.log(typeof req.body.quantity);
    let isNumber = typeof req.body.quantity === 'number';
    return isNumber && req.body.quantity > 0;
}

/**
 * Check the request to ensure the ticket id supplied is valid
 */
function isValidTicketId(req) {
    let validId = req.params && req.params.id;;
    if(validId) {
        let ticketId = req.params.id;
        let idRegex = new RegExp("^[0-9a-fA-F]{24}$");
        validId = idRegex.test(ticketId);
    }
    return validId;
}
