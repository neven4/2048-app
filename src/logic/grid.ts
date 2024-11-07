import { pickRandomFromArray } from "../utils";
import { createEmptyTile, Tile, TileType } from "./tile";

export type Grid = Tile[][];

export type Position = {
  row: number;
  col: number;
};

export const initGrid = (size: number): Grid =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => createEmptyTile())
  );

export const cloneGrid = (grid: Grid): Grid =>
  grid.map((row) => row.map((tile) => ({ ...tile })));

export const setTile = (grid: Grid, position: Position, newTile: Tile) => {
  grid[position.row][position.col] = newTile;
};

export const getTile = (grid: Grid, position: Position): Tile =>
  grid[position.row][position.col];

const getGridEmptyPositions = (grid: Grid) => {
  const emptyPositions: Position[] = [];

  grid.forEach((rows, row) => {
    rows.forEach((tile, col) => {
      if (tile.type === TileType.Empty) emptyPositions.push({ row, col });
    });
  });

  return emptyPositions;
};

export const pickRandomEmptyPosition = (grid: Grid) => {
  const emptyPositions = getGridEmptyPositions(grid);

  return pickRandomFromArray(emptyPositions);
};

export const hasEmptyTile = (grid: Grid): boolean => {
  return grid.some((row) => row.some((tile) => tile.type === TileType.Empty));
};
