const INITIAL_STATE = {
    music : null
  };
  
  function musicReducer(state = INITIAL_STATE, action)  {
    switch (action.type) {
      case "SET_MUSIC":
          return {...state, music:action.payload}
      default:
          return state;
    }
  };
  
  
  export default musicReducer;
  
  