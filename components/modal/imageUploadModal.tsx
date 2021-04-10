import React, { useCallback, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import ReactCrop from "react-image-crop";
import NumericInput from "react-numeric-input";
import "react-image-crop/dist/ReactCrop.css";

import { TILE_SIZE } from "../consts";
import { imageUploaderState, ImageUploaderStatus } from "../../recoil/atoms";

export const ImageUploadModal = () => {
  const [crop, setCrop] = useState<ReactCrop.Crop>({
    unit: "%",
    width: 100,
    aspect: 1,
  });
  const [croppedDataURI, setCroppedDataURI] = useState<string>();
  const [area, setArea] = useState<{ width: number; height: number }>({
    width: 1,
    height: 1,
  });
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

  const makeClientCrop = useCallback(
    (crop: ReactCrop.Crop) => {
      if (result.current.imageEl && crop.width && crop.height) {
        setCroppedDataURI(getCroppedImg(result.current.imageEl, crop, area));
      }
    },
    [result, area]
  );

  function getCroppedImg(
    image: HTMLImageElement,
    crop: ReactCrop.Crop,
    area: { width: number; height: number }
  ) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = TILE_SIZE * area.width;
    canvas.height = TILE_SIZE * area.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(
        image,
        (crop.x as number) * scaleX,
        (crop.y as number) * scaleY,
        (crop.width as number) * scaleX,
        (crop.height as number) * scaleY,
        0,
        0,
        TILE_SIZE * area.width,
        TILE_SIZE * area.height
      );
      return canvas.toDataURL();
    }
    return;
  }

  const onAreaChange = useCallback((val, _, e) => {
    setArea((area) => {
      const newArea = {
        width: e.id === "area-width" ? val : area.width,
        height: e.id === "area-height" ? val : area.height,
      };
      setCrop({
        aspect: newArea.width / newArea.height,
        unit: "%",
        width: 100,
      });
      return newArea;
    });
  }, []);

  return (
    <UploadModalContainer>
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
      <PreviewImageContainer>
        {croppedDataURI && <PreviewImage alt="Crop" src={croppedDataURI} />}
      </PreviewImageContainer>
      <Inputs>
        <DimensionInput
          type="text"
          value={area.width}
          min={1}
          onChange={onAreaChange}
          id="area-width"
        />
        <DimensionInput
          type="text"
          value={area.height}
          min={1}
          onChange={onAreaChange}
          id="area-height"
        />
        <UploadButton onClick={handleUpload} disabled={!croppedDataURI || busy}>
          Upload
        </UploadButton>
      </Inputs>
    </UploadModalContainer>
  );
};

const height = 250;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 20px;
  bottom 40px;

  span {
    margin-bottom: 10px;
  }
`;

const DimensionInput = styled(NumericInput)`
  background-color: rgba(0, 0, 0, 0.55);
  border: 1px solid black !important;
  border-radius: 5px;
  width: 50px;
  color: white;
  padding: 2px;

  &:focus {
    outline: none;
  }
`;

const UploadButton = styled.button`
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
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25), 0px 2px 10px #ffb1e6;
  cursor: pointer;

  &:disabled,
  &[disabled] {
    color: #555;
  }
`;

const PreviewImageContainer = styled.div`
  width: 330px;
  height: 140px;
  margin-top: 10px;
`;

const PreviewImage = styled.img`
  background-color: rgba(255, 255, 255, 0.7);
  object-fit: contain;
  width: 100%;
  height: 100%;
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
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25), 0px 2px 10px #ffb1e6;

  span b:first-of-type i {
    border-color: transparent transparent #fff !important;
  }

  span b:last-child i {
    border-color: #fff transparent transparent !important;
  }
`;
