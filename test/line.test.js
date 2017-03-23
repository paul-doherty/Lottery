/**
 * Test the Line model directly
 */
let config = require('../config');
let Line = require('../models/line');
let expect = require('chai').expect;

describe('Create a Line model', function() {
    let currentLine = null;
    it('Creation succeeds', function() {
        currentLine = Line.createLine();
        expect(currentLine).to.not.be.null;
    });
    describe('Line object passes sanity check', function() {
        it('Correct number of values', function() {
            currentLine = Line.createLine();
            expect(currentLine.entry.length)
                .to.be.equal(config.lineNumberOfValues);
        });
        it('All values 0 result 5', function() {
            currentLine.entry = [0, 0, 0];
            expect(currentLine.result).to.be.equal(5);
        });
        it('All values 1 result 5', function() {
            currentLine.entry = [1, 1, 1];
            expect(currentLine.result).to.be.equal(5);
        });
        it('All values 2 result 5', function() {
            currentLine.entry = [2, 2, 2];
            expect(currentLine.result).to.be.equal(5);
        });
        it('Sum of values is 2 [0,1,1] result 10', function() {
            currentLine.entry = [0, 1, 1];
            expect(currentLine.result).to.be.equal(10);
        });
        it('Sum of values is 2 [1,0,1] result 10', function() {
            currentLine.entry = [1, 0, 1];
            expect(currentLine.result).to.be.equal(10);
        });
        it('Sum of values is 2 [1,1,0] result 10', function() {
            currentLine.entry = [1, 1, 0];
            expect(currentLine.result).to.be.equal(10);
        });
        it('Sum of values is 2 [2,0,0] result 10', function() {
            currentLine.entry = [2, 0, 0];
            expect(currentLine.result).to.be.equal(10);
        });
        it('Sum of values is 2 [0,2,0] result 10', function() {
            currentLine.entry = [0, 2, 0];
            expect(currentLine.result).to.be.equal(10);
        });
        it('Sum of values is 2 [0,0,2] result 10', function() {
            currentLine.entry = [0, 0, 2];
            expect(currentLine.result).to.be.equal(10);
        });
        it('2nd and 3rd different from first [0,1,2] result 1', function() {
            currentLine.entry = [0, 1, 2];
            expect(currentLine.result).to.be.equal(1);
        });
        it('2nd and 3rd different from first [0,2,1] result 1', function() {
            currentLine.entry = [0, 2, 1];
            expect(currentLine.result).to.be.equal(1);
        });
        it('2nd and 3rd different from first [0,2,2] result 1', function() {
            currentLine.entry = [0, 2, 2];
            expect(currentLine.result).to.be.equal(1);
        });
        it('2nd and 3rd different from first [1,0,2] result 1', function() {
            currentLine.entry = [1, 0, 2];
            expect(currentLine.result).to.be.equal(1);
        });
        it('2nd and 3rd different from first [1,2,0] result 1', function() {
            currentLine.entry = [1, 2, 0];
            expect(currentLine.result).to.be.equal(1);
        });
        it('2nd and 3rd different from first [1,2,2] result 1', function() {
            currentLine.entry = [1, 2, 2];
            expect(currentLine.result).to.be.equal(1);
        });
        it('2nd and 3rd different from first [2,0,1] result 1', function() {
            currentLine.entry = [2, 0, 1];
            expect(currentLine.result).to.be.equal(1);
        });
        it('2nd and 3rd different from first [2,1,0] result 1', function() {
            currentLine.entry = [2, 1, 0];
            expect(currentLine.result).to.be.equal(1);
        });
        it('2nd and 3rd different from first [2,1,1] result 1', function() {
            currentLine.entry = [2, 1, 1];
            expect(currentLine.result).to.be.equal(1);
        });
        it('Default [0,0,1] result 0', function() {
            currentLine.entry = [0, 0, 1];
            expect(currentLine.result).to.be.equal(0);
        });
        it('Default [0,1,0] result 0', function() {
            currentLine.entry = [0, 1, 0];
            expect(currentLine.result).to.be.equal(0);
        });
        it('Default [1,1,2] result 0', function() {
            currentLine.entry = [1, 1, 2];
            expect(currentLine.result).to.be.equal(0);
        });
        it('Default [1,2,1] result 0', function() {
            currentLine.entry = [1, 2, 1];
            expect(currentLine.result).to.be.equal(0);
        });
        it('Default [2,0,2] result 0', function() {
            currentLine.entry = [2, 0, 2];
            expect(currentLine.result).to.be.equal(0);
        });
        it('Default [2,2,0] result 0', function() {
            currentLine.entry = [2, 2, 0];
            expect(currentLine.result).to.be.equal(0);
        });
    });
});

after(function() {
});
