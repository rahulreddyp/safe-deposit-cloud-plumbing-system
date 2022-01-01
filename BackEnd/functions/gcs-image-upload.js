// This file uploads an image from user to GCP cloud function
const cloud = require('@google-cloud/storage')
const path = require('path')
const util = require('util')

const { Storage } = cloud

const storage = new Storage({
  keyFilename: './serviceaccount-jsonkey.json',
  projectId: 'csci-5410-f21-project-333901',
})


const bucket = storage.bucket('box-images')

const uploadImage = (file, boxID) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file

  const fullFileName = originalname.replace(/ /g, "_")
  const temp  = fullFileName.split(".")

  const fileName =  temp[0] + "_" + boxID + "." + temp[1]

  const blob = bucket.file(fileName)
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = util.format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    resolve(publicUrl)
  })
  .on('error', () => {
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
})

module.exports.uploadImage = uploadImage;
