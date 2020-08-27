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
import ContinueListeningPodcastItem from './ContinueListeningPodcastItem';
//const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
const { width, height } = Dimensions.get('window');

class ContinueListeningPodcasts extends Component {
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
          dotsLength={this.props.podcasts.length}
          activeDotIndex={activeSlide}
          containerStyle={{ paddingBottom:0,marginBottom:10 }}
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
    console.log(this.props.podcasts)
    const  podcasts  = this.props.podcasts;
      console.log("Swayam")
      console.log(podcasts)
    
    const dotPosition = this.state.activeSlide;//Animated.divide(this.scrollX, width);
    console.log("dotPosition: ",dotPosition);
    return (
      <View style={[
        styles.flex, styles.row,
        { justifyContent: 'center', alignItems: 'center', marginTop: 10 }
      ]}>
        {   podcasts.map((item, index) => {
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

  

  renderPodcasts = () => {
    return (
      <View style={[ styles.column, styles.books ]}>
        <Text style={{fontFamily:'HeadlandOne-Regular',fontSize:23,marginBottom:20,alignSelf:'flex-start'}}> Continue Listening </Text>
        <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.props.podcasts}
              renderItem={this.renderPodcast}
              firstItem={1}
              activeSlideAlignment={'center'}
              sliderWidth={width}
              onSnapToItem={(index) => this.setState({ activeSlide: index }) }
              itemWidth={width/2}
            />
      </View>      
    );
  }

  renderPodcast = ({item,index}) => {
    console.log("[ContinueListeningPodcasts] ContinueListeningPodcastItem indexed - ",index," before rendering")
    return (
      <ContinueListeningPodcastItem podcast={item} key={item.podcastID} index={index} navigation={this.props.navigation}/>
    )
  }

  
  

  render() {
    return (
      <View
      >
        {this.renderPodcasts()}
      </View>
    )
  }
}

// ContinueListeningPodcasts.defaultProps = {
//   podcasts: mocks
// };

export default ContinueListeningPodcasts;

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
    alignItems:'center',
    marginBottom:20
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
