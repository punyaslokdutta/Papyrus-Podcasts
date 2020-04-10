const functions         = require('firebase-functions');
const admin=require('firebase-admin');
const algoliasearch=require('algoliasearch');


//const ALGOLIA_APP_ID = "BJ2O4N6NAY"
//const ALGOLIA_ADMIN_KEY="c169c60de08aa43d881bf81c223dda06"
//const ALGOLIA_INDEX_NAME='books'

const algoliaRecords = [];

admin.initializeApp();
const db = admin.firestore();
const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const collectionIndexName='podcasts';
const collectionIndex = algoliaClient.initIndex(collectionIndexName);

exports.AddToPodcastsIndex = functions.region("asia-northeast1").https.onCall((data, context) => {
 

  const podcastName=data.podcastName;
  const bookName=data.bookName;
  const podcastPicture= data.podcastPicture;
  const podcastID=data.podcastID;
  const podcasterName=data.podcasterName
  const timestamp=data.timestamp
  const language =data.language
  const authors=data.authors

  console.log("AddToPodcastsIndex cloud function");

  console.log("podcastName: ",podcastName);
  console.log("bookName: ",bookName);
  console.log("podcastPicture:" , podcastPicture)
  console.log("podcastID: ",podcastID);
  console.log("podcasterName: ",podcasterName);
  console.log("timestamp: ",timestamp);
  console.log("language: ",language);

  console.log("context.auth = ",context.auth);

  const record = {
    objectID: podcastID,
    podcastName:podcastName, 
    podcastPicture:podcastPicture,
    bookName:bookName, 
    podcasterName:podcasterName, 
    timestamp:timestamp, 
    language :language,
    authors: authors,
};




algoliaRecords.push(record);

collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
  console.log("content : ",content);
  console.log("ERROR LOG : ",_error);

  if(_error === null || _error === undefined)
    console.log("The uploaded podcast has been indexed in algolia.");

});
});
