const INITIAL_STATE = {
    categoryMap : {},
    allCategoryNames : []
  };
  
  function categoryReducer(state = INITIAL_STATE, action)  {
    switch (action.type) {
      case "SET_CATEGORY_NAMES":
          return {...state,allCategoryNames:action.payload}
      case "SET_CATEGORIES_MAP_NAME_TO_ID":
          const categoriesDocumentData = action.payload;
          for(var i=0;i<categoriesDocumentData.length;i++)
          {
            state.categoryMap[categoriesDocumentData[i].categoryName] = categoriesDocumentData[i].categoryID;
          }
            

          console.log("[categoryReducer] state.categoryMap = ",state.categoryMap);
          return state;
      default:
          return state;
    }
  };
  
  
  export default categoryReducer;
  
  