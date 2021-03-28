import { BILLBOARD_HEIGHT, BILLBOARD_WIDTH, TILE_SIZE } from "./consts";

export interface TileData {
  owner: string;
  url: string;
  base64Url: string | null;
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
          base64Url: null,
        }
      : null
  );
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
  const data = getTestBillboardData(BILLBOARD_WIDTH, BILLBOARD_HEIGHT, 0.001);
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
