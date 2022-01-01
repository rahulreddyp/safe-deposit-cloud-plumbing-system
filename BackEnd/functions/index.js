const fAdmin = require("firebase-admin");
fAdmin.initializeApp();
const AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "ASIAY3UPCOOINTSN37FI",
    "secretAccessKey": "j222znwAuoyfdUbcjz2h7tldKZIkYxfBp8bWPc48",
    "sessionToken": "FwoGZXIvYXdzEEkaDEz3/pesoRJXHgildiK/Aaxqi29ky+QfVSYJMqmHv30wZe2nqUZCEiKZALYaZEeCBojbplx0gTJEtChAz7Glc8UYD6xoJDRBWcoyCWLoX12dZnvOrynmugCJywiz7d8grgwrLGcyoD2NgrjCpYX5S+TrPEmTt4K/rP3RrEct8K0JHmCozhrZf/nlwn8RRqMhOyaPZ/5ec+qFeyrMl8lvJNDBkLFzf8IkC6MRhnvnANXGi7uZyg/zgOAvUwQABNJookmt/mYL6f4WwwGsUwacKPbw1I0GMi0pyyJysZwntojZwIlZVfz0xHZbnMKmxu+WibRyLr6f3GHTcEldrsSdA/sp9DE="
}

const ALPHABETS = 'abcdefghijklmnopqrstuvwxyz';
AWS.config.update(awsConfig);
const { v4: uuidv4 } = require('uuid');
const { decryptString } = require('@gykh/caesar-cipher');
let dynamoClient = new AWS.DynamoDB.DocumentClient();

const fireBaseFunctions = require("firebase-functions");

const express = require("express");
const umapp = express();
const cors = require("cors"); //enabling cors
const bcrypt = require("bcrypt");
const saltRounds = 9;
const firestoreDB = fAdmin.firestore();

umapp.use(cors({ origin: true }));


// multer to upload image to gcp cloud storage
const multer = require("multer")
const {uploadImage} = require('./gcs-image-upload')

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      // no larger than 5 MB
      fileSize: 5 * 1024 * 1024,
    },
  })

//Service to save to firebase
umapp.post("/userCreate", async (req, res) => {
    try {
        var createBox;
        var Document;
        const encryptedPassword = await bcrypt.hash(req.body.password, 9);
        await fAdmin
            .auth()
            .createUser({
                email: req.body.email,
                password: req.body.password
            })
            .then((userRecord) => {
                var item = {
                    "userId": userRecord.uid,
                    "password": encryptedPassword,
                    "questionOne": req.body.questionOne,
                    "answerOne": req.body.answerOne,
                    "questionTwo": req.body.questionTwo,
                    "answerTwo": req.body.answerTwo,
                    "safeDeposit": req.body.safeDeposit
                }

                var params = {
                    TableName: "MFA",
                    Item: item
                }

                dynamoClient.put(params, async (err, data) => {
                    if (err) {
                        return res.status(500).send("Error in inserting into dynamo " + err);
                    } else {
                        try {
                            const boxDetails = firestoreDB.collection('box');
                            const boxDoc = await boxDetails.get();
                            boxDoc.forEach(async (doc) => {
                                console.log(doc.id, '=>', doc.data());
                                if (doc.data().count < 3) {
                                    createBox = true;
                                 
                                }
                            });

                            if (createBox) {
                                boxDoc.forEach(async (doc) => {
                                    console.log(doc.id, '=>', doc.data());
                                    if (doc.data().count < 3) {
                                        console.log("adding in existing box")
                                        let boxMembers = doc.data().members;
                                        console.log("--> before " + boxMembers);
                                        boxMembers.push(userRecord.uid)
                                        console.log("--> after" + boxMembers);
                                        await boxDetails.doc(doc.id).update({ count: boxMembers.length, members: boxMembers });      
                                        return res.status(200).json({
                                            message: "User Created and assigned to existing Box id " + doc.id + " and the user id which is generated is: " + userRecord.uid,
                                            success: true

                                        })
                                    }
                                });

                            } else {
                                const boxId = uuidv4();
                                await boxDetails.doc(boxId).set({
                                    count: '1', members: [userRecord.uid]
                                });
                                
                                return res.status(200).json({
                                    message: "User Created and assigned to new Box with Id " + boxId + " and the user id which is generated is: " + userRecord.uid,
                                    success: true

                                })
                            }

                        } catch (error) {
                            console.log(error);
                            return res.status(500).send(error);
                        }
                    }
                })
            });
    } catch (err) {
        return res.status(500).send("Error in inserting into dynamo " + err);
    }

});

umapp.post("/login", async (req, res) => {
    try {
        const userEmail = req.body.email;
        const cipherQuestion = req.body.cQuestion;
        const cipherAnswer = req.body.cAnswer;
        const cipherKey = req.body.CipherKey;
        fAdmin
            .auth()
            .getUserByEmail(userEmail)
            .then(async (userRecord) => {
                var params = {
                    TableName: "MFA",
                    Key: {
                        "userId": userRecord.uid
                    }
                };
                console.log("Cipher Key:"+cipherKey)
                const decryptedAnswer = decryptString(cipherAnswer, Number(cipherKey));
                
                console.log("decrypted answer" + decryptedAnswer)
                if (decryptedAnswer === cipherQuestion) {
                    const doc = await dynamoClient.get(params).promise();
                    const isPasswordCompared = await bcrypt.compare(req.body.password, doc.Item.password);
                    if (isPasswordCompared) {
                        if (doc.Item.answerOne === req.body.answerOne && doc.Item.answerTwo === req.body.answerTwo) {
                            const boxDetails = firestoreDB.collection('box');
                            const boxDoc = await boxDetails.get();

                            boxDoc.forEach(async (doc) => {
                                let boxMembers = doc.data().members;
                                await boxMembers.forEach(async (value) => {
                                    if (value === userRecord.uid) {
                                        return res.status(200).json({
                                            "message": "Success",
                                            "userId": userRecord.uid,
                                            "email": req.body.email,
                                            "boxID": doc.id

                                        });

                                    }
                                });


                            })


                        } else {
                            return res.status(500).json({
                                "message": "Incorrect Answer!!"
                            });
                            // throw new Error('Invalid Answers for security Questions');
                        }
                    } else {
                        return res.status(500).json({

                            "message": "Incorrect password!!"
                        });
                        // throw new Error('Invalid Password for User Credentials');
                    }
                } else {
                    return res.status(500).json({
                        "message": "Cipher code you have entered is wrong, Please try again"
                    });
                }


            })
            .catch((error) => {
                console.log(error)
                return res.status(500).send(error);
            })
    }
    catch (error) {
        res.send("error!")
    }

});

umapp.post("/api/fileUpload",  multerMid.single('file'), async (req, res, next) => {
    try {
  
      const file = req.file
      const boxID = req.body['boxID']
      const imageUrl = await uploadImage(file, boxID)
      res
        .status(200)
        .json({
          message: "success",
          data: imageUrl
        })
    } catch (error) {
      console.warn('Error', error);
      res.status(500).json({
        error: error,
        message: 'Internal server error!',
      })
      next()
    }
  })

exports.app = fireBaseFunctions.https.onRequest(umapp);
