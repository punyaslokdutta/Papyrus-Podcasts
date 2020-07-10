import TrackPlayer, { usePlaybackState,useTrackPlayerProgress } from 'react-native-track-player';
import {useSelector, useDispatch} from "react-redux"

module.exports = async function() {

    TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());

    TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());

    //TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy());

    TrackPlayer.addEventListener('remote-duck', async data => {
        console.log("remote-duck triggered: ",data);

        if(data.paused) {
            TrackPlayer.pause();
            //wasPlaying = true;
        } else if(data.ducking) {
            TrackPlayer.setVolume(0.5);
        } else {
            const state = await TrackPlayer.getState();
            if(state == TrackPlayer.STATE_PLAYING)
                TrackPlayer.play();
            else
                TrackPlayer.pause();
            TrackPlayer.setVolume(1);
        }
        let { paused: shouldPause, permanent: permanentLoss = false } = data;
        
        //TrackPlayer.pause();
        //dispatch({type:"TOGGLE_PLAY_PAUSED"});
    })
    // ...
    
};