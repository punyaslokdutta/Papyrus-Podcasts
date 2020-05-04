


const INITIAL_STATE = {
  podcast: null, 
  volume: 80, 
  rate: 1,
  currentTime:0.0,
  paused: true,
  isBuffering:true, 
  duration: 0.0, 
  resizeMode:'contain', 
  isMiniPlayer:false,
  numLikes: 0,
  loadingPodcast: false,
  videoRef: null
};

function rootReducer(state = INITIAL_STATE, action)  {
  switch (action.type) {
    case "SET_VIDEO_REF":
      console.log("SET_VIDEO_REF")
        return {...state, videoRef:action.payload}
      case "SET_LOADING_PODCAST":
        console.log("SET_LOADING_PODCAST")
          return {...state, loadingPodcast:action.payload}
      case "TOGGLE_MINI_PLAYER":
        console.log("TOGGLE_MINI_PLAYER")
          return {...state, isMiniPlayer:!state.isMiniPlayer}
      case "SET_PODCAST":
        console.log("SET_PODCAST"+" " +action.payload)
          return {...state, podcast:action.payload}
      case "SET_VOLUME":
          return {...state, volume:action.payload}
      case "SET_RATE":
        console.log("SET_RATE"+" " +action.payload)
          return {...state,rate:((action.payload)>2.0? 1.0 :(action.payload) )}
      case "SET_NUM_LIKES":
          return {...state, numLikes:action.payload}
      case "SET_CURRENT_TIME":
          console.log("SET_CURRENT_TIME_ACTION"+" " +action.payload)
          return {...state, currentTime:(action.payload)}
      case "SET_DURATION":
        console.log("SET_DURATION_ACTION"+ " " + action.payload)
        return {...state, duration:action.payload}
      case "BUFFERING_PODCAST":
        console.log("BUFFERING_PODCAST"+ " " + action.payload)
          return {...state, isBuffering:action.payload}
      case "SET_PAUSED":
          return {...state, paused:action.payload}
    case "TOGGLE_PLAY_PAUSED":
        console.log("SET_TOGGLE_PLAY_PAUSED_ACTION"+ " " + action.payload)
        return {...state, paused:!state.paused}
    case "RESET_TO_INITIAL":
        console.log("RESET_TO_INITIAL")
        return {...state, currentTime:0}
    
      
      default:
          return state;
  }
};


export default rootReducer;

