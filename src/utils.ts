export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

export function pickRandomFromArray<T>(array: Array<T>): T {
  return array[getRandomInt(0, array.length)];
}