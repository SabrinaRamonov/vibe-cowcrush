import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useGameStore } from '../store/gameStore';
import CowCell from './CowCell';
import UFOAbduction from './UFOAbduction';
import { checkForMatches, applyGravity, hasValidMoves } from '../utils/gameLogic';

const { width } = Dimensions.get('window');
const BOARD_SIZE = 8;
const CELL_SIZE = Math.min((width - 40) / BOARD_SIZE, 50);

const GameBoard: React.FC = () => {
  const {
    board,
    selectedCell,
    isAnimating,
    setBoard,
    setSelectedCell,
    setIsAnimating,
    incrementScore,
    incrementMoves,
    setGameOver,
  } = useGameStore();

  const boardRef = useRef(board);
  const abductingCells = useRef<{ row: number; col: number }[]>([]);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  const handleCellPress = (row: number, col: number) => {
    if (isAnimating) return;

    if (!selectedCell) {
      setSelectedCell({ row, col });
    } else {
      const { row: sRow, col: sCol } = selectedCell;
      const isAdjacent =
        (Math.abs(row - sRow) === 1 && col === sCol) ||
        (Math.abs(col - sCol) === 1 && row === sRow);

      if (isAdjacent) {
        performSwap(sRow, sCol, row, col);
      } else {
        setSelectedCell({ row, col });
      }
    }
  };

  const performSwap = async (row1: number, col1: number, row2: number, col2: number) => {
    setIsAnimating(true);
    const newBoard = board.map((row) => [...row]);
    
    // Swap with smooth animation
    const temp = newBoard[row1][col1];
    newBoard[row1][col1] = newBoard[row2][col2];
    newBoard[row2][col2] = temp;

    setBoard(newBoard);
    // Wait for swap animation to complete
    await new Promise((resolve) => setTimeout(resolve, 350));

    const matches = checkForMatches(newBoard);

    if (matches.length > 0) {
      incrementMoves();
      setSelectedCell(null);
      await processMatches(newBoard, matches);
    } else {
      // Swap back with bounce animation if no match
      const temp = newBoard[row1][col1];
      newBoard[row1][col1] = newBoard[row2][col2];
      newBoard[row2][col2] = temp;
      setBoard(newBoard);
      setSelectedCell(null);
      await new Promise((resolve) => setTimeout(resolve, 350));
      setIsAnimating(false);
    }
  };

  const processMatches = async (currentBoard: number[][], matches: { row: number; col: number }[]) => {
    // Store cells for UFO abduction animation
    abductingCells.current = matches;

    // Calculate score
    const points = matches.length * 10 + (matches.length > 3 ? (matches.length - 3) * 20 : 0);
    incrementScore(points);

    // Wait for UFO animation (UFO comes, beams, lifts cows)
    await new Promise((resolve) => setTimeout(resolve, 1600));

    // Remove matched cows
    const newBoard = currentBoard.map((row) => [...row]);
    matches.forEach(({ row, col }) => {
      newBoard[row][col] = -1;
    });

    setBoard(newBoard);
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Apply gravity and refill
    const filledBoard = applyGravity(newBoard);
    setBoard(filledBoard);
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Check for cascading matches
    const newMatches = checkForMatches(filledBoard);
    if (newMatches.length > 0) {
      await processMatches(filledBoard, newMatches);
    } else {
      // Check if game over
      if (!hasValidMoves(filledBoard)) {
        setGameOver(true);
      }
      setIsAnimating(false);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.boardContainer}>
        <View style={[styles.board, { width: CELL_SIZE * BOARD_SIZE, height: CELL_SIZE * BOARD_SIZE }]}>
          {board.map((row, rowIndex) =>
            row.map((color, colIndex) => (
              <CowCell
                key={`${rowIndex}-${colIndex}`}
                color={color}
                row={rowIndex}
                col={colIndex}
                size={CELL_SIZE}
                isSelected={
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                }
                onPress={() => handleCellPress(rowIndex, colIndex)}
              />
            ))
          )}
        </View>
        <UFOAbduction
          cells={abductingCells.current}
          cellSize={CELL_SIZE}
          boardSize={BOARD_SIZE}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardContainer: {
    position: 'relative',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#162447',
    borderRadius: 12,
    padding: 4,
    borderWidth: 3,
    borderColor: '#00ff88',
  },
});

export default GameBoard;