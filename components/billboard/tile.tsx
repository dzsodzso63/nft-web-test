import React from "react";
import styled from "styled-components";
import { Colors } from "../colors";
import { TILE_SIZE } from "../consts";
import { getTestTileForDataUrl, TileData } from "../test-data";
import { useRouter } from 'next/router';
import { uploadImage } from "../../utils/image-upload";

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

  const refreshData = React.useCallback(() => {
    router.replace(router.asPath);
  }, [router]);

  const handleTileClick = React.useCallback(() => {
    uploadImage().then(async dataUrl => {
      const item = getTestTileForDataUrl(dataUrl, row, col);
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
    }).catch(e => {
      alert(e);
    });
  }, [row, col, refreshData]);

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
