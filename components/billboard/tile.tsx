import React from "react";
import styled from "styled-components";
import { Colors } from "../colors";
import { TILE_SIZE } from "../consts";
import { getTestTileForDataUrl, TileData } from "../test-data";
import { NextRouter, useRouter } from "next/router";
import { uploadImage } from "../../utils/image-upload";
import { useGetAuthenticatedSignature } from "../../utils/authenticate";

interface TileProps {
  tile: TileData;
  row: number;
  col: number;
  account: string | null;
  metamask: any | null;
}

interface EmptyTileProps {
  row: number;
  col: number;
  account: string | null;
  metamask: any | null;
}

const upload = (
  row: number,
  col: number,
  owner: string,
  signedMessage: string
) => {
  return uploadImage()
    .then(async (dataUrl) => {
      const item = getTestTileForDataUrl(dataUrl, row, col, owner);
      console.log(item, row, col);

      // itt akarunk https://www.blocksism.com/authentication-via-metamask-and-portis/ lekuldeni egy szignalt akarmit

      await fetch("/api/putitem/", {
        method: "PUT",
        mode: "same-origin",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "X-Authentication-Signed-Message": signedMessage,
        },
        body: JSON.stringify({ item }),
      });
    })
    .catch((e) => {
      alert(e);
    });
};

const refresh = (router: NextRouter) =>
  React.useCallback(() => {
    router.replace(router.asPath);
  }, [router]);

export function Tile(props: TileProps) {
  const { tile, account, row, col, metamask } = props;
  const getAuthenticatedSignature = useGetAuthenticatedSignature(metamask);

  const router = useRouter();
  const refreshData = refresh(router);

  const handleTileClick = React.useCallback(async () => {
    if (
      account != null &&
      (account === tile.owner || !tile.owner.startsWith("0x")) // todo hekk
    ) {
      const signedMessage = await getAuthenticatedSignature();
      upload(row, col, account, signedMessage).then(() => refreshData());
    }
  }, [row, col, refreshData, account]);

  return (
    <TileImg
      src={props.tile.base64Url ?? ""}
      onClick={handleTileClick}
      title={tile.owner}
    />
  );
}

export function EmptyTile(props: EmptyTileProps) {
  const { row, col, account, metamask } = props;
  const getAuthenticatedSignature = useGetAuthenticatedSignature(metamask);

  const router = useRouter();
  const refreshData = refresh(router);

  const handleTileClick = React.useCallback(async () => {
    if (account != null) {
      const signedMessage = await getAuthenticatedSignature();
      upload(row, col, account, signedMessage).then(() => refreshData());
    }
  }, [row, col, refreshData, account]);

  return (
    <EmptyTileImg onClick={handleTileClick} title={account ?? undefined} />
  );
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
