import React, { Component, useState,useEffect } from 'react'
import { Image, StyleSheet, ScrollView, TextInput,Alert, TouchableOpacity , View,ActivityIndicator, Linking,Dimensions,NativeModules} from 'react-native'
import Slider from 'react-native-slider';
import firestore from '@react-native-firebase/firestore'
//import { Divider, Button, Block, Text, Switch } from '../components';
import {  Block, Text } from '../screens/components/categories/components/';
import { Divider, Button, Switch } from '../screens/components/categories/components/';
import {withFirebaseHOC} from './config/Firebase'
import { theme, mocks } from '../screens/components/categories/constants/';
import Icon from 'react-native-vector-icons/FontAwesome'
import { firebase } from '@react-native-firebase/functions';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';

//import { WebView } from 'react-native-webview';
import sampleHtml from '../assets/Web/sample.html';
var {width, height}=Dimensions.get('window')


import {useSelector,useDispatch} from 'react-redux'
import Toast from 'react-native-simple-toast';
import { renderers } from 'react-native-popup-menu';

class WriteScreen extends Component {

    componentDidMount = () => {
        //this.myWebView.postMessage("Hello from RN");
    }

    onMessage(data) {
      //Prints out data that was passed.
      console.log(data);
    }
    
    render() {
      var css = `<head><style type="text/css"> @font-face {font-family: 'Baskerville Normal'; font-weight: normal;font-size:100px; src:url('file:///android_asset/baskvl.woff')}@font-face {font-family: 'Baskerville Bold';font-size:60px; src:url('file:///android_asset/BaskervilleBoldBT.woff')}</style></head>`;
      var HTML = css + `<div style="padding-left: 10px; padding-right: 10px; padding-top: 30 px;"><div style='padding-bottom:0,margin-bottom:0,line-height:110px;font-size:100px;font-family:Baskerville Normal'>The concept of Dharma</div><div style="font-family:Baskerville Bold;color:gray;font-size:70px;">Unknown possibilities of life </div><img style="display: block;margin-left: auto;margin-right: auto;width: 50%;" src="https://firebasestorage.googleapis.com/v0/b/papyrus-274618.appspot.com/o/articles%2Fimages%2F_1597475292765.jpg?alt=media&amp;token=989200b5-45dc-404b-b86c-8171e6548e62"><p style="line-height:1.5;font-size:50px;font-family:Baskerville Normal;">They thought I’d succumb to a life of mediocrity, and sooner or later, would give up my dream of becoming a writer.</p><p style="line-height:1.5;font-size:50px;font-family:Times;">Coming from a small town, that’s what a lot of people seemed to think. However, I refused to give up. It was like there was a little voice in my head saying that I needed to pursue my dream and prove everyone wrong.</p><p style="line-height:1.5;font-size:50px;font-family:Times;">So that’s what I did. Every day, I got home from high school and started writing for several hours on my laptop until it was time to sleep. And as a result, I realized my dream and created a full-time income doing something I genuinely love.</p><p style="line-height:1.5;font-size:50px;font-family:Times;">From personal experience, I’ve learned that you can accomplish almost anything if you’re willing to do whatever it takes. So if you want to achieve a lot more than you ever thought possible, here are several things you can do to create the life you desire.</p><b style="line-height:1.5;font-size:50px;font-family:Times;">Apply The 80/20 Rule To Your Life.</b><p style="line-height:1.5;font-size:50px;font-family:Times;">When you focus your time &amp; energy on everything that’s going well, you spend much less time on the things that aren’t. In other words, you need to stop doing things that get you nowhere and identify the activities that will make you incredibly successful. Darren Hardy said it best:</p><p style="line-height:1.5;font-size:50px;font-family:Times;">“The first step toward change is awareness. If you want to get from where you are to where you want to be, you have to start by becoming aware of the choices that lead you away from your desired destination.”</p><p style="line-height:1.5;font-size:50px;font-family:Times;">I’m a writer. That means I need to sit down and write each day if I want to get paid. Unfortunately, watching Netflix for eight hours a day won’t increase my income. But do you know what will? Finding more time in the day to write new articles.</p><p style="line-height:1.5;font-size:50px;font-family:Times;">Perhaps you don’t care about money or fame, and want to spend a lot more time with your family. If that’s the case, take a moment to consider what you can do to make the most of your time with loved ones and create amazing memories.</p><p align="center"><q style="font-size:70px;font-family:Times;color:gray"><b>Always strive forward.</b></q></p><br><p style="line-height:1.5;font-size:50px;font-family:Times;">For example, going on an exciting day trip together will be a lot more memorable in ten years than sitting at home for several hours and scrolling through social media.</p><p style="line-height:1.5;font-size:50px;font-family:Times;">You get the idea. Focus on what you can do each day to spend more time on the things that matter to you. And if you can do that every day, you’ll quickly discover that you’re able to live a much happier and fulfilling life than you ever thought possible.</p><b style="line-height:1.5;font-size:50px;font-family:Times;">Break Down Your Goals Into Smaller Habits.</b><p style="line-height:1.5;font-size:50px;font-family:Times;">I’ll admit that I’m a self-improvement junkie. But if there’s one strategy that’s changed my life forever, it’s this.</p><p style="line-height:1.5;font-size:50px;font-family:Times;">When you set a massive goal, it can often feel like you have to climb a mountain. After all, it’s an incredibly daunting task. So naturally, you procrastinate and never make any progress towards achieving it. Sound familiar?</p><p style="line-height:1.5;font-size:50px;font-family:Times;">I thought so. Instead, I’ve found that a much better way to achieve big goals is by breaking them down into small habits that are easy to accomplish. For example, if you want to become a professional writer, writing 1000 words each day is certainly a pretty easy way to create a massive portfolio of work.</p><p style="line-height:1.5;font-size:50px;font-family:Times;">Do one thing each day that gets you a little bit closer towards achieving your dream. Because when you put one foot in front of the other and make continual progress, the power of compound interest will create incredible results over time. Like Bill Phillips once said:</p><p style="line-height:1.5;font-size:50px;font-family:Times;">“The difference between who you are and who you want to be, is what you do.”</p><b style="line-height:1.5;font-size:50px;font-family:Times;">Remember To Stay Consistent.</b><p style="line-height:1.5;font-size:50px;font-family:Times;">Look, there are inevitably going to be days when you “don’t feel like it.” I’ve been there; I know exactly how you feel. But do you want to know the quality that separates people who achieve extraordinary levels of success from people that don’t? Consistency. Let me give you a few examples:</p><p style="line-height:1.5;font-size:50px;font-family:Times;">You’re not going to have amazing abs if you keep eating a giant slice of chocolate cake after every workout. You need to exercise daily, eat well, and sustain healthy habits over a long period of time.</p><div style="background-color:LightGray"><code style="line-height:1.5;font-size:50px;font-family:Times;">var x=10;                                                                                                                                                                     var y=20;</code></div><p></p><u style="line-height:1.5;font-size:50px;font-family:Times;">You’re not going to become a successful writer if you give up whenever a story doesn’t perform well. Instead, you need to accept that some articles will do better than others and maintain a consistent writing schedule.</u><img style="display: block;margin-top:20px;margin-bottom:20px; margin-left: auto;margin-right: auto;width: 100%;" src="https://firebasestorage.googleapis.com/v0/b/papyrus-274618.appspot.com/o/articles%2Fimages%2F_1597475500996.jpg?alt=media&amp;token=37c1db45-d2ad-4e38-a663-bcfbed4052a4"><p></p><i style="line-height:1.5;font-size:50px;font-family:Times;">You’re not going to get rid of social anxiety overnight. But if you can have a conversation with someone each day, it’ll only be a matter of time before any feelings of nervousness fade away.</i><p style="line-height:1.5;font-size:50px;font-family:Times;">If you think about it, all of this advice is pretty simple. Focus on the things that matter, break down your goals into smaller habits, and stay consistent until you achieve your vision of success.</p><p style="line-height:1.5;font-size:50px;font-family:Times;">And if you make an effort to do those things every day, you’ll discover that it’s only a matter of time before you can live the life you desire.</p><p></p><p></p></div>`
        return (
          null

          // Some points for using webview to show & edit articles:-
          // * VIEWING article inside webview
          // [1] query the html for article from article document
          // [2] use the html like this:-
          //     <WebView
          //      source={{ baseUrl: '', html: HTML }}/>
          // [3] Use a footer in the VIEW article screen using 'absolute' positioning & keep the 
          //     like,comment, repost & share option in there
          // [4] For fonts we have to keep them in android/app/src/main/assets as
          // file:///android_asset/ (used in css variable above) corresponds to android/app/src/main/assets
          
          // * EDITING article inside webview
          // [1] Host an unauthenticated page containing the RichTextEditor
          // [2] Use the URL for above ([1]) in webview like this:-
          //      <WebView source={{uri:"http://192.168.1.5:3000"}}
          //           ref="webview"
          //           onMessage={this.onMessage}/>
          // [3] onMessage call receives data sent from page hosted inside webview
          // [4] In webview use - window.ReactNativeWebView.postMessage(contentData1); inside onChange of Slate Editor 
          //     in order to send data from React to React Native
          // [5] Store the html recived in onMessage in a state variable.
          // [6] Keep publish button in React Native because the unauthenticated page will be there only for editor....No firebase shall be involved there.
          // [7] Keep the toolbar at the bottom on React side & also the hovering toolbar should come
          //     below the selected text & not above because it clashes with the default Selection toolbar in android phone.
           
          // <View style={{flex:1}}> 
            // <ScrollView contentContainerStyle={{flex:1}}>
            //   <View style={{height:20,width:width}}>
            //  <TouchableOpacity>
            //  <Text>bgjhjk</Text>
            //  </TouchableOpacity>
            //  </View>
            //  <View style={{flex:1}}>
            // <WebView
            // source={{ baseUrl: '', html: HTML }} 
            //   // originWhitelist={['*']}
            //   // style={{height:height,width:width,marginBottom:50}}
            //   // source={{ html: `<html><head><style>@font-face { font-family: Baskerville Normal; src: url('baskvl.woff') ; } h1 {font-family: "Baskerville Normal"}</style></head><body><h1 style={font-family:"Baskerville Normal"}>Hey, June bvshdw dhdhw dwbdwbdw bn</h1></body></html>` }} />
            //   />

                
              // <View style={{flex:1,position:'absolute',bottom:0,height:height/15,width:width,backgroundColor:'white',borderTopColor:'black',borderWidth:0.5}}> 
              //   <Text>FOOTER</Text>
              //   </View>
              // </View>
              
              //   </ScrollView>
                
              // </View> 
                

            // <WebView
            //   style={{flex: 1}}
            //   originWhitelist={['*']}
            //   source={{uri:'file:///android_asset/index.html'}}
            //   style={{ marginTop: 20 }}
            //   javaScriptEnabled={true}
            //   domStorageEnabled={true}
            // />

        );
    }
     
  }

export default withFirebaseHOC(WriteScreen);
