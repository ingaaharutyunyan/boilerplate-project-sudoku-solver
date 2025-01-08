const { validateBoolOption } = require("@babel/preset-env/lib/normalize-options");

class SudokuSolver {
    validate(input) {
        // Validate input length (must be 81 characters)
          if (input.length !== 81) {
            return ('Expected puzzle to be 81 characters long');
          }

          // Validate puzzle characters
          if (!/^[1-9.]+$/.test(input)) {
             return ('Invalid characters in puzzle' );
          }

        // Convert the input string into a 2D array
        const grid = [];
        for (let i = 0; i < 9; i++) {
            grid.push(input.slice(i * 9, i * 9 + 9).split('').map(char => (char === '.' ? 0 : parseInt(char, 10))));
        }
        return grid;
    }

    // Helper function to check if a number is valid in the current position
    isValid(grid, row, col, num, res) {
        // Validate that the puzzle contains only valid characters
        
        // Check rows, columns, and regions
        for (let i = 0; i < 9; i++) {
            if (
                grid[row][i] === num || // Check row
                grid[i][col] === num || // Check column
                grid[Math.floor(row / 3) * 3 + Math.floor(i / 3)][Math.floor(col / 3) * 3 + (i % 3)] === num // Check region
            ) {
                return false; // Trigger backtracking
            }
        }

        return true; // No conflicts found
    }


    // Recursive backtracking function to solve the Sudoku
    solve(grid) {
        

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (this.solve(grid)) return true;
                            grid[row][col] = 0;
                        }
                    }
                    return false; // Trigger backtracking
                }
            }
        }
        return true; // Solved
    }

    solveSudoku(puzzleString) {
        
        const grid = this.validate(puzzleString);
        if (!this.solve(grid)) {
            throw new Error( 'Puzzle cannot be solved' );
        }

        return grid.flat().join('');
    }

    returnthis(puzzleString){
        return "Puzzle cannot be solved";
    }

    checkRowPlacement(puzzleString, row, column, value) {
        if (!this.validate(puzzleString)) {
            throw new Error("Invalid Sudoku puzzle");
        }
        if (!/^[1-9]$/.test(value)) {
            return false;
        }
        const grid = this.validate(puzzleString);
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === parseInt(value, 10)) return false;
        }
        return true;
    }

    checkColPlacement(puzzleString, row, column, value) {
        if (!this.validate(puzzleString)) {
            throw new Error("Invalid Sudoku puzzle");
        }
        if (!/^[1-9]$/.test(value)) {
            return false;
        }
        const grid = this.validate(puzzleString);
        for (let r = 0; r < 9; r++) {
            if (grid[r][column] === parseInt(value, 10)) return false;
        }
        return true;
    }

    checkRegionPlacement(puzzleString, row, column, value) {
        if (!this.validate(puzzleString)) {
            throw new Error("Invalid Sudoku puzzle");
        }
        if (!/^[1-9]$/.test(value)) {
            return false;
        }
        const grid = this.validate(puzzleString);
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(column / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[startRow + i][startCol + j] === parseInt(value, 10)) return false;
            }
        }
        return true;
    }
}

module.exports = SudokuSolver;
