//import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage'

 
const firebaseApi={
    
    
     
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


     _createNewUser:async(user,fullName,userName) => {

        //const query11 = await firestore().collection('users').doc("656523232").get();
        console.log("createNewUser QQUUEERRYY");
        console.log(userName);
        var name = null;
        if(fullName == null)
            name = user._user.displayName;
        else
            name = fullName;
        const user1 = await firestore().collection('users').doc(`${user._user.uid}`)
        
        let documentSnapshots = await user1.get();
        
        const doc1 = await user1.collection('privateUserData').doc("privateData").set({
                            uid: user._user.uid,
                            phoneNumber: user._user.phoneNumber,
                            name: name,
                            displayPicture: user._user.photoURL,
                            email: user._user.email,
                            introduction: "",
                            account_creation_time: Date.now(),
                            userName:userName,
                            following_count: 0,
                            following_list: [],
                            lastSignIn_time: Date.now(),//have to set it in Explore useEffect()
                            following_posts: [],
                            podcastsLiked: [],
                            created_book_podcasts_count: 0, // On podcast upload
                            created_chapter_podcasts_count: 0,// On podcast upload
                            languages_comfortable_talking: [],// In setPreferences
                            listened_book_podcasts_count: 0,
                            listened_chapter_podcasts_count: 0,
                            timespent_by_user_listening: 0        
        });

        const documentRef = await firestore().collection('users').doc(`${user._user.uid}`).set({
            id: user._user.uid,
            follower_count: 0,
            followers_list: [],
            timespent_total_by_listeners_listening: 0
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
