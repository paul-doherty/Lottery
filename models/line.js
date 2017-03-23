/**
 * Line model
 */
'use strict';

let mongoose = require('mongoose');
let config = require('../config');
let Schema = mongoose.Schema;

let lineSchema = new Schema({
    entry: [Number],
}, {id: false});

/**
 * Create a new line with randomly generated values
 * @return {Line} A Line model
 */
lineSchema.statics.createLine = function createLine() {
    let line = new this({
        entry: [],
    });
    let lineNumberOfValues = config.lineNumberOfValues;
    for(let i=0; i<lineNumberOfValues; i++) {
        line.entry.push(generateLineValue());
    }

    line.save();
    return line;
};

/**
 * Add the result data to the line
 */
lineSchema.virtual(config.MODEL_LINE_RESULT).get(function() {
    // Get the sum of the line
    // Ignoring lint as operation on line instance
    // eslint-disable-next-line no-invalid-this
    let sum = this.entry.reduce((a, b) => a + b);
    if(sum === 2) {
        let result = 10;
        return result;
    }
    // Check if all the values are the same on a line
    // Ignoring lint as operation on line instance
    // eslint-disable-next-line no-invalid-this
    let areValuesSame = this.entry.reduce((a, b) => (a === b) ? a : NaN);
    if (!isNaN(areValuesSame)) {
        let result = 5;
        return result;
    }
    // Check if first value is not equal to any other value
    // Ignoring lint as operation on line instance
    // eslint-disable-next-line no-invalid-this
    let areValuesNotEqualFirst = this.entry.reduce((a, b) => (a != b)? a : NaN);
    if(!isNaN(areValuesNotEqualFirst)) {
        let result = 1;
        return result;
    }
    // default result
    let result = 0;
    return result;
});

/**
 * Generates one value for a line entry
 * @return {number} A random number within the expected range
 */
function generateLineValue() {
    return Math.floor(Math.random() *
                     (config.lineMaximumValue - config.lineMinimumValue + 1))
                     + config.lineMinimumValue;
}

module.exports = mongoose.model(config.MODEL_LINE, lineSchema);
