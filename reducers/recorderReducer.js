


const INITIAL_STATE = {
    bookName:null,
    chapterName:null,
    authors:null,
    languageSelected:null,
    bookID:null,
    chapterID:null,
    genres : [],
    editpodcast : false,
    isBookPodcast : true
  };
  
  function recorderReducer(state = INITIAL_STATE, action)  {
    switch (action.type) {
      case "SET_BOOK_PODCAST":
          return {...state,isBookPodcast:action.payload}
      case "CHANGE_BOOK_ID":
          console.log("CHANGE_BOOK_ID"+" " +action.payload)
            return {...state, bookID:action.payload}
      case "CHANGE_CHAPTER_ID":
        console.log("CHANGE_CHAPTER_ID"+" " +action.payload)
          return {...state, chapterID:action.payload}
      case "SET_EDIT_PODCAST":
        return {...state,editpodcast:action.payload}
      case "SET_BOOK_GENRES":
          return {...state,genres:action.payload}  
      case "CHANGE_BOOK":
        console.log("CHANGE_BOOK"+" " +action.payload)
          return {...state, bookName:action.payload}
      case "CHANGE_CHAPTER":
        console.log("CHANGE_CHAPTER"+" " +action.payload)
          return {...state, chapterName:action.payload}
      case "CHANGE_AUTHOR":
          console.log("CHANGE_AUTHOR"+" " +action.payload)
          return {...state, authors:action.payload}
      case "CHANGE_LANGUAGE":
        console.log("CHANGE_LANGUAGE"+" " +action.payload)
          return {...state,languageSelected:action.payload} 
          
      default:
          return state;
    }
  };
  
  
  export default recorderReducer;
  
  