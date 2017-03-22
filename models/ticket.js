/**
 * Ticket model
 */
var mongoose = require('mongoose');
var config = require('../config');
var Schema = mongoose.Schema;
var Line = require("./line");

var ticketSchema = new Schema({ 
    open: Boolean, 
    allLines: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Line' 
    }], 
    lineCount: Number 
}, { id: false });

/**
 * Create a new ticket setting sensible defaults
 */
ticketSchema.statics.createTicket = function createTicket (quantity) {
    let ticket = new this({ 
        open: true, 
        allLines: [], 
        lineCount: 0
    });
    ticket.save();
    ticket.addLines(quantity);
    return ticket;
};

/**
 * Add lines to an existing ticket
 */
ticketSchema.methods.addLines = function addLines (quantity) {
    if(typeof quantity === 'number') {
        let additionalLines = [];
        for(let i=0; i<quantity; i++) {
            let currentLine = Line.createLine(); 
            additionalLines.push(currentLine);
        }
        let current = (this.allLines)? this.allLines : [];
        this.allLines =  current.concat(additionalLines);
        this.lineCount = this.allLines.length;
        this.save(function (err) {
            if (err) return handleError(err);
            // thats it!
        });
    } else {
        console.error('Expected a number of lines to add. Ignoring.');
    }
};

/**
 * A ticket has been opened for viewing
 */
ticketSchema.methods.view = function view () {
    console.log('The ticket %s is open for viewing. It can no longer be modified.', this._id);
    this.open = false;
    this.save(function (err) {
            if (err) return handleError(err);
            // thats it!
        });
};

module.exports = mongoose.model('Ticket', ticketSchema);