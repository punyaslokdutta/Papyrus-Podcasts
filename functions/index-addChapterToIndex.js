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
const collectionIndexName='chapters';
const collectionIndex = algoliaClient.initIndex(collectionIndexName);

exports.addChapterToIndex = functions.region("asia-northeast1").https.onCall((data, context) => {
 

  
  const bookName=data.bookName;
  const chapterName=data.chapterName
  const chapterCover= data.chapterCover;
  const createdOn=data.createdOn;
  const language =data.language;
  const authors=data.authors;
  const publicationYear = data.publicationYear;
  const chapterID = data.objectID;
  const bookID = data.bookID;

  console.log("AddToPodcastsIndex cloud function");

 
  console.log("bookName: ",bookName);
  console.log("bookID: ",bookID);
  console.log("chapterName: ",chapterName);
  console.log("chapterCover:" , chapterCover)
  //console.log("podcastID: ",podcastID);
  //console.log("podcasterName: ",podcasterName);
 // console.log("timestamp: ",createdOn);
  console.log("language ",language);

  console.log("context.auth = ",context.auth);

  const record = {
    objectID: chapterID,
    bookID: bookID,
    chapterCover:chapterCover,
    bookName:bookName, 
    chapterName:chapterName,
    language :language,
    authors: authors,
    publicationYear : publicationYear,
    createdOn :createdOn
};




algoliaRecords.push(record);

collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
  console.log("content : ",content);
  console.log("ERROR LOG : ",_error);

  if(_error === null || _error === undefined)
    console.log("The uploaded book has been indexed in algolia.");

});
});
