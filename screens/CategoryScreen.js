import React, { Component } from 'react';
import firestore from '@react-native-firebase/firestore';
import {withFirebaseHOC} from './config/Firebase'

import { Dimensions, Image,NativeEventEmitter, NativeModules,ActivityIndicator,StyleSheet, ScrollView, TouchableOpacity,View } from 'react-native';
import CategoryPodcast from './components/categories/CategoryPodcast';
import { Card, Badge, Block, Text } from './components/categories/components';
import { theme, mocks } from './components/categories/constants';
import CategoryTabNavigator from './navigation/CategoryTabNavigator'

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

  }

  componentDidUpdate=(props)=>
  {
    const eventEmitter=new NativeEventEmitter(NativeModules.ReactNativeRecorder);
    console.log("Inside useEffect - componentDidUpdate of ExploreScreen");
      const fileType=".m4a"
      const filePath="/storage/emulated/0/AudioRecorder/"
      var audioFilePath=null;
      this.eventListener=eventEmitter.addListener('RecordFile', (event) => {
           audioFilePath=filePath.concat(event.eventName,fileType)
          console.log(props)
          console.log("RecordedFilePath :" +audioFilePath)
          console.log("timeduration :" , +event.eventDuration)
         props.navigation.navigate('PreviewScreen', {  
          recordedFilePath: audioFilePath, 
          duration:event.eventDuration})
    })

  }
  

  componentDidMount = () => {
    try {
      // Cloud Firestore: Initial Query
      this.retrieveData();
    }
    catch (error) {
      console.log(error);
    }
  };

  // componentDidMount() {
  //   this.setState({ categories: this.props.categories });
  // }
  //retrieve data
  retrieveData = async () => {
    try {
      // Set State: Loading
      this.setState({
        loading: true,
      });

      console.log('Retrieving Data');
      // Cloud Firestore: Query
      let query3 = await firestore().collection('Categories').get();
      let documentData = query3.docs.map(document => document.data());

      this.setState({
        categories: documentData,
        loading:false
      });
    }
    catch (error) {
      console.log(error);
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
            {/* <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>Categories</Text>
        </Block> */}
          </View>
           <ActivityIndicator/>
           </View>
       );
     }
    else
    {
      return (
        <Block>
          {/* <Block flex={false} row center space="between" style={styles.header}>
            <Text h1 bold>Categories</Text>
          </Block> */}
  
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingVertical: theme.sizes.base * 2}}>
            <Block flex={false} row space="between" style={styles.categories}>
              {categories.map(category => (
                <TouchableOpacity key={category.categoryName} onPress={() => 
                                  this.props.navigation.navigate('CategoryTabNavigator', {category : category.categoryName })}>
                  <Card center middle shadow style={styles.category}> 
                    <Badge margin={[0, 0, 15]} size={20} color="rgba(41,216,143,0.20)">
                     
                      <Image style={{height:50,width:50,borderRadius:72}} source={{uri:category.categoryImage}} />
                      
                     </Badge>
                     <View style={{alignItems:'center',justifyContent:'center'}}>
                    <Text style={{textAlign:'center'}} medium height={20}>{category.categoryName}</Text>
                    <Text gray caption>{category.numPodcasts} Podcasts </Text>
                    <Text gray caption>{category.numBooks} books </Text>
                    </View>
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
  profile: mocks.profile,
  categories: mocks.categories,
}

export default withFirebaseHOC(CategoryScreen);

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
