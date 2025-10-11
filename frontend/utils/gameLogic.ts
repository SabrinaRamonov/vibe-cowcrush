const BOARD_SIZE = 8;
const NUM_COLORS = 5;

export const checkForMatches = (board: number[][]): { row: number; col: number }[] => {
  const matches: { row: number; col: number }[] = [];
  const matchSet = new Set<string>();

  // Check horizontal matches
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE - 2; col++) {
      const color = board[row][col];
      if (color === -1) continue;

      let matchLength = 1;
      while (
        col + matchLength < BOARD_SIZE &&
        board[row][col + matchLength] === color
      ) {
        matchLength++;
      }

      if (matchLength >= 3) {
        for (let i = 0; i < matchLength; i++) {
          matchSet.add(`${row}-${col + i}`);
        }
      }
    }
  }

  // Check vertical matches
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row < BOARD_SIZE - 2; row++) {
      const color = board[row][col];
      if (color === -1) continue;

      let matchLength = 1;
      while (
        row + matchLength < BOARD_SIZE &&
        board[row + matchLength][col] === color
      ) {
        matchLength++;
      }

      if (matchLength >= 3) {
        for (let i = 0; i < matchLength; i++) {
          matchSet.add(`${row + i}-${col}`);
        }
      }
    }
  }

  // Convert set to array
  matchSet.forEach((key) => {
    const [row, col] = key.split('-').map(Number);
    matches.push({ row, col });
  });

  return matches;
};

export const applyGravity = (board: number[][]): number[][] => {
  const newBoard = board.map((row) => [...row]);

  // Move existing cows down
  for (let col = 0; col < BOARD_SIZE; col++) {
    let emptyRow = BOARD_SIZE - 1;

    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      if (newBoard[row][col] !== -1) {
        if (row !== emptyRow) {
          newBoard[emptyRow][col] = newBoard[row][col];
          newBoard[row][col] = -1;
        }
        emptyRow--;
      }
    }
  }

  // Fill empty spaces with new random cows
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (newBoard[row][col] === -1) {
        newBoard[row][col] = Math.floor(Math.random() * NUM_COLORS);
      }
    }
  }

  return newBoard;
};

export const hasValidMoves = (board: number[][]): boolean => {
  // Check all possible swaps
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      // Try swapping right
      if (col < BOARD_SIZE - 1) {
        const testBoard = board.map((r) => [...r]);
        const temp = testBoard[row][col];
        testBoard[row][col] = testBoard[row][col + 1];
        testBoard[row][col + 1] = temp;

        if (checkForMatches(testBoard).length > 0) {
          return true;
        }
      }

      // Try swapping down
      if (row < BOARD_SIZE - 1) {
        const testBoard = board.map((r) => [...r]);
        const temp = testBoard[row][col];
        testBoard[row][col] = testBoard[row + 1][col];
        testBoard[row + 1][col] = temp;

        if (checkForMatches(testBoard).length > 0) {
          return true;
        }
      }
    }
  }

  return false;
};
