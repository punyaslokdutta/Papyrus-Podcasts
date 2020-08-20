const functions = require('firebase-functions');
const admin=require('firebase-admin');
const algoliasearch=require('algoliasearch');
admin.initializeApp(functions.config().firebase)
const db = admin.firestore();

/////////////////////
// AddToPodcastsIndex 
/////////////////////
exports.AddToPodcastsIndex = functions.region("asia-northeast1").https.onCall(async(data, context) => {
 
  const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
  var algoliaRecords = [];
  const collectionIndexName='dev_podcasts';
  const collectionIndex = algoliaClient.initIndex(collectionIndexName);

  const podcastName=data.podcastName;
  const bookName=data.bookName;
  const chapterName = data.chapterName;
  const podcastPicture= data.podcastPicture;
  const podcastID=data.podcastID;
  const podcasterName=data.podcasterName
  const createdOn=data.createdOn
  const language =data.language

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


/////////////////////
// AddToUsersIndex 
/////////////////////

exports.AddToUsersIndex = functions.region("asia-northeast1").https.onCall(async(data, context) => {
 
  const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);

  var algoliaRecords = [];
  const collectionIndexName='dev_users';
  const collectionIndex = algoliaClient.initIndex(collectionIndexName);
  
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


/////////////////////
// deletePodcastFromIndex 
/////////////////////

exports.deletePodcastFromIndex = functions.region("asia-northeast1").https.onCall(async(data, context) => {
 
  const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);

  const collectionIndexName='dev_podcasts';
  const collectionIndex = algoliaClient.initIndex(collectionIndexName);

  const podcastID=data.podcastID;
  console.log("deletePodcastFromIndex cloud function");
  console.log("podcastID: ",podcastID);
  console.log("context.auth = ",context.auth);

  collectionIndex.deleteObject(podcastID).then(() => {
      console.log("Deleted podcast from podcasts Index");
      return 1;
  }).catch((error) => {
    console.error("Error removing podcast from podcastsIndex: ", error);
  });

});

/////////////////////
// addBookToIndex 
/////////////////////

exports.addBookToIndex = functions.region("asia-northeast1").https.onCall((data, context) => {

    const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);

  const collectionIndexName='dev_books';
  const collectionIndex = algoliaClient.initIndex(collectionIndexName);

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


/////////////////////
// addChapterToIndex 
/////////////////////


exports.addChapterToIndex = functions.region("asia-northeast1").https.onCall((data, context) => {
 
    const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);

  var algoliaRecords = [];
  const collectionIndexName='dev_chapters';
  const collectionIndex = algoliaClient.initIndex(collectionIndexName);
  
  const bookName=data.bookName;
  const chapterName=data.chapterName
  const chapterCover= data.chapterCover;
  const createdOn=data.createdOn;
  const language =data.language;
  const authors=data.authors;
  const publicationYear = data.publicationYear;
  const chapterID = data.objectID;
  const bookID = data.bookID;

  console.log("addChapterToIndex cloud function");

 
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
    console.log("The uploaded chapter has been indexed in algolia.");

});
});



/////////////////////
// AddToMusicIndex 
/////////////////////

exports.AddToMusicIndex = functions.region("asia-northeast1").https.onCall(async(data, context) => {
 
    const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);

  var algoliaRecords = [];
  const collectionIndexName='dev_music';
  const collectionIndex = algoliaClient.initIndex(collectionIndexName);

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


/////////////////////
// changeDPInPodcastsAsiaEast 
/////////////////////


exports.changeDPInPodcastsAsiaEast = functions.region("asia-northeast1").https.onCall((data, context) => {

    const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);

  const collectionIndexName='dev_users';
  const collectionIndex = algoliaClient.initIndex(collectionIndexName);

  const DPSetInSettingsScreen = data.changedDP;
  const uid = context.auth.uid;
  console.log("User ID: ",uid);
  console.log("data variable: ",data);
  
  const objects = [{
   userPicture: DPSetInSettingsScreen,
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
             batch.update(docRef, {podcasterDisplayPicture : DPSetInSettingsScreen}) 
           }
           else if(doc._fieldsProto.isChapterPodcast.booleanValue === true)
           {
             const docRef = db.collection('books').doc(doc._fieldsProto.bookID.stringValue).collection('chapters').doc(doc._fieldsProto.chapterID.stringValue)
                           .collection('podcasts').doc(doc._fieldsProto.podcastID.stringValue);
             batch.update(docRef, {podcasterDisplayPicture : DPSetInSettingsScreen}) 
           }
          
         }
         else if(doc._fieldsProto.isOriginalPodcast.booleanValue === true)
          {
            const docRef = db.collection('podcasts').doc(doc._fieldsProto.podcastID.stringValue);
            batch.update(docRef, {podcasterDisplayPicture : DPSetInSettingsScreen}) 
          }
        
    })
    return batch.commit().then(() => {
        console.log('updated all podcast documents of podcasterID - ',uid);
        return true;
    })
 }).catch(err => console.log(err));
 
      return true;
  });


/////////////////////
// changeUserNameInPodcastsAsiaEast 
/////////////////////


exports.changeUserNameInPodcastsAsiaEast = functions.region("asia-northeast1").https.onCall((data, context) => {

  const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);

  const collectionIndexName='dev_users';
  const collectionIndex = algoliaClient.initIndex(collectionIndexName);

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
          else if(doc._fieldsProto.isOriginalPodcast.booleanValue === true)
          {
            const docRef = db.collection('podcasts').doc(doc._fieldsProto.podcastID.stringValue);
            batch.update(docRef, {podcasterName : nameSetInSettingsScreen}) 
          }   
    })
    return batch.commit().then(() => {
        console.log('updated all podcast documents of podcasterID - ',uid);
        return true;
    })
  }).catch(err => console.log(err));
  
      return true;
});

/////////////////////////////////
/////////////////////////////////
/////////////////////////////////
   



