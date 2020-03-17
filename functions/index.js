const functions         = require('firebase-functions');
const admin=require('firebase-admin');
const algoliasearch=require('algoliasearch');


//const ALGOLIA_APP_ID = "BJ2O4N6NAY"
//const ALGOLIA_ADMIN_KEY="c169c60de08aa43d881bf81c223dda06"
//const ALGOLIA_INDEX_NAME='Books'

admin.initializeApp();
const db = admin.firestore();
const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const collectionIndexName='Books';
const collectionIndex = algoliaClient.initIndex(collectionIndexName);

exports.sendBooksToAlgolia = functions
                             .region('asia-northeast1')
                             .https.onRequest( async(req, res) => {

	// This array will contain all records to be indexed in Algolia.
	// A record does not need to necessarily contain all properties of the Firestore document,
	// only the relevant ones. 
	const algoliaRecords = [];

	// Retrieve all documents from the COLLECTION collection.
	const querySnapshot = await db.collection('Books').get();

	querySnapshot.docs.forEach(doc => {
		const document = doc.data();
        // Essentially, you want your records to contain any information that facilitates search, 
        // display, filtering, or relevance. Otherwise, you can leave it out.
        const record = {
            objectID: doc.id,
            Book_Name: (document.title===undefined)?null:document.title,
			      Author_Name: (document.authors===undefined)? null:document.authors[0],
            Language: (document.language===undefined)?null:document.language,
            Book_cover:(document.bookPictures===undefined)?null:document.bookPictures[0],
        };

        if((document.title!==undefined))
        {
            algoliaRecords.push(record);
        }
    });
	
	// After all records are created, we save them to 
	collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
        res.status(200).send("Books was indexed to Algolia successfully.");
    });
	
})


// const { tmpdir }        = require("os");
// const { Storage }       = require("@google-cloud/storage");
// const { dirname, join } = require("path");
// const sharp             = require("sharp");
// const fs                = require("fs-extra");
// const gcs               = new Storage();

// exports.resizeImg = functions
//                   .region('asia-')
//                   .runWith({ memory: "2GB", timeoutSeconds: 120 })
//                   .storage
//                   .object()
//                   .onFinalize(async (object) => {
//   const bucket    = gcs.bucket(object.bucket);
//   const filePath  = object.name;
//   const fileName  = filePath.split("/").pop();
//   const bucketDir = dirname(filePath);

//   const workingDir  = join(tmpdir(), "resize");
//   const randomNr = Math.random().toString(36).substring(2, 15) +
//             Math.random().toString(36).substring(2, 15)
//   const tmpFilePath = join(workingDir, `source_${randomNr}.png`)
//   //const tmpFilePath = join(workingDir, "source.png");

//   console.log(`Got ${fileName} file`);

//   if (fileName.includes("@s_") || !object.contentType.includes("image")) {
//     console.log(`Already resized. Exiting function`);
//     return false;
//   }

//   await fs.ensureDir(workingDir);
//   await bucket.file(filePath).download({ destination: tmpFilePath });

//   const sizes = [ 1920, 720, 100 ];

//   const uploadPromises = sizes.map(async (size) => {

//     console.log(`Resizing ${fileName} at size ${size}`);

//     const ext        = fileName.split('.').pop();
//     const imgName    = fileName.replace(`.${ext}`, "");
//     const newImgName = `${imgName}@s_${size}.${ext}`;
//     const imgPath    = join(workingDir, newImgName);
//     await sharp(tmpFilePath).resize({ width: size }).toFile(imgPath);

//     console.log(`Just resized ${newImgName} at size ${size}`);

//     return bucket.upload(imgPath, {
//       destination: join(bucketDir, newImgName)
//     });

//   });

//   await Promise.all(uploadPromises);
//   await fs.emptyDir(workingDir)
//   await fs.remove(workingDir)

  

// });


