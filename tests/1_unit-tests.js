const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

let validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

suite('Unit Tests', () => {
  suite('Solve Tests', function() {

    test("Logic handles a valid puzzle string of 81 characters", function() {
      let complete = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
      assert.equal(solver.solveSudoku(validPuzzle), complete, 'Expected valid puzzle solution to match.');
    });

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function() {
      let str = '1357629849463812577284596136945178328a29367453.....19647329856oiu1673429269145378';
      assert.equal(solver.validate(str), "Invalid characters in puzzle");
    });

    test("Logic handles a puzzle string that is not 81 characters in length", function() {
      let str = '1357629849463812577284596136945178328129367';
      assert.equal( solver.validate(str), "Expected puzzle to be 81 characters long");
    });

    test("Logic handles a valid row placement", function() {
      assert.isTrue(solver.checkRowPlacement(validPuzzle, 0, 0, '7'), 'Expected valid row placement.');
    });

    test("Logic handles an invalid row placement", function() {
      assert.isFalse(solver.checkRowPlacement(validPuzzle, 0, 0, '1'), 'Expected invalid row placement.');
    });

    test("Logic handles a valid column placement", function() {
      assert.isTrue(solver.checkColPlacement(validPuzzle, 0, 0, '7'), 'Expected valid column placement.');
    });

    test("Logic handles an invalid column placement", function() {
      assert.isFalse(solver.checkColPlacement(validPuzzle, 0, 0, '1'), 'Expected invalid column placement.');
    });

    test("Logic handles a valid region (3x3 grid) placement", function() {
      assert.isTrue(solver.checkRegionPlacement(validPuzzle, 0, 0, '7'), 'Expected valid region placement.');
    });

    test("Logic handles an invalid region (3x3 grid) placement", function() {
      assert.isFalse(solver.checkRegionPlacement(validPuzzle, 0, 0, '1'), 'Expected invalid region placement.');
    });

    test("Valid puzzle strings pass the solver", function() {
      assert.equal(
        solver.solveSudoku(validPuzzle),
        '135762984946381257728459613694517832812936745357824196473298561581673429269145378',
        'Expected solver to solve valid puzzle.'
      );
    });

    test("Invalid puzzle strings fail the solver", function() {
      let str = 'x35799.84946381257728459613694517832812936745357824196473298888881673429269145378';

      let result = solver.returnthis(str);
      assert.equal(result, "Puzzle cannot be solved");
    });



    test("Solver returns the expected solution for an incomplete puzzle", function() {
      let str = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      assert.equal(
        solver.solveSudoku(str),
        '135762984946381257728459613694517832812936745357824196473298561581673429269145378',
        'Expected solver to return correct solution.'
      );
    });
  });
});
