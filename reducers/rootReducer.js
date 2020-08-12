import { act } from "react-test-renderer";



const INITIAL_STATE = {
  podcast: null, 
  volume: 80, 
  rate: 1,
  currentTime:0.0,
  paused: true,
  duration: 0.0, 
  isMiniPlayer:false,
  numLikes: 0,
  numRetweets: 0,
  loadingPodcast: false,
  screenChanged: 0,
  isPodcastPlaying : false
};

function rootReducer(state = INITIAL_STATE, action)  {
  switch (action.type) {
    case "CHANGE_SCREEN": // CHANGE_SCREEN is called so as to rerender components when we navigate to an already mounted screen.
      return {...state,screenChanged:state.screenChanged + 1}
    case "SET_LOADING_PODCAST":
      console.log("SET_LOADING_PODCAST")
        return {...state, loadingPodcast:action.payload}
    case "SET_MINI_PLAYER_FALSE":
      return {...state, isMiniPlayer: false}
    case "TOGGLE_MINI_PLAYER":
      console.log("TOGGLE_MINI_PLAYER")
        return {...state, isMiniPlayer:!state.isMiniPlayer}
    case "SET_PODCAST":
      console.log("SET_PODCAST"+" " +action.payload)
      if(action.payload !== null)
        state.isPodcastPlaying = true;
      else
        state.isPodcastPlaying = false;
      state.podcast = action.payload; 
      return state;
    case "SET_VOLUME":
        return {...state, volume:action.payload}
    case "SET_RATE":
      console.log("SET_RATE"+" " +action.payload)
        return {...state,rate:((action.payload)>2.0? 1.0 :(action.payload) )}
    case "SET_NUM_LIKES":
        return {...state, numLikes:action.payload}
    case "SET_NUM_RETWEETS":
      return {...state, numRetweets:action.payload}
    case "SET_CURRENT_TIME":
        console.log("SET_CURRENT_TIME_ACTION"+" " +action.payload)
        return {...state, currentTime:(action.payload)}
    case "SET_DURATION":
      console.log("SET_DURATION_ACTION"+ " " + action.payload)
      return {...state, duration:action.payload}
    case "SET_PAUSED":
        return {...state, paused:action.payload}
    case "TOGGLE_PLAY_PAUSED":
        console.log("SET_TOGGLE_PLAY_PAUSED_ACTION"+ " " + action.payload)
        return {...state, paused:!state.paused}
      default:
          return state;
  }
};


export default rootReducer;

