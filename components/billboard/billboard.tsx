import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { accountSelector } from "../../recoil/selectors";

import { Colors } from "../colors";
import { BILLBOARD_WIDTH, BREAKPOINT, TILE_SIZE } from "../consts";
import { BillboardData } from "../test-data";
import { Tile } from "./tile";

interface BillboardProps {
  data: BillboardData;
}

export const Billboard = (props: BillboardProps) => {
  const { data } = props;
  const rows = data.map((tileRow, i) => {
    return (
      <BillboardRowContainer key={`row-${i}`}>
        {tileRow.map((tile, j) =>
          <Tile
            key={`tile-${i}${j}`}
            row={i}
            col={j}
            tile={tile}
          />
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
