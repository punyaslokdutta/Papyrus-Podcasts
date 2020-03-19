
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)//not required for uploading json to firestore
  });


exports.addActivity = functions.region("asia-northeast1").https.onCall((data, context) => {
 
  const userItem = data.userItem;
  const creationTimestamp = data.timestamp;
  const podcast = data.podcast;
  const likerOrFollowerID = context.auth.uid;
  const likerOrFollowerImage = data.photoURL;
  const podcastID = data.PodcastID;
  const userID = data.userID;
  const podcastPicture = data.podcastImageURL;
  const type = data.type;
  const likerOrFollowerName = data.Name;
  const podcastName = data.podcastName;

  console.log("ACTIVITY DETAILS: ");

  console.log("userItem: ",userItem);
  console.log("type: ",type);
  console.log("podcast: ",podcast);
  console.log("creationTimestamp: ",creationTimestamp);
  console.log("likerOrFollowerID: ",likerOrFollowerID);
  console.log("likerOrFollowerImage: ",likerOrFollowerImage);
  console.log("likerOrFollowerName: ",likerOrFollowerName);
  console.log("podcastID: ",podcastID);
  console.log("userID: ",userID);
  console.log("podcastPicture: ",podcastPicture);
  console.log("podcastName: ",podcastName);

  console.log("context.auth = ",context.auth);
  
  const db = admin.firestore();
  
  // FOLLOW activity
  if(podcast === undefined)
    {
      db.collection('users').doc(userID).collection('privateUserData').doc('privateData').collection('Activities').add({
        userItem : {userItem},
        type : type,
        creationTimestamp: creationTimestamp,
        actorID: likerOrFollowerID,
        actorImage: likerOrFollowerImage,
        actorName: likerOrFollowerName
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
       return db.collection('users').doc(userID).collection('privateUserData').doc('privateData').collection('Activities')
                .doc(docRef.id).set({
                    activityID: docRef.id
                },{merge:true})
    
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    }
  else // LIKE activity
    {
      db.collection('users').doc(userID).collection('privateUserData').doc('privateData').collection('Activities').add({
        userItem : {userItem},
        type : type,
        creationTimestamp: creationTimestamp,
        actorID: likerOrFollowerID,
        actorImage: likerOrFollowerImage,
        actorName: likerOrFollowerName,
        podcastID: podcastID,
        podcastPicture: podcastPicture,
        podcastName: podcastName,
        podcast : {podcast}
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
       return db.collection('users').doc(userID).collection('privateUserData').doc('privateData').collection('Activities')
                .doc(docRef.id).set({
                    activityID: docRef.id
                },{merge:true})
    
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    }  
  
  
  
      return true;
  });





