import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import {
  tileClaimerState,
  TileClaimerStatus,
  ImageUploaderStatus,
  TileClaimerTile,
} from "../recoil/atoms";
import { useEffect } from "react";
import { visibleModalSelector, accountSelector } from "../recoil/selectors";
import { Modal } from "./modal";

export const ClaimManager = () => {
  const [tileClaimer, setTileClaimer] = useRecoilState(tileClaimerState);
  const setVisibleModal = useSetRecoilState(visibleModalSelector);
  const account = useRecoilValue(accountSelector);

  useEffect(() => {
    switch (tileClaimer.status) {
      case TileClaimerStatus.INITIATED:
        setVisibleModal(Modal.TILE_CLAIM);
        (async () => {})();
        break;
      case TileClaimerStatus.CLAIM_REQUESTED:
        (async () => {
          const result = await claim(tileClaimer.tile, account);
          setTileClaimer({
            ...tileClaimer,
            status: TileClaimerStatus.IDLE,
            result,
          });
        })();
        break;
      default:
    }
  }, [tileClaimer]);

  return null;
};

const claim = async (
  tile: TileClaimerTile | undefined,
  account: string | undefined
): Promise<string> => {
  if (!account) {
    return "not logged in";
  }

  return "pina";
};
