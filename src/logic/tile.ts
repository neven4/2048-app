import { v4 as uuid } from "uuid";

export enum TileType {
  Obstacle = "obstacle",
  Empty = "empty",
  Number = "number",
}

export type Tile = {
  id: string;
  type: TileType;
  value: number;
};

const createTile = (type: TileType, value: number): Tile => ({
  id: uuid(),
  value,
  type,
});

export const createEmptyTile = (): Tile => createTile(TileType.Empty, 0);

export const createObstacleTile = (): Tile => createTile(TileType.Obstacle, -1);

export const createNumberTile = (value: number = 2): Tile =>
  createTile(TileType.Number, value);

export const setTileValue = (tile: Tile, value: number): Tile => ({
  ...tile,
  value,
});
