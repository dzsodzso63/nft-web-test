import { atom } from "recoil";
import { Modal } from "../components/modal";
import { TileData } from "../components/test-data";

export const signedMessage = atom<Promise<string> | null>({
  key: "signedMessage",
  default: null,
});

export const userState = atom({
  key: 'user',
  default: {
    account: undefined as string | undefined,
  },
});

export const uiState = atom({
  key: 'ui',
  default: {
    visibleModal: Modal.NONE,
  },
});

export enum ImageUploaderStatus {
  IDLE,
  INITIATED,
  IMAGE_SELECTED,
  IMAGE_READY,
  IMAGE_UPLOADED,
}

export type ImageUploadTile = {
  row: number,
  col: number,
  owner: string,
};

export const imageUploaderState = atom({
  key: 'uploadImage',
  default: {
    status: ImageUploaderStatus.IDLE,
    tile: undefined as ImageUploadTile | undefined,
    dataURIToEdit: undefined as string | undefined,
    dataURIToUpload: undefined as string | undefined,
  },
});

export enum TileClaimerStatus {
  IDLE,
  INITIATED,
}

export type TileClaimerTile = {
  row: number,
  col: number,
};

export const tileClaimerState = atom({
  key: 'tileClaimer',
  default: {
    status: TileClaimerStatus.IDLE,
    tile: undefined as TileClaimerTile | undefined,
  },
});