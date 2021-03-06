const functions         = require('firebase-functions');
const admin=require('firebase-admin');
const algoliasearch=require('algoliasearch');
const serviceAccount = require('./serviceAccountProduction.json');//this one

const algoliaRecords = [];

const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const collectionIndexName='prod_users';
const collectionIndex = algoliaClient.initIndex(collectionIndexName);

 admin.initializeApp({
   credential: admin.credential.cert(serviceAccount)//not required for uploading json to firestore
 });

exports.changeUserNameInPodcastsAsiaEast = functions.region("asia-northeast1").https.onCall((data, context) => {

 const nameSetInSettingsScreen = data.changedName;
 const uid = context.auth.uid;
 console.log("User ID: ",uid);
 console.log("data variable: ",data);
 
 const objects = [{
  name: nameSetInSettingsScreen,
  objectID: uid
}];

collectionIndex.partialUpdateObjects(objects).then(({ objectIDs }) => {
  console.log(objectIDs);
  return true;
}).catch(err => console.log(err));

 
 const db = admin.firestore();
 db.collectionGroup('podcasts').where('podcasterID','==',uid).get().then(response => {
   let batch = db.batch()
   console.log("Response DOCS : ",response.docs);
   response.docs.forEach((doc) => {
       console.log("Full Doc : ",doc);
       //console.log("bookID : ",doc._fieldsProto.bookID.stringValue);
       if(doc._fieldsProto.bookID !== undefined && 
        doc._fieldsProto.bookID !== null)
        {
          console.log("podcastID : ",doc._fieldsProto.podcastID.stringValue);
          if(doc._fieldsProto.isChapterPodcast.booleanValue === false)
          {
            const docRef = db.collection('books').doc(doc._fieldsProto.bookID.stringValue).collection('podcasts')
                          .doc(doc._fieldsProto.podcastID.stringValue);
            batch.update(docRef, {podcasterName : nameSetInSettingsScreen}) 
          }
          else if(doc._fieldsProto.isChapterPodcast.booleanValue === true)
          {
            const docRef = db.collection('books').doc(doc._fieldsProto.bookID.stringValue).collection('chapters').doc(doc._fieldsProto.chapterID.stringValue)
                          .collection('podcasts').doc(doc._fieldsProto.podcastID.stringValue);
            batch.update(docRef, {podcasterName : nameSetInSettingsScreen}) 
          }
         
        }
       
   })
   return batch.commit().then(() => {
       console.log('updated all podcast documents of podcasterID - ',uid);
       return true;
   })
}).catch(err => console.log(err));

     return true;
 });

