
  const functions = require("firebase-functions");
  const admin = require('firebase-admin');
  const serviceAccount = require('./serviceAccount.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)//not required for uploading json to firestore
    });


  exports.addActivityFlipLike = functions.region("asia-northeast1").https.onCall(async(data, context) => {
  

    const creationTimestamp = data.timestamp;
    const likerID = context.auth.uid;
    const likerImage = data.photoURL;
    const flipID = data.flipID;
    const userID = data.userID;
    const flipPicture = data.flipImageURL;
    const type = data.type;
    const likerName = data.Name;
    const bookName = data.bookName;

    console.log("ACTIVITY DETAILS: ");

    console.log("type: ",type);
    console.log("creationTimestamp: ",creationTimestamp);
    console.log("likerID: ",likerID);
    console.log("likerImage: ",likerImage);
    console.log("likerName: ",likerName);
    console.log("flipID: ",flipID);
    console.log("userID: ",userID);
    console.log("flipPicture: ",flipPicture);
    console.log("bookName: ",bookName);
    

    console.log("context.auth = ",context.auth);
    
    const db = admin.firestore();
    const privateDataID = "private" + userID;    
      
      db.collection('users').doc(userID).collection('privateUserData').doc(privateDataID).collection('Activities').add({
      type : type,
      creationTimestamp: creationTimestamp,
      actorID: likerID,
      actorImage: likerImage,
      actorName: likerName,
      flipID: flipID,
      flipPicture: flipPicture,
      bookName: bookName
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





