


const INITIAL_STATE = {
    BookName:null,
    ChapterName:null,
    AuthorName:null,
    LanguageSelected:null
  
  };
  
  function recorderReducer(state = INITIAL_STATE, action)  {
    switch (action.type) {
        case "CHANGE_BOOK":
          console.log("CHANGE_BOOK"+" " +action.payload)
            return {...state, BookName:action.payload}
        case "CHANGE_CHAPTER":
          console.log("CHANGE_CHAPTER"+" " +action.payload)
            return {...state, ChapterName:action.payload}
        case "CHANGE_AUTHOR":
            console.log("CHANGE_AUTHOR"+" " +action.payload)
            return {...state, AuthorName:action.payload}
        case "CHANGE_LANGUAGE":
          console.log("CHANGE_LANGUAGE"+" " +action.payload)
            return {...state,LanguageSelected:action.payload} 
        default:
            return state;
    }
  };
  
  
  export default recorderReducer;
  
  