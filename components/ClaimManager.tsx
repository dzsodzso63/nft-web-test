import { useRecoilState, useSetRecoilState } from "recoil";
import { tileClaimerState, TileClaimerStatus, ImageUploaderStatus } from "../recoil/atoms";
import { useEffect } from "react";
import { visibleModalSelector } from "../recoil/selectors";
import { Modal } from "./modal";

export const ClaimManager = () => {

    const [tileClaimer, setTileClaimer] = useRecoilState(tileClaimerState);
    const setVisibleModal = useSetRecoilState(visibleModalSelector);

    useEffect(() => {
        switch(tileClaimer.status) {
        case TileClaimerStatus.INITIATED:
            setVisibleModal(Modal.TILE_CLAIM);
            (async () => {
            })();
            break;
        default:
        }
    }, [tileClaimer]);

  return null;
}