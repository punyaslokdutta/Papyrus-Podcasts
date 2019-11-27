

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//



const functions=require('firebase-functions')
const algoliasearch=require('algoliasearch')

const admin = require('firebase-admin');
admin.initializeApp();
//import * as admin from 'firebase-admin';

exports.myStorageFunction = functions
    .region('asia-northeast1')
    .storage
    .object()
    .onFinalize((object) => {
      // ...
    });

/*exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin.database().ref('/Books').push({original: original});
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.redirect(303, snapshot.ref.toString());
});*/



const env = functions.config();


// Initialize the Algolia Client
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('Books');


exports.indexBook = functions.firestore
  .document('Books/{book_Id}')
  .onCreate((snap, context) => {
    const data = snap.data();
    const objectID = snap.id;

    // Add the data to the algolia index
    return index.addObject({
      objectID,
      ...data
    });
});