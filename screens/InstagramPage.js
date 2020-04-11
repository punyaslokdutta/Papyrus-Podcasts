import React, { Component } from "react";
import 'react-native-get-random-values';
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { WebView } from 'react-native-webview';
import Pdf from 'react-native-pdf';

export default class InstagramPage extends Component {
  render() {
    return (
      <WebView source={{ uri: 'https://www.instagram.com/papyrus_podcast/' }} />
    )
  }
}