/**
 * Line model
 */
var mongoose = require('mongoose');
var config = require('../config');
var Schema = mongoose.Schema;

var lineSchema = new Schema({ 
    entry: [Number] 
}, { id: false });

/**
 * Create a new line with randomly generated values
 */
lineSchema.statics.createLine = function createLine () {
    let line = new this({ 
        entry: []
    });
    let lineNumberOfValues = new Number(config.lineNumberOfValues);
    for(let i=0; i<lineNumberOfValues; i++) {
        line.entry.push(generateLineValue());
    }

    line.save();
    return line;
};

/**
 * Add the result data to the line
 */
lineSchema.virtual('result').get(function () {

    let result = 0;
    let sum = this.entry.reduce((a, b) => a + b);
    if(sum === 2) {
        result = 10;
        return result;
    } 
    let areValuesSame = this.entry.reduce((a, b) => (a === b) ? a : NaN);
    if (!isNaN(areValuesSame)) {
        result = 5;
        return result;
    }
    let areValuesNotEqualFirst = this.entry.reduce((a, b) => (a != b)? a : NaN);
    if(!isNaN(areValuesNotEqualFirst)) {
        result = 1;
        return result;
    }
    return result;
});

/**
 * Generates one value for a line entry
 */
function generateLineValue() {
    return Math.floor(Math.random() * (config.lineMaximumValue - config.lineMinimumValue + 1)) + config.lineMinimumValue;
}

module.exports = mongoose.model('Line', lineSchema);