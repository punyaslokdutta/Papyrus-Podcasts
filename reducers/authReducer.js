


const INITIAL_STATE = {
    fullName:null,
  };
  
  function authReducer(state = INITIAL_STATE, action)  {
    switch (action.type) {
        case "SET_FULL_NAME":
          console.log("SET_FULL_NAME"+" " +action.payload)
            return {...state, fullName:action.payload}
        default:
            return state;
    }
  };
  
  
  export default authReducer;
  
  