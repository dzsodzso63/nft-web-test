import { NextRouter, useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { imageUploaderState, ImageUploaderStatus, ImageUploadTile } from "../recoil/atoms";
import { accountSelector, visibleModalSelector } from "../recoil/selectors";
import { useGetAuthenticatedSignature } from "../utils/authenticate";
import { uploadImage } from "../utils/image-upload";
import { Modal } from "./modal";
import { getTestTileForDataUrl, TileData } from "./test-data";


type UploadData = {
  dataURI: string;
  tile: TileData;
};

const refresh = (router: NextRouter) =>
  useCallback(() => {
    router.replace(router.asPath);
  }, [router]);

export const UploadManager = () => {
  const router = useRouter();
  const refreshData = refresh(router);
  const getAuthenticatedSignature = useGetAuthenticatedSignature();
  const setVisibleModal = useSetRecoilState(visibleModalSelector);
  const [imageUploader, setImageUploader] = useRecoilState(imageUploaderState);
  const account = useRecoilValue(accountSelector);

  useEffect(() => {
    switch(imageUploader.status) {
      case ImageUploaderStatus.INITIATED:
        setVisibleModal(Modal.UPLOAD_IMAGE);
        (async () => {
          const imageData = await selectFile();
          if (imageData) {
            setImageUploader({
              ...imageUploader,
              status: ImageUploaderStatus.IMAGE_SELECTED,
              dataURIToEdit: imageData,
            });
          } else {
            console.log('upload aborted');
            setVisibleModal(Modal.NONE);
            setImageUploader({
              ...imageUploader,
              status: ImageUploaderStatus.IDLE,
            });
          }
        })();
        break;
      case ImageUploaderStatus.IMAGE_READY:
        (async () => {
          if (imageUploader.dataURIToUpload && imageUploader.tile) {
            await persistImage(imageUploader.dataURIToUpload, imageUploader.tile);
            setImageUploader({
              ...imageUploader,
              status: ImageUploaderStatus.IMAGE_UPLOADED,
            });
          }
        })();
        break;
      case ImageUploaderStatus.IMAGE_UPLOADED:
        refreshData();
        setImageUploader({
          ...imageUploader,
          status: ImageUploaderStatus.IDLE,
        });
        setVisibleModal(Modal.NONE);
      default:
    }
  }, [imageUploader, account]);

  const selectFile = async (): Promise<string | undefined> => {
    if (!account) {
      return;
    }
    const signedMessage = await getAuthenticatedSignature();
    if (signedMessage != null) {
      return await uploadImage();
    }
  };
  
  const persistImage = async (dataUrl: string, tile: ImageUploadTile) => {
    const item = getTestTileForDataUrl(dataUrl, tile.row, tile.col, tile.owner);
    // itt akarunk https://www.blocksism.com/authentication-via-metamask-and-portis/ lekuldeni egy szignalt akarmit
  
    return await fetch("/api/putitem/", {
      method: "PUT",
      mode: "same-origin",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "X-Authentication-Signed-Message": await getAuthenticatedSignature(),
      },
      body: JSON.stringify({ item }),
    });
  }

  return null;
}