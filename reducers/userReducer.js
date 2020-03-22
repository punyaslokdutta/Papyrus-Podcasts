


const INITIAL_STATE = {
    userItem: null,
    name: null,
    email: null,
    userName: null, 
    numFollowers: 0,
    numFollowing: 0,
    displayPictureURL: null,
    followingList:[],
    isPodcastLiked: {},
    isUserFollowing: {},
    introduction : null,
    numCreatedBookPodcasts : 0,
    numCreatedChapterPodcasts : 0,
    totalMinutesRecorded : 0,
    navigation:null,
    website:null
  };
  
  function userReducer(state = INITIAL_STATE, action)  {
    switch (action.type) {
        case "SET_USER_ITEM":
            return {...state,userItem:action.payload}
        case "ADD_NAVIGATION":
            return {...state,navigation:action.payload}
        case "CHANGE_EMAIL":
            return {...state,email:action.payload}
        case "CHANGE_NAME":
            return {...state, name:action.payload}
        case "CHANGE_WEBSITE":
            return {...state, website:action.payload}
        case "SET_PODCASTS_LIKED":
            let liker_list = action.payload;
            let length_liker_list = liker_list.length;
            for (i = 0; i < length_liker_list; i++) {
                state.isPodcastLiked[liker_list[i]] = true;
              }
            return state;
        case "ADD_TO_PODCASTS_LIKED":
            state.isPodcastLiked[action.payload] = true;
            return state;
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
        case "ADD_INTRODUCTION":
            return {...state,introduction: action.payload};    
        case "ADD_NUM_CREATED_BOOK_PODCASTS":
            return {...state,numCreatedBookPodcasts: action.payload};
        case "ADD_NUM_CREATED_CHAPTER_PODCASTS":
            return {...state,numCreatedChapterPodcasts: action.payload};
        case "ADD_TOTAL_MINUTES_RECORDED":
            return {...state,totalMinutesRecorded: action.payload};
        default:
            return state;
    }
  };
  
  
  export default userReducer;
  
  