import { VercelRequest, VercelResponse } from "@vercel/node";

import db from "./db";

export default (request: VercelRequest, response: VercelResponse) => {
  const { token = "World" } = request.query;

  if (typeof token === "string") {
    const bayjor = db[token];
    const data = {
      ...bayjor,
      image: `https://example.com/images/${token}.png`,
    };
    response.status(200).send(data);
  }
};
