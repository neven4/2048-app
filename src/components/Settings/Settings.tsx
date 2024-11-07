import styles from "./settings.module.css";

type Props = {
  setGridSize: (newValue: number) => void;
  setNumObstacles: (newValue: number) => void;
  startGame: () => void;
  gridSize: number;
  numObstacles: number;
};

export const Settings = ({
  setGridSize,
  gridSize,
  setNumObstacles,
  numObstacles,
  startGame,
}: Props) => {
  return (
    <div className={styles.settings}>
      <label>
        Grid Size:
        <input
          className={styles.input}
          type="number"
          min="2"
          max="10"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
        />
      </label>

      <label>
        Number of Obstacles:
        <input
          className={styles.input}
          type="number"
          min="0"
          value={numObstacles}
          onChange={(e) => setNumObstacles(Number(e.target.value))}
        />
      </label>
      <button className={styles.button} onClick={startGame}>
        Start New Game
      </button>
    </div>
  );
};
