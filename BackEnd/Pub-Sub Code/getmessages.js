const admin = require("firebase-admin");
const express = require("express");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

app.get("/messages/:id", async (req, res, next) => {
  try {
    const safebox = req.params.id;
    if (!safebox) {
      res.send({
         headers: {
            "Access-Control-Allow-Origin" : "*",
           "Access-Control-Allow-Credentials" : true 
          },
        status: 400,
        message: "safebox is empty",
      });
    } else {
      const Messages = await db.collection("Messages").doc(safebox).get();
      console.log("Messages: ", Messages)
      if(Messages._fieldsProto != undefined){
        res.send({
            headers: {
            "Access-Control-Allow-Origin" : "*",
           "Access-Control-Allow-Credentials" : true 
          },
          status : 200,
          message: Messages._fieldsProto.Message.stringValue,
        });
      }
      else{
          res.send({
            headers: {
            "Access-Control-Allow-Origin" : "*",
           "Access-Control-Allow-Credentials" : true 
}, 
          status:200,
          message: "",
        });
      }
    }
    }
  catch (e) {
    next(e);
  }
});


module.exports = { app }