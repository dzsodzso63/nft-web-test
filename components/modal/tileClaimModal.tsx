import { tileClaimerState, TileClaimerStatus } from "../../recoil/atoms";
import { useRecoilState } from "recoil";
import { useCallback, useRef } from "react";
import styled from "styled-components";

export const TileClaimModal = () => {
  const [tileClaimer, setTileClaimer] = useRecoilState(tileClaimerState);

  const handleClaim = useCallback(() => {
    setTileClaimer({
      ...tileClaimer,
      status: TileClaimerStatus.CLAIM_REQUESTED,
    });
  }, [tileClaimer]);

  return (
    <TileClaimModalContainer>
      <div>
        You are about to claim the tile: {tileClaimer.tile?.row},{" "}
        {tileClaimer.tile?.col}
      </div>
      <div>Result: {tileClaimer.result}</div>
      <ClaimButton onClick={handleClaim}>Claim</ClaimButton>
    </TileClaimModalContainer>
  );
};

const ClaimButton = styled.button`
  position: absolute;
  right: 20px;
  bottom 40px;
  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  color: white;
  padding: 10px;
  font-family: PT Mono;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  text-align: right;
  mix-blend-mode: normal;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25), 0px 2px 10px #FFB1E6;
  cursor: pointer;

  &:disabled,
  &[disabled]{
    color: #555;
  }
`;

const TileClaimModalContainer = styled.div`
  width: 400px;
  height: 400px;
  color: #fff;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25), 0px 2px 10px #ffb1e6;
`;
