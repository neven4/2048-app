import styles from "./tile.module.css";
import { TileType } from "../../logic/tile";

type Props = {
  value: number;
  type: TileType;
};

export const Tile = ({ value, type }: Props) => {
  const styleByTileType = {
    [TileType.Empty]: styles.empty,
    [TileType.Obstacle]: styles.obstacle,
    [TileType.Number]: styles[`value-${value}`],
  };

  return (
    <div className={`${styles.tile} ${styleByTileType[type]}`}>
      {value > 0 ? value : ""}
    </div>
  );
};