import styled from "styled-components";
import { Colors } from "../colors";
import { TILE_SIZE } from "../consts";

export function Tile(props) {
  const { url } = props

  return <TileImg src={url} />;
}

const TileImg = styled.img`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
`

export const EmptyTile = styled.div`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  border: dashed 0.5px ${Colors.lightGray};
  box-sizing: border-box;
  background: ${Colors.darkGray};
`