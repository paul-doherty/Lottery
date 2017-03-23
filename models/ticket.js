/**
 * Ticket model
 */
'use strict';

let mongoose = require('mongoose');
let config = require('../config');
let Schema = mongoose.Schema;
let Line = require('./line');

let ticketSchema = new Schema({
    open: Boolean,
    allLines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: config.MODEL_LINE,
    }],
    lineCount: Number,
}, {id: false});

/**
 * Create a new ticket setting sensible defaults containing
 * the requested number of lines
 * @param {number} quantity The number of lines to add to the ticket
 * @return {Ticket} A new ticket
 */
ticketSchema.statics.createTicket = function createTicket(quantity) {
    let ticket = new this({
        open: true,
        allLines: [],
        lineCount: 0,
    });
    ticket.save();
    ticket.addLines(quantity);
    return ticket;
};

/**
 * Add lines to an existing ticket
 * @param {number} quantity The number of lines to add to the ticket
 */
ticketSchema.methods.addLines = function addLines(quantity) {
    let additionalLines = [];
    for(let i=0; i<quantity; i++) {
        let currentLine = Line.createLine();
        additionalLines.push(currentLine);
    }
    let current = (this.allLines)? this.allLines : [];
    this.allLines = current.concat(additionalLines);
    this.lineCount = this.allLines.length;
    this.save(function(err) {
        if (err) return handleError(err);
        // thats it!
    });
};

/**
 * A ticket has been opened for viewing
 */
ticketSchema.methods.view = function view() {
    this.open = false;
    this.save(function(err) {
            if (err) return handleError(err);
            // thats it!
        });
    console.log(config.INFO_TICKET_OPEN, this._id);
};

module.exports = mongoose.model(config.MODEL_TICKET, ticketSchema);
