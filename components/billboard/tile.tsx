import React, { useCallback } from "react";
import styled from "styled-components";
import { Colors } from "../colors";
import { TILE_SIZE } from "../consts";
import { TileData } from "../test-data";
import { imageUploaderState, ImageUploaderStatus, tileClaimerState, TileClaimerStatus } from "../../recoil/atoms";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";

import { accountSelector } from "../../recoil/selectors";

type ImageUploader = {
  upload: () => void;
};

type TileClaimer = {
  claim: () => void;
};

type TileProps = {
  tile?: TileData;
  row: number;
  col: number;
};

type OwnedTileProps = TileProps & {
  tile: TileData;
};

function isOwnedTileProps(props: TileProps): props is OwnedTileProps {
  return props.tile != null;
}

function OwnedTile(props: OwnedTileProps & ImageUploader) {
  const { tile, upload } = props;

  const handleTileClick = useRecoilCallback(
    ({ snapshot }) => async () => {
      const account = await snapshot.getPromise(accountSelector);

      if (
        account != null &&
        (account === tile.owner || !tile.owner.startsWith("0x")) // todo hekk
      ) {
        upload();
      }
    },
    [upload, tile]
  );

  return (
    <TileImg
      src={props.tile.base64Url ?? ""}
      onClick={handleTileClick}
      title={tile.owner}
    />
  );
}

function EmptyTile(props: TileProps & TileClaimer) {
  const { claim } = props;

  const handleTileClick = useRecoilCallback(
    ({ snapshot }) => async () => {
      const account = await snapshot.getPromise(accountSelector);

      if (account != null) {
        claim();
      }
    },
    [claim]
  );

  return <EmptyTileImg onClick={handleTileClick} title={"not yet taken"} />;
}

export const Tile = React.memo((props: TileProps) => {
  const setImageUploader = useSetRecoilState(imageUploaderState);
  const setTileClaimer = useSetRecoilState(tileClaimerState);

  const { row, col } = props;
  const upload = useRecoilCallback(
    ({ snapshot }) => async () => {
      const account = await snapshot.getPromise(accountSelector);

      if (account) {
        setImageUploader({
          status: ImageUploaderStatus.INITIATED,
          tile: {
            row,
            col,
            owner: account,
          },
          dataURIToEdit: undefined,
          dataURIToUpload: undefined,
        });
      }
    },
    [row, col]
  );

  const claim = useRecoilCallback(
    ({ snapshot }) => async () => {
      const account = await snapshot.getPromise(accountSelector);
    if (account) {
      setTileClaimer({
        status: TileClaimerStatus.INITIATED,
        tile: {
          row,
          col,
        },
      });
    }
  }, [row, col, ]);

  return isOwnedTileProps(props) ? (
    <OwnedTile {...props} upload={upload} />
  ) : (
    <EmptyTile {...props} claim={claim} />
  );
});
Tile.displayName = "Tile";

const TileImg = styled.img`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  cursor: pointer;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
  background-color: ${Colors.tileBackground};
`;

export const EmptyTileImg = styled.div`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAT0lEQVQ4T2P8////fwYGBgZGRkZGEA0CMDGyxEGakQ2DGUoODTaLHI349AwBA6kehoPfwNFYpigEwBE8GssUhSG4uKPYBDQDhkCkULsKAAAmmmfplyhaSwAAAABJRU5ErkJggg==);
  background-size: 10px 10px;
  opacity: 0.2;
  box-sizing: border-box;
  cursor: pointer;
`;
