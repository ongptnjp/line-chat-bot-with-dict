import axios from "axios";
import dictionary from "./dictionary";

// Mock the axios module
jest.mock("axios");

describe("dictionary", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should return title and message when words is not provided", async () => {
    const expectedResponse = {
      title: "Please give me some word",
      message: "",
    };

    const response = await dictionary();

    expect(response).toEqual(expectedResponse);
  });

  test("should return title and message when no definitions are found", async () => {
    const mockedResponse = {
      data: [],
    };

    axios.get.mockResolvedValueOnce(mockedResponse);

    const expectedResponse = {
      title: "No Definitions Found",
      message:
        "Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at a later time or head to the web instead.",
    };

    const response = await dictionary("test");

    expect(response).toEqual(expectedResponse);
    expect(axios.get).toHaveBeenCalledWith("https://api.dictionaryapi.dev/api/v2/entries/en/test");
  });

  test("should return transformed data when definitions are found", async () => {
    const mockedResponse = {
      data: [
        {
          meanings: [
            {
              partOfSpeech: "noun",
              definitions: [
                {
                  definition: "a person, place, thing, or event that is accepted as true or real",
                },
              ],
            },
          ],
        },
      ],
    };

    axios.get.mockResolvedValueOnce(mockedResponse);

    const expectedResponse = [
      {
        partOfSpeech: "noun",
        definition: "a person, place, thing, or event that is accepted as true or real",
      },
    ];

    const response = await dictionary("test");

    expect(response).toEqual(expectedResponse);
    expect(axios.get).toHaveBeenCalledWith("https://api.dictionaryapi.dev/api/v2/entries/en/test");
  });

  test("should handle error responses and return title and message", async () => {
    const mockedError = {
      response: {
        data: {
          title: "Error Title",
          message: "Error message",
          resolution: "Resolution",
        },
      },
    };

    axios.get.mockRejectedValueOnce(mockedError);

    const expectedResponse = {
      title: "Error Title",
      message: "Error message Resolution",
    };

    const response = await dictionary("test");

    expect(response).toEqual(expectedResponse);
    expect(axios.get).toHaveBeenCalledWith("https://api.dictionaryapi.dev/api/v2/entries/en/test");
  });

  test("should handle generic errors and return default error message", async () => {
    const mockedError = new Error("Failed to fetch data");

    axios.get.mockRejectedValueOnce(mockedError);

    const expectedResponse = {
      title: "No Definitions Found",
      message:
        "Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.",
    };

    const response = await dictionary("test");

    expect(response).toEqual(expectedResponse);
    expect(axios.get).toHaveBeenCalledWith("https://api.dictionaryapi.dev/api/v2/entries/en/test");
  });
});
