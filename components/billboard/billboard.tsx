import * as React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
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
  const rows = data.map((tileRow, i) => {
    return (
      <>
        <BillboardRowContainer key={`row-${i}`}>
          {tileRow.map((tile, j) => (
            <Tile key={`tile-${i}${j}`} row={i} col={j} tile={tile} />
          ))}
        </BillboardRowContainer>
      </>
    );
  });

  return (
    <BillboardContainer>
      <BillboardGrid />
      <BillboardImage src={stitchedImage} />
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
