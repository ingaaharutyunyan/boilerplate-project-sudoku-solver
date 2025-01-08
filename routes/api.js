'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check')
  .post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // Validate required fields
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    // Validate puzzle length
    if (puzzle.length !== 81) {
      return res.json({ error: 'Expected puzzle to be 81 characters long' });
    }

    // Validate puzzle characters
    if (!/^[1-9.]+$/.test(puzzle)) {
      return res.json({ error: 'Invalid characters in puzzle' });
    }

    // Validate coordinate format
    if (!/^[a-i][1-9]$/i.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    // Validate value
    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    const row = coordinate[0].toUpperCase().charCodeAt(0) - 65;
    const col = parseInt(coordinate[1], 10) - 1;

    // Check if the value matches the current value in the puzzle
    const currentValue = puzzle[row * 9 + col];
    if (currentValue === value) {
      return res.json({ valid: true });
    }

    // Convert the puzzle string to a 2D grid
    const grid = solver.validate(puzzle);

    // Validate placement
    const conflicts = [];
    if (!solver.checkRowPlacement(puzzle, row, col, value)) conflicts.push('row');
    if (!solver.checkColPlacement(puzzle, row, col, value)) conflicts.push('column');
    if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflicts.push('region');

    if (conflicts.length > 0) {
      return res.json({ valid: false, conflict: conflicts });
    }

    return res.json({ valid: true });
  });

  app.route('/api/solve')
  .post((req, res) => {
    const { puzzle } = req.body;

    // Validate required field
    if (!puzzle) { // This will catch both undefined and empty strings
      return res.json({ error: 'Required field missing' });
    }

    // Validate puzzle length
    if (puzzle.length !== 81) {
      return res.json({ error: 'Expected puzzle to be 81 characters long' });
    }

    // Validate puzzle characters
    if (!/^[1-9.]+$/.test(puzzle)) {
      return res.json({ error: 'Invalid characters in puzzle' });
    }

    // Solve the puzzle
    try {
      const solution = solver.solveSudoku(puzzle);
      return res.json({ solution });
    } catch (e) {
      return res.json({ error: 'Puzzle cannot be solved' });
    }
  });

};
