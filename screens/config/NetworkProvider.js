import React from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = React.createContext({ isConnected: true });

export class NetworkProvider extends React.PureComponent {
  state = {
    isConnected: true
  };

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        this.setState({ isConnected : state.isConnected})
      });
  }
  
  componentWillUnmount() {
      console.log("unmounting NetworkProvider")
    this.unsubscribe();
  }

  handleConnectivityChange = isConnected => this.setState({ isConnected });

  render() {
    return (
      <NetworkContext.Provider value={this.state}>
        {this.props.children}
      </NetworkContext.Provider>
    );
  }
}