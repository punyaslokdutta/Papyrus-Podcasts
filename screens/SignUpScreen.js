

import React ,{useState} from 'react';
import {
  ActivityIndicator,
  TouchableOpacity, StyleSheet, Text, View, AsyncStorage, Dimensions, ImageBackground, Button, Image} from 'react-native';

  import {Icon} from 'native-base';

import Toast from 'react-native-simple-toast';
import { TextInput } from 'react-native-gesture-handler';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Formik } from 'formik';
import {withFirebaseHOC} from '../screens/config/Firebase'
import * as yup from 'yup';
import {firebase} from '@react-native-firebase/auth';
import {useDispatch,useSelector} from 'react-redux'
import { AccessToken, LoginManager } from 'react-native-fbsdk';

const validationSchema = yup.object().shape({ 
  fullName: yup
    .string()
    .trim()
    .label('Fullname')
    .required("*Name is a required field"),

  email: yup
    .string()
    .trim()
    .label('Email')
    .email()
    .required("*Email is a required field"),
  password: yup
    .string()
    .trim()
    .label('Password')
    .required("*Password is a required field")
    .min(6, 'Password must be atleast 6 characters'),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref('password'), null], 'Password must match')
    .required("*Confirm Password is a required field")
    .label('Confirm password')
    .min(6, 'Password must be atleast 6 characters')
    
});

var {width:WIDTH, height:HEIGHT}=Dimensions.get('window')

const SignUpScreen=(props)=>{

  const [loading,setLoading] = useState(false);
  const userEmail = useSelector(state=>state.userReducer.signupEmail);
  console.log("[SIGN UP Screen] userEmail: ", userEmail);
  const dispatch=useDispatch();
  const [iconPasswordState,setIconPasswordState] = useState('eye-off');
  const [passwordState,setPasswordState] = useState(true);
  const [iconConfirmPasswordState,setIconConfirmPasswordState] = useState('eye-off');
  const [confirmPasswordState,setConfirmPasswordState] = useState(true);

  function _changeIconPassword() {
  if(iconPasswordState == 'eye-off') 
    setIconPasswordState('eye');
  else
    setIconPasswordState('eye-off');
    setPasswordState(!passwordState);   
  }

  function _changeIconConfirmPassword() {
    if(iconConfirmPasswordState == 'eye-off') 
      setIconConfirmPasswordState('eye');
    else
      setIconConfirmPasswordState('eye-off');
      setConfirmPasswordState(!confirmPasswordState);   
    }

  async function _signupWithEmail (email, password, fullName){
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      
  
    } catch (error) {
      
      var errorCode = error.code;
    var errorMessage = error.message;
    console.log("ERROR_CODE"+errorCode);
    console.log("ERROR_MESSAGE"+errorMessage);

    //props.navigation.navigate('SignUpScreen')
                if(errorCode==="auth/email-already-in-use")
                {
                    Toast.show('This email is already in use');
                }
                else if(errorCode==="auth/invalid-email")
                {
                  Toast.show('The email you have entered is invalid')
                }
                else if(errorCode==='auth/operation-not-allowed')
                {
                  //actions.setSubmitting(false);
                  console.log("Email/Password login/signup is not enabled");
                  
                }
                else if(errorCode === "auth/weak-password")
                {
                    Toast.show('This password is too weak');
                }


    }
    finally {
      setLoading(false);
    }
  }


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
        dispatch({type:"CHANGE_NAME", payload: user.user.displayName})
        console.log(user.user.email);
      })
      .catch((error) => {
        const { code, message } = error;
        console.log(code);
        console.log(message);
      });
  }

  
      return (
        <Formik
      initialValues={{ fullName: '', email: userEmail, password: '',confirmPassword:'' }}
      onSubmit={(values, actions) => {
         // alert(JSON.stringify(values));
         setLoading(true);
         const trimmedFullName = values.fullName.trim();
         dispatch({type:"CHANGE_NAME", payload:trimmedFullName })
         const trimmedEmail = values.email.trim();
         const trimmedPassword = values.password.trim();
         _signupWithEmail( trimmedEmail, trimmedPassword, values.fullName)
          actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
    >   
    {formikProps => (
        <View style={styles.backgroundContainer}>
           <View style={{ }}>

<TouchableOpacity>
    <Image
      resizeMode="contain"
      source={require('../assets/images/papyrusLogo.png')}
      style={{ width: 150, height: 150 }}
    />
  </TouchableOpacity>      
   </View>
        <View style={styles.positions}>
        <TextInput style={styles.Input}   placeholder={'Fullname'} placeholderTextColor={'rgba(255, 255, 255, 0.5)'} borderColor={'rgb(218,165,32)'} underlineColorAndroid='transparent'
          onChangeText={formikProps.handleChange('fullName')}
          /> 
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.fullName && formikProps.errors.fullName}
          </Text>
          
        </View>
        <View style={styles.positions}>
        <TextInput style={styles.Input}  defaultValue={userEmail} placeholder={'Email'} placeholderTextColor={'rgba(255, 255, 255, 0.5)'} underlineColorAndroid='transparent'
          onChangeText={formikProps.handleChange('email')}
          /> 
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.email && formikProps.errors.email}
          </Text>
          </View>
          <View style={styles.positions}>
          <TextInput style={styles.Input}   placeholder={'Password'} placeholderTextColor={'rgba(255, 255, 255, 0.5)'} underlineColorAndroid='transparent'
          onChangeText={formikProps.handleChange('password')}
          secureTextEntry={passwordState}
          /> 
          <Icon name={iconPasswordState}  style={{color:'white',fontSize:23,position:'absolute',right:45,top:11}} onPress={() => _changeIconPassword()} /> 

          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.password && formikProps.errors.password}
          </Text>
          </View>
          <View style={styles.positions}>
          <TextInput style={styles.Input}   placeholder={'Confirm Password'} placeholderTextColor={'rgba(255, 255, 255, 0.5)'} underlineColorAndroid='transparent'
          onChangeText={formikProps.handleChange('confirmPassword')}
          secureTextEntry={confirmPasswordState}
          /> 
          <Icon name={iconConfirmPasswordState}  style={{color:'white',fontSize:23,position:'absolute',right:45,top:11}} onPress={() => _changeIconConfirmPassword()} /> 

          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', paddingLeft:45 ,fontFamily:'sans-serif-light' , fontSize:12 }}>
          {formikProps.touched.confirmPassword && formikProps.errors.confirmPassword}
          </Text>
          </View>
         
            <View>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent:'center', height:45, width:WIDTH -55, borderRadius:15, backgroundColor:'rgba(0, 0, 0, 0.7)', borderColor:'rgb(218,165,32)', borderWidth: 1 }}
        onPress={formikProps.handleSubmit} >
          {
            loading === true
            ?
            <ActivityIndicator color={'rgb(218,165,32)'}/>
            :
            <Text style={{ alignItems: 'center', fontFamily:'sans-serif-light', color:'rgb(218,165,32)', justifyContent:'center'}} >Submit</Text>
          }
            </TouchableOpacity>
            </View>
        
            <View>
            <TouchableOpacity style={{paddingTop:10, }}>
           <Text style={{ fontFamily:'sans-serif-light', color:'rgba(255, 255, 255, 0.8)', fontSize:12 }}>OR SignUp with </Text>
         </TouchableOpacity>
            </View>

            <View style={{flexDirection:'row', justifyContent:'center'}}>
         <TouchableOpacity style={{paddingTop:20 }} onPress={()=>{onFBLoginOrRegister()}}>
         <FontAwesomeIcon name="facebook-square" size={30} style={{color:'rgba(255, 255, 255, 0.6)'}}/>
         </TouchableOpacity>
            </View>
        <View style={{ paddingTop:HEIGHT/8}}>
        <TouchableOpacity>
        <Text style={{ fontFamily:'sans-serif-light', color:'rgba(255, 255, 255, 0.5)', fontSize:10}}>By clicking "Submit" you agree to Papyrus's Terms and Privacy Policy</Text>
       </TouchableOpacity>
        </View>
        </View>
      

         

         
      )}
      </Formik>);
  }

export default withFirebaseHOC(SignUpScreen);


const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: null,
    height: null,
    alignItems: 'center',
    paddingTop:HEIGHT/24,
    backgroundColor:'#120d02'
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
    fontFamily:'sans-serif-light', 
   // borderColor:'rgb(218,165,32)'
  },
   positions:
  {
paddingBottom: 10
  }, 
  
});
