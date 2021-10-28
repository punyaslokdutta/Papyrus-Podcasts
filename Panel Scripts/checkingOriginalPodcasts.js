const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccount.json');//this one

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)//not required for uploading json to firestore
});
const db = admin.firestore()

const checkingOriginalPodcasts = async () => {

    try{
        const originalPodcasts = await db.collectionGroup('podcasts').where("isOriginalPodcast",'==',true).get();
        const originalPodcastsData = originalPodcasts.docs[0].data();
        console.log("originalPodcastsData : ",originalPodcastsData);
    }
    catch(error){
        console.log("Error : ",error);
    }
}

checkingOriginalPodcasts();