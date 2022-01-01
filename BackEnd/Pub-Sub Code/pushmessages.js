const express = require("express");
const {PubSub} = require("@google-cloud/pubsub");
const pubsub = new PubSub();

const app = express();
app.use(express.json());

app.post("/pubsub", async (req, res, next) => {
    try {
      const content = req.body;
      console.log("req : ",req);
      console.log("content:", content.message);
      if (!content) {
        res.send({
          status: 400,
          message: "There are no messages",
        });
      } else {
        const buffer = Buffer.from(JSON.stringify(content.message));
        await pubsub.topic("serverless_project").publish(buffer);
        res.send({
          status: 200,
          message: "Success",
        });
      }
    } catch (e) {
       res.send({
           status: 500,
           message: "Internal server error"
       }) 
      next(e);
    }
  });

  module.exports = { app }