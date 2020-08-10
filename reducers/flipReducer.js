const INITIAL_STATE = {
    paused : true,
    currentFlipID : null,
    isFlipPlaying : false,
    audioRecorderPlayerRef : null,
    flipUploadSuccess : false
  };
  
  function flipReducer(state = INITIAL_STATE, action)  {
    switch (action.type) {
      case "SET_FLIP_PAUSED":
          return {...state, paused:action.payload}
      case "TOGGLE_FLIP_PLAY_PAUSED":
          console.log("TOGGLE_FLIP_PLAY_PAUSED"+ " " + action.payload)
          return {...state, paused:!state.paused} 
      case "SET_FLIP_UPLOAD_SUCCESS":
          return {...state, flipUploadSuccess:action.payload}
      case "SET_FLIP_ID":
          return {...state, currentFlipID:action.payload} 
      case "SET_FLIP_PLAYING":
          return {...state, isFlipPlaying: action.payload} 
      case "SET_AUDIO_RECORDER_PLAYER_REF":
          return {...state, audioRecorderPlayerRef: action.payload}
      default:
          return state;
    }
  };
  
  
  export default flipReducer;
  
  