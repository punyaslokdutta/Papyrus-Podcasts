
const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase)

exports.addActivity = functions.region("asia-northeast1").https.onCall(async(data, context) => {
 

  const creationTimestamp = data.timestamp;
  const likerOrFollowerID = context.auth.uid;
  const likerOrFollowerImage = data.photoURL;
  const podcastID = data.podcastID;
  const userID = data.userID;
  const podcastPicture = data.podcastImageURL;
  const type = data.type;
  const likerOrFollowerName = data.Name;
  const podcastName = data.podcastName;
  const bookID = data.bookID;
  const chapterID = data.chapterID;
  const isChapterPodcast = data.isChapterPodcast;
  const likeUpdatedInDocument = data.likeUpdatedInDocument;

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
  console.log("bookID: ",bookID);
  console.log("chapterID: ",chapterID);
  console.log("isChapterPodcast: ",isChapterPodcast);
  console.log("likeUpdatedInDocument: ",likeUpdatedInDocument);
  console.log("context.auth = ",context.auth);
  
  const db = admin.firestore();
  const privateDataID = "private" + userID;

  if(type === "invite")
  {
    db.collection('users').doc(userID).collection('privateUserData').doc(privateDataID).collection('Activities').add({
      type : type,
      creationTimestamp: creationTimestamp,
      actorID: likerOrFollowerID,
      actorImage: likerOrFollowerImage,
      actorName: likerOrFollowerName,
      channelName: data.channelName
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

  // FOLLOW activity
  else if(podcastName === undefined)
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
      try{
        if(likeUpdatedInDocument === true)
        {
          console.log("[addActivity] numUsersLiked has already been updated in firestore.So, not updating here.");
        }
        else
        {
          if(isChapterPodcast === true)// && props.podcast.chapterID !== undefined)
          {
            console.log("updating numUsersLiked in chapterpodcast")
            await db.collection('books').doc(bookID).collection('chapters').doc(chapterID)
                                  .collection('podcasts').doc(podcastID).update({
                      numUsersLiked : admin.firestore.FieldValue.increment(1)
                })
          }
          else if(isChapterPodcast === false)
          {
            console.log("updating numUsersLiked in bookpodcast")
            await db.collection('books').doc(bookID).collection('podcasts').doc(podcastID)
                      .update({
                numUsersLiked : admin.firestore.FieldValue.increment(1)
            })
          }
          else if(isChapterPodcast === undefined || isChapterPodcast === null)
          {
            console.log("updating numUsersLiked in original podcast")
            await db.collection('podcasts').doc(podcastID).update({
                numUsersLiked : admin.firestore.FieldValue.increment(1)
            })
          }
        }   
      }
      catch(error){
        console.log("Error in updating numUsersLiked: ",error)
      }
     


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





