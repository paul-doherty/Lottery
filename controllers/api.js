/**
 * Ticket API
 */
'use strict"';

let mongoose = require('mongoose');
let config = require('../config');
require('../models/ticket');

mongoose.Promise = global.Promise;
mongoose.connect(config.database);

// Create models
let Ticket = mongoose.model(config.MODEL_TICKET);

exports.api = {};

/**
 * GET /api/tickets
 * Returns all tickets
 * @param {request} req The request sent by the user
 * @param {response} res The response to the users request
 */
exports.api.getTickets = function(req, res) {
    Ticket.find(null, {__v: 0, allLines: 0}).exec(function(error, data) {
    res.status(200).json({tickets: data});
    });
};

/**
 * POST /api/tickets
 * Creates a new ticket
 * @param {request} req The request sent by the user
 * @param {response} res The response to the users request
 */
exports.api.postTicket = function(req, res) {
    if(isValidTicketQuantity(req)) {
        let ticket = Ticket.createTicket(req.body.quantity);
        res.status(201).json({ticket: ticket});
    } else {
        res.status(400).json({mesage: config.ERROR_INVALID_QUANTITY});
    }
};

/**
 * GET /api/tickets/<id>
 * Returns the ticket with the specified id
 * @param {request} req The request sent by the user
 * @param {response} res The response to the users request
 */
exports.api.getTicket = function(req, res) {
    if(isValidTicketId(req)) {
        let ticketId = req.params.id;
        Ticket.findOne({_id: ticketId}, {__v: 0})
              .populate(config.MODEL_TICKET_ALLLINES, config.MODEL_LINE_ENTRY)
              .exec(function(error, ticket) {
            ticket.view();
            let ticketWithResults = ticket.toObject({virtuals: true});
            ticketWithResults.allLines.sort((a, b)=> a.result - b.result);
            res.json({ticket: ticketWithResults});
        });
    } else {
        res.status(404).json({mesage: config.ERROR_INVALID_TICKET_ID});
    }
};

/**
 * PATCH /api/tickets/<id>
 * Updates a ticket to add a required number of lines to it
 * @param {request} req The request sent by the user
 * @param {response} res The response to the users request
 */
exports.api.patchTicket = function(req, res) {
    if(!isValidTicketId(req)) {
        res.status(404).json({mesage: config.ERROR_INVALID_TICKET_ID});
    }
    if(!isValidTicketQuantity(req)) {
        res.status(400).json({mesage: config.ERROR_INVALID_QUANTITY});
    }

    let ticketId = req.params.id;
    let quantity = req.body.quantity;
    Ticket.findOne({_id: ticketId}, {__v: 0})
          .exec(function(error, ticket) {
        if(ticket.open) {
            ticket.addLines(quantity);
            let ticketObject = ticket.toObject();
            delete ticketObject.allLines; // hide alllines in output
            res.status(200).json({ticket: ticketObject});
        } else {
            res.status(400).json({mesage: config.ERROR_TICKET_CLOSED});
        }
    });
};

/**
 * Check the request to ensure the quantity supplied is valid
 * @param {request} req The request sent by the user
 * @return {boolean} If the quantity specified is valid
 */
function isValidTicketQuantity(req) {
    let isNumber = typeof req.body.quantity === 'number';
    return isNumber && req.body.quantity > 0;
}

/**
 * Check the request to ensure the ticket id supplied is valid
 * @param {request} req The request sent by the user
 * @return {boolean} If the ticket id is in the correct format
 */
function isValidTicketId(req) {
    let validId = req.params && req.params.id;
    if(validId) {
        let ticketId = req.params.id;
        let idRegex = new RegExp(config.REGEX_VALID_TICKET);
        validId = idRegex.test(ticketId);
    }
    return validId;
}
