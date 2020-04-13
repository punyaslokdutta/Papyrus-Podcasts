


const INITIAL_STATE = {
    BookName:null,
    chapterName:null,
    authors:null,
    LanguageSelected:null,
    bookId:null,
    genres : []
  };
  
  function recorderReducer(state = INITIAL_STATE, action)  {
    switch (action.type) {
      case "CHANGE_BOOK_ID":
          console.log("CHANGE_BOOK_ID"+" " +action.payload)
            return {...state, bookId:action.payload}
      case "SET_BOOK_GENRES":
          return {...state,genres:action.payload}  
      case "CHANGE_BOOK":
        console.log("CHANGE_BOOK"+" " +action.payload)
          return {...state, BookName:action.payload}
      case "CHANGE_CHAPTER":
        console.log("CHANGE_CHAPTER"+" " +action.payload)
          return {...state, chapterName:action.payload}
      case "CHANGE_AUTHOR":
          console.log("CHANGE_AUTHOR"+" " +action.payload)
          return {...state, authors:action.payload}
      case "CHANGE_LANGUAGE":
        console.log("CHANGE_LANGUAGE"+" " +action.payload)
          return {...state,LanguageSelected:action.payload} 
      default:
          return state;
    }
  };
  
  
  export default recorderReducer;
  
  