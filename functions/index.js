// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
const functions         = require("firebase-functions");
const { tmpdir }        = require("os");
const { Storage }       = require("@google-cloud/storage");
const { dirname, join } = require("path");
const sharp             = require("sharp");
const fs                = require("fs-extra");
const gcs               = new Storage();


exports.resizeImg = functions
                  .region('asia-northeast1')
                  .runWith({ memory: "2GB", timeoutSeconds: 120 })
                  .storage
                  .object()
                  .onFinalize(async (object) => {
  const bucket    = gcs.bucket(object.bucket);
  const filePath  = object.name;
  const fileName  = filePath.split("/").pop();
  const bucketDir = dirname(filePath);

  const workingDir  = join(tmpdir(), "resize");
  const tmpFilePath = join(workingDir, "source.jpg");

  console.log(`Got ${fileName} file`);

  if (fileName.includes("@s_") || !object.contentType.includes("image")) {
    console.log(`Already resized. Exiting function`);
    return false;
  }

  await fs.ensureDir(workingDir);

  // fs.ensureFile(tmpFilePath)
  // .then(() => {
  //   console.log('success!')
  // })
  // .catch(err => {
  //   console.error(err)
  // })

  fs.pathExists(tmpFilePath, (err, exists) => {
    console.log(err) // => null
    console.log(tmpFilePath,":",exists) // => false
  })

  await bucket.file(filePath).download({ destination: tmpFilePath });

  fs.pathExists(tmpFilePath, (err, exists) => {
    console.log(err) // => null
    console.log("after download",tmpFilePath,":",exists) // => false
  })

  const sizes = [ 680 ];

  const uploadPromises = sizes.map(async (size) => {

    console.log(`Resizing ${fileName} at size ${size}`);

    const ext        = fileName.split('.').pop();
    const imgName    = fileName.replace(`.${ext}`, "");
    const newImgName = `${imgName}@s_${size}.${ext}`;
    const imgPath    = join(workingDir, newImgName);

    await sharp(tmpFilePath).resize({ width: size }).toFile(imgPath);

    console.log("tmpFilePath: ",tmpFilePath);
    console.log("imgPath: ",imgPath);
    console.log(`Just resized ${newImgName} at size ${size}`);

    return bucket.upload(imgPath, {
      destination: join(bucketDir, newImgName)
    });

  });

  Promise.all(uploadPromises).then(function(data) {
    fs.remove(workingDir);
  }).catch(error)
  {
    console.log(error);
  }

  //fs.unlinkSync(tmpFilePath);

   
  return true;
});



// //Algolia related cloud functions
// const algoliasearch=require('algoliasearch')

// const admin = require('firebase-admin');
// admin.initializeApp();
// //import * as admin from 'firebase-admin';

// exports.myStorageFunction = functions
//     .region('asia-northeast1')
//     .storage
//     .object()
//     .onFinalize((object) => {
//       // ...
//     });

// /*exports.addMessage = functions.https.onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   const snapshot = await admin.database().ref('/Books').push({original: original});
//   // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//   res.redirect(303, snapshot.ref.toString());
// });*/



// const env = functions.config();


// // Initialize the Algolia Client
// const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
// const index = client.initIndex('Books');


// exports.indexBook = functions.firestore
//   .document('Books/{book_Id}')
//   .onCreate((snap, context) => {
//     const data = snap.data();
//     const objectID = snap.id;

//     // Add the data to the algolia index
//     return index.addObject({
//       objectID,
//       ...data
//     });
// });

