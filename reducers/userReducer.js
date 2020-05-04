const INITIAL_STATE = {
    userItem: null,
    name: null,
    email: null,
    signupEmail: null,
    userName: null, 
    numFollowers: 0,
    numFollowing: 0,
    displayPictureURL: null,
    followingList:[],
    isPodcastLiked: {},
    isPodcastBookmarked : {},
    isUserFollowing: {},
    introduction : null,
    numCreatedBookPodcasts : 0,
    numCreatedChapterPodcasts : 0,
    totalMinutesRecorded : 0,
    navigation:null,
    website:null,
    algoliaQuery: "Papyrus",
    algoliaBookQuery: "",
    selectedOnlyBookItem: null,
    numNotifications: 0,
    bookAdded: null,
    isExplorePreviousScreen: false,
    userPreferences: [],
    fromSearchChapterScreen: false,
    otherPrivateUserItem: null,
    userLanguages: [],
    algoliaAPPID: null,
    algoliaAPIKey: null
  };
  
  function userReducer(state = INITIAL_STATE, action)  {
    switch (action.type) {
        case "SET_ALGOLIA_API_KEY":
            return {...state,algoliaAPIKey:action.payload}
        case "SET_ALGOLIA_APP_ID":
            return {...state,algoliaAPPID:action.payload}
        case "SET_USER_LANUAGES":
            return {...state,userLanguages:action.payload}
        case "SET_OTHER_PRIVATE_USER_ITEM":
            return {...state,otherPrivateUserItem:action.payload}
        case "SET_USER_ITEM":
            return {...state,userItem:action.payload}
        case "ADD_NAVIGATION":
            return {...state,navigation:action.payload}
        case "SET_USER_PREFERENCES":
            return {...state,userPreferences:action.payload}
        case "SET_FROM_SEARCH_CHAPTER_SCREEN":
            return {...state,fromSearchChapterScreen:action.payload}
        case "ADD_NUM_NOTIFICATIONS":
            return {...state,numNotifications:action.payload}
        case "CHANGE_EMAIL":
            return {...state,email:action.payload}
        case "SET_SIGNUP_MAIL":
            return {...state,signupEmail:action.payload}
        case "SET_ALGOLIA_QUERY":
            return {...state,algoliaQuery:action.payload}
        case "SET_ALGOLIA_BOOK_QUERY":
            return {...state,algoliaBookQuery:action.payload}
        case "ADD_BOOK":
            return {...state,bookAdded:action.payload}
        case "SELECT_ONLY_BOOK_ITEM":
            return {...state,selectedOnlyBookItem:action.payload}
        case "CHANGE_NAME":
            return {...state, name:action.payload}
        case "SET_EXPLORE_SCREEN_AS_PREVIOUS_SCREEN":
            return {...state, isExplorePreviousScreen:action.payload}
        case "CHANGE_WEBSITE":
            return {...state, website:action.payload}
        case "SET_PODCASTS_LIKED":
            let liker_list = action.payload;
            let length_liker_list = liker_list.length;
            for (i = 0; i < length_liker_list; i++) {
                state.isPodcastLiked[liker_list[i]] = true;
              }
            return state;
        case "SET_PODCASTS_BOOKMARKED":
            let bookmark_list = action.payload;
            let length_bookmark_list = bookmark_list.length;
            for (i = 0; i < length_bookmark_list; i++) {
                state.isPodcastBookmarked[bookmark_list[i]] = true;
                }
            return state;
        case "ADD_TO_PODCASTS_LIKED":
            state.isPodcastLiked[action.payload] = true;
            return state;
        case "ADD_TO_PODCASTS_BOOKMARKED":
            state.isPodcastBookmarked[action.payload] = true;
            return state;
        case "REMOVE_FROM_PODCASTS_BOOKMARKED":
            state.isPodcastBookmarked[action.payload] = false;
            return state;    
        case "CHANGE_USER_NAME":
            return {...state, userName:action.payload}
        case "CHANGE_DISPLAY_PICTURE":
            return {...state, displayPictureURL: action.payload}
        case "ADD_ALL_TO_FOLLOWING_MAP":
            let followingList = action.payload;
            let length_list = followingList.length;
            for (i = 0; i < length_list; i++) {
                state.isUserFollowing[followingList[i]] = true;
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
        case "UPDATE_TOTAL_MINUTES_RECORDED":
            return {...state,totalMinutesRecorded: action.payload};
        case "CLEAR_FOLLOWING_MAP":
            return {...state,isUserFollowing:{}}
        case "CLEAR_PODCASTS_LIKED":
            return {...state,isPodcastLiked:{}}
        default:
            return state;
    }
  };
  
  
  export default userReducer;
  
  