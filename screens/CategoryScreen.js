import React, { Component } from 'react';
import firestore from '@react-native-firebase/firestore';
import {withFirebaseHOC} from './config/Firebase'
import {useSelector, useDispatch,connect} from "react-redux"
import { Dimensions, Image,NativeEventEmitter, NativeModules,ActivityIndicator,StyleSheet, ScrollView, TouchableOpacity,View } from 'react-native';
import { Card, Badge, Block, Text } from './components/categories/components';
import { theme } from './components/categories/constants';
const { width,height } = Dimensions.get('window');

class CategoryScreen extends Component {
  constructor(props)
  {
    super(props)
    {
      this.state = {
        active: 'books',
        categories: [],
      }
    }

    const eventEmitter=new NativeEventEmitter(NativeModules.ReactNativeRecorder);
    const fileType=".m4a"
    const filePath="/storage/emulated/0/AudioRecorder/"
    var audioFilePath=null;
    this.eventListener=eventEmitter.addListener('RecordFile', (event) => {
          audioFilePath=filePath.concat(event.eventName,fileType)
          console.log(props)
          console.log("RecordedFilePath :" +audioFilePath)
          console.log("timeduration :" , +event.eventDuration)
          console.log("this.props.isBookPodcast : ",this.props.isBookPodcast);

          if(this.props.isBookPodcast == true)
          {
            props.navigation.navigate('PreviewScreen', {  
              recordedFilePath: audioFilePath, 
              duration:event.eventDuration
            })      
          }
          else
          {
            props.navigation.navigate('OriginalsPreviewScreen', {  
              recordedFilePath: audioFilePath, 
              duration:event.eventDuration
            })
          }
        })
  }

  componentDidUpdate=(prevprops)=>
  {
    console.log("[CategoryScreen] componentDidUpdate");
    console.log("prevprops.isBookPodcast",prevprops.isBookPodcast);
    console.log("this.props.isBookPodcast",this.props.isBookPodcast)
  }
  

  componentDidMount = () => {
    try {
      
      this.retrieveData();
      
    }
    catch (error) {
      console.log(error);
    }
  };

  componentWillUnmount = () => {
    // this.eventListener.remove();  
  }


  retrieveData = async () => {
    
    this.setState({
      loading: true,
    });
    console.log('Retrieving Data');
    try {
      let categoriesQuery = await firestore().collection('Categories').get();
      let documentData = categoriesQuery.docs.map(document => document.data());

      this.props.dispatch({ type:"SET_CATEGORIES_MAP_NAME_TO_ID",payload:documentData});
      this.props.dispatch({ type:"SET_CATEGORY_NAMES",payload:documentData.map(data=>data.categoryName)})
      this.setState({
        categories: documentData
      });
    }
    catch (error) {
      console.log(error);
    }
    finally {
      this.setState({
        loading: false
      });
    }
  };
  
  render() {
    const { categories } = this.state;
    const tabs = ['books', 'Podcasts'];
    
    if(this.state.loading)
     {
       return (
        <View>
        <View  style={{paddingBottom: (height*5)/12}}>
          </View>
           <ActivityIndicator/>
           </View>
       );
     }
    else
    {
      return (
        <Block>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingVertical: theme.sizes.base * 2}}>
            <Block flex={false} row space="between" style={styles.categories}>
              
              {categories.map(category => (
                <TouchableOpacity key={category.categoryName} onPress={() => 
                                  this.props.navigation.navigate('CategoryTabNavigator', {category : category.categoryName })}>
                  <Card style={{height:width/2.8,width:width/4}} center middle shadow> 
                    {/* <Badge margin={[0, 0, 15]} size={20} color="rgba(41,216,143,0.20)"> */}
                  
                      <Image style={{height:width/4,width:width/4,borderRadius:0}} source={{uri:category.categoryImage}} />
                <Text style={{fontWeight:'bold',textAlign:'center',fontSize:9.5}}>{"   "}{category.categoryName}{"  "}{"\n"}</Text>
                {
                  this.props.isAdmin &&
                  <Text style={{fontSize:6}}> {category.numPodcasts} </Text>
                }
                
                      
                    
                  </Card>
                </TouchableOpacity>
              ))}
            </Block>
          </ScrollView>
        </Block>
        
      )
    }
}
}

CategoryScreen.defaultProps = {
}

const mapStateToProps = (state) => {
  return{
    isAdmin : state.userReducer.isAdmin,
    isBookPodcast : state.recorderReducer.isBookPodcast
  }
}

const mapDispatchToProps = (dispatch) =>{
  return{
  dispatch,
  }}

export default connect(mapStateToProps,mapDispatchToProps)(withFirebaseHOC(CategoryScreen));

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingTop: theme.sizes.base * 2,
    paddingBottom :theme.sizes.base * 0.5,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  tabs: {
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
  },
  tab: {
    marginRight: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base
  },
  active: {
    borderBottomColor: theme.colors.black,
    borderBottomWidth: 3,
  },
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
  }
})
