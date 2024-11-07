import { useState } from "react";
import { type Direction, handleMove, initGameGrid } from "../logic/game";
import { GameState } from "../logic/game";
import { Grid } from "../logic/grid";

export function useGame() {
  const [grid, setGrid] = useState<Grid | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.Ongoing);

  const startNewGame = ({
    gridSize,
    obstacles,
  }: {
    gridSize: number;
    obstacles: number;
  }) => {
    setGrid(initGameGrid(gridSize, obstacles));
    setGameState(GameState.Ongoing);
  };

  const moveTiles = (direction: Direction) => {
    if (!grid) return;

    const nextState = handleMove(grid, direction);

    if (!nextState) return;

    const { grid: newGrid, gameState: newGameState } = nextState;

    setGrid(newGrid);
    setGameState(newGameState);
  };

  return { grid, gameState, startNewGame, moveTiles };
}
