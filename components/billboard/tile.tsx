import React from "react";
import styled from "styled-components";
import { Colors } from "../colors";
import { TILE_SIZE } from "../consts";
import { getTestTileForDataUrl, TileData } from "../test-data";
import { NextRouter, useRouter } from 'next/router';
import { uploadImage } from "../../utils/image-upload";

interface TileProps {
  tile: TileData;
  row: number;
  col: number;
  account?: string;
}

interface EmptyTileProps {
  row: number;
  col: number;
  owner?: string;
}

const upload = (row: number, col: number, owner?: string) => {
  return uploadImage().then(async dataUrl => {
    const item = getTestTileForDataUrl(dataUrl, row, col, owner);
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
  }).catch(e => {
    alert(e);
  });
};

const refresh = (router: NextRouter) => React.useCallback(() => {
  router.replace(router.asPath);
}, [router]);

export function Tile(props: TileProps) {

  const { tile, account, row, col } = props;

  const router = useRouter();
  const refreshData = refresh(router);

  const handleTileClick = React.useCallback(() => {
    if (account === tile.owner || !tile.owner.startsWith('0x')) {
      upload(row, col, account).then(() => refreshData());
    }
  }, [row, col, refreshData]);

  return <TileImg src={props.tile.base64Url ?? ""} onClick={handleTileClick} title={tile.owner}/>;
}

export function EmptyTile(props: EmptyTileProps) {

  const { row, col, owner } = props;

  const router = useRouter();
  const refreshData = refresh(router);

  const handleTileClick = React.useCallback(() => upload(row, col, owner).then(() => refreshData()), [row, col, refreshData]);

  return <EmptyTileImg onClick={handleTileClick} title={owner}/>;
}

const TileImg = styled.img`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  cursor: pointer;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  -ms-interpolation-mode: nearest-neighbor; 
`;

export const EmptyTileImg = styled.div`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  border: dashed 0.5px ${Colors.lightGray};
  box-sizing: border-box;
  background: ${Colors.darkGray};
  cursor: pointer;
`;
