import styles from "./grid.module.css";
import { ReactNode } from "react";

type Props = {
  size: number;
  children: ReactNode;
};

export const Grid = ({ size, children }: Props) => {
  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${size}, 100px)`,
        gridTemplateRows: `repeat(${size}, 100px)`,
      }}
    >
      {children}
    </div>
  );
};
