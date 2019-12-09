import React, { Component } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
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
  

  renderMonthly() {
    return (
      <Card shadow style={{ paddingVertical: theme.sizes.padding }}>
        <Block>
          <Block center>
            <Text h1 primary spacing={1.7}>116</Text>
            <Text spacing={0.7}>Total Listening Time (mins)</Text>
          </Block>

          <Block color="gray3" style={styles.hLine} />

          <Block row>
            <Block center>
              <Text size={20} spacing={0.6} primary style={{ marginBottom: 6 }}>12</Text>
              <Text body spacing={0.7}>Number of </Text>
              <Text body spacing={0.7}>Book Podcasts</Text>
            </Block>

            <Block flex={false} color="gray3" style={styles.vLine} />

            <Block center>
              <Text size={20} spacing={0.6} primary style={{ marginBottom: 6 }}>30</Text>
              <Text body spacing={0.7}>Number of </Text>
              <Text body spacing={0.7}>Chapter Podcasts</Text>
            </Block>
          </Block>
        </Block>
      </Card>
    )
  }

  renderRewards() {
    return (
      <Card shadow style={{ paddingVertical: theme.sizes.base * 2}}>
        <Block center>
          <AnimatedCircularProgress
            size={214} // can use  with * .5 => 50%
            fill={85} // percentage
            lineCap="round" // line ending style
            rotation={220}
            arcSweepAngle={280}
            width={theme.sizes.base}
            tintColor={theme.colors.primary} // gradient is not supported
            backgroundColor={theme.colors.gray3}
            backgroundWidth={theme.sizes.base / 2}
          >
            {() => (
              <Block center middle>
                <Text h2 medium>8.1</Text>
                <Text h3 transform="uppercase">good</Text>
              </Block>
            )}
          </AnimatedCircularProgress>
        </Block>

        <Block center>
          <Text title spacing={1} style={{marginVertical: 8}}>
            Gnosis Score
          </Text>
        </Block>
        <Block >
          <Text  spacing={1} style={{marginVertical: 8}}>
            *Gnosis Score is calculated monthly based on Listens_Count, Likes , Nature of comments in your podcasts, time spent on the App.
            

          </Text>
          <Text  spacing={1} style={{marginVertical: 8}}>
            *We won't make "Gnosis Score" public and only serves as a self improvement tool.
            

          </Text>

         
        </Block>


        <Block color="gray3" style={styles.hLine} />

        <Block row>
          <Block center flex={0.8}>
            <Text size={20} spacing={1} primary>12</Text>
            <Text spacing={0.7}>Book </Text>
          </Block>
          
          <Block center flex={2}>
            <Text size={20} spacing={1} primary>33</Text>
            <Text spacing={0.7}>Chapters</Text>
          </Block>

          <Block center flex={0.8}>
            <Text size={20} spacing={0.5} primary>332</Text>
            <Text spacing={0.5}>Time(mins)</Text>
          </Block>
        </Block>

        <Block color="gray3" style={styles.hLine} />

       
        
       

        <Block style={{ marginBottom: theme.sizes.base }}>
          <Block row space="between" style={{ paddingLeft: 6 }}>
            <Text body spacing={0.7}>Retention Rate of Listeners</Text>
            <Text caption spacing={0.7}>7.4</Text>
          </Block>
          <Progress endColor="#D37694" value={0.74} />
        </Block>

        <Block color="gray3" style={styles.hLine} />

        
      </Card>
    )
  }

  renderChallenges() {
    return (
      <Block>
        <Block style={{
            marginTop: theme.sizes.base,
            marginBottom: theme.sizes.base,
            paddingHorizontal: theme.sizes.base / 3
          }}
        >
          <Text spacing={0.7} transform="uppercase">
            Challenges taken
          </Text>
        </Block>

        <Card row shadow color="gray">
          <Block middle flex={0.4}>
            <Badge color={rgba(theme.colors.white, '0.2')} size={74}>
              <Badge color={rgba(theme.colors.white, '0.2')} size={52}>
                <FontAwesome name="check" color="white" size={theme.sizes.h1} />
              </Badge>
            </Badge>
          </Block>
          <Block middle>
            <Text size={theme.sizes.base} spacing={0.4} medium white>
              Hit zero pedestrians
            </Text>
            <Text size={theme.sizes.base} spacing={0.4} medium white>
              during next trip - $5
            </Text>
          </Block>
        </Card>
      </Block>
    )
  }

  render() {
    return (
      <ScrollView style={styles.rewards} showsVerticalScrollIndicator={false}>
       <Block flex={false} row center style={styles.header}>
       <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Image
            resizeMode="contain"
            source={require('../assets/icons/Back.png')}
            style={{ width: 20, height: 24, marginRight: theme.sizes.base  }}
          />
        </TouchableOpacity>
          <Text h3 bold>Listening Statistics</Text>
        </Block>
        {this.renderMonthly()}
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h3 bold>Your Podcast Statistics</Text>
        </Block>
        {this.renderRewards()}
        
      </ScrollView>
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
