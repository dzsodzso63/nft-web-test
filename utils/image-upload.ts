import { TILE_SIZE } from "../components/consts";

const SUPPORTED_IMAGE_TYPES = ["png", "gif"];
let inputElement: HTMLInputElement | null = null;

export async function uploadImage(): Promise<string> {
  if (inputElement != null) {
    document.body.removeChild(inputElement);
    inputElement = null;
  }
  return new Promise((resolve, reject) => {
    inputElement = document.createElement("input");
    inputElement.id = "filedialoginput";
    inputElement.type = "file";
    inputElement.accept = SUPPORTED_IMAGE_TYPES.join(",");
    inputElement.style.display = "none";
    inputElement.onchange = () => {
      if (inputElement != null && inputElement.files != null && inputElement.files.length === 1) {
        const file = inputElement.files[0];
        resolve(handleImageFileSelected(file));
      }
    };
    document.body.appendChild(inputElement);
    inputElement.click();
  });
}

function handleImageFileSelected(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl: string = reader.result as string;

      const image = new Image();
      image.onload = () => {
        if (image.naturalWidth === TILE_SIZE || image.naturalHeight === TILE_SIZE) {
          resolve(dataUrl);
        } else {
          reject("Image size should be 10x10")
        }
      }
      image.src = dataUrl;
    }
    reader.readAsDataURL(file);
  });
}