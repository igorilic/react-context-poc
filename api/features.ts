import { NowRequest, NowResponse } from "@vercel/node";

const response = {
  name: "Decrement",
  description: "Decrement enabler",
  tags: ["decrement"],
  constraints: [
    {
      dataScope: '{"countryId": "AU"}',
      enabled: true
    }
  ]
};

export default (request: NowRequest, response: NowResponse) => {
  const { tag = "decrement" } = request.query;
  if (tag === "decrement") {
    response.status(200).send(response);
  } else {
    response.status(400).send('tag must be "decrement"');
  }
};
