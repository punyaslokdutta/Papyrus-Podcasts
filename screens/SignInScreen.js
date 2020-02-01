

import React, {Component} from 'react';
import {SafeAreaView,
  ActivityIndicator,
  TouchableOpacity, StyleSheet, Text, View, AsyncStorage, Dimensions, ImageBackground, Button, Image} from 'react-native';
import bgImage from '../assets/bgImage.jpg'
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Formik } from 'formik';
import * as yup from 'yup';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { firebase } from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firebaseApi from './config/Firebase/firebaseApi'
import {withFirebaseHOC} from '../screens/config/Firebase'
import {useDispatch,useSelector} from 'react-redux'


const validationSchema = yup.object().shape({
  email: yup
    .string()
    .label('Email')
    .email()
    .required("*Email is a required field"),
  password: yup
    .string()
    .label('Password')
    .required("*Password is a required field")
    .min(6, 'Password must be atleast 6 characters'),
    
});


var {width:WIDTH, height:HEIGHT}=Dimensions.get('window')
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

  
  const SignInScreen = (props) => {
  
  dispatch = useDispatch();
    // constructor(props)
  // {
  //   super(props)
  //   this.state = {
  //     userInfo: null,
  //     gettingLoginStatus: true,
  //   };
  // }
  // componentDidMount() {
  //   //initial configuration
  //   GoogleSignin.configure({
  //     //It is mandatory to call this method before attempting to call signIn()
  //    // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  //     // Repleace with your webClientId generated from Firebase console
  //     webClientId: '66057191427-s1qut9jum2u53i8gchv5u2cdtcoku2q2.apps.googleusercontent.com',
  //     offlineAccess: true
  //   });
  //   //Check if user is already signed in
  //   this._isSignedIn();
  // }



  // _isSignedIn = async () => {
  //   const isSignedIn = await GoogleSignin.isSignedIn();
  //   if (isSignedIn) {
  //     alert('User is already signed in');
  //     //Get the User details as user is already signed in
  //     this._getCurrentUserInfo();
  //   } else {
  //     //alert("Please Login");
  //     console.log('Please Login');
  //   }
  //   this.setState({ gettingLoginStatus: false });
  // };

  // _getCurrentUserInfo = async () => {
  //   try {
  //     const userInfo = await GoogleSignin.signInSilently();
  //     console.log('User Info --> ', userInfo);
  //     this.setState({ userInfo: userInfo });
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_REQUIRED) {
  //       alert('User has not signed in yet');
  //       console.log('User has not signed in yet');
  //     } else {
  //       alert("Something went wrong. Unable to get user's info");
  //       console.log("Something went wrong. Unable to get user's info");
  //     }
  //   }
  // };
  // _signIn = async () => {
  //   //Prompts a modal to let the user sign in into your application.
  //   try {
  //     await GoogleSignin.hasPlayServices({
  //       //Check if device has Google Play Services installed.
  //       //Always resolves to true on iOS.
  //       showPlayServicesUpdateDialog: true,
  //     });
  //     console.log("Crossed Play services ")
  //     GoogleSignin.configure({
  //       //It is mandatory to call this method before attempting to call signIn()
  //      // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  //       // Repleace with your webClientId generated from Firebase console
  //       offlineAccess: true,
  //       webClientId: '66057191427-s1qut9jum2u53i8gchv5u2cdtcoku2q2.apps.googleusercontent.com',
  //     });
  //     console.log(GoogleSignin.webClientId)
  //     const userInfo = await GoogleSignin.signIn();
  //     console.log('User Info --> ', userInfo);
  //     this.setState({ userInfo: userInfo });
  //   } catch (error) {
  //     console.log('Message', error.message);
  //     console.log(error.code)
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       console.log('User Cancelled the Login Flow');
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       console.log('Signing In');
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       console.log('Play Services Not Available or Outdated');
  //     } else {
  //       console.log(",,,,,,,,,,")
  //       //console.log('Some Other Error Happened');
  //     }
  //   }
  // };
 
  // _signOut = async () => {
  //   //Remove user session from the device.
  //   try {
  //     await GoogleSignin.revokeAccess();
  //     await GoogleSignin.signOut();
  //     this.setState({ userInfo: null }); // Remove the user from your app's state as well
  //   } catch (error) {
  //     console.error(error);
      
  //   }
  // };
 
  /*onGoogleLoginOrRegister = () => {
    
     GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      // google services are available
    .catch ((err) =>{
      console.error('play services are not available');
    })
    console.log(GoogleSignin.webClientId)
    console.log(GoogleSignin.offlineAccess)
    GoogleSignin.signIn()
    .then((data) => {
      // Create a new Firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      // Login with the credential
      return firebase.auth().signInWithCredential(credential);
    })
    .then((user) => {
      // If you need to do anything with the user, do it here
      // The user will be logged in automatically by the
      // `onAuthStateChanged` listener we set up in App.js earlier
    })
    .catch((error) => {
      const { code, message } = error;
      // For details of error codes, see the docs
      // The message contains the default Firebase string
      // representation of the error
      console.log(code);
      console.log(message);
    });
  };*/
  
  
  onFBLoginOrRegister = async () => {
    LoginManager.logInWithPermissions(['public_profile', 'email',])
      .then((result) => {
        if (result.isCancelled) {
          return Promise.reject(new Error('The user cancelled the request'));
        }
        // Retrieve the access token
        return AccessToken.getCurrentAccessToken();
      })
      .then((data) => {
        // Create a new Firebase credential with the token
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        // Login with the credential

        return firebase.auth().signInWithCredential(credential);
      })
      .then(async(user) => {
        // If you need to do anything with the user, do it here
        // The user will be logged in automatically by the
        // `onAuthStateChanged` listener we set up in App.js earlier
        console.log("username: ")
        console.log(user);
        console.log(user.user.uid);
        console.log(user.user.photoURL); 
        console.log(user.user.phoneNumber);
        console.log(user.user.displayName);
        console.log(user.user.email);
      
        //dispatch({type:"CHANGE_NAME", payload: user.user.displayName});
        //dispatch({type:"CHANGE_USER_NAME", payload: user.user.username});
        //dispatch({type:"CHANGE_DISPLAY_PICTURE", payload: user.user.displayPicture});

        // console.log("useDispatch & useSelector in SignInScreenNNNNNNNNNNNNNNNNNNNNNNNNNNNN\n\n");
        // const nam = useSelector(state=>state.userReducer.name);
        // const usrnam = useSelector(state=>state.userReducer.username);
        // const photo = useSelector(state=>state.userReducer.displayPictureURL);
        // console.log("My name is ",nam," & my username is ",usrnam," & this is my pic URL: ",photo);

      })
      .catch((error) => {
        const { code, message } = error;
        console.log(code);
        console.log(message);
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
      });
  }
  /*signIn=async()=>
  {
    await AsyncStorage.setItem('userToken', 'punyaslok') // This AsyncStorage store the token on the device, so that a user can be signed in when he/she revisits
    this.props.navigation.navigate('App')
  }
  Add persistent sign in with async storage like functionality 
  */






    
      return (
        
        <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={(values, actions) => {
        //alert(JSON.stringify(values));
        setTimeout(() => {
          actions.setSubmitting(false);
          this.props.navigation.navigate('App')
        }, 1000);
        
      }}
      validationSchema={validationSchema}
    >   
    {formikProps => (
      

      <SafeAreaView  style={styles.backgroundContainer} >
      <View style={{alignItems:'center', paddingBottom:HEIGHT/7}}>

          <TouchableOpacity style={{paddingTop:0 ,activeOpacity:0.2}}>
          
          <Image source={require('../assets/logo.png')} style={styles.image} />  
          <View style={{paddingLeft: 13, paddingTop: 10}}>
         <Text style={{ alignItems: 'center', fontFamily:'cursive', color:'white', justifyContent:'center', fontWeight: '900' }} >PAPYRUS PODCASTS</Text>
         </View>
         </TouchableOpacity>
         </View>

        
        
        <View style={styles.positions}>
          <TextInput style={styles.Input}   placeholder={'Email'} placeholderTextColor={'black'} underlineColorAndroid='transparent'
          onChangeText={formikProps.handleChange('email')}
          /> 
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.email && formikProps.errors.email}
          </Text>

        </View>
        <View style={styles.positions}>
        <TextInput style={styles.Input} placeholder={'Password'} placeholderTextColor={'black'} underlineColorAndroid='transparent'
          onChangeText={formikProps.handleChange('password')}
          secureTextEntry/> 
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.password && formikProps.errors.password}
          </Text>
          </View>
          {formikProps.isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <View>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:45, width:WIDTH -55, borderRadius:15, backgroundColor:'rgb(218,165,32)', borderColor:'black', borderWidth: 1 }}
        onPress={formikProps.handleSubmit} >
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'black', justifyContent:'center'}} >Login</Text>
                </TouchableOpacity>
             
              </View>
          )}
        

            <View>
            <TouchableOpacity style={{paddingTop:10, }}>
           <Text style={{ fontFamily:'sans-serif-light', color:'white', fontSize:12 }}>Forgot your Password?</Text>
         </TouchableOpacity>
            </View>
            <View style={{ paddingTop:10 }}>
          
           <Text style={{ fontFamily:'sans-serif-light', color:'white',  fontSize:12 }}>OR Login with </Text>
         
            </View>

            <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{paddingTop:20,paddingRight:WIDTH/8 }} onPress={(this.onFBLoginOrRegister)}>
         <Icon name="facebook-square" size={30} style={{color:'rgba(255, 255, 255, 0.6)'}}/>
         </TouchableOpacity>
         <TouchableOpacity style={{paddingTop:20}} onPress={this._signIn}>
         <Icon name="google-plus" size={30} style={{color:'rgba(255, 255, 255, 0.6)'}}/>
         </TouchableOpacity>
            </View>
        <View style={{ paddingTop:HEIGHT/12}}>
        <TouchableOpacity	onPress={() => this.props.navigation.navigate('SignUp')}>
        <Text style={{ fontFamily:'sans-serif-light', color:'white', fontSize:13 }}>Not a Papyrus member yet? Signup here</Text>
       </TouchableOpacity>
        </View>
        

       
      
         </SafeAreaView>)}
         </Formik>
         
         
       
      );
    
  }

export default withFirebaseHOC(SignInScreen);


const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop:HEIGHT/10,
    backgroundColor:'#101010',
  },
  logo:{
    width:120,
    height:120,

  }, 
  logoContainer:{
    alignItems:'center'

  }, 
  logoText:
  {
    color:'#D4AF37', 
    fontSize:20,
    fontWeight:'500',
    marginTop: 10,
    opacity:0.5
  }, 
  
  Input:{
    width: WIDTH -55, 
    height: 45, 
    borderRadius:20, 
    borderColor:'rgba(255, 255, 255, 0.8)',
    borderWidth:1,
    fontSize:16, 
    paddingLeft:45, 
    backgroundColor:'rgba(255, 255, 255, 0.9)',
    //color:'black', 
    marginHorizontal:25, 
    fontFamily:'sans-serif-light'
  },
   positions:
  {
paddingBottom: 10
  }, 
  image: {
    //flex: 1,
    width: 150,
    height: 150,
    resizeMode: 'contain',
    //paddingLeft: 20
    
}
  
});


/*import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, AsyncStorage, Dimensions} from 'react-native';

// async/await vs callbacks vs promise objects 
var {width:WIDTH, height:HEIGHT}=Dimensions.get('window')
class SignInScreen extends React.Component {

  signIn=async()=>
  {
    await AsyncStorage.setItem('userToken', 'punyaslok') // This AsyncStorage store the token on the device, so that a user can be signed in when he/she revisits
    this.props.navigation.navigate('App')
  }
   
    render() {
      return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.buttonStyle}
			onPress={this.signIn}
		  >
			 <Text style={styles.textStyle}>Complete Sign In</Text>
		  </TouchableOpacity>
          
        </View>
      );
    }
  }

export default SignInScreen;


const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: null,
    height: null,
    alignItems: 'center',
    paddingTop:HEIGHT/2.3,
  },
  logo:{
    width:120,
    height:120,

  }, 
  logoContainer:{
    alignItems:'center'

  }, 
  logoText:
  {
    color:'#D4AF37', 
    fontSize:20,
    fontWeight:'500',
    marginTop: 10,
    opacity:0.5
  }, 
  Input:{
    width: WIDTH -55, 
    height: 45, 
    borderRadius:20, 
    fontSize:16, 
    paddingLeft:45, 
    backgroundColor:'rgba(0, 0, 0, 0.7)',
    color:'rgba(255, 255, 255, 0.7)', 
    marginHorizontal:25, 
    fontFamily:'sans-serif-light'
  },
   positions:
  {
paddingBottom: 10
  }, 
  
});


*/

