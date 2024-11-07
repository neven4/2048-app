import { useCallback, useEffect } from "react";
import { Direction } from "../logic/game";

const keyDirectionMap: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

export function useKeyboardSwiper(moveTiles: (direction: Direction) => void) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const direction = keyDirectionMap[e.code];

      if (direction) {
        e.preventDefault(); // Prevents scrolling for arrow keys

        moveTiles(direction);
      }
    },
    [moveTiles]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
