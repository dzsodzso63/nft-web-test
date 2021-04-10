import { createCanvas, loadImage } from "canvas";
import dataUriToBuffer from "data-uri-to-buffer";
import { TileSchema } from "../components/test-data";

function tileIndexToRowCol(index: number): { row: number; col: number } {
  const row = (index / 100) | 0;
  const col = index % 100;
  return { row, col };
}

export const assembleStitchedImage = async (
  items: TileSchema[]
): Promise<string> => {
  const canvas = createCanvas(1000, 1000);
  const ctx = canvas.getContext("2d");

  await Promise.all(
    items.map(async (tile) => {
      const image = await loadImage(dataUriToBuffer(tile.DataURI.S));

      const { row, col } = tileIndexToRowCol(tile.TileIndex.N);

      ctx.drawImage(image, col * 10, row * 10, 10, 10);
    })
  );

  return canvas.toDataURL();
};
