import React, { useCallback } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { visibleModalSelector } from "../../recoil/selectors";
import { ImageUploadModal } from "./imageUploadModal";

export enum Modal {
  NONE,
  UPLOAD_IMAGE,
};

type ModalProps = {
  visibleModal: Modal,
  closeModal: () => void,
};

const modalContent = {
  [Modal.NONE]: null,
  [Modal.UPLOAD_IMAGE]: <ImageUploadModal />,
};

export const ModalContainer = () => {
  const [visibleModal, setVisibleModal] = useRecoilState(visibleModalSelector);
  const closeModal = useCallback(() => setVisibleModal(Modal.NONE), []);

  if (visibleModal === Modal.NONE) {
    return null;
  }
  
  return <ModalWrapper><ModalWindow><CloseModal onClick={closeModal}>⊗</CloseModal>{modalContent[visibleModal]}</ModalWindow></ModalWrapper>;
};

const CloseModal = styled.div`
  cursor: pointer;
  color: white;
  position: absolute;
  top: 15px;
  right: 15px;
`;

const ModalWrapper = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color:
  background-color:
`;

const ModalWindow = styled.div`
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: fit-content;
  height: fit-content;
`;