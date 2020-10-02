import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  NativeModules,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,Alert
} from 'react-native';
import RtcEngine,{RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { firebase } from '@react-native-firebase/functions';
import { TextInput } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { withFirebaseHOC } from './config/Firebase';
import moment from 'moment';
import {useSelector, useDispatch,connect} from "react-redux"
import Toast from 'react-native-simple-toast';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import OpenSettings from 'react-native-open-settings';
import storage from '@react-native-firebase/storage'
import {request, PERMISSIONS,RESULTS} from 'react-native-permissions';
import ExtraDimensions from 'react-native-extra-dimensions-android';
const STATUS_BAR_HEIGHT= ExtraDimensions.getStatusBarHeight();
// import {Actions} from 'react-native-router-flux';

//const {Agora} = NativeModules; //Define Agora object as a native module

// const {FPS30, AudioProfileDefault, AudioScenarioDefault, Adaptative} = Agora; //Set defaults for Stream
const { width, height } = Dimensions.get('window');

class VideoChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peerIds: [], //Array for storing connected peers
      uid: Math.floor(Math.random() * 100), //Generate a UID for local user
      appId: "758f9cfbbf7a49e68925db9d89fe42b6", //Enter the App ID generated from the Agora Website
      channelName: "channelX", //Channel Name for the current session
      vidMute: false, //State variable for Video Mute
      audMute: false, //State variable for Audio Mute
      joinSucceed: false, //State variable for storing success
      resourceId: null,
      sid: null,
      discussionTopic: null,
      discussionGenre: null,
      inviteeUserIDs : [],
      inviteeUserImages : [],
      isInitiator : false,
      firstInviteeID : null,
      uploadedImageURL : null
    };
    
    this._engine = null; //Initialize the RTC engine
  }
  
  componentDidMount() {
    this.init();
  }

  componentDidUpdate = async(prevState) => {
    // console.log("[componentDidUpdate] prevState = ",prevState)
    // if(prevState.channelName === "channelX" && this.state.channelName !== "channelX")
    // {

    //   this.sendNotificationToFirstInvitee();
    // }
  }

  uploadImage = async() => {

    try{
      ImagePicker.showImagePicker(async (response) => {
        console.log('Response URI = ', response.uri);
        console.log('Response PATH = ', response.path);
  
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          if(response.error == "Permissions weren't granted")
          {
            Alert.alert(  
              'Papyrus needs access to your camera and/or storage.',  
              '',  
              [  
                  {  
                      text: 'Cancel',  
                      onPress: () => console.log('Cancel Pressed'),  
                      style: 'cancel',  
                  },  
                  {
                      text: 'OK', onPress: () => {
                      OpenSettings.openSettings()
                      console.log('OK Pressed')
                  }},  
              ]  
          ); 
          }
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = { uri: response.uri };
          console.log("Before storageRef.putFile");
          //console.log("response : ",response);

          //setImageFromURL(false);
          //setPodcastImage(source);
          this.setState({
            loadingImage : true
          })
          const userID = this.props.firebase._getUid();
          //filename.split('.').pop();
          var refPath = "conversations/images/" + userID + "_" + moment().format() + ".jpg";
          if(response.path.split('.').pop() == "gif")
          {
            if(((response.fileSize/1024)/1024) > 1)
            {
              this.setState({
                loadingImage : false
              })
              alert("Please upload a GIF file within 1 MB");
              return;
            }
            refPath = "conversations/gifs/" + userID + "_" + moment().format() + ".gif";
            var storageRef = storage().ref(refPath);

            const unsubscribe=storageRef.putFile(response.path)//: 'content://com.miui.gallery.open/raw/storage/emulated/DCIM/Camera/IMG_20200214_134628_1.jpg')
            .on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              snapshot => {
                console.log("snapshot: " + snapshot.state);
                console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                  console.log("Success");
                }
              },
              error => {
                unsubscribe();
                console.log("image upload error: " + error.toString());
              },
              () => {
                storageRef.getDownloadURL()
                  .then((downloadUrl) => {
                    console.log("File available at: " + downloadUrl);
                    this.setState({
                      uploadedImageURL : downloadUrl,
                      loadingImage : false
                    })
                  })
                  .catch(err => {
                    console.log("Error in storageRef.getDownloadURL() in uploadImage in PreviewScreen: ",err);
                  })
              }
            )
          }
          else
          {
            var storageRef = storage().ref(refPath);
            console.log("Before storageRef.putFile");
            console.log("[AddFlipScreen] response.path : ",response.path);
            ImageResizer.createResizedImage(response.path, 720, 720, 'JPEG',100)
          .then(({path}) => {
    
            const unsubscribe=storageRef.putFile(path)//: 'content://com.miui.gallery.open/raw/storage/emulated/DCIM/Camera/IMG_20200214_134628_1.jpg')
              .on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                snapshot => {
                  console.log("snapshot: " + snapshot.state);
                  console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                  if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                    console.log("Success");
                  }
                },
                error => {
                  unsubscribe();
                  console.log("image upload error: " + error.toString());
                },
                () => {
                  storageRef.getDownloadURL()
                    .then((downloadUrl) => {
                      console.log("File available at: " + downloadUrl);
                      this.setState({
                        uploadedImageURL : downloadUrl,
                        loadingImage : false
                      })
                      
                    })
                    .catch(err => {
                      console.log("Error in storageRef.getDownloadURL() in uploadImage in PreviewScreen: ",err);
                    })
                }
              )
              });
          }  
          }
      });
    }
    catch(error){
      console.log("Resizing & Uploading Podcast Image Error: ",error);
    }
  }


  sendNotificationToFirstInvitee = async(channelName) => {
    console.log("[VideoChatScreen] --> [sendNotificationToFirstInvitee]");  
    try {
        const instance = firebase.app().functions("asia-northeast1").httpsCallable('addActivity');
        try {          
            await instance({ 
              timestamp : moment().format(),
              photoURL : this.props.displayPictureURL,
              podcastID : null,
              userID : this.state.firstInviteeID,
              podcastImageURL : null,
              type : "invite",
              Name : this.props.name,
              channelName : channelName
            });
        }
        catch (e) {
            console.log("Error in calling addActivity cloud function for Invite Activity");
            console.log(e);
        }
    }   
    catch(error) {
        console.log(error)
    }

    this.setState({
      channelName : channelName
    })
  }

  init = async () => {
    const {appId} = this.state
    try {
      this._engine = await RtcEngine.create(appId)
      //await this._engine.enableAudio()
      await this._engine.enableVideo()
    }
    catch(error){
      console.log("[Video] [init] error = ",error);
    }

    this._engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed)
      // Get current peer IDs
      const {peerIds} = this.state
      // If new user
      if (peerIds.indexOf(uid) === -1) {
          this.setState({
              // Add peer ID to state array
              peerIds: [...peerIds, uid]
          })
      }
  })

  this._engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason)
      const {peerIds} = this.state
      this.setState({
          // Remove peer ID from state array
          peerIds: peerIds.filter(id => id !== uid)
      })

      if(uid == 1) // host
      {
        this.leaveCall();
      }
  })

  // If Local user joins RTC channel
  this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed)
      
      // Set state variable to true
      this.setState({
          joinSucceed: true
      })
  })
   
  console.log("[VideoChatScreen] --> [init] --> params - ",this.props.navigation.state.params);
  
  if(this.props.navigation.state.params.fromActivity == true)
  {
    this.setState({
      channelName : this.props.navigation.state.params.channelName
    })
    try{
      await this._engine.joinChannel(null, this.props.navigation.state.params.channelName, null, 0)
    }
    catch(error){
      console.log("[startCall] error = ",error);
    }
  }

  }

  editConversationDoc = async (fileName) => {
    const s3URL = "https://example-bucket-fa45c.s3.ap-south-1.amazonaws.com/" + fileName;
    const usrID = [this.props.firebase._getUid()]
   firestore().collection('conversations').doc(this.state.channelName).set({
      participants : [...this.state.inviteeUserIDs,...usrID],
      recordedVideoURL : s3URL,
      conversationEndTime : moment().format()
   },{merge:true}).then(() => {
     console.log("[VideoChatScreen] Successfully edited conversation Document");
   }).catch((error) => {
     console.log("[VideoChatScreen] error in editing conversation document",error);
   })
  }

  startCall = async () => {
    // Join Channel using null token and channel name
    var permissionResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
    if (permissionResult !== RESULTS.GRANTED) 
    {
      console.log('permission denied');
          Alert.alert(  
            'Papyrus needs access to your microphone',  
            '',  
            [  
                {  
                    text: 'Cancel',  
                    onPress: () => console.log('Cancel Pressed'),  
                    style: 'cancel',  
                },  
                {text: 'OK', onPress: () => {
                  OpenSettings.openSettings()
                  console.log('OK Pressed')
                }},  
            ]  
        ); 

        return;
    }

    console.log("startCall => ",this._engine);
    try{
      await this._engine.joinChannel(null, this.state.channelName, null, 1) 
    }
    catch(error){
      console.log("[startCall] error = ",error);
    }

    const instance = firebase.app().functions("asia-northeast1").httpsCallable('sendRequestToAgora');
    try 
    {          
      const resAcquire = await instance({ // change in podcast docs created by  user
        apiName : "acquire",
        channelName : this.state.channelName
      });
      console.log("response from acquire = ",resAcquire.data.resourceId);
      this.setState({ resourceId : resAcquire.data.resourceId })

      const resStart = await instance({ // change in podcast docs created by  user
        apiName : "start",
        channelName : this.state.channelName,
        resourceId : resAcquire.data.resourceId
      });
      console.log("response from start = ",resStart.data);
      this.setState({ 
        sid : resStart.data.sid,
        isInitiator : true 
      })
    }
    catch (e) 
    {
      console.log(e);
    }
    
    firestore().collection('conversations').doc(this.state.channelName).set({
      conversationStartTime : moment().format()
    },{merge:true}).then(() => {
      console.log("Successfully set conversationStartTime in conversation Doc");
    }).catch((error) => {
      console.log("Error in setting conversationStartTime in conversation Doc",error);
    })
  }

  leaveCall = async() => {
    await this._engine.leaveChannel()
    this.setState({peerIds: [], joinSucceed: false})
  }

  endCall = async () => {
    await this._engine.leaveChannel()
    this.setState({peerIds: [], joinSucceed: false})

    const instance = firebase.app().functions("asia-northeast1").httpsCallable('sendRequestToAgora');
    try 
    {          
      const res = await instance({ // change in podcast docs created by  user
        apiName : "stop",
        channelName : this.state.channelName,
        resourceId : this.state.resourceId,
        sid : this.state.sid
      });
      console.log("response from stop = ",res.data);
      this.editConversationDoc(res.data.serverResponse.fileList);
    }
    catch (e) 
    {
      console.log(e);
    }
  }

  createConversationDoc = async() => {

    var that = this;

    firestore().collection('conversations').add({
      videoInitiatorID : this.props.firebase._getUid(),
      createdOn : moment().format(),
      discussionTopic : this.state.discussionTopic,
      discussionGenre : this.state.discussionGenre,
      discussionImage : this.state.uploadedImageURL
    }).then(async function(docRef, props) {
      console.log("Document written with ID: ", docRef.id);
      firestore().collection('conversations').doc(docRef.id).set({
            conversationID: docRef.id
        },{merge:true}) 
        that.sendNotificationToFirstInvitee(docRef.id); 
      // that.setState({
      //   channelName : docRef.id
      // })      
    })
    .catch(function(error) {
      console.log("[createConversationDoc] --> Error",error);
      Toast.show("Error: Please try again.")
    });
  }

  addUserIDToDiscussion = (userID,userImage) => {
    const usr_arr = [userID];
    const usrImg_arr = [userImage];

    if(this.state.inviteeUserIDs.length == 0)
    {
      this.setState({
        firstInviteeID : userID
      })
      this.createConversationDoc();
    }

    this.setState({
      inviteeUserIDs : [...this.state.inviteeUserIDs,...usr_arr],
      inviteeUserImages : [...this.state.inviteeUserImages,...usrImg_arr]  
    })
  }

  _renderVideos = () => {
    const {joinSucceed} = this.state
    return joinSucceed ? (
        <View style={styles.fullView}>
            <RtcLocalView.SurfaceView
                style={styles.max}
                channelId={this.state.channelName}
                renderMode={VideoRenderMode.Hidden}/>
            {this._renderRemoteVideos()}
        </View>
    ) : null
}

_renderRemoteVideos = () => {
    const {peerIds} = this.state
    return (
        <ScrollView
            style={styles.remoteContainer}
            contentContainerStyle={{paddingHorizontal: 2.5}}
            horizontal={true}>
            {peerIds.map((value, index, array) => {
                return (
                    <RtcRemoteView.SurfaceView
                        style={styles.remote}
                        uid={value}
                        channelId={this.state.channelName}
                        renderMode={VideoRenderMode.Hidden}
                        zOrderMediaOverlay={true}/>
                )
            })}
        </ScrollView>
      )
    }

    startCallOption = () => {
      return (
        <View style={styles.buttonHolder}>
          <TouchableOpacity
              onPress={this.startCall}
              style={styles.button}>
              <Text style={styles.buttonText}> Start Discussion </Text>
          </TouchableOpacity>
        </View>
      )
    }

    renderInvitees = () => {
      return (
        <View style={{height:width/3}}>
        <ScrollView 
            horizontal={true}
            //contentContainerStyle={{borderWidth:1,borderColor:}}
            >
              {
                this.state.inviteeUserImages.map((item,index) => {
                  return (
                    <Image 
                      style={{width:width/6,height:width/6,backgroundColor:'#dddd',borderWidth:2,borderColor:'blue',borderRadius:width/12}}
                      source={{uri:item}}/>
                  )
                })
              }
        </ScrollView>
        </View>
      )
    }

    renderInvitationOption = () => {
      return (
        <View style={styles.buttonHolder}>
          <TouchableOpacity
            onPress={() => {
                if(this.state.discussionTopic === null)
                {
                  alert('Enter a discussion topic!')
                  
                }
                else if(this.state.uploadedImageURL === null)
                {
                  alert('Enter a picture for your discussion!')
                }
                else
                {
                  this.props.navigation.navigate('InviteUserScreen',{
                    inviteeUserIDs : this.state.inviteeUserIDs,
                    addUserIDToDiscussion : this.addUserIDToDiscussion,
                    channelName : this.state.channelName
                  })
                }

              }}
            style={styles.button}>
             <Text style={styles.buttonText}> Invite Participants </Text>
          </TouchableOpacity>
        </View>
      )
    }


  render() {

    if(this.state.joinSucceed == false)
    {
      return (
        <ScrollView contentContainerStyle={{height:height,marginTop:STATUS_BAR_HEIGHT}}>
        <View style={styles.max}>
            <View style={styles.max}>
                <View>
                <View style={{height:30}}/>
                <TextInput
                  value={this.state.discussionTopic}
                  style={{fontFamily:'Montserrat-SemiBold',fontWeight:'normal',fontSize:20,borderWidth:0.5,borderColor:'black'}}
                  underlineColorAndroid="transparent"
                  placeholder={"Discussion Topic"}
                  placeholderTextColor={"gray"}
                  //numberOfLines={6}
                  multiline={false}
                  onChangeText={(text) => {
                      this.setState({
                        discussionTopic : text.slice(0,150)
                      })
                  }}/>
                  <View style={{height:30}}/>
                  <TextInput
                  value={this.state.discussionGenre}
                  style={{fontFamily:'Montserrat-SemiBold',fontWeight:'normal',fontSize:20,borderWidth:0.5,borderColor:'black'}}
                  underlineColorAndroid="transparent"
                  placeholder={"Discussion Genre"}
                  placeholderTextColor={"gray"}
                  //numberOfLines={6}
                  multiline={false}
                  onChangeText={(text) => {
                      this.setState({
                        discussionGenre : text.slice(0,150)
                      })
                  }}/>  
                </View>
                 <View style={{height:20}}/> 
                <View style={{paddingHorizontal:5}}>
                  <Text style={{fontFamily:'Montserrat-SemiBold',marginBottom:10}}>Add media</Text>
                  <TouchableOpacity onPress={() => {
                    this.uploadImage();
                  }}>
                    <FontAwesome name="image" size={30} />
                  </TouchableOpacity>
                  {
                    this.state.uploadedImageURL !== null &&
                    <Image source={{uri : this.state.uploadedImageURL}} style={{height:width/2,width:width/2}}/>
                  }
                  </View>
                  {this.renderInvitationOption()}
                  {this.renderInvitees()}
                  {
                    this.state.inviteeUserIDs.length != 0
                    &&
                    this.startCallOption()
                  }
            </View>
        </View>
        </ScrollView>
      )
    }
    else
    {
      return (
      
        <View style={{height:height*2,marginTop:STATUS_BAR_HEIGHT}}>
          <View>
          {
            this.state.isInitiator == true
            ?
            <TouchableOpacity
            onPress={this.endCall}
            style={{paddingVertical: 10,marginVertical:10,marginHorizontal:20,alignItems:'center',backgroundColor:'#0093E9',borderRadius:25}}>
              <Text style={styles.buttonText}> End Discussion </Text>
             </TouchableOpacity>
            :
            <TouchableOpacity
            onPress={this.leaveCall}
            style={{paddingVertical: 10,marginVertical:10,marginHorizontal:20,alignItems:'center',backgroundColor:'#0093E9',borderRadius:25}}>
              <Text style={styles.buttonText}> Leave Discussion </Text>
          </TouchableOpacity>
          }
          
          </View>
        {this._renderVideos()}
        </View>
      )

    }
    
    
}


}

let dimensions = {
  //get dimensions of the device to use in view styles
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const styles = StyleSheet.create({
  max: {
      flex: 1,
  },
  buttonHolder: {
      height: 30,
      alignItems: 'center',
      marginVertical:20,
      //borderWidth:1,
      //borderColor:'black',
      //flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
  },
  button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: '#0093E9',
      borderRadius: 25,
  },
  buttonText: {
      color: '#fff',
  },
  fullView: {
      width: dimensions.width,
      height: dimensions.height - 68,
  },
  remoteContainer: {
      width: '100%',
      height: 150,
      position: 'absolute',
      top: 5
  },
  remote: {
      width: 150,
      height: 150,
      marginHorizontal: 2.5
  },
  noUserText: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      color: '#0093E9',
  },
})

const mapStateToProps = (state) => {
  return{
    displayPictureURL: state.userReducer.displayPictureURL,
    name: state.userReducer.name,
  }}

export default connect(mapStateToProps,null)(withFirebaseHOC(VideoChatScreen));