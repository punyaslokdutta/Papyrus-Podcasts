
import * as React from 'react';
import {
  View, StyleSheet, Text, Dimensions, TouchableWithoutFeedback,
} from 'react-native';
//import { Icon } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome'
import PlayerContext from './PlayerContext';

const { width } = Dimensions.get('window');
export const PLACEHOLDER_WIDTH = width / 3;

/*type PlayerControlsProps = {
  title: string,
  onPress: () => mixed,
};*/

export default class PlayerControls extends React.Component {

  constructor(props)
  {
    super(props)
    {
      onPress:  this.props.onPress;
      title: this.props.title;
    }
  }

    /*static propTypes={
        title: React.PropTypes,
        onPress: React.PropTypes,
    }*/
  render() {
   const { title, onPress } = this.props;
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.placeholder} />
          <Text style={styles.title} numberOfLine={3}>{title}</Text>
          <Icon name="play" size={24} style={styles.icon}/>
          <PlayerContext.Consumer>
            {
              ({ setPodcast }) => (
                <TouchableWithoutFeedback onPress={() => setPodcast(null)}>
                <Icon name="times-circle" size={24} style={styles.icon}/>
                </TouchableWithoutFeedback>
              )
            }

          </PlayerContext.Consumer>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderColor:'black'
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    paddingLeft: 8,
  },
  placeholder: {
    width: PLACEHOLDER_WIDTH,
  },
  icon: {
    fontSize: 18,
    color: 'black',
    padding: 8,
    
  },
});
