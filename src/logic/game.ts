// gameLogic.ts

import {
  cloneGrid,
  getTile,
  Grid,
  hasEmptyTile,
  initGrid,
  pickRandomEmptyPosition,
  Position,
  setTile,
} from "./grid";
import {
  createEmptyTile,
  createNumberTile,
  createObstacleTile,
  setTileValue,
  TileType,
} from "./tile";

export type Direction = "left" | "right" | "up" | "down";
export enum GameState {
  Ongoing = "ongoing",
  Win = "win",
  Lose = "lose",
}

const TARGET_TILE = 2048;

const getNextPosition = (
  row: number,
  col: number,
  direction: Direction
): { row: number; col: number } => {
  switch (direction) {
    case "left":
      return { row, col: col - 1 }; // Move left to find previous
    case "right":
      return { row, col: col + 1 }; // Move right to find previous
    case "down":
      return { row: row + 1, col }; // Move down to find previous
    case "up":
      return { row: row - 1, col }; // Move up to find previous
    default:
      throw new Error("Invalid direction");
  }
};

const isWithinBounds = (pos: Position, size: number): boolean => {
  return pos.row >= 0 && pos.row < size && pos.col >= 0 && pos.col < size;
};

const findClosestTileToMoveTo = (
  grid: Grid,
  direction: Direction,
  { row, col }: Position,
  lastMergedPos: Position | null
) => {
  const currentTitle = grid[row][col];
  let tileToMoveTo: Position = { row, col };
  const size = grid.length;

  while (isWithinBounds(tileToMoveTo, size)) {
    const nextPosition = getNextPosition(
      tileToMoveTo.row,
      tileToMoveTo.col,
      direction
    );

    if (!isWithinBounds(nextPosition, size)) break;

    const nextTile = grid[nextPosition.row][nextPosition.col];

    if (nextTile.type === TileType.Obstacle) break;

    if (nextTile.type === TileType.Empty) {
      tileToMoveTo = nextPosition;
    } else {
      if (
        nextTile.value !== currentTitle.value ||
        (nextPosition.col === lastMergedPos?.col &&
          nextPosition.row === lastMergedPos?.row)
      ) {
        break;
      }

      tileToMoveTo = nextPosition;
    }
  }

  return tileToMoveTo;
};

const getTraversalOrder = (
  direction: Direction,
  row: number,
  col: number,
  size: number
): Position => {
  switch (direction) {
    case "left":
      return { row, col };
    case "right":
      return { row, col: size - 1 - col };
    case "up":
      return { row: col, col: row };
    case "down":
      return { row: size - 1 - col, col: row };
    default:
      throw new Error("Invalid direction");
  }
};

const canMergeTiles = (
  grid: Grid,
  currentPosition: Position,
  nextPosition: Position,
  lastMergedPos: Position | null
) => {
  const currentTile = getTile(grid, currentPosition);
  const nextTile = getTile(grid, nextPosition);

  const isThisLastMergedTile = lastMergedPos
    ? nextPosition.col === lastMergedPos.col &&
      nextPosition.row === lastMergedPos.row
    : false;

  return nextTile.value === currentTile.value && !isThisLastMergedTile;
};

// Function to move tiles in a specified direction and merge them
const moveTiles = (grid: Grid, direction: Direction) => {
  const size = grid.length;
  let isMoved = false;

  for (let r = 0; r < size; r++) {
    let lastMergedPos: Position | null = null;

    for (let c = 0; c < size; c++) {
      const currentPos = getTraversalOrder(direction, r, c, size);
      const currentTile = getTile(grid, currentPos);

      if (
        currentTile.type === TileType.Empty ||
        currentTile.type === TileType.Obstacle
      ) {
        continue;
      }

      const nextPos = findClosestTileToMoveTo(
        grid,
        direction,
        currentPos,
        lastMergedPos
      );
      const nextTile = getTile(grid, nextPos);

      // if next tile is the same, skip
      if (currentTile.id === nextTile.id) continue;

      // merge with existing tile
      if (canMergeTiles(grid, currentPos, nextPos, lastMergedPos)) {
        setTile(
          grid,
          nextPos,
          setTileValue(currentTile, currentTile.value * 2)
        );
        setTile(grid, currentPos, createEmptyTile());
        lastMergedPos = nextPos;
        isMoved = true;

        // move to empty tile
      } else {
        setTile(grid, nextPos, currentTile);
        setTile(grid, currentPos, createEmptyTile());
        isMoved = true;
      }
    }
  }

  return { isMoved };
};

const setNewNumberTile = (grid: Grid) => {
  const emptyPosition = pickRandomEmptyPosition(grid);

  setTile(grid, emptyPosition, createNumberTile());
};

const setNewObstacleTile = (grid: Grid) => {
  const emptyPosition = pickRandomEmptyPosition(grid);

  setTile(grid, emptyPosition, createObstacleTile());
};

const placeObstacles = (grid: Grid, numObstacles: number) => {
  let obstaclesPlaced = 0;

  while (obstaclesPlaced < numObstacles) {
    setNewObstacleTile(grid);
    obstaclesPlaced++;
  }
};

const hasValidMoves = (grid: Grid): boolean => {
  const size = grid.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const currentTile = getTile(grid, { row, col });

      // Skip obstacles and empty tiles
      if (
        currentTile.type === TileType.Obstacle ||
        currentTile.type === TileType.Empty
      ) {
        continue;
      }

      // Define positions for neighboring tiles
      const neighbors = [
        { row: row - 1, col }, // Up
        { row: row + 1, col }, // Down
        { row, col: col - 1 }, // Left
        { row, col: col + 1 }, // Right
      ];

      for (const pos of neighbors) {
        if (isWithinBounds(pos, size)) {
          const neighborTile = getTile(grid, pos);
          // If neighboring tile has the same value, there's a valid move
          if (
            neighborTile.type === TileType.Empty ||
            neighborTile.value === currentTile.value
          ) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

const isGameWon = (grid: Grid): boolean => {
  return grid.some((row) => row.some((tile) => tile.value === TARGET_TILE));
};

// Handle move and return updated grid and game-over status
const handleMove = (
  oldGrid: Grid,
  direction: Direction
): { grid: Grid; gameState: GameState } | undefined => {
  const grid = cloneGrid(oldGrid);

  const { isMoved } = moveTiles(grid, direction);

  if (!isMoved) return;

  const gameWon = isGameWon(grid);

  if (gameWon) {
    return {
      grid,
      gameState: GameState.Win,
    };
  }

  if (hasEmptyTile(grid)) {
    setNewNumberTile(grid);
  }

  const movesAvailable = hasValidMoves(grid);

  if (!movesAvailable) {
    return { grid, gameState: GameState.Lose };
  }

  return { grid, gameState: GameState.Ongoing };
};

// Initialize a grid with the specified size and number of obstacles
const initGameGrid = (size: number, numObstacles: number): Grid => {
  const grid = initGrid(size);

  placeObstacles(grid, numObstacles);

  setNewNumberTile(grid);

  return grid;
};

export { initGameGrid, handleMove };
