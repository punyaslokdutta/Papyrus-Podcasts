import React, { Component } from "react";
import 'react-native-get-random-values';
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { WebView } from 'react-native-webview';
import Pdf from 'react-native-pdf';

export default class TermsandConditions extends Component {
  render() {
    return (
    <View style={{flex: 1}}>
    <Pdf source={{ uri: 'https://storage.googleapis.com/www.papyruspodcasts.com/Papyrus_Podcasts/pdf/Terms%20%26%20Comditions%20Final.pdf' }}
      style={{flex: 1}}
      onError={(error)=>{console.log(error);}} />
  </View>
//   <WebView source={{ uri: 'https://storage.googleapis.com/www.papyruspodcasts.com/Papyrus_Podcasts/pdf/Privacy%20Policy%20for%20Papyrus.pdf' }} />
    )
  }
}