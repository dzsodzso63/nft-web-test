import styled from "styled-components"
import { Colors } from "../colors"
import { BILLBOARD_WIDTH, TILE_SIZE } from "../consts"
import { EmptyTile, Tile } from "./tile"

export const Billboard = (props) => {
  const { data } = props

  const rows = data.map((tileRow, i) => {
    return <BillboardRowContainer key={`row-${i}`}>
      {tileRow.map((tile, j) =>
        tile != null
        ? <Tile key={`tile-${i}${j}`} url={tile.url} />
        : <EmptyTile key={`tile-${i}${j}`} />)
      }
    </BillboardRowContainer>
  })

  return <BillboardContainer>
    {rows}
  </BillboardContainer>
}

const BillboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: solid 2px ${Colors.tilos};
  width: ${TILE_SIZE * BILLBOARD_WIDTH}px;
  height: ${TILE_SIZE * BILLBOARD_WIDTH}px;
  filter: drop-shadow(0 0 0.75rem ${Colors.lightGray});
`

const BillboardRowContainer = styled.div`
  display: flex;
  flex-direction: row;
`