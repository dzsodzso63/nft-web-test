import { queryAllItems } from "../utils/database";
import {
  BILLBOARD_HEIGHT,
  BILLBOARD_ID,
  BILLBOARD_WIDTH,
  TILE_SIZE,
} from "./consts";

export interface TileData {
  bilboardID: string;
  index: number;
  owner: string;
  url: string;
  base64Url: string | null;
}

export interface TileSchema {
  BilboardID: { S: string };
  TileIndex: { N: number };
  owner: { S: string };
  url: { S: string };
  DataURI: { S: string };
}

export type BillboardData = Array<Array<TileData | null>>;

export async function getTestBillboardData(
  width: number,
  height: number,
  fillRatio: number
): Promise<BillboardData> {
  return Array.from({ length: height }, (_, row) =>
    getTestTileRow(width, fillRatio, row)
  );
}

function getTestTileRow(width: number, fillRatio: number, row: number) {
  return Array.from({ length: width }, (_, col) =>
    Math.random() < fillRatio
      ? {
          bilboardID: BILLBOARD_ID,
          index: row * BILLBOARD_HEIGHT + col,
          owner: randomString(),
          url: `https://picsum.photos/seed/${randomString()}/${TILE_SIZE}/${TILE_SIZE}`,
          base64Url: null,
        }
      : null
  );
}

export async function getTestTile(row: number, col: number) {
  const url = `https://picsum.photos/seed/${randomString()}/${TILE_SIZE}/${TILE_SIZE}`;
  return {
    BilboardID: BILLBOARD_ID,
    TileIndex: row * BILLBOARD_HEIGHT + col,
    owner: randomString(),
    url,
    DataURI: await createBase64UrlForUrl(url),
  };
}

export interface TileForServer {
  BilboardID: string;
  TileIndex: number;
  owner: string;
  url: string;
  DataURI: string;
}

export function getTestTileForDataUrl(
  dataUrl: string,
  row: number,
  col: number,
  owner: string
): TileForServer {
  return {
    BilboardID: BILLBOARD_ID,
    TileIndex: row * BILLBOARD_HEIGHT + col,
    owner: owner,
    url: "http://lofasz.hu",
    DataURI: dataUrl,
  };
}

function randomString() {
  return Math.random().toString(36).substring(7);
}

async function createBase64UrlForUrl(src: string): Promise<string | null> {
  try {
    const response = await fetch(src);
    if (response.status == 200) {
      const base64string =
        "data:" +
        response.headers.get("content-type") +
        ";base64," +
        Buffer.from(await response.arrayBuffer()).toString("base64");
      return base64string;
    } else {
      return null;
    }
  } catch (e) {
    console.error("error!!!!", e);
    throw e;
  }
}

export async function getTestBillboardDataUrls(): Promise<BillboardData> {
  const data = await getTestBillboardData(
    BILLBOARD_WIDTH,
    BILLBOARD_HEIGHT,
    0.001
  );
  const dataWithBase64Urls = Promise.all(
    data.map(async (rows) =>
      Promise.all(
        rows.map(async (tile) => {
          if (tile == null) {
            return null;
          } else {
            return {
              ...tile,
              base64Url: await createBase64UrlForUrl(tile.url),
            };
          }
        })
      )
    )
  );
  return dataWithBase64Urls;
}
