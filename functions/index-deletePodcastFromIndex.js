const functions = require('firebase-functions');
const algoliasearch=require('algoliasearch');

const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const collectionIndexName='prod_podcasts';
const collectionIndex = algoliaClient.initIndex(collectionIndexName);

exports.deletePodcastFromIndex = functions.region("asia-northeast1").https.onCall(async(data, context) => {
 

  const podcastID=data.podcastID;
  
  console.log("deletePodcastFromIndex cloud function");

  console.log("podcastID: ",podcastID);
  
  console.log("context.auth = ",context.auth);

  collectionIndex.deleteObject(podcastID).then(() => {
      console.log("Deleted podcast from podcasts Index");
      return 1;
  }).catch((error) => {
    console.error("Error removing podcast from podcatsIndex: ", error);
  });

});
