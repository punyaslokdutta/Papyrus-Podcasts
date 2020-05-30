

import React, {Component} from 'react';
import { TouchableOpacity,StyleSheet,Image, Text,Dimensions, View, Button, ImageBackground} from 'react-native';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import Carousel,{getInputRangeFromIndexes,Pagination} from 'react-native-snap-carousel';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { firebase } from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome'

const {width,height} = Dimensions.get('window')


const data = [
  {
    text: "A social network designed to rediscover the voice in you.",
    imageURL: "https://storage.googleapis.com/papyrus-274618.appspot.com/illustrations/Illustration-I.png",
  },
  {
    text: "Through countless voiceless characters in stories. ",
    imageURL: "https://storage.googleapis.com/papyrus-274618.appspot.com/illustrations/Illustration-II.png",

  },
  {
    text: "Weaving Stories of Us and our Universes within.",
    imageURL: "https://storage.googleapis.com/papyrus-274618.appspot.com/illustrations/Illustration-IV.png",

  }
]

class WelcomeScreen extends Component {

   
  constructor(props)
  {
    super(props)
    {
    this.state={
        activeSlide:0,
        navBarHeight: 0,
      }
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
        console.log(user.user.email);
      })
      .catch((error) => {
        const { code, message } = error;
        console.log(code);
        console.log(message);
      });
  }


   getWindowDimension = (event) => { 
    const device_width = event.nativeEvent.layout.width;
    const device_height = event.nativeEvent.layout.height;

    console.log ("height: ",height);
    console.log ("nativeEventHeight: ",device_height);  // Yeah !! good value
    if(height - device_height >= 48)
    {
      this.setState({
        navBarHeight: 0
      })
    }
    else
    {
      this.setState({
        navBarHeight: 48
      })
    }
      
    console.log ("nativeEventWidth: ",device_width); 
  }

    renderItem = ({item, index}) => {
      return (
        <View>
        <Image style={{height:height/3, marginTop:height/3}}
        source={{uri:item.imageURL}}
        resizeMode='center'
        />
        <Text style={{position:'absolute',fontFamily:'Proxima-Nova-Bold',top:height/6,paddingLeft:10,fontSize:30}}>{item.text}
         </Text>
        </View>
      );
    }

     renderPagination = () => {
      const { activeSlide } = this.state;
      return (
        <View style={{alignItems:'center',justifyContent:'center'}}>
          <Pagination
            dotsLength={data.length}
            activeDotIndex={activeSlide}
            containerStyle={{width:width/10,paddingTop:15,paddingBottom:15, alignItems:'center',justifyContent:'center' }}
            dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 0,
                backgroundColor: 'white'
            }}
            inactiveDotStyle={{
                // Define styles for inactive dots here
                backgroundColor:'gray'
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
          </View>
      );
      }

    render() {
      return (
        <View onLayout={(event) => this.getWindowDimension(event)}>
        <LinearGradient  colors={['#383131','transparent', 'transparent', 'transparent','transparent','transparent','transparent',  '#383131','black']} >
        <View style={{height:height}}>
          
           <Carousel
              ref={(c) => { this._carousel = c; }}
              data={data}
              renderItem={this.renderItem}
              activeSlideAlignment={'start'}
              onSnapToItem={(index) => this.setState({ activeSlide: index }) }
              sliderWidth={width}
              itemWidth={width}
            />

            {this.renderPagination()}
          <TouchableOpacity style={{flexDirection:'row',marginBottom:20, position:'absolute',width:width*0.7,height:height/16,borderRadius:50,backgroundColor:'white',alignItems:'center',justifyContent:'center',marginHorizontal:width*0.15,bottom:height/6,borderWidth:1}} activeOpacity={0.5} onPress={() => this.props.navigation.navigate('SignInScreen')}>
           
          <Icon name="envelope-o" size={20}/>

          <Text style={{height:height/24,fontFamily:'Proxima-Nova-Bold',paddingLeft:5, paddingTop:height/175,fontSize:15, textAlign:'center'}}>  EMAIL </Text>
              </TouchableOpacity>
          <TouchableOpacity style={{flexDirection:'row',position:'absolute',width:width*0.7,height:height/16,borderRadius:50,
              backgroundColor:'transparent',alignItems:'center',justifyContent:'center',
               marginHorizontal:width*0.15,bottom:height/10,borderColor:'gray',borderWidth:0.5}} activeOpacity={0.5} onPress={()=>{this.onFBLoginOrRegister()}}>
              <Icon name="facebook" size={20} style={{color:'white'}}/>
          <Text style={{height:height/24,paddingLeft:10, paddingTop:height/175, fontFamily:'Proxima-Nova-Bold',color:'white',fontSize:15,textAlign:'center'}}> FACEBOOK </Text>
          </TouchableOpacity>
            </View>
          </LinearGradient>
          </View>
      );
    }
  }

export default WelcomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  buttonStyle: {
    padding:10,
    backgroundColor: '#202646',
    borderRadius:5
    },
    textStyle: {
      fontSize:20,
    color: '#ffffff',
    textAlign: 'center'
    },
});
