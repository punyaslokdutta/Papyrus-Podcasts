const INITIAL_STATE = {
    music : null,
    musicPaused : true,
    allMusic : [],
    currentMusicIndex : 0,
  };
  
  function musicReducer(state = INITIAL_STATE, action)  {
    switch (action.type) {
      case "SET_MUSIC":
          return {...state, music:action.payload}
      case "SET_MUSIC_PAUSED":
          return {...state, musicPaused:action.payload}
      case "SET_ALL_MUSIC":
          return {...state,allMusic:action.payload}
      case "SET_CURRENT_MUSIC_INDEX":
          return {...state,currentMusicIndex:action.payload}
      default:
          return state;
    }
  };
  
  
  export default musicReducer;
  
  