import React, { Component } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity,NativeModules,View } from 'react-native'
import rgba from 'hex-to-rgba';
//import Icon from 'react-native-vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// check this lib for more options
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { Block, Badge, Card, Text, Progress } from './components/statistics/components';
import { theme, mocks } from './components/statistics/constants';

export default class StatisticsScreen  extends Component {

    constructor(props)
    {
        super(props);
        this.state={
            totalListenCount: 10, 
            book_podcast_listen_count:20 , 
            chapter_podcast_listen_count: 200, 
            Gnosis_Score :4.5 ,
            Books_recorded_count: 23, 
            Chapter_Recorder_count: 34, 
            Time: 23, 


        }
    }

  render() {
    return (
    
      <View>
      {NativeModules.ReactNativeRecorder.sampleMethodTwo()}
      </View>
      // <ScrollView style={styles.rewards} showsVerticalScrollIndicator={false}>
      //  <Block flex={false} row center style={styles.header}>
      //  <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
      //     <Image
      //       resizeMode="contain"
      //       source={"../assets/icons/Back.png"}
      //       style={{ width: 20, height: 24, marginRight: theme.sizes.base  }}
      //     />
      //   </TouchableOpacity>
      //     <Text h3 bold>Listening Statistics</Text>
      //   </Block>
      //   {this.renderMonthly()}
      //   <Block flex={false} row center space="between" style={styles.header}>
      //     <Text h3 bold>Your Podcast Statistics</Text>
      //   </Block>
      //   {this.renderRewards()}
        
      // </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: theme.sizes.base * 2,
        paddingTop: theme.sizes.base * 2.5,
        paddingBottom :theme.sizes.base * 1,
      },
  rewards: {
    padding: theme.sizes.padding,
    backgroundColor: theme.colors.gray4,
  },
  // horizontal line
  hLine: {
    marginVertical: theme.sizes.base * 1.5,
    height: 1,
  },
  // vertical line
  vLine: {
    marginVertical: theme.sizes.base / 2,
    width: 1,
  },
})
