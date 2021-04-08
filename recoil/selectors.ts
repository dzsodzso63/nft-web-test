import { DefaultValue, selector } from "recoil";
import { Modal } from "../components/modal";
import { uiState, userState } from "./atoms";

export const visibleModalSelector = selector<Modal>({
  key: 'visibleModal',
  get: ({get}) => get(uiState).visibleModal,
  set: ({set, get}, newValue) => set(uiState, {
    ...get(uiState),
    visibleModal: newValue instanceof DefaultValue ? Modal.NONE : newValue,
  }),
});

export const accountSelector = selector({
  key: 'account',
  get: ({get}) => get(userState).account,
});
