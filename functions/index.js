

const functions         = require("firebase-functions");
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');//this one


 admin.initializeApp({
   credential: admin.credential.cert(serviceAccount)//not required for uploading json to firestore
 });

exports.changeUserNameInPodcastsAsiaEast = functions.region("asia-northeast1").https.onCall((data, context) => {

 const nameSetInSettingsScreen = data.changedName;
 const uid = context.auth.uid;
 console.log("User ID: ",uid);
 console.log("data variable: ",data);

 
 
 const db = admin.firestore();
 db.collectionGroup('Podcasts').where('podcasterID','==',uid).get().then(response => {
   let batch = db.batch()
   console.log("Response DOCS : ",response.docs);
   response.docs.forEach((doc) => {
       console.log("Full Doc : ",doc);
       //console.log("BookID : ",doc._fieldsProto.BookID.stringValue);
       if(doc._fieldsProto.BookID !== undefined && 
        doc._fieldsProto.BookID !== null)
        {
          console.log("PodcastID : ",doc._fieldsProto.PodcastID.stringValue);
          const docRef = db.collection('Books').doc(doc._fieldsProto.BookID.stringValue).collection('Podcasts')
                                        .doc(doc._fieldsProto.PodcastID.stringValue);
          batch.update(docRef, {podcasterName : nameSetInSettingsScreen}) 
        }
       
   })
   return batch.commit().then(() => {
       console.log('updated all documents of podcasterID - 123456789');
       return true;
   })
}).catch(err => console.log(err));

     return true;
 });






