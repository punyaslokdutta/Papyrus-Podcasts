
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)//not required for uploading json to firestore
  });


exports.addActivity = functions.region("asia-northeast1").https.onCall((data, context) => {
 

  const creationTimestamp = data.timestamp;
  const likerOrFollowerID = context.auth.uid;
  const likerOrFollowerImage = data.photoURL;
  const podcastID = data.podcastID;
  const userID = data.userID;
  const podcastPicture = data.podcastImageURL;
  const type = data.type;
  const likerOrFollowerName = data.Name;
  const podcastName = data.podcastName;

  console.log("ACTIVITY DETAILS: ");

  console.log("type: ",type);
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
  const privateDataID = "private" + userID;
  // FOLLOW activity
  if(podcastName === undefined)
    {

      db.collection('users').doc(userID).collection('privateUserData').doc(privateDataID).collection('Activities').add({
        type : type,
        creationTimestamp: creationTimestamp,
        actorID: likerOrFollowerID,
        actorImage: likerOrFollowerImage,
        actorName: likerOrFollowerName
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
       return db.collection('users').doc(userID).collection('privateUserData').doc(privateDataID).collection('Activities')
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
      db.collection('users').doc(userID).collection('privateUserData').doc(privateDataID).collection('Activities').add({
        type : type,
        creationTimestamp: creationTimestamp,
        actorID: likerOrFollowerID,
        actorImage: likerOrFollowerImage,
        actorName: likerOrFollowerName,
        podcastID: podcastID,
        podcastPicture: podcastPicture,
        podcastName: podcastName
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
       return db.collection('users').doc(userID).collection('privateUserData').doc(privateDataID).collection('Activities')
                .doc(docRef.id).set({
                    activityID: docRef.id
                },{merge:true})
    
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    }  
  
    db.collection('users').doc(userID).collection('privateUserData').doc(privateDataID).set({
        numNotifications: admin.firestore.FieldValue.increment(1)
    },{merge:true}).then(
      () => {
        console.log("Added 1 to numNotifications in privateData");
        return true;
      })
      .catch(function(error) {
        console.error("Error adding 1 to numNotifications to user's private document: ", error);
    });
  
  
      return true;
  });





