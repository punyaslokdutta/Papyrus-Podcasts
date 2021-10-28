const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccount.json');//this one

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)//not required for uploading json to firestore
});
const db = admin.firestore()
var fs = require('fs');

const jsonToFirestore = async () => {

    const allPodcasts = await db.collectionGroup('Podcasts').get();
    
    const podcastsData = allPodcasts.docs.map(document => document.data());
    console.log("Podcast Data --> ",podcastsData)
    var allPodcastsJSON = JSON.stringify(podcastsData,null,4);
    console.log("All podcast documents JSON --> ",allPodcastsJSON);

    fs.writeFile("./allPodcasts.json", allPodcastsJSON, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });
} 

jsonToFirestore();