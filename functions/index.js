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
const collectionIndexName='books';
const collectionIndex = algoliaClient.initIndex(collectionIndexName);

exports.addBookToIndex = functions.region("asia-northeast1").https.onCall((data, context) => {
 

  
  const bookName=data.bookName;
  const bookCover= data.bookCover;
  const language =data.language;
  const authors=data.authors;
  const publicationYear = data.publicationYear;
  const bookID = data.objectID;

  console.log("addBookToIndex cloud function");

 
  console.log("bookName: ",bookName);
  console.log("bookPicture:" , bookCover)
  console.log("language: ",language);

  console.log("context.auth = ",context.auth);

  const record = {
    objectID: bookID,
    bookCover:bookCover,
    bookName:bookName, 
    language :language,
    authors: authors,
    publicationYear : publicationYear,
};

//algoliaRecords.push(record);

collectionIndex.saveObject(record, (_error, content) => {
  console.log("content : ",content);
  console.log("ERROR LOG : ",_error);

  if(_error === null || _error === undefined)
    console.log("The uploaded book has been indexed in algolia.");

});
});
