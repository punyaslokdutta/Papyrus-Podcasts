


const INITIAL_STATE = {
  podcast: null
};

function rootReducer(state = INITIAL_STATE, action)  {
  switch (action.type) {
      case "SET_PODCAST":
          return {...state, podcast:action.payload}
      default:
          return state;
  }
};


export default rootReducer;

