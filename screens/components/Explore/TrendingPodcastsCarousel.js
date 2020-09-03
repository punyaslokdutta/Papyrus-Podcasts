
import React from 'react';
import Carousel,{getInputRangeFromIndexes,Pagination} from 'react-native-snap-carousel';
import {View, Text, Dimensions,StyleSheet} from 'react-native'
import Story from './Story';
import TrendingPodcast from './TrendingPodcast';
import {useSelector, useDispatch,connect} from "react-redux"

const {width,height} = Dimensions.get('window')

 class TrendingPodcastsCarousel extends React.Component {

    constructor(props)
    {
        super(props)
        {
        this.state={
           activeSlide : 0
        }
        }
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        return (this.state.activeSlide != nextState.activeSlide);//this.state.value != nextState.value;
      }

    retrievePodcast = (item) => {
        if(this.props.podcastRedux === null || (this.props.podcastRedux!== null && this.props.podcastRedux.podcastID != item.podcastID))
          {
            this.props.dispatch({type:"SET_FLIP_ID",payload:null});
            this.props.dispatch({type:"SET_CURRENT_TIME", payload:0});
            this.props.dispatch({type:"SET_PAUSED", payload:false});
            this.props.dispatch({type:"SET_LOADING_PODCAST", payload:true});
            this.props.podcastRedux === null && this.props.dispatch({type:"SET_MINI_PLAYER_FALSE"});
            this.props.dispatch({ type:"SET_MUSIC_PAUSED",payload:true});
            this.props.dispatch({type:"SET_PODCAST", payload: item});
            this.props.dispatch({type:"SET_DURATION", payload:item.duration});
            this.props.dispatch({type:"ADD_NAVIGATION", payload:this.props.navigation});
            this.props.dispatch({type:"SET_NUM_LIKES", payload: item.numUsersLiked});
            this.props.dispatch({type:"SET_NUM_RETWEETS", payload: item.numUsersRetweeted})
          } 
    };

    renderItem = ({item, index}) => {
        console.log("[TrendingPodcastsCarousel] Before rendering TrendingPodcast");
        return (
            <View>
            <TrendingPodcast item={item} retrievePodcast={this.retrievePodcast} index={index} key ={index} navigation={this.props.navigation}/>
            </View>
        );
    }



    // Left/right translate effect
//   scrollInterpolator = (index, carouselProps) => {
//     const range = [2, 1, 0, -1];
//     const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
//     const outputRange = range;

//     return { inputRange, outputRange };
// }

//   animatedStyles = (index, animatedValue, carouselProps) => {
//     const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
//     const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';

//     return {
//         zIndex: carouselProps.data.length - index,
//         opacity: animatedValue.interpolate({
//             inputRange: [-1, 0, 1, 2],
//             outputRange: [1, 1, 0.75, 0.5],
//             extrapolate: 'clamp'
//         }),
//         transform: [{
//             [translateProp]: animatedValue.interpolate({
//                 inputRange: [-1, 0, 1, 2],
//                 outputRange: [
//                     0,
//                     0,
//                     -sizeRef * 2,
//                     -sizeRef
//                 ],
//                 extrapolate: 'clamp'
//             })
//         }]
//     };
// }

// From https://codeburst.io/horizontal-scroll-animations-in-react-native-18dac6e9c720

// scrollInterpolator = (index, carouselProps) => {
//     const range = [1, 0, -1];
//     const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
//     const outputRange = range;

//     return { inputRange, outputRange };
// }
// animatedStyles = (index, animatedValue, carouselProps) => {
//     return {
//         zIndex: carouselProps.data.length - index,
//         opacity: animatedValue.interpolate({
//             inputRange: [-1, 0, 1],
//             outputRange: [0.75, 1, 0.75],
//             extrapolate: 'clamp'
//         }),
//         transform: [
//             {
//                 perspective: 1000
//             },
//             {
//                 scale: animatedValue.interpolate({
//                     inputRange: [-1, 0, 1],
//                     outputRange: [0.65, 1, 0.65],
//                     extrapolate: 'clamp'
//                 })
//             },
//             {
//                 rotateX: animatedValue.interpolate({
//                     inputRange: [-1, 0, 1],
//                     outputRange: ['30deg', '0deg', '30deg'],
//                     extrapolate: 'clamp'
//                 })
//             },
//             {
//                 rotateY: animatedValue.interpolate({
//                     inputRange: [-1, 0, 1],
//                     outputRange: ['-30deg', '0deg', '30deg'],
//                     extrapolate: 'clamp'
//                 })
//             }
//         ]
//     };
// }

    scrollInterpolator = (index, carouselProps) => {
        const range = [2, 1, 0, -1];
        const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
        const outputRange = range;
    
        return { inputRange, outputRange };
    }
    animatedStyles = (index, animatedValue, carouselProps) => {
        const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
        const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';
    
        return {
            zIndex: carouselProps.data.length - index,
            opacity: animatedValue.interpolate({
                inputRange: [-1, 0, 1, 2],
                outputRange: [0.75, 1, 0.6, 0.4]
            }),
            transform: [{
                rotate: animatedValue.interpolate({
                    inputRange: [-1, 0, 1, 2],
                    outputRange: ['0deg', '0deg', '5deg', '8deg'],
                    extrapolate: 'clamp'
                })
            }, {
                scale: animatedValue.interpolate({
                    inputRange: [-1, 0, 1, 2],
                    outputRange: [0.96, 1, 0.85, 0.7]
                })
            }, {
                [translateProp]: animatedValue.interpolate({
                    inputRange: [-1, 0, 1, 2],
                    outputRange: [
                        0,
                        0,
                        -sizeRef + 30,
                        -sizeRef * 2 + 45
                    ],
                    extrapolate: 'clamp'
                })
            }]
        };
    }


    get pagination () {
        const { activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={this.props.data.length}
              activeDotIndex={activeSlide}
              containerStyle={{ backgroundColor: 'white' }}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 8,
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

    render () {
        return (
            <View>
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.props.data}
              activeSlideAlignment={'center'}
              renderItem={this.renderItem}
              sliderWidth={width}
              onSnapToItem={(index) => this.setState({ activeSlide: index }) }
              itemWidth={width*0.8}
              inactiveSlideOpacity={2}
            />

            </View>
        );
    }
}


const horizontalMargin = 20;
const slideWidth = 280;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;
const itemHeight = 200;

const styles = StyleSheet.create({
    slide: {
        width: itemWidth,
        height: itemHeight,
        paddingHorizontal: horizontalMargin
        // other styles for the item container
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold'
      },
    slideInnerContainer: {
        width: slideWidth,
        flex: 1
        // other styles for the inner container
    }
});

const mapStateToProps = (state) => {
    return{
      podcastRedux: state.rootReducer.podcast,
    }
  }
  
  const mapDispatchToProps = (dispatch) =>{
    return{
    dispatch,
    }}
  
export default connect(mapStateToProps,mapDispatchToProps)(TrendingPodcastsCarousel);
// export default TrendingPodcastsCarousel;