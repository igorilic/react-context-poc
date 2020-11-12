import { NowRequest, NowResponse } from "@vercel/node";

export default (request: NowRequest, response: NowResponse) => {
  const res = [
    {
      name: "Decrement",
      description: "Decrement enabler",
      tags: ["decrement"],
      constraints: [
        {
          dataScope: '{"countryId": "AU"}',
          enabled: true
        }
      ]
    }
  ];
  response.setHeader(
    "Cache-Control",
    "no-store, must-revalidate, no-cache, max-age=0"
  );
  const { tag = "decrement" } = request.query;
  if (tag === "decrement") {
    response.status(200).send(res);
  } else {
    response.status(400).send('tag must be "decrement"');
  }
};
