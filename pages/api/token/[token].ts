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
// import express from "express";
// import { HOST } from "./constants";
// import db from "./database";

// const PORT = process.env.PORT || 5000;

// const app = express().set("port", PORT);

// // Static public files
// app.use(express.static("public"));

// app.get("/", (_req, res) => {
//   res.send("Get ready for OpenSea!");
// });

// app.get("/api/token/:token_id", (req, res) => {
//   const tokenId = req.params.token_id;
//   const bayjor = db[tokenId];
//   const data = {
//     ...bayjor,
//     image: `${HOST}/images/${tokenId}.png`,
//   };
//   res.send(data);
// });

// app.listen(app.get("port"), () => {
//   console.log("Node app is running on port", app.get("port"));
// });
