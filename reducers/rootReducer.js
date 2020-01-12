


const INITIAL_STATE = {
  podcast: null, 
  volume: 80, 
  rate: 1,
  currentTime:0.0,
  paused: true,
  isBuffering:null, 
  duration: 0.0, 
  resizeMode:'contain', 

};

function rootReducer(state = INITIAL_STATE, action)  {
  switch (action.type) {
      case "SET_PODCAST":
          return {...state, podcast:action.payload}
      case "SET_VOLUME":
          return {...state, volume:action.payload}
      case "SET_RATE":
          return {...state,rate: action.payload}
      case "SET_CURRENT_TIME":
          return {...state, currentTime:action.payload}
      case "SET_DURATION":
          return {...state, duration:action.payload}
      case "SET_BUFFERING":
          return {...state, isBuffering:action.payload}
      case "SET_PAUSED":
          return {...state, paused:!state.paused}
      
      default:
          return state;
  }
};


export default rootReducer;

