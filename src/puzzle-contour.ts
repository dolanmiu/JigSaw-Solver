import { Point2, Vec2 } from "@u4/opencv4nodejs";
import { splitToNChunks } from "./util";

type SnakeCache = { chain: Point2[]; direction: Vec2 };

let snakeTailCache: SnakeCache = {
  chain: [],
  direction: new Vec2(0, 0),
};
export let snakeHeadCache: SnakeCache = {
  chain: [],
  direction: new Vec2(0, 0),
};

export const splitPuzzleContourToFour = (contour: Point2[]) => {
  const windowSize = Math.floor(contour.length * 0.2);
  snakeTailCache = createTailCache(contour, windowSize, 0);
  console.log(snakeTailCache);
  const output = splitToNChunks(contour, 4);
  return output;
};

const getWrappedPointFromContour = (contour: Point2[], index: number) => {
  const wrappedIndex =
    ((index % contour.length) + contour.length) % contour.length;
  return contour[wrappedIndex];
};

const createTailCache = (
  contour: Point2[],
  windowSize: number,
  index: number
) => {
  const cache: SnakeCache = {
    chain: [],
    direction: new Vec2(0, 0),
  };

  for (let i = 0; i < windowSize; i++) {
    const previousPoint = getWrappedPointFromContour(contour, index - i + 1);
    const point = getWrappedPointFromContour(contour, index - i);
    const direction = normalizeVector(point.sub(previousPoint));
    cache.chain.push(point);
    cache.direction = normalizeVector(cache.direction.add(direction) as Vec2);
  }

  return cache;
};

const normalizeVector = (vector: { x: number; y: number }): Vec2 => {
  const length = Math.sqrt(vector.x ** 2 + vector.y ** 2);
  return new Vec2(vector.x / length, vector.y / length);
};
