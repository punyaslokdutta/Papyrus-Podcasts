//import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/auth';

bookRec = [
    {
        "Author_DP_Link" : "https://en.wikipedia.org/wiki/Yuval_Noah_Harari#/media/File:Yuval_Noah_Harari_cropped.jpg",
        "Author_Name" : "Yuval Noah Harari",
        "About_the_Author" : "Bakwaas",
        "Book_Picture" : "https://www.booktopia.com.au/http_coversbooktopiacomau/big/9780670078189/0000/the-arsonist.jpg",
        "Language" : "English",
        "Book_Rating" : 4.5,
        "Book_Name" : "Sapiens",
        "BookID" : "7gGB4CjIiGRgB8yYD8N3"
      },
      {
        "Author_DP_Link" : "https://en.wikipedia.org/wiki/Dan_Brown#/media/File:Dan_Brown_bookjacket_cropped.jpg",
        "Author_Name" : "Dan Brown",
        "About_the_Author" : "Bakwaas2",
        "Book_Picture" : "https://images-na.ssl-images-amazon.com/images/I/712guFgz8uL._AC_UL160_.jpg",
        "Language" : "English",
        "Book_Rating" : 4.6,
        "Book_Name" : "Angels & Demons",
        "BookID" : "qDmvY1EumpKvwQdjjdQk"
      } 
  ]
  podRec = [
              {
                 "Podcast_Pictures": ["https://www.sapiens.org/wp-content/uploads/2019/07/SapiensAlbumCoverBanner-1.jpg"],
                 "Podcast_Name": "History of Homo Sapiens",
                 "Language": "English",
                 "Timestamp": "9:00:00 PM",
                 "podcastID": "0GF46N2E5d91idp51NQ8" 
              },
              {
                "Podcast_Pictures": ["http://alessandria.bookrepublic.it/api/books/9788834141076/cover"],
                "Podcast_Name": "Our reality.",
                "Language": "English",
                "Timestamp": "10:00:25 PM",
                "podcastID": "DEpdGiWLTQK4C0te0nim"
              },
              {
                "Podcast_Pictures": ["https://miro.medium.com/max/1920/1*ycr2IXne71_gyClvXAX1Zw.jpeg"],
                "Podcast_Name" : "The purpose of demons and angels.",
                "Language": "English",
                "Timestamp": "15:00:00",
                "podcastID": "16UivAKfY1zhm3LON701"
              }
  
           ]

//////////////
  
//firebase configs are initialized in the google-services.js
//loginWithEmail
//signupWithEmail
//signout
//checkUserAuth
// createNewUser , to firestore 
//HOC 
const firebaseApi={
    
     _signupWithEmail: async (email, password) =>{
        try {
          await auth().createUserWithEmailAndPassword(email, password);
        } catch (e) {
          console.error(e.message);
        }
      },

      _loginWithEmail :async (email, password) => {
        try {
           await firebase
             .auth()
             .signInWithEmailAndPassword(email, password)
             .then(res => {
                 console.log(res.user.email);
          });
    } catch (error) {
          console.log(error.toString(error));
        }
      },
      _signOutUser : async () => {
        try {
            //await AsyncStorage.clear();
    //this.props.navigation.navigate('Auth');
            await firebase.auth().signOut();
            navigate('Auth');
        } catch (e) {
            console.log(e);
        }
    },

    _checkUserAuth: async( user) => {
        return firebase.auth().onAuthStateChanged(user)
      },
      _passwordReset: async(email)  => {
        return firebase.auth().sendPasswordResetEmail(email)
      },


     _createNewUser:async(user) => {

        //const query11 = await firestore().collection('users').doc("656523232").get();
        console.log("QQUUEERRYY");
        //console.log(query11);
        
    
        const user1 = await firestore().collection('users').doc(`${user._user.uid}`)
        let documentSnapshots = await user1.get();
        // let documentSnapshots = await initialQuery.get();
        // console.log(documentSnapshots);
        const doc1 = await user1.collection('privateUserData').doc("privateData").set({
                            uid: user._user.uid,
                            phoneNumber: user._user.phoneNumber,
                            account_creation_time: 25,
                            lastSignIn_time: 26,
                            following_posts: [],
                            book_recommendations: bookRec,
                            podcast_recommendations: podRec,
                            listen_count_in_previous_day: 0,
                            podcasts_list_user_liked: 0,
                            retention_rate_of_listeners: 0,
                            gnosis_score: 0
        });

        const documentRef = await firestore().collection('users').doc(`${user._user.uid}`).set({
            name: user._user.displayName,
            username: "",
            displayPicture: user._user.photoURL,
            email: user._user.email,
            introduction: "",
            follower_count: 0,
            following_count: 0,
            followers_list: [],
            following_list: [],
            listened_book_podcasts_count: 0,
            listened_chapter_podcasts_count: 0,
            created_book_podcasts_count: 0,
            created_chapter_podcasts_count: 0,
            timespent_by_user_listening: 0,
            timespent_total_by_listeners_listening: 0,
            languages_comfortable_talking: [], 
            timestamp : Date.now()
            });
        console.log("Firestore mei Data ADD HO GAYA")
    console.log(doc1);

    },

    _addPost:async ({text, localUri}) => {
        const remoteUri = await this.uploadPhotoAsync(localUri);

        return new Promise((res, rej) => {
            this.firestore
                .collection("posts")
                .add({
                    text,
                    uid: this.uid,
                    timestamp: this.timestamp,
                    image: remoteUri
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    },


    _uploadPhotoAsync: async uri => {
        const path = `photos/${this.uid}/${Date.now()}.jpg`;

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase
                .storage()
                .ref(path)
                .put(file);

            upload.on(
                "state_changed",
                snapshot => {},
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        });
    },

    _getFirestore:()=> {
        return firebase.firestore();
    },
    _getUid:()=> {
        return (firebase.auth().currentUser || {}).uid;
    },
    _getphotoURL:()=> {
        return (firebase.auth().currentUser || {}).photoURL;
    },
    _getTimestamp:()=> {
        return Date.now();
    }, 
    _isNewUser: async(user)=> {
        query = await firebase.firestore().collection('users').doc(user.user.uid).get();
        return true;
    },
}

//firebaseApi.shared = new firebaseApi();
export default firebaseApi;


// Populating the firebaseConfig object with Context, you will be able to
// access all the functions as well as the user throughout this React Native app as props.
