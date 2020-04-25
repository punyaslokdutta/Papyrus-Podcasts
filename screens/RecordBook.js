import React, { Component } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Text, StyleSheet, View, Animated, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import {Card, CardItem,  Body} from 'native-base'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation';
//import Animated, { Easing } from 'react-native-reanimated';

import * as theme from './components/constants/theme';

const { width, height } = Dimensions.get('window');
//const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)

const styles = StyleSheet.create({
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
 
  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
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
    // backgroundColor: 'transparent',
    paddingHorizontal: theme.sizes.padding,
    paddingTop: theme.sizes.padding,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  back: {
    width: theme.sizes.base * 3,
    height: theme.sizes.base * 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    // backgroundColor: theme.colors.active,
    // borderTopLeftRadius: theme.sizes.border,
    // borderTopRightRadius: theme.sizes.border,
  },
  contentHeader: {
    backgroundColor: 'transparent',
    padding: theme.sizes.padding,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.sizes.radius*4,
    borderTopRightRadius: theme.sizes.radius*4,
    marginTop: -theme.sizes.padding / 2,
  },
  avatar: {
    position: 'absolute',
    top: -theme.sizes.margin,
    right: theme.sizes.margin,
    width: theme.sizes.padding * 2,
    height: theme.sizes.padding * 2,
    borderRadius: theme.sizes.padding,
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },
  dotsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 36,
    right: 0,
    left: 0
  },
  dots: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
  },
  title: {
    fontSize: theme.sizes.font * 2,
    fontWeight: 'bold'
  },
  description: {
    fontSize: theme.sizes.font * 1.2,
    lineHeight: theme.sizes.font * 2,
    color: theme.colors.black,
    //fonFamily: 'sans-serif-light'
    
  }
});

class RecordBook extends Component {

  constructor(props)
  {
    super(props)
    {
      //this.renderHeader = this.renderHeader.bind(this);
      this.state={
        loading: true, 
        article: null
      };
    }
    //const ref = firestore().collection('books');
  }
  scrollX = new Animated.Value(0);

 

  //component did mount
  componentDidMount = async () => {
    try {
      // Cloud Firestore: Initial Query
      this.retrieveData();
      this.setState({
        loading: false

      })
    }
    catch (error) {
      console.log(error);
    }
  };


  retrieveData = async () => {
  
    console.log('[Record Book] Retrieving Data');
    try{
      const bookID = this.props.navigation.state.params.bookID;
      let bookDoc = await firestore().collection('books').doc(bookID).get();
      this.setState({
        article : bookDoc._data
      });
    }
    catch(error){
      console.log(error)
    }
    
  };


  renderDots = () => {
   // const { navigation } = this.props;
    const bookid = this.props.navigation.params;

    const dotPosition = Animated.divide(this.scrollX, width);


    return (
      <View style={[ styles.flex, styles.row, styles.dotsContainer ]}>
        {this.state.article.bookPictures && this.state.article.bookPictures.map((item, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp'
          });
          return (
            <Animated.View
              key={`step-${item}-${index}`}
              style={[styles.dots, { opacity }]}
            />
          )
        })}
      </View>
    )
  }

  renderRatings = (rating) => {
    const stars = new Array(5).fill(0);
    return (
      stars.map((_, index) => {
        const activeStar = Math.floor(rating) >= (index + 1);
        return (
          <FontAwesome
            name="star"
            key={`star-${index}`}
            size={theme.sizes.font}
            color={theme.colors[activeStar ? 'active' : 'gray']}
            style={{ marginRight: 4 }}
          />
        )
      })
    )
  }

  render() {
    const { navigation } = this.props;
    const bookid = this.props.navigation.state.params;
  

    if(this.state.article) 
    { 
      return (
        <ScrollView  scrollEventThrottle={16} >
        <View style={styles.flex,{paddingBottom:height*2/11}}>
          <View style={[styles.flex]}>
            <ScrollView
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate={0.998}
            scrollEventThrottle={16}
            //onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: this.scrollX } } }])}
          >
            {
               this.state.article.bookPictures && this.state.article.bookPictures.map((img, index) => 
                <Image
                  key={`${index}-${img}`}
                  source={{ uri: img }}
                  resizeMode='cover'
                  style={{ width, height: width }}
                />
              )
            }
          </ScrollView>
          {this.renderDots()}
        </View>
        <View style={[styles.flex, styles.content]}>
          <View style={[styles.flex, styles.contentHeader]}>
            <View style={{flexDirection:'row'}}>
              <View>
            <Text style={styles.title}>{this.state.article.bookName}</Text>
            <View style={[
              styles.row,
              { alignItems: 'center', marginVertical: theme.sizes.margin / 2, flexDirection:'row' }
            ]}>
              {this.renderRatings(this.state.article.bookRating)}
              <Text style={{ color: theme.colors.active }}>
                {this.state.article.bookRating} 
              </Text>
              <View style={{paddingLeft:10}}>
          
              </View>
              </View>
              </View>
               
            </View>

            
            <View style={{paddingTop:20,paddingBottom:20, paddingLeft:10}}>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('SelectScreen',{bookItem:this.state.article,chapterItem:null})}>
            <View style={{alignItems:'center'}}>  
             <FontAwesome name="microphone" color={theme.colors.black} size={theme.sizes.font * 1.5} />
            <Text style={{fontSize:12}}>Record</Text>
            </View>
          </TouchableOpacity>
            </View> 

            <Card style={{borderRadius: 10 ,width:((width*4)/5 ), paddingTop :5}}>
              <CardItem>
            <TouchableOpacity>
              <Text style={{fontSize:20, paddingBottom:10, fontFamily:'san-serif-light'}}>Description</Text>
              <Text style={{fontSize:15}}>
                {this.state.article.bookDescription}
              </Text>
            </TouchableOpacity>
            </CardItem>
            </Card>
            <Card style={{borderRadius: 10 ,width:((width*4)/5 ), paddingTop :5}}>
              <CardItem>
            <TouchableOpacity>
              <Text style={{fontSize:20, paddingBottom:10, fontFamily:'san-serif-light'}}>Author(s)</Text>
                {
                  this.state.article.authors.map(item => (
                    <Text style={{fontSize:15}}>
                    {item}
                    </Text>
                   ))
                }
                
              
            </TouchableOpacity>
            </CardItem>
            </Card>
          </View>
        </View>
      </View>
      </ScrollView>
    )
  }
  else
  {
    return (
    <View></View>
    );
  }
  }
}

export default withNavigation(RecordBook);
