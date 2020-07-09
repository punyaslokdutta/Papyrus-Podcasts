
import React from 'react';
import Carousel,{getInputRangeFromIndexes,Pagination} from 'react-native-snap-carousel';
import {View, Text, Dimensions,StyleSheet} from 'react-native'
import Music from './Music';
const {width,height} = Dimensions.get('window')

 class MusicCarousel extends React.Component {

    renderItem = ({item, index}) => {
        return (
            <View>
            <Music item={item} index={index} key ={index} navigation={this.props.navigation}/>
            </View>
        );
    }   

    render () {
        return (
            <View>
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.props.data}
              renderItem={this.renderItem}
              activeSlideAlignment={'start'}
              sliderWidth={width}
              itemWidth={width*0.48}
            />

            </View>
        );
    }
}

export default MusicCarousel;

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


