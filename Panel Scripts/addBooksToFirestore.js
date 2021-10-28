const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccount.json');//this one

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)//not required for uploading json to firestore
});

const db = admin.firestore()
var fs = require('fs');
  
var langData = []; // data structure for containing array for the mapping of language codes to language names
const data = fs.readFileSync('./langCodes.csv').toString('utf8') // mapping of language codes to language names

let allTextLines = data.split("\r\n"); 

for(let i=0;i<allTextLines.length;i++)
{
    let rowTemp = allTextLines[i];
    for(let j=0;j<6;j++)
        rowTemp = rowTemp.replace('"','');
    let row = rowTemp.split(',');
    
    let col = []

    for(let j=0;j<row.length;j++){
        col.push(row[j])
    }

    langData.push(col);
}
// Here, we have the entire mapping inside this array called langData

function langCodeToName(language)
{
    var ans = null;
    for(let i=0;i<langData.length;i++)
    {
        if(langData[i][0] === language)
        {
            console.log(langData[i][2]);
            ans = langData[i][2];
            break;
        }
    }
    return ans;
}
    
var books = require('./10kbooks.json')

var count = 0;
books.forEach(function(obj) {

    let authors = [];
    let row = obj.authors.split(',');
    for(let i=0;i<row.length;i++)
        authors.push(row[i].trimLeft());

    var lang =  langCodeToName(obj.language_code);

    if(lang === undefined || lang === null)
    {
        lang = "NA";
        count=count+1;
    }
        
    db.collection("books").add({
        aboutTheAuthors : obj.about_the_author,
        authors : authors,
        bookDescription : obj.book_description,
        bookName: obj.original_title,
        source: "goodreads",
        bookPictures : [],
        bookRating : obj.average_rating,
        genres : [],
        isbn : obj.isbn,
        isbn13 : obj.isbn13,
        language : lang,
        listenCount : 0,
        podcastCount : 0,
        publicationYear : obj.original_publication_year,
        timestamp : Date.now(),
        reviewPending : false
    }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        db.collection('books').doc(docRef.id).set({
            bookID : docRef.id
        },{merge:true})
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
});

console.log("No. of NA language books : ",count);
//console.log("Total Books: ",)









///////////////////////////////



