import { Text, Dimensions,ScrollView, Image,View,Animated,StyleSheet,ImageBackground, TouchableOpacity,TouchableNativeFeedback,Alert } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React, { Component, useEffect,useState,useRef } from 'react';
import * as theme from '../constants/theme';
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import {useSelector, useDispatch} from "react-redux"
import { withFirebaseHOC } from '../../config/Firebase';
import firestore from '@react-native-firebase/firestore';
import moment from "moment";
import LinearGradient from 'react-native-linear-gradient';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Toast from 'react-native-simple-toast';

const { width, height } = Dimensions.get('window');

const areEqual = (prevProps, nextProps) => true

const MainFlipItem = React.memo((props) => {
    
    const realUserID = props.firebase._getUid();
    const isAdmin = useSelector(state=>state.userReducer.isAdmin);
    const [resizeModes,setResizeModes] = useState([]);
    const [loadingResizeModes,setLoadingResizeModes] = useState(true);
    const dispatch = useDispatch();
    const flipID = props.navigation.state.params.item.flipID;
    const item = props.navigation.state.params.item;
    var scrollX = new Animated.Value(0);

    useEffect(() => {
      console.log("In FLIP ITEM ID: ",item.flipID);
      console.log("Flip Book Name : ",item.bookName);

      item.flipPictures !== undefined &&
      item.flipPictures.map((img,index) => {
            console.log("index:",index);
          Image.getSize(img, (width, height) => {
              var localResizeModes = resizeModes;
              console.log("width : ",width,", height : ",height);
              if(height == (4/3)*width || height == (3/2)*width){
                localResizeModes.push('contain');
                console.log('COVER mode');
              }
              else{
                localResizeModes.push('contain');
                console.log('CONTAIN mode');
              }
                  
              setResizeModes(localResizeModes); 
              if(resizeModes.length == item.flipPictures.length)
                setLoadingResizeModes(false);
                 
          });
      })
      

  },[])

  useEffect(() => {
    if(resizeModes.length == item.flipPictures.length)
        setLoadingResizeModes(false);
  },[resizeModes])

    async function retrieveUserData(){
        if(realUserID == props.navigation.state.params.item.creatorID)
            props.navigation.navigate('ProfileTabNavigator');
        else
        {
            const userID = props.navigation.state.params.item.creatorID;
            const privateDataID = "private" + userID;
            const privateDoc = await firestore().collection('users').doc(userID).collection('privateUserData').doc(privateDataID).get();
            const privateDocumentData = privateDoc.data();
            dispatch({type:"SET_OTHER_PRIVATE_USER_ITEM",payload:privateDocumentData})
            props.navigation.navigate('ExploreTabNavigator',{userData:privateDocumentData});
        }
    }

    function renderDots () {
        const dotPosition = Animated.divide(scrollX, width);
        return (
          <View style={[ styles.flex, styles.row, styles.dotsContainer ]}>
            {props.navigation.state.params.item.flipPictures && 
            props.navigation.state.params.item.flipPictures.map((item, index) => {
              const opacity = dotPosition.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [0.5, 1, 0.5],
                extrapolate: 'clamp'
              });
              return (
                <Animated.View
                  key={`step-${item}-${index}`}
                  style={[styles.dots, styles.activeDot,{ opacity }]}
                />
              )
            })}
          </View>
        )
      }

      function renderMenu() {
        return (
            <Menu>
            <MenuTrigger>
            <IconAntDesign name="ellipsis1" size={26}/>
            </MenuTrigger>
            <MenuOptions customStyles={{optionWrapper: { margin: 5}}}>
            <MenuOption text='Edit' onSelect={() => {
                props.navigation.navigate('FlipPreviewScreen',{
                flipDescription : props.navigation.state.params.item.flipDescription,
                flipPictures : props.navigation.state.params.item.flipPictures,
                bookName : props.navigation.state.params.item.bookName,
                editing : true,
                flipID : props.navigation.state.params.item.flipID
                })
            }}/>
            <MenuOption text='Delete' onSelect={async() => {
                Alert.alert(  
                'Are you sure you want to delete this flip?',  
                '',  
                [  
                    {  
                    text: 'Cancel',  
                    onPress: () => console.log('Cancel Pressed'),  
                    style: 'cancel',  
                    },  
                    {
                    text: 'OK', onPress: async() => {
                    firestore().collection('flips').doc(flipID).delete().then(() => {
                        console.log("Flip Document successfully deleted. ");
                        Toast.show('Flip deleted');
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                        console.log('OK Pressed')
                        }
                    },  
                ]  
            );
            }}/>
            </MenuOptions>
            </Menu>
        );
      }

    return (
        <ScrollView style={{paddingBottom:0,borderBottomWidth:1,borderTopWidth:1, borderColor:'#dddd'}}>
            <View style={{flexDirection:'row',paddingBottom:0}}>
            <TouchableOpacity 
            onPress={() => retrieveUserData()}
            style={{flexDirection:'row',padding:5}}>
                <View>
                    <Image 
                        source={{uri:props.navigation.state.params.item.creatorPicture}}
                        style={{height:width/12,width :width/12,borderRadius:20}} />
                </View>
                <View style={{borderColor:'black',borderWidth:0,justifyContent:'center'}}>
                    <Text style={{fontFamily:'Montserrat-Bold'}}> {props.navigation.state.params.item.creatorName}</Text>
                     
                </View>            
            </TouchableOpacity>
            <View style={{flex:1,alignItems:'flex-end',justifyContent:"center",paddingRight:5}}>
            {
              props.navigation.state.params.item.bookName !== undefined &&
              <Text style={{fontFamily:'Montserrat-Italic',fontSize:10}}>
                {props.navigation.state.params.item.bookName}
              </Text>
            }
            </View>
            </View>
            <View>
                {/* <Image 
                    source={{uri:props.item.flipPictures[0]}}
                    style={{height:width,width :width}}/> */}
                <ScrollView
                    horizontal
                    pagingEnabled
                    scrollEnabled
                    showsHorizontalScrollIndicator={false}
                    decelerationRate={0.998}
                    scrollEventThrottle={16}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }])}
                    useNativeDriver={true}
                >
            {
               loadingResizeModes === false
               ?
               props.navigation.state.params.item.flipPictures && 
               props.navigation.state.params.item.flipPictures.map((img, index) => 
                
               
                    <Image
                  key={`${index}-${img}`}
                  source={{ uri: img }}
                  resizeMode={resizeModes[index]}
                  style={{ width:width, height: width*1.5 }}
                />      
              )
              :
              <View style={{ backgroundColor:'#dddd', width:width, height: width*1.5 }}/>  
            }
          </ScrollView>

            </View>
            <View>
            {
                props.navigation.state.params.item.flipPictures.length > 1 &&
                renderDots()
            }
                </View>
            <View style={{marginHorizontal:5,paddingBottom:height/6}}>
                <Text style={{fontWeight:'bold'}}>{props.navigation.state.params.item.creatorName} 
                <Text style={{fontWeight:'normal', fontFamily:'Montserrat-Regular'}}>  {props.navigation.state.params.item.flipDescription} </Text>
                </Text>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={{color:"gray",fontSize:10}}>{moment(props.navigation.state.params.item.createdOn).fromNow()}</Text>
                
                {
                  (isAdmin == true || props.navigation.state.params.item.creatorID == realUserID)
                  &&
                  renderMenu()
                }

                
                </View>
            </View>
           
        </ScrollView>
    )

  }, areEqual)

export default withFirebaseHOC(MainFlipItem);


const styles = StyleSheet.create({
  flex: {
    flex: 0,
  },
  column: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.sizes.padding,
    paddingTop: theme.sizes.padding * 1.33,
    paddingBottom: theme.sizes.padding * 0.66,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  articles: {
  },
  books: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  destination: {
    width: width - (theme.sizes.padding * 2),
    height: height/3,
    marginHorizontal: theme.sizes.margin*1.5,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding * 0.66,
    borderRadius: theme.sizes.radius,
  },
  destinationInfo: {
    position: 'absolute',
    borderRadius: theme.sizes.radius,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding / 2,
    bottom: height/100,
    left: (width - (theme.sizes.padding * 4)) / (Platform.OS === 'ios' ? 3.2 : 3),
    backgroundColor: theme.colors.white,
    width: width - (theme.sizes.padding * 4),
  },
  recommended: {
  },
  recommendedHeader: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: theme.sizes.padding,
  },
  recommendedList: {
  },
  recommendation: {
    width: (width - (theme.sizes.padding * 2)) / 2,
    marginHorizontal: 0,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
    borderRadius: theme.sizes.radius,
    marginVertical: theme.sizes.margin * 0.5,
  },
  recommendationHeader: {
    overflow: 'hidden',
    borderTopRightRadius: theme.sizes.radius,
    borderTopLeftRadius: theme.sizes.radius,
  },
  recommendationOptions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.sizes.padding / 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  recommendationTemp: {
    fontSize: theme.sizes.font * 1.25,
    color: theme.colors.white
  },
  recommendationImage: {
    width: (width - (theme.sizes.padding * 2)) / 2,
    height: (width - (theme.sizes.padding * 2)) / 2,
  },
  avatar: {
    width: theme.sizes.padding,
    height: theme.sizes.padding,
    borderRadius: ((theme.sizes.padding) * 2) / 1,
  },
  rating: {
    fontSize: theme.sizes.font * 1.5,
    color: theme.colors.white,
    fontWeight: 'bold'
  },
  shadow: {
    shadowColor: theme.colors.dark_green,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  dots: {
    width: 5,
    height: 5,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
    borderColor: 'transparent',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 6.25,
    borderColor: theme.colors.active,
  }
});

       
    
  