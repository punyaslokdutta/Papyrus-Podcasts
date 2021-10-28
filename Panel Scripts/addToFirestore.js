const firestore = require('@firebase/firestore');
const admin = require('firebase-admin')
const firebase = require('@firebase/app').default;
const firestoreService = require('firestore-export-import');//this one
const firebaseConfig = require('./config.js');//this one
const serviceAccount = require('./serviceAccount.json');//this one

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)//not required for uploading json to firestore
});
const db = admin.firestore()
var fs = require('fs');
var path = require('path');
var dirPath = "C:/Users/Swayam Dutta/Desktop/PAPYRUS/BookImages/books"; 
// JSON To Firestore
const jsonToFirestore = async () => {
  //try {
    //console.log('Initialzing Firebase');
    //await firestoreService.initializeApp(serviceAccount, firebaseConfig.databaseURL);//uncomment this line for uploading 
	                                                                                   // to firestore entire json
    //console.log('Firebase Initialized');
    
    // const users = await db.collection('Books').doc('9288').get();
    // console.log(users._data);
    const directoryPath = "C:/Users/Swayam Dutta/Desktop/PAPYRUS/BookImages/books";
    fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      } 
      //listing all files using forEach
      var count = 50;//100
      var ind = 3;
      var ext = 0;
      files.forEach(function (file) {
          // Do whatever you want to do with the file
          if(count!=0)
          {
             //let str1 = 'https://storage.cloud.google.com/papyrusbookimages/books/' + file;
            let str1 = 'https://storage.googleapis.com/papyrusbookimages/books/' + file;
            count--;

             db.collection('users').doc("CW1phdEHG6bDcGqqiWFEHrgPGiU2").collection("privateUserData")
                            .doc("privateData").collection('podcastRecommendations').add({
                              Duration : "35 mins",
                              Podcast_Name : "Podcasting" + ext,
                              Podcast_Pictures : [str1],
                              Timestamp:"31/11/2018",
                              podcastID: ext + 5,
                              podcasterName: "Shawn Paul George" 
                            }).then(function(docRef) {
                              console.log("Document written with ID: ", docRef.id);

                              db.collection('users').doc("CW1phdEHG6bDcGqqiWFEHrgPGiU2").collection("privateUserData")
                              .doc("privateData").collection('podcastRecommendations').doc(docRef.id).set({
                                      podcastID: docRef.id
                              },{merge:true});
                          })

            
            // db.collection('users').doc("yljl7kgsfvUJp4L7rVsDd1lj41H3").collection("privateUserData")
            //                                             .doc("privateData").set({
            //          podcast_recommendations : admin.firestore.FieldValue.arrayUnion({"Language" : "English",
            //                                          "Podcast_Name" : "Podcast " + ext,
            //                                          "Podcast_Pictures" : [str1],
            //                                          "Timestamp":"",
            //                                          "podcastID": "PodcastID" + ext,
            //                                          "indexFirestore": ext
            //                                         }) 
            //      },{ merge:true })

            console.log(str1); 
            ext = ext + 1;
          }
        });
  });
    
    

    //
  //
    //
   //


    // const books = await db.collection('Books').get();
    // console.log(books);
    // console.log(books.docs[10003]._ref.id);

    // var i;
    // for (i = 0; i < 10004; i++) 
    // {
    //   var id = books.docs[i]._ref.id;
    //   db.collection('Books').doc(id).set({
    //       bookID: id
    //   },{ merge:true })
    //   console.log("Document :" + i);
    // }




  //   let setWithOptions = users.set({
  //     capital: true
  //   }, {merge: true});
  //   var index = 0;
  //   var arr = [];
    
  //   fs.readdir(dirPath, async (err,list) => {
  //     //if(err) throw err;
      
  //     //const book = await db.collection('Books').doc('1');
  //     for(var i=0; i<list.length; i++)
  //     {
  //         //if(path.extname(list[i])===fileType)
  //             const bookID = list[i].substr(0,4);
  //             if(i!=0)
  //             {
  //               if(list[i-1].substr(0,4) != list[i].substr(0,4))
  //               {
  //                 index = 0;
  //                 arr = [];
  //               }
                  
  //             }
  //             //var index = 0;
  //             const fileext = path.extname(list[i]);
  //             let len = fileext.length;
  //             let totalLen = list[i].length;
  //             let str23 = list[i].substr(0,totalLen-len) 
  //             console.log(fileext.length);
  //             console.log(str23);
  //             const book = await db.collection('Books').doc(bookID);
  //              let str1 = 'https://storage.cloud.google.com/papyrusbookimages/books/' + str23 + fileext;
  //              if(i!=list.length - 1)
  //              {
  //                 if(list[i+1].substr(0,4) == list[i].substr(0,4))
  //                    {
  //                      arr[index++] = str1;
  //                      continue;
  //                    } 
  //                    arr[index] = str1;
  //              }
                 
  //              let setWithOptions = book.set({
  //                bookPictures: arr 
  //              }, {merge: true});
  //             //console.log(list[i].substr(0,4)); //print the file
  //             //files.push(list[i]); //store the file name into the array files
          
  //     }
  // });
   // setTimeout
    //await firestoreService.restore('./goodbooks10k.json');//uncomment this one for adding goodbooks10k.json to firestore
    //console.log('Upload Success');
  //}
  //catch (error) {
    //console.log("bakchodi");
    //console.log(error);
    //console.log("dfdd");
 // }
};

jsonToFirestore();