import axios from "axios";

export default function reply(reply_token) {
  const body = {
    replyToken: reply_token,
    messages: [
      {
        type: "text",
        text: "Hello",
      },
      {
        type: "text",
        text: "How are you?",
      },
    ],
  };

  try {
    axios.post("https://api.line.me/v2/bot/message/reply", body, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.SECRET_KEY}` },
    });
  } catch (err) {
    console.log("reply message error :", err);
  }
}
