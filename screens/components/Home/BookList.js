import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableOpacity, 
  Animated
} from 'react-native'
import Carousel,{getInputRangeFromIndexes,Pagination} from 'react-native-snap-carousel';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
//import Animated, { Easing } from 'react-native-reanimated';

import * as theme from '../constants/theme';
import RecordBook from '../../RecordBook'
import BookItem from './BookItem';
//const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
const { width, height } = Dimensions.get('window');

class BookList extends Component {
  constructor(props)
  {
    super(props)
    {
    this.state={
       activeSlide : 1
    }
    }    
  }

  scrollX = new Animated.Value(0);


  get pagination () {
    const { activeSlide } = this.state;
    return (
        <Pagination
          dotsLength={this.props.books.length}
          activeDotIndex={activeSlide}
          //containerStyle={{ backgroundColor: 'white' }}
          dotStyle={{
              width: 8,
              height: 8,
              borderRadius: 5,
              //marginHorizontal: 8,
              backgroundColor: 'black'
          }}
          inactiveDotStyle={{
              // Define styles for inactive dots here
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
    );
}

  renderDots() {
    console.log(this.props.books)
    const  books  = this.props.books;
      console.log("Swayam")
      console.log(books)
    
    const dotPosition = this.state.activeSlide;//Animated.divide(this.scrollX, width);
    console.log("dotPosition: ",dotPosition);
    return (
      <View style={[
        styles.flex, styles.row,
        { justifyContent: 'center', alignItems: 'center', marginTop: 10 }
      ]}>
        {   books.map((item, index) => {
          // const borderWidth = dotPosition.interpolate({
          //   inputRange: [index -1, index, index + 1],
          //   outputRange: [0, 2.5, 0],
          //  // extrapolate: 'clamp'
          // });
          return (
            <View
              key={`step-${index}`}
              style={[styles.dots, styles.activeDot ]}
            />
          )
        })}
        
      </View>
      
    )
  }

  

  renderBooks = () => {
    return (
      <View style={[ styles.column, styles.books ]}>
        {/* <FlatList
          horizontal
          //pagingEnabled
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          scrollEventThrottle={50}
          snapToInterval={width - 50} 
          snapToAlignment={"center"}
          style={{ overflow:'visible', height: 280 }}
          data={this.props.books}
          keyExtractor={(item, index) => `${item.bookID}`}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: this.scrollX }} }])}
          renderItem={({ item }) => this.renderBook(item)}
        /> */}
        <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.props.books}
              //scrollInterpolator={this.scrollInterpolator}
              //slideInterpolatedStyle={this.animatedStyles}
              renderItem={this.renderBook}
              firstItem={1}
              activeSlideAlignment={'center'}
              sliderWidth={width}
              onSnapToItem={(index) => this.setState({ activeSlide: index }) }
              itemWidth={width/3}
            />
        {this.pagination}
      </View>      
    );
  }

  renderBook = ({item,index}) => {
    //const { navigation } = this.props;
    console.log("dwdeeedee")
    console.log(item)     
    return (
      <BookItem item={item} navigation={this.props.navigation}/>
    )
  }

  
  

  render() {
    return (
      <View key ={this.props.index}
      >
        {this.renderBooks()}
      </View>
    )
  }
}

// BookList.defaultProps = {
//   books: mocks
// };

export default BookList;

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
    marginHorizontal: theme.sizes.margin,
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
    width: 10,
    height: 10,
    borderWidth: 2.5,
    borderRadius: 5,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
    borderColor: 'transparent',
  },
  activeDot: {
    width: 12.5,
    height: 12.5,
    borderRadius: 6.25,
    borderColor: theme.colors.active,
  }
});
