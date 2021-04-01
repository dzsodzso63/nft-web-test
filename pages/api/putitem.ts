import { NextApiRequest, NextApiResponse } from "next";
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

  if (body && body.item) {
    try {
      console.log("signed message", signedMessage);
      const authenticated = authenticateSignature(
        body.item.owner,
        signedMessage
      );
      if (authenticated) {
        return res
          .status(200)
          .json({ result: (await putItem(body.item)) as any });
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
