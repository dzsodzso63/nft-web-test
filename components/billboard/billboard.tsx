import { useEffect, useState } from "react";
import styled from "styled-components";
import { Colors } from "../colors";
import { BILLBOARD_WIDTH, BREAKPOINT, TILE_SIZE } from "../consts";
import { BillboardData } from "../test-data";
import { EmptyTile, Tile } from "./tile";

interface BillboardProps {
  data: BillboardData;
  owner: string | null;
  metamask: any | null;
}

export const Billboard = (props: BillboardProps) => {
  const { data, owner, metamask } = props;

  const rows = data.map((tileRow, i) => {
    return (
      <BillboardRowContainer key={`row-${i}`}>
        {tileRow.map((tile, j) =>
          tile != null ? (
            <Tile
              key={`tile-${i}${j}`}
              row={i}
              col={j}
              tile={tile}
              account={owner}
              metamask={metamask}
            />
          ) : (
            <EmptyTile
              key={`tile-${i}${j}`}
              row={i}
              col={j}
              account={owner}
              metamask={metamask}
            />
          )
        )}
      </BillboardRowContainer>
    );
  });

  return <BillboardContainer>{rows}</BillboardContainer>;
};

const BillboardContainer = styled.div`
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

const BillboardRowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
