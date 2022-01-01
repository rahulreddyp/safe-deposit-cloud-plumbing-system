/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */

 const admin = require("firebase-admin");
 const express = require("express");
 
 const app = express();
 app.use(express.json());
 
 admin.initializeApp({
   credential: admin.credential.applicationDefault(),
 });
 
 const db = admin.firestore();
 
 exports.helloPubSub = async (event, context) => {
   try{
   const message = event.data
     ? Buffer.from(event.data, 'base64').toString()
     : '';
   console.log("testing ", message);
   const content = message.split('"').join('');
   if (content != "")
   {
     console.log("Message", content);
     console.log("Split", content.split(" ").splice(-1)[0]);
    const safebox = content.split(" ").splice(-1)[0];
    const storing = await db.collection("Messages").doc(safebox).set({
    "Message": content});
   }
   console.log("storing", storing)
     }
   catch(e)
   {
     console.log(e);
     }
 };