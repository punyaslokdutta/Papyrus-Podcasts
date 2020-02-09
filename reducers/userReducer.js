


const INITIAL_STATE = {
    name: null,
    email: null,
    userName: null, 
    numFollowers: 0,
    numFollowing: 0,
    displayPictureURL: null,
    followingList:[],
    isUserFollowing: {},
    stats : null,
    personalListeningTime : 0,
    listenedBookPodcasts : 0,
    listenedChapterPodcasts: 0,
    introduction : null,
    createdBookPodcasts : 0,
    createdChapterPodcasts : 0,
    navigation:null
  };
  
  function userReducer(state = INITIAL_STATE, action)  {
    switch (action.type) {
        case "ADD_NAVIGATION":
            return {...state,navigation:action.payload}
        case "CHANGE_STATS":
            return {...state,stats:action.payload}
        case "CHANGE_EMAIL":
            return {...state,email:action.payload}
        case "CHANGE_NAME":
            return {...state, name:action.payload}
        case "CHANGE_USER_NAME":
            return {...state, userName:action.payload}
        case "CHANGE_DISPLAY_PICTURE":
            return {...state, displayPictureURL: action.payload}
        case "ADD_ALL_TO_FOLLOWING_MAP":
            let following_list = action.payload;
            let length_list = following_list.length;
            for (i = 0; i < length_list; i++) {
                state.isUserFollowing[following_list[i]] = true;
              }
              state.numFollowing = length_list;
            return state;
        case "ADD_TO_FOLLOWING_MAP":
            state.isUserFollowing[action.payload] = true;
            state.numFollowing = state.numFollowing + 1;
            return state;
        case "REMOVE_FROM_FOLLOWING_MAP":
            state.isUserFollowing[action.payload] = false;
            state.numFollowing = state.numFollowing - 1;
            return state;
        case "ADD_NAVIGATION":
            return {...state, navigation:action.payload}
        case "SET_IS_USER_FOLLOWING":
            state.isUserFollowing[action.payload] = false;
            return state;
        case "ADD_NUM_FOLLOWERS":
            return {...state,numFollowers: action.payload};
        case "ADD_PERSONAL_LISTENING_TIME":
            return {...state,personalListeningTime: action.payload};
        case "ADD_NUM_LISTENED_BOOK_PODCASTS":
            return {...state,listenedBookPodcasts: action.payload};
        case "ADD_NUM_LISTENED_CHAPTER_PODCASTS":
            return {...state,listenedChapterPodcasts: action.payload};
        case "ADD_INTRODUCTION":
            return {...state,introduction: action.payload};    
        case "ADD_NUM_CREATED_BOOK_PODCASTS":
            return {...state,createdBookPodcasts: action.payload};
        case "ADD_NUM_CREATED_CHAPTER_PODCASTS":
            return {...state,createdChapterPodcasts: action.payload};
        
        default:
            return state;
    }
  };
  
  
  export default userReducer;
  
  