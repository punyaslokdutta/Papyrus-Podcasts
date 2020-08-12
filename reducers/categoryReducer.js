const INITIAL_STATE = {
    allCategoryNames : []
  };
  
  function categoryReducer(state = INITIAL_STATE, action)  {
    switch (action.type) {
      case "SET_CATEGORY_NAMES":
          return {...state,allCategoryNames:action.payload}
      default:
          return state;
    }
  };
  
  
  export default categoryReducer;
  
  