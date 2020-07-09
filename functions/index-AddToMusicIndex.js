const functions = require('firebase-functions');
const algoliasearch=require('algoliasearch');
const algoliaRecords = [];
const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const collectionIndexName='prod_music';
const collectionIndex = algoliaClient.initIndex(collectionIndexName);

exports.AddToMusicIndex = functions.region("asia-northeast1").https.onCall(async(data, context) => {
 
  const musicID = data.musicID;
  const musicTitle = data.musicTitle;
  const musicArt = data.musicArt;
  const artist = data.artist;
  const createdOn = data.createdOn;
  const language = data.language;

  console.log("AddToMusicIndex cloud function");

  console.log("musicTitle: ",musicTitle);
  console.log("musicArt:" , musicArt)
  console.log("musicID: ",musicID);
  console.log("artist: ",artist);
  console.log("createdOn: ",createdOn);
  console.log("language: ",language);
  
  console.log("context.auth = ",context.auth);

  const record = {
    objectID: musicID,
    musicTitle:musicTitle, 
    musicArt:musicArt, 
    artist:artist, 
    createdOn:createdOn, 
    language :language
  };

    algoliaRecords.push(record);

    collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
        console.log("content : ",content);
        console.log("ERROR LOG : ",_error);

     if(_error === null || _error === undefined)
        console.log("The uploaded music has been indexed in algolia.");

    });
});
