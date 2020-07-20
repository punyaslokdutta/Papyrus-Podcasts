//import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
 
const firebaseApi={
    
      _signOutUser : async () => {
        try {
            await firebase.auth().signOut();
        } catch (e) {
            console.log(e);
        }
    },

    _checkUserAuth: async( user) => {
        return firebase.auth().onAuthStateChanged(user)
      },

      _passwordReset: async(email)  => {
        return firebase.auth().sendPasswordResetEmail(email).then(() => {
            Toast.show('A password reset mail has been sent to your emailID.')
        }).catch((error) => {
            var errorCode = error.code;
            if(errorCode==="auth/user-not-found")
                {
                    Toast.show('Sign up')
                    console.log("SignUp")
                }
        })
      },


     _createNewUser:async(user,fullName,userPreferences,languagePreferences) => {

        //const query11 = await firestore().collection('users').doc("656523232").get();
        console.log("createNewUser QQUUEERRYY");
        console.log(userName);
        var name = null;
        var pictureURL = user._user.photoURL;
        if(fullName == null)
            name = user._user.displayName;
        else
            name = fullName;




        const uId=user._user.uid;
        ////// username generation
        var splittedString = name.split(" ");
        var i;
        var userName = "";
        for(i=0;i<splittedString.length;i++)
            userName = userName + splittedString[i] + "_";
            
        userName= userName + uId.substring(3,9)
        //////

        if(pictureURL === null)
            pictureURL = "https://storage.googleapis.com/papyrus-fa45c.appspot.com/users/DefaultProfilePictures/WhatsApp%20Image%202020-03-29%20at%205.51.24%20PM.jpeg";
        
        const instance = firebase.app().functions("asia-northeast1").httpsCallable('AddToUsersIndex');
    
        try 
        {          
            await instance({ // change in podcast docs created by  user
                name : name,
                userID : uId,
                displayPicture : pictureURL
            });
        }
        catch (e) 
        {
            console.log(e);
        }
        
        const privateDataID = "private" + user._user.uid;
        
        try{
            await firestore().collection('users').doc(`${user._user.uid}`).collection('privateUserData').doc(privateDataID).set({
                id: user._user.uid,
                phoneNumber: user._user.phoneNumber,
                name: name,
                displayPicture: pictureURL,
                email: user._user.email,
                introduction: "",
                accountCreationTime: moment().format(),
                userName:userName,
                followingCount: 0,
                followingList: [],
                podcastsLiked: [],
                numCreatedBookPodcasts: 0, // On podcast upload
                numCreatedChapterPodcasts: 0,// On podcast upload
                numNotifications: 0,    
                languagesComfortableTalking: languagePreferences,
                listenedBookPodcastsCount: 0,
                listenedChapterPodcastsCount: 0,
                timespentByUserListening: 0,
                userPreferences: userPreferences,
                website : null        
            });
        }
        catch(error){
            console.log("Error in private Doc creation in createNewUser in firebaseApi: ",error)
        }
        
        try{
            await firestore().collection('users').doc(`${user._user.uid}`).set({
                id: user._user.uid,
                followerCount: 0,
                followersList: [],
                timespentTotalByUsersListening: 0,
                name: name,
                displayPicture: pictureURL
                });
        }
        catch(error){
            console.log("Error in public Doc creation in createNewUser in firebaseApi: ",error)
        }

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
     _getNumNotifications:async()=>{

        
       const privateDoc = await firestore().collection('users').doc(userID)
               .collection('privateUserData').doc(privateDataID).get();
        return privateDoc._data.numNotifications;
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
