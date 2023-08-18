import axios from "axios";

import dictionary from "../dictionary/dictionary.js";

import { capitalizeFirstLetter } from "../utils/utils.js";

/**
 * @param {string} reply_token
 * @param {string} message
 * @returns {void}
 */
export default async function reply(reply_token, message) {
  try {
    const replyMessage = await dictionary(message);

    console.log("replyMessage: ", replyMessage);

    let rawMessage;
    if (replyMessage?.length) {
      rawMessage = replyMessage.map((item) => {
        return {
          type: "text",
          text: `${capitalizeFirstLetter(item?.partOfSpeech)}: ${item?.definition}`,
        };
      });
    }

    if (replyMessage?.title) {
      rawMessage = [
        {
          type: "text",
          text: `${replyMessage.title}, ${replyMessage?.message}`,
        },
      ];
    }

    console.log("rawMessage : ", rawMessage);

    const body = {
      replyToken: reply_token,
      message: rawMessage,
    };

    axios.post("https://api.line.me/v2/bot/message/reply", body, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.ACCESSTOKEN}` },
    });
  } catch (err) {
    const errMsg = err?.response?.data || err?.response || err;
    console.log("reply message error :", errMsg);
  }
}
