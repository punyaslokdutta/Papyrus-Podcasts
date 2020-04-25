const functions = require('firebase-functions');
const admin=require('firebase-admin');
const algoliasearch=require('algoliasearch');


admin.initializeApp();
const db = admin.firestore();
const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const collectionIndexName='dev_books';
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
          console.log("bookID = ",document.bookID);
          console.log("bookName = ",document.bookName);
          console.log("bookPictures = ",document.bookPictures);
          console.log("authors = ",document.authors);
          console.log("language = ",document.language);
          console.log("publicationYear = ",document.publicationYear);

        const record = {
            objectID: document.bookID,
            bookName: (document.bookName===undefined)?null:document.bookName,
		      	authors: (document.authors===undefined)? null:document.authors,
            language: (document.language===undefined)?null:document.language,
            bookCover:(document.bookPictures===undefined)?null:document.bookPictures[0],
            publicationYear: (document.publicationYear===undefined || document.publicationYear===null) ? null : document.publicationYear
        };

        if(document.bookName !== undefined && document.bookID !== undefined && document.bookID !== null)
        {
            algoliaRecords.push(record);
        }
    });
	
	collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
        
        console.log("_error : ",_error);
        res.status(200).send("books was indexed to Algolia successfully.");
    });
	
})





