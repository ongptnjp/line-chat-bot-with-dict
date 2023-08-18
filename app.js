import express from "express";
import dotenv from "dotenv";
import replyMessage from "./src/replyMessage/reply.js";
import dictionary from "./src/dictionary/dictionary.js";

dotenv.config().parsed;

const PORT = process.env.PORT || 4000;

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

app.get("/dictionary/:words", async (req, res) => {
  const theWord = req.params?.words ?? null;
  const response = await dictionary(theWord);

  res.send(response);
});

app.post("/webhook", (req, res) => {
  console.log("req.body : ", req.body);
  const reply_token = req.body?.events[0]?.replyToken;
  const message = req.body?.evnets[0]?.message?.text;
  replyMessage(reply_token, message);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
