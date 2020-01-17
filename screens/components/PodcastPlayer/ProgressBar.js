import React from 'react';
import Slider from '@react-native-community/slider';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux'



 const ProgressBar=(props) => {
  const currentTime=useSelector(state=>state.currentTime);
  const duration=useSelector(state=>state.duartion);
  const position = getMinutesFromSeconds(currentTime);
  const fullDuration = getMinutesFromSeconds(duration);
  
 

  return (
    <View style={styles.wrapper}>
      <Slider
        value={currentTime}
        minimumValue={1}
        maximumValue={duration===undefined?300:duration}
        step={0.01}
        onValueChange={(value)=>handleOnSlide(value)}
        onSlidingStart={props.onSlideStart}
        onSlidingComplete={props.onSlideComplete}
        minimumTrackTintColor={'#F44336'}
        maximumTrackTintColor={'#FFFFFF'}
        thumbTintColor={'#F44336'}
      />
      <View style={styles.timeWrapper}>
        <Text style={styles.timeLeft}>{position}</Text>{
            duration!==undefined &&
        <Text style={styles.timeRight}>{duration}</Text>
 }
      </View>
    </View>
  );

  function getMinutesFromSeconds(time) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : '0' + minutes}:${
      seconds >= 10 ? seconds : '0' + seconds
    }`;
  }

  function handleOnSlide(time) {
    props.onSlideCapture({seekTime: time});
  }
};

export default ProgressBar;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  timeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  timeLeft: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingLeft: 10,
  },
  timeRight: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'right',
    paddingRight: 10,
  },
});
