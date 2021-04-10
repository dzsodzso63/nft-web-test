import * as React from "react";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  imageUploaderState,
  ImageUploaderStatus,
  tileClaimerState,
  TileClaimerStatus,
} from "../../recoil/atoms";
import { accountSelector } from "../../recoil/selectors";

import { Colors } from "../colors";
import { BILLBOARD_WIDTH, BREAKPOINT, TILE_SIZE } from "../consts";
import { BillboardData } from "../test-data";
import { Tile } from "./tile";

type BillboardProps = {
  data: BillboardData;
  stitchedImage: string;
};

export const Billboard = React.memo((props: BillboardProps) => {
  const { data, stitchedImage } = props;

  const setImageUploader = useSetRecoilState(imageUploaderState);
  const setTileClaimer = useSetRecoilState(tileClaimerState);

  const upload = useRecoilCallback(
    ({ snapshot }) => async (row: number, col: number) => {
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
    []
  );

  const claim = useRecoilCallback(
    ({ snapshot }) => async (row: number, col: number) => {
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
    },
    []
  );

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const col = Math.floor(event.nativeEvent.offsetX / TILE_SIZE);
      const row = Math.floor(event.nativeEvent.offsetY / TILE_SIZE);
      const tile = data[row][col];
      if (tile != null) {
        // tile is owned
        upload(row, col);
      } else {
        // tile is unclaimed
        claim(row, col);
      }
    },
    [upload, claim]
  );

  return (
    <BillboardContainer>
      <BillboardGrid />
      <BillboardImage src={stitchedImage} onClick={onClick} />
    </BillboardContainer>
  );
});
Billboard.displayName = "Billboard";

const BillboardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  outline: solid 1px ${Colors.tilos};
  width: ${TILE_SIZE * BILLBOARD_WIDTH}px;
  height: ${TILE_SIZE * BILLBOARD_WIDTH}px;
  user-select: none;
  margin: 32px 32px 32px 0;
  @media (max-width: ${BREAKPOINT}px) {
    margin-left: 32px;
  }
`;

const BillboardGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${TILE_SIZE * BILLBOARD_WIDTH}px;
  height: ${TILE_SIZE * BILLBOARD_WIDTH}px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAT0lEQVQ4T2P8////fwYGBgZGRkZGEA0CMDGyxEGakQ2DGUoODTaLHI349AwBA6kehoPfwNFYpigEwBE8GssUhSG4uKPYBDQDhkCkULsKAAAmmmfplyhaSwAAAABJRU5ErkJggg==);
  background-size: 10px 10px;
  opacity: 0.2;
`;

const BillboardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: ${TILE_SIZE * BILLBOARD_WIDTH}px;
  height: ${TILE_SIZE * BILLBOARD_WIDTH}px;
  cursor: pointer;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
`;

const BillboardRowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
