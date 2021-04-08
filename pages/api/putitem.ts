import sharp from "sharp";
import dataUriToBuffer from "data-uri-to-buffer";
import { NextApiRequest, NextApiResponse } from "next";
import { TileForServer } from "../../components/test-data";
import { authenticateSignature } from "../../utils/authenticate";
import { putItem } from "../../utils/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, headers } = req;

  console.log("headers", headers);

  const signedMessage =
    headers["x-authentication-signed-message"]?.toString() ?? "";

  const item = body.item as TileForServer;

  if (body && item) {
    try {
      console.log("signed message", signedMessage);
      const authenticated = authenticateSignature(item.owner, signedMessage);
      if (authenticated) {
        const resizedImageBuffer = await sharp(dataUriToBuffer(item.DataURI))
          .resize(10, 10, { fit: "cover" })
          .toFormat("png")
          .toBuffer();
        const resizedImageBase64 = resizedImageBuffer.toString("base64");
        const resizedImageDataURI = `data:image/png;base64,${resizedImageBase64}`;
        const updatedItem: TileForServer = {
          ...item,
          DataURI: resizedImageDataURI,
        };
        return res
          .status(200)
          .json({ result: (await putItem(updatedItem as any)) as any }); // TODO typescript mad
      } else {
        console.error("unauthenticated request");
        res.status(403).json({ msg: "not authenticated" });
      }
    } catch (e) {
      console.error("Authentication error", e);
      res.status(403).json({ msg: "not authenticated" });
      return;
    }
  }
  res.status(400).json({ msg: "problemo" });
}
