import { TILE_SIZE } from "./consts";

export interface TileData {
  owner: string;
  url: string;
}

export type BillboardData = Array<Array<TileData | null>>;

export function getTestBillboardData(
  width: number,
  height: number,
  fillRatio: number
): BillboardData {
  return Array.from({ length: height }, () => getTestTileRow(width, fillRatio));
}

function getTestTileRow(width: number, fillRatio: number) {
  return Array.from({ length: width }, () =>
    Math.random() < fillRatio
      ? {
          owner: randomString(),
          url: `https://picsum.photos/seed/${randomString()}/${TILE_SIZE}/${TILE_SIZE}`,
        }
      : null
  );
}

function randomString() {
  return Math.random().toString(36).substring(7);
}
