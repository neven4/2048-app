import { useState, Fragment, useEffect } from "react";
import styles from "./app.module.css";
import { Tile } from "./components/Tile";
import { useGame } from "./hooks/useGame";
import { useKeyboardSwiper } from "./hooks/useKeyboardSwiper";
import { Grid } from "./components/Grid";
import { Settings } from "./components/Settings";

function App() {
  const [gridSize, setGridSize] = useState(6);
  const [numObstacles, setNumObstacles] = useState(2);

  const { grid, gameState, startNewGame, moveTiles } = useGame();

  useKeyboardSwiper(moveTiles);

  const startGame = () => {
    startNewGame({ gridSize, obstacles: numObstacles });
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div>
      <h1 className={styles.title}>2048 Game</h1>

      <Settings
        startGame={startGame}
        gridSize={gridSize}
        setGridSize={setGridSize}
        numObstacles={numObstacles}
        setNumObstacles={setNumObstacles}
      />

      {gameState === "lose" && (
        <p className={styles.endGameMessage}>Game Over!</p>
      )}
      {gameState === "win" && <p className={styles.endGameMessage}>You win!</p>}

      {grid && (
        <Grid size={grid.length}>
          {grid.map((rows, row) => (
            <Fragment key={`row-${row}`}>
              {rows.map((tile) => (
                <Tile key={tile.id} value={tile.value} type={tile.type} />
              ))}
            </Fragment>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default App;
