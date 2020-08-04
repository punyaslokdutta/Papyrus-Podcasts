import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import {useSelector, useDispatch} from "react-redux"
import store from './store';

module.exports = async function() {

    TrackPlayer.addEventListener('remote-play', () => {
        store.dispatch({type:"SET_FLIP_PAUSED",payload:false})
        console.log("In remote-play")
        TrackPlayer.play()
    });

    TrackPlayer.addEventListener('remote-pause', () => {
        store.dispatch({type:"SET_FLIP_PAUSED",payload:true})
        TrackPlayer.pause()
    });

    TrackPlayer.addEventListener('remote-stop', () => {
        store.dispatch({type:"SET_FLIP_ID",payload:null});
        store.dispatch({type:"SET_FLIP_PAUSED",payload:true});
        store.dispatch({type:"SET_PODCAST",payload:null});
        TrackPlayer.destroy()
      });
    //TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy());

    TrackPlayer.addEventListener('remote-duck', async data => {
        console.log("remote-duck triggered: ",data);

        if(data.paused && data.permanent) {
            store.dispatch({type:"SET_FLIP_PAUSED",payload:true})
            TrackPlayer.pause();
            //wasPlaying = true;
        } else if(data.paused && !data.permanent) {
            TrackPlayer.setVolume(0.5);
        } else {
            const state = await TrackPlayer.getState();
             if(state == TrackPlayer.STATE_PLAYING){
                TrackPlayer.play();
                store.dispatch({type:"SET_FLIP_PAUSED",payload:false})
             }

            // else
            //     TrackPlayer.pause();
            TrackPlayer.setVolume(1);
        }
        let { paused: shouldPause, permanent: permanentLoss = false } = data;
        
        //TrackPlayer.pause();
        //dispatch({type:"TOGGLE_PLAY_PAUSED"});
    })
};