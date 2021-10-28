const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountProduction.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function reviewAllBooksInFirestore(){

    db.collection("books").orderBy('lastEdited','desc').limit(300).get().then(response => {
        let batch = db.batch();
        var numBooksReviewed = 0;
        response.docs.forEach(function(doc) {
            console.log(doc._fieldsProto.bookID);
            const docRef = db.collection("books").doc(doc._fieldsProto.bookID.stringValue);
            batch.update(docRef, {reviewPending : false}) 
            numBooksReviewed = numBooksReviewed + 1;
        });

        return batch.commit().then(() => {
            console.log("Total books reviewed: ",numBooksReviewed);
            return true;
        })
    }).catch(err => console.log(err));

    return true;
};
    


reviewAllBooksInFirestore();
