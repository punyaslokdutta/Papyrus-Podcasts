const functions         = require('firebase-functions');
const admin=require('firebase-admin');
const algoliasearch=require('algoliasearch');


//const ALGOLIA_APP_ID = "BJ2O4N6NAY"
//const ALGOLIA_ADMIN_KEY="c169c60de08aa43d881bf81c223dda06"
//const ALGOLIA_INDEX_NAME='books'

admin.initializeApp();
const db = admin.firestore();
const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const collectionIndexName='books';
const collectionIndex = algoliaClient.initIndex(collectionIndexName);

exports.sendBooksToAlgolia = functions
                             .region('asia-northeast1')
                             .https.onRequest( async(req, res) => {
	const algoliaRecords = [];
	const querySnapshot = await db.collection('books').get();

	querySnapshot.docs.forEach(doc => {
		const document = doc.data();
        // Essentially, you want your records to contain any information that facilitates search, 
        // display, filtering, or relevance. Otherwise, you can leave it out.
        const record = {
            objectID: doc.id,
            bookName: (document.bookName===undefined)?null:document.bookName,
			authors: (document.authors===undefined)? null:document.authors,
            language: (document.language===undefined)?null:document.language,
            Book_cover:(document.bookPictures===undefined)?null:document.bookPictures[0],
        };

        if((document.bookName!==undefined))
        {
            algoliaRecords.push(record);
        }
    });
	
	collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
        res.status(200).send("books was indexed to Algolia successfully.");
    });
	
})





