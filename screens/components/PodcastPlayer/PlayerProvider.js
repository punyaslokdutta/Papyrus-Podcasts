// @flow
import React, {Component} from 'react';
import {
  View, StyleSheet, Dimensions, StatusBar, Platform,
} from 'react-native';
//import { DangerZone } from 'expo';

import PlayerContext from './PlayerContext';
import PodcastPlayer from '../../PodcastPlayer'; //instead of Video Modal 
import podcasts from './podcasts';
import Animated, { Easing } from 'react-native-reanimated';


const { height } = Dimensions.get('window');
//const { Animated, Easing } = DangerZone;
const { Value, timing } = Animated;
const isOS = Platform.OS === 'ios';

/*type PlayerProviderProps = {
  children: React.Node,
};

type PlayerProviderState = {
  video: Video | null,
};*/

export default class PlayerProvider extends React.Component {
    constructor(props)
    {
        super(props)
        {
            //animation = new Value(0);
            this.state = {
                
                podcast: null,
                eventSource: null,
                setPodcast : (podcast, eventSource ) => {
                  this.setState({ podcast }, this.togglePodcast, {eventSource});
                  //console.log(this.state.eventSource)
              
                }, 
                togglePodcast : () => {
                  const { podcast } = this.state;
                  const {eventSource} =this.state;
                  timing(
                    this.animation,
                    {
                      toValue: podcast ? 1 : 0,
                      duration: 300,
                      easing: Easing.inOut(Easing.ease),
                    },
                  ).start();
                },



              };

        }
    }

    static propTypes={
        //children: React.PropTypes.
    }
  

  animation = new Value(0);

  /*setPodcast = (podcast, eventSource ) => {
    this.setState({ podcast }, this.togglePodcast, {eventSource});
    //console.log(this.state.eventSource)

  };

  togglePodcast = () => {
    const { podcast } = this.state;
    const {eventSource} =this.state;
    timing(
      this.animation,
      {
        toValue: podcast ? 1 : 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      },
    ).start();
  };*/

  render() {
    const { /*setPodcast,*/ animation } = this;
    const { children } = this.props ;
    const  {podcast } = this.state;
    //const  {eventSource} =this.state;
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 0],
    });
    return (
      <PlayerContext.Provider value={this.state}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <View style={StyleSheet.absoluteFill}>
            {children}
          </View>
          {
            isOS && (
              <Animated.View
                style={{ transform: [{ translateY }] }}
              >
                {
                  podcast && <PodcastPlayer {...{ podcast }} />
                }
              </Animated.View>
            )
          }
          {
            !isOS && podcast && <PodcastPlayer {...{ podcast }} />
          }
        </View>
      </PlayerContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
