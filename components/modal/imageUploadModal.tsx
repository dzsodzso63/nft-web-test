import React, { useCallback, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { TILE_SIZE } from "../consts";
import { imageUploaderState, ImageUploaderStatus } from "../../recoil/atoms";

export const ImageUploadModal = () => {
  const [crop, setCrop] = useState<ReactCrop.Crop>({
    unit: '%',
    width: 100,
    aspect: 1,          
  });
  const [croppedDataURI, setCroppedDataURI] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [imageUploader, setImageUploader] = useRecoilState(imageUploaderState);
  const result = useRef({
    imageEl: null as HTMLImageElement | null,
  });

  const handleUpload = useCallback(() => {
    setBusy(true);
    setImageUploader({
      ...imageUploader,
      status: ImageUploaderStatus.IMAGE_READY,
      dataURIToUpload: croppedDataURI,
    });
  }, [croppedDataURI, imageUploader]);

  const onLoad = useCallback((img) => {
    result.current.imageEl = img;
  }, []);

  const makeClientCrop = useCallback((crop: ReactCrop.Crop) => {
    if (result.current.imageEl && crop.width && crop.height) {
      setCroppedDataURI(getCroppedImg(
        result.current.imageEl,
        crop
      ));
    }
  }, [result]);

  function getCroppedImg(image: HTMLImageElement, crop: ReactCrop.Crop) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = TILE_SIZE;
    canvas.height = TILE_SIZE;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(
        image,
        crop.x as number * scaleX,
        crop.y as number * scaleY,
        crop.width as number * scaleX,
        crop.height as number * scaleY,
        0,
        0,
        TILE_SIZE,
        TILE_SIZE
      );
      return canvas.toDataURL();
    }
    return;
  }

  return <UploadModalContainer>
    <CropContainer>
      {imageUploader.dataURIToEdit && (
        <ImageCropper
          src={imageUploader.dataURIToEdit}
          crop={crop}
          onImageLoaded={onLoad}
          onComplete={makeClientCrop}
          onChange={setCrop}
        />
      )}
    </CropContainer>
    {croppedDataURI && (
      <PreviewImage alt="Crop" src={croppedDataURI} />
    )}
    <UploadButton onClick={handleUpload} disabled={!croppedDataURI || busy}>Upload</UploadButton>
  </UploadModalContainer>;
};

const height = 250;

const UploadButton = styled.button`
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

const PreviewImage = styled.img`
  background-color: rgba(255, 255, 255, 0.7);
  margin-top: 10px;
  width: 100px;
  image-rendering: pixelated;
`;

const CropContainer = styled.div`
  margin-top: 20px;
  border: 1px solid red;
  border-bottom-color: rgba(0, 0, 0, 0.15);
  border-right-color: rgba(0, 0, 0, 0.15);
  border-top-color: rgba(0, 0, 0, 0.85);
  border-left-color: rgba(0, 0, 0, 0.85);
  width: 100%;
  height: ${height}px;
  line-height: ${height}px;
  text-align: center;
  position: relative;
`;

const ImageCropper = styled(ReactCrop)`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7);
  max-width: ${height}px;
  max-height: ${height}px;
  width: 100%;
  height: 100%;
img {
    max-width: ${height}px;
    max-height: ${height}px;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const UploadModalContainer = styled.div`
  width: 400px;
  height: 400px;
  color: #fff;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25), 0px 2px 10px #FFB1E6;
`;