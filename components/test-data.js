import { TILE_SIZE } from "./consts";

export function getTestBillboardData(width, height, fillRatio) {
  return Array.from({ length: height }, () => getTestTileRow(width, fillRatio))
}

function getTestTileRow(width, fillRatio) {
  return Array.from({ length: width }, () => (Math.random() < fillRatio ? {
    owner: randomString(),
    url: `https://picsum.photos/seed/${randomString()}/${TILE_SIZE}/${TILE_SIZE}`,
  }: null))
}

function randomString() {
  return Math.random().toString(36).substring(7)
}