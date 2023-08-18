import axios from "axios";

/**
 * @typedef {object} MeaningsOfWords
 * @property {string} partOfSpeech
 * @property {string} definition
 */

/**
 * @typedef {object} OutputResponse
 * @property {string} [title]
 * @property {string} [message]
 * @property {MeaningsOfWords[]} [meaningsOfWords]
 */

/**
 * @param {string} words
 * @returns {Promise<OutputResponse>}
 */
export default async function dictionary(words) {
  try {
    if (!words?.length) {
      return {
        title: "Please give me some word",
        message: "",
      };
    }

    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${words}`);
    const rawData = response?.data;

    if (!rawData?.length) {
      return {
        title: "No Definitions Found",
        message:
          "Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at a later time or head to the web instead.",
      };
    }

    const meanings = rawData[0]?.meanings;
    const tranfromData = meanings?.map((item) => ({
      partOfSpeech: item.partOfSpeech,
      definition: item.definitions[0].definition,
    }));

    return tranfromData;
  } catch (error) {
    const errMsg = error?.response ?? error;
    console.log("ERROR fetch dictionary: ", errMsg);

    if (error?.response?.data?.title) {
      const { title, message, resolution } = error.response.data ?? {};
      const fullMessage = message && resolution ? `${message} ${resolution}` : "";

      return {
        title: title,
        message: fullMessage,
      };
    }

    return {
      title: "No Definitions Found",
      message:
        "Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.",
    };
  }
}
