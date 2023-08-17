import express from "express";
import dotenv from "dotenv";
dotenv.config().parsed;

const PORT = process.env.PORT || 4000;

import { reply } from "./src/replyMessage";

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get("/", (req, res) => {
  res.send("สวัสดี express");
});

app.post("/webhook", (req, res) => {
  const reply_token = req.body.events[0].replyToken;
  reply(reply_token);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
