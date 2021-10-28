const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountProduction.json');//this one
const { firestore } = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)//not required for uploading json to firestore
});
const db = admin.firestore()

const addNumReweetsToPodcastDoc = async () => {

    try{
        const allReposts = await db.collectionGroup('bookmarks').get();
        const allRepostsData = allReposts.docs.map(document => document.data());
        var totalChapterPodcastReposts = 0;
        var totalBookPodcastReposts = 0;
        var updatedChapterPodcastsReposts = 0;
        var updatedBookPodcastsReposts = 0;

        for(var i=0;i<allRepostsData.length;i++)
        {
            const podcastID = allRepostsData[i].podcastID;
            console.log("reposts podcastID: ",podcastID);

            const bookID = allRepostsData[i].bookID;
            const chapterID = allRepostsData[i].chapterID;

            if(chapterID === null || chapterID === undefined)
            {
                totalBookPodcastReposts++;
                db.collection('books').doc(bookID).collection('podcasts').doc(podcastID).set({
                    numUsersRetweeted : admin.firestore.FieldValue.increment(1)
                },{merge:true}).then(() => {
                    console.log("Successfully updated podcast ",podcastID," of book ",bookID);
                    updatedBookPodcastsReposts++;
                    console.log("updated chapter Podcast reposts: ",updatedChapterPodcastsReposts);
                    console.log("updated book Podcast reposts: ",updatedBookPodcastsReposts);
                }).catch((err) => {
                    console.log("Error in adding podcast ",podcastID," of book ",bookID);
                    console.log(err)
                })
            }
            else if(chapterID !== null && chapterID !== undefined)
            {
                totalChapterPodcastReposts++;
                db.collection('books').doc(bookID).collection('chapters').doc(chapterID).collection('podcasts').doc(podcastID).set({
                    numUsersRetweeted : admin.firestore.FieldValue.increment(1)
                },{merge:true}).then(() => {
                    console.log("Successfully updated podcast ",podcastID,"of chapter ",chapterID, " of book ",bookID);
                    updatedChapterPodcastsReposts++;
                    console.log("updated chapter Podcast reposts: ",updatedChapterPodcastsReposts);
                    console.log("updated book Podcast reposts: ",updatedBookPodcastsReposts);
                }).catch((err) => {
                    console.log("Error in adding podcast ",podcastID,"of chapter ",chapterID," of book ",bookID);
                    console.log(err)
                })
            }
        }

        
    }
    catch(error){
        console.log("Error : ",error);
    }
    finally{
        console.log("Total chapter Podcast reposts: ",totalChapterPodcastReposts);
        console.log("Total book Podcast reposts: ",totalBookPodcastReposts);
        console.log("updated chapter Podcast reposts: ",updatedChapterPodcastsReposts);
        console.log("updated book Podcast reposts: ",updatedBookPodcastsReposts);
        //console.log("Total reposts: ",allRepostsData.length);
    }
}

addNumReweetsToPodcastDoc();