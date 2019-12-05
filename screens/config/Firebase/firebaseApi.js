//import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/auth';


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


     /* _createNewUser=async(userData) => {

        const documentRef = await firestore.collection('users').add
        return firebase
          .firestore()
          .collection('users')
          .doc(`${userData.uid}`)
          .set(userData)
      }*/
    


      



      
    
     
      
      
   

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

    _getTimestamp:()=> {
        return Date.now();
    }, 
}

//firebaseApi.shared = new firebaseApi();
export default firebaseApi;


// Populating the firebaseConfig object with Context, you will be able to
// access all the functions as well as the user throughout this React Native app as props.
