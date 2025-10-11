import { create } from 'zustand';

export type CowType = {
  id: string;
  color: number;
  row: number;
  col: number;
};

export type GameState = {
  board: number[][];
  score: number;
  moves: number;
  gameOver: boolean;
  selectedCell: { row: number; col: number } | null;
  isAnimating: boolean;
  
  // Actions
  setBoard: (board: number[][]) => void;
  incrementScore: (points: number) => void;
  incrementMoves: () => void;
  setGameOver: (gameOver: boolean) => void;
  setSelectedCell: (cell: { row: number; col: number } | null) => void;
  setIsAnimating: (isAnimating: boolean) => void;
  resetGame: () => void;
};

const BOARD_SIZE = 8;
const NUM_COLORS = 5;

// Generate initial board without matches
const generateInitialBoard = (): number[][] => {
  const board: number[][] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      let color;
      do {
        color = Math.floor(Math.random() * NUM_COLORS);
      } while (
        (col >= 2 && board[row][col - 1] === color && board[row][col - 2] === color) ||
        (row >= 2 && board[row - 1][col] === color && board[row - 2][col] === color)
      );
      board[row][col] = color;
    }
  }
  
  return board;
};

export const useGameStore = create<GameState>((set) => ({
  board: generateInitialBoard(),
  score: 0,
  moves: 0,
  gameOver: false,
  selectedCell: null,
  isAnimating: false,

  setBoard: (board) => set({ board }),
  incrementScore: (points) => set((state) => ({ score: state.score + points })),
  incrementMoves: () => set((state) => ({ moves: state.moves + 1 })),
  setGameOver: (gameOver) => set({ gameOver }),
  setSelectedCell: (cell) => set({ selectedCell: cell }),
  setIsAnimating: (isAnimating) => set({ isAnimating }),
  
  resetGame: () =>
    set({
      board: generateInitialBoard(),
      score: 0,
      moves: 0,
      gameOver: false,
      selectedCell: null,
      isAnimating: false,
    }),
}));