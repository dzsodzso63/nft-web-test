import styled from "styled-components";
import { Colors } from "../colors";
import { BILLBOARD_WIDTH, TILE_SIZE } from "../consts";
import { BillboardData } from "../test-data";
import { EmptyTile, Tile } from "./tile";

interface BillboardProps {
  data: BillboardData;
}

export const Billboard = (props: BillboardProps) => {
  const { data } = props;

  const rows = data.map((tileRow, i) => {
    return (
      <BillboardRowContainer key={`row-${i}`}>
        {tileRow.map((tile, j) =>
          tile != null ? (
            <Tile key={`tile-${i}${j}`} tile={tile} />
          ) : (
            <EmptyTile key={`tile-${i}${j}`} />
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
  border: solid 2px ${Colors.tilos};
  width: ${TILE_SIZE * BILLBOARD_WIDTH}px;
  height: ${TILE_SIZE * BILLBOARD_WIDTH}px;
  filter: drop-shadow(0 0 0.75rem ${Colors.lightGray});
  user-select: none;
`;

const BillboardRowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
