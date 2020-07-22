const functions = require('firebase-functions');
const admin=require('firebase-admin');
const algoliasearch=require('algoliasearch');
const serviceAccount = require('./serviceAccountProduction.json');//this one


const algoliaRecords = [];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)//not required for uploading json to firestore
});

const db = admin.firestore();
const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const collectionIndexName='prod_podcasts';
const collectionIndex = algoliaClient.initIndex(collectionIndexName);

exports.AddToPodcastsIndex = functions.region("asia-northeast1").https.onCall(async(data, context) => {
 

  const podcastName=data.podcastName;
  const bookName=data.bookName;
  const chapterName = data.chapterName;
  const podcastPicture= data.podcastPicture;
  const podcastID=data.podcastID;
  const podcasterName=data.podcasterName
  const createdOn=data.createdOn
  const language =data.language

  
  // Adding Podcaster Display Picture to Podcast Doc until all the users are updated with latest app version with previewScreen changes
  const podcastQuery = await db.collectionGroup('podcasts').where('podcastID','==',data.podcastID).get();
  const podcastData = podcastQuery.docs[0].data();

  // const podcastGenres = podcastData.genres;

  // for(var i=0;i<podcastGenres.length;i++)
  // {
  //   const categoryDocs = await db.collection('Categories').where('categoryName','==',podcastGenres[i]).get();
  //   const categoryID = categoryDocs.docs[0].id;
  //   await db.collection('Categories').doc(categoryID).set({
  //     numPodcasts : admin.firestore.FieldValue.increment(1)
  //   },{merge:true})
  // }


  console.log("podcastData: ",podcastData);
  
  const podcasterQuery = await db.collection('users').doc(podcastData.podcasterID).get();
  const podcasterData = podcasterQuery.data();

  console.log("podcasterData: ",podcasterData);

  if(podcastData.lastEditedOn === undefined || podcastData.lastEditedOn === null)
  {
    if(podcastData.isChapterPodcast === true)
    {
      await db.collection('books').doc(podcastData.bookID).collection('chapters').doc(podcastData.chapterID).collection('podcasts')
                .doc(podcastData.podcastID).set({
                  podcasterDisplayPicture : podcasterData.displayPicture,
                  lastEditedOn : podcastData.createdOn 
                },{merge:true}).then(() => {
                  console.log("Successfully added podcasterDisplayPicture & lastEditedOn to podcast Document.");
                  return null;
                }).catch((err) => console.log(err))
    }
    else
    {
      await db.collection('books').doc(podcastData.bookID).collection('podcasts').doc(podcastData.podcastID).set({
                  podcasterDisplayPicture : podcasterData.displayPicture,
                  lastEditedOn : podcastData.createdOn 
                },{merge:true}).then(() => {
                  console.log("Successfully added podcasterDisplayPicture & lastEditedOn to podcast Document.");
                  return null;
                }).catch((err) => console.log(err))
    }
  }
  

  

  console.log("AddToPodcastsIndex cloud function");

  console.log("podcastName: ",podcastName);
  console.log("bookName: ",bookName);
  console.log("chapterName: ",chapterName);
  console.log("podcastPicture:" , podcastPicture)
  console.log("podcastID: ",podcastID);
  console.log("podcasterName: ",podcasterName);
  console.log("createdOn: ",createdOn);
  console.log("language: ",language);
  
  console.log("context.auth = ",context.auth);

  const record = {
    objectID: podcastID,
    podcastName:podcastName, 
    podcastPicture:podcastPicture,
    bookName: bookName,
    chapterName: chapterName,  
    podcasterName:podcasterName, 
    createdOn:createdOn, 
    language :language
};




algoliaRecords.push(record);

collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
  console.log("content : ",content);
  console.log("ERROR LOG : ",_error);

  if(_error === null || _error === undefined)
    console.log("The uploaded podcast has been indexed in algolia.");

});
});
