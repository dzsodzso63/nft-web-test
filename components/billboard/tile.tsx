import Image from "next/image";

import styled from "styled-components";
import { Colors } from "../colors";
import { TILE_SIZE } from "../consts";
import { TileData } from "../test-data";

interface TileProps {
  tile: TileData;
}

export function Tile(props: TileProps) {
  const { url } = props.tile;

  return <Image src={url} width={TILE_SIZE} height={TILE_SIZE} />;
}

export const EmptyTile = styled.div`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  border: dashed 0.5px ${Colors.lightGray};
  box-sizing: border-box;
  background: ${Colors.darkGray};
`;
