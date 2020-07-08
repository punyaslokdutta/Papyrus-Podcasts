const functions = require('firebase-functions');
const algoliasearch=require('algoliasearch');

const algoliaRecords = [];

const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const collectionIndexName='prod_users';
const collectionIndex = algoliaClient.initIndex(collectionIndexName);

exports.AddToUsersIndex = functions.region("asia-northeast1").https.onCall(async(data, context) => {
 
  const name = data.name;
  const userID = data.userID;
  const displayPicture = data.displayPicture;

  const record = {
    objectID:userID,
    name:name, 
    userPicture:displayPicture
  };

  algoliaRecords.push(record);

  collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
    console.log("content : ",content);
    console.log("ERROR LOG : ",_error);

    if(_error === null || _error === undefined)
      console.log("The user has been indexed in algolia.");

  });
});
