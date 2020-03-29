const functions         = require('firebase-functions');
const admin=require('firebase-admin');
const algoliasearch=require('algoliasearch');


//const ALGOLIA_APP_ID = "BJ2O4N6NAY"
//const ALGOLIA_ADMIN_KEY="c169c60de08aa43d881bf81c223dda06"
//const ALGOLIA_INDEX_NAME='Books'

const algoliaRecords = [];

admin.initializeApp();
const db = admin.firestore();
const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const collectionIndexName='Podcasts';
const collectionIndex = algoliaClient.initIndex(collectionIndexName);

exports.AddToPodcastsIndex = functions.region("asia-northeast1").https.onCall((data, context) => {
 

  const Podcast_Name=data.Podcast_Name;
  const Book_Name=data.Book_Name;
  const Podcast_Picture= data.Podcast_Picture;
  const PodcastID=data.PodcastID;
  const PodcasterName=data.PodcasterName
  const Timestamp=data.Timestamp
  const Language =data.Language
  const AuthorName=data.AuthorName

  console.log("AddToPodcastsIndex cloud function");

  console.log("Podcast_Name: ",Podcast_Name);
  console.log("Book_Name: ",Book_Name);
  console.log("Podcast_Picture:" , Podcast_Picture)
  console.log("PodcastID: ",PodcastID);
  console.log("PodcasterName: ",PodcasterName);
  console.log("Timestamp: ",Timestamp);
  console.log("Language: ",Language);

  console.log("context.auth = ",context.auth);

  const record = {
    objectID: PodcastID,
    Podcast_Name:Podcast_Name, 
    Podcast_Picture:Podcast_Picture,
    Book_Name:Book_Name, 
    PodcasterName:PodcasterName, 
    Timestamp:Timestamp, 
    Language :Language,
    AuthorName: AuthorName,
};




algoliaRecords.push(record);

collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
  console.log("content : ",content);
  console.log("ERROR LOG : ",_error);

  if(_error === null || _error === undefined)
    console.log("The uploaded podcast has been indexed in algolia.");

});
});
