import styled from "styled-components";
import { Colors } from "../colors";
import { BILLBOARD_ID, BILLBOARD_WIDTH, TILE_SIZE } from "../consts";
import { getTestTile, TileData } from "../test-data";
import { useRouter } from 'next/router';

interface TileProps {
  tile: TileData;
}

interface EmptyTileProps {
  row: number;
  col: number;
}

export function Tile(props: TileProps) {

  const { tile } = props;

  return <TileImg src={props.tile.base64Url ?? ""}/>;
}

export function EmptyTile(props: EmptyTileProps) {

  const { row, col } = props;

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  }

  async function handleTileClick() {
    const item = await getTestTile(row, col);
    console.log(item, row, col)
    await fetch('/api/putitem/', {
      method: 'PUT',
      mode: 'same-origin',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item }),
    });

    refreshData();
  }

  return <EmptyTileImg onClick={handleTileClick}/>;
}

const TileImg = styled.img`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  cursor: pointer;
`;

export const EmptyTileImg = styled.div`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  border: dashed 0.5px ${Colors.lightGray};
  box-sizing: border-box;
  background: ${Colors.darkGray};
  cursor: pointer;
`;
