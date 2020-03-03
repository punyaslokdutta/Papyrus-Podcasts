

import React, {Component, useEffect} from 'react';
import {SafeAreaView,
  ActivityIndicator,
  TouchableOpacity, StyleSheet, Text, View, AsyncStorage, Dimensions, ImageBackground, Button, Image} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Formik } from 'formik';
import * as yup from 'yup';
import SignUpScreen from './SignUpScreen'
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { firebase } from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firebaseApi from './config/Firebase/firebaseApi'
import {withFirebaseHOC} from '../screens/config/Firebase'
import {useDispatch,useSelector} from 'react-redux'
import Toast from 'react-native-simple-toast';

var {width:WIDTH, height:HEIGHT}=Dimensions.get('window')


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


  
  const SignInScreen = (props) => {
  
  //dispatch = useDispatch();
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
   useEffect( (props)=>
    {
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        webClientId: '66057191427-s1qut9jum2u53i8gchv5u2cdtcoku2q2.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
       // hostedDomain: '', // specifies a hosted domain restriction
        //loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
        forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
        //accountName: '', // [Android] specifies an account name on the device that should be used
        //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      });

    
      

    }, [])



  _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      alert('User is already signed in');
      //Get the User details as user is already signed in
      //_getCurrentUserInfo();
    } else {
      //alert("Please Login");
      console.log('Please Login');
    }
   // this.setState({ gettingLoginStatus: false });
  };

  // // _getCurrentUserInfo = async () => {
  // //   try {
  // //     const userInfo = await GoogleSignin.signInSilently();
  // //     console.log('User Info --> ', userInfo);
  // //     this.setState({ userInfo: userInfo });
  // //   } catch (error) {
  // //     if (error.code === statusCodes.SIGN_IN_REQUIRED) {
  // //       alert('User has not signed in yet');
  // //       console.log('User has not signed in yet');
  // //     } else {
  // //       alert("Something went wrong. Unable to get user's info");
  // //       console.log("Something went wrong. Unable to get user's info");
  // //     }
  // //   }
  // // };
  _signIn = async () => {
   
    GoogleSignin.hasPlayServices()
        .then(res => {
            GoogleSignin.signIn()
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(error.code);
            });
        })
        .catch(err => {
            console.log(err);
        });
  }
 
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
 
  onGoogleLoginOrRegister = () => {
    
     GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      console.log("google services are available")
    .catch ((err) =>{
      console.error('play services are not available');
    })
    console.log(GoogleSignin.webClientId)
    console.log(GoogleSignin.offlineAccess)
    GoogleSignin.signIn()
    .then((data) => {
      //Create a new Firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      //Login with the credential
      return firebase.auth().signInWithCredential(credential);
    })
    .then((user) => {
     // If you need to do anything with the user, do it here
      //The user will be logged in automatically by the
     // `onAuthStateChanged` listener we set up in App.js earlier
    })
    .catch((error) => {
      const { code, message } = error;
      //For details of error codes, see the docs
      //The message contains the default Firebase string
      //representation of the error
      console.log(code);
      console.log(message);
    });
  };
  
  
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
      })
      .catch((error) => {
        const { code, message } = error;
        console.log(code);
        console.log(message);
      });
  }
  /*signIn=async()=>
  {
    await AsyncStorage.setItem('userToken', 'punyaslok') // This AsyncStorage store the token on the device, so that a user can be signed in when he/she revisits
    this.props.navigation.navigate('App')
  }
  Add persistent sign in with async storage like functionality 
  */
 async function _loginWithEmail(email, password, props){
  try {
     await firebase
       .auth()
       .signInWithEmailAndPassword(email, password)
       .then(res => {
           console.log(res.user.email);
    });
} catch (error) {
   
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("ERROR_CODE"+errorCode);
    console.log("ERROR_MESSAGE"+errorMessage);

    //props.navigation.navigate('SignUpScreen')
                if(errorCode==="auth/user-not-found")
                {
                    Toast.show('Sign up')
                    console.log("SignUp")
                    //actions.setSubmitting(false);
                    props.navigation.navigate('SignUpScreen')

                }
                else if(errorCode==="auth/wrong-password")
                {
                  //actions.setSubmitting(false);
                  Toast.show('wrong password (or) previously loggedIn(through Fb/Google)')
                }
                else if(errorCode==='auth/user-disabled')
                {
                  //actions.setSubmitting(false);
                  Toast.show("You have been temporarily disabled")
                  
                }
  }
}






    
      return (
        
        <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={(values, actions) => {
        //alert(JSON.stringify(values));
        _loginWithEmail(values.email, values.password, props)
        actions.setSubmitting(false);

              }  
      }
      validationSchema={validationSchema}
    >   
    {formikProps => (
      

      <SafeAreaView  style={styles.backgroundContainer} >
      <View style={{ }}>

      <TouchableOpacity>
          <Image
            resizeMode="contain"
            source={require('../assets/images/papyrusLogo.png')}
            style={{ width: 180, height: 240 }}
          />
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
            <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:45, width:WIDTH -55, borderRadius:15, backgroundColor:'rgba(0, 0, 0, 0.7)', borderColor:'rgb(218,165,32)', borderWidth: 0.4 }}
        onPress={formikProps.handleSubmit} >
            <Text style={{ alignItems: 'center', fontFamily:'century-gothic', color:'rgb(218,165,32)', justifyContent:'center'}} >Login</Text>
                </TouchableOpacity>
             
              </View>
          )}
        

            <View>
            <TouchableOpacity style={{paddingTop:10, }}>
           <Text style={{ fontFamily:'sans-serif-light', color:'rgb(218,165,32)', fontSize:12 }}>Forgot your Password?</Text>
         </TouchableOpacity>
            </View>
            <View style={{ paddingTop:10 }}>
          
           <Text style={{ fontFamily:'sans-serif-light', color:'white',  fontSize:12 }}>OR Login with </Text>
         
            </View>

            <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{paddingTop:20,paddingRight:WIDTH/8 }} onPress={()=>{onFBLoginOrRegister()}}>
         <Icon name="facebook-square" size={30} style={{color:'rgba(255, 255, 255, 0.6)'}}/>
         </TouchableOpacity>
         <TouchableOpacity style={{paddingTop:20}} onPress={()=>{ _signIn()}}>
         <Icon name="google-plus" size={30} style={{color:'rgba(255, 255, 255, 0.6)'}}/>
         </TouchableOpacity>
            </View>
        <View style={{ paddingTop:HEIGHT/12, flexDirection:'row'}}>
          <View style={{ paddingRight:5}}>
          <Text style={{ fontFamily:'sans-serif-light', color:'white', fontSize:13 }}>Not a Papyrus member yet?</Text>
          </View>
        <TouchableOpacity	onPress={()=>{props.navigation.navigate('SignUpScreen')}}>
        <Text style={{ fontFamily:'sans-serif-light', color:'rgb(218,165,32)', fontSize:13 }}>Signup</Text>
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
    paddingTop:HEIGHT/12 ,
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


