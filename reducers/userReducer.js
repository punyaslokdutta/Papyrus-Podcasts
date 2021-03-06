const INITIAL_STATE = {
    userID: null,
    name: null,
    email: null,
    signupEmail: null,
    userName: null, 
    numFollowers: 0,
    numFollowing: 0,
    displayPictureURL: null,
    followingList:[], // no limit
    isPodcastLiked: {},
    isFlipLiked: {},
    isPodcastBookmarked : {},
    isBookBookmarked: {},
    isChapterBookmarked: {},
    isUserFollowing: {},
    introduction : null,
    numCreatedBookPodcasts : 0,
    numCreatedChapterPodcasts : 0,
    numCreatedOriginalPodcasts : 0,
    totalMinutesRecorded : 0,
    navigation:null,
    website:null,
    algoliaQuery:"Papyrus",
    numNotifications: 0,
    bookAdded: null,
    isExplorePreviousScreen: false,
    userPreferences: [], // max 10 size
    otherPrivateUserItem: null,
    userLanguages: [], // max 5 size
    algoliaAPPID: null,
    algoliaAPIKey: null,
    externalPodcastID: null,
    externalFlipID: null,
    navBarHeight:0,
    bookmarksCountArray:[],
    likesCountArray: [],
    lastPlayingPodcastID: null,
    lastPlayingCurrentTime: null,
    isAdmin: false,
    uploadPodcastSuccess: false,
    isMusicEnabled: false,
    handleOpenUrlFuncRef: null,
    musicEnabledNotificationSeen: false,
    musicPreferences: {},
    musicPreferencesArray : [], // max value = number of musicCategories we provide
    buildVersion : "",
    showMusicPlayerTooltip : false,
    addFlipWalkthroughDone : false,
    flipPreviewWalkthroughDone : false,
    audioFlipWalkthroughDone : false,
    addBookReviewScreenWalkthroughDone : false,
    recordBookWalkthroughDone : false,
    bookPodcastWalkthroughDone : false,
    originalPodcastWalkthroughDone : false,
    continueListeningPodcasts : [] // max 10 items
  };
  
  function userReducer(state = INITIAL_STATE, action)  {
    switch (action.type) {
        case "SET_CONTINUE_LISTENING_PODCASTS":
            return {...state,continueListeningPodcasts:action.payload} 
        case "SET_USER_ID":
            return {...state,userID: action.payload}
        case "SET_ADD_BOOK_REVIEW_WALKTHROUGH":
            return {...state,addBookReviewScreenWalkthroughDone:action.payload}
        case "SET_RECORD_BOOK_WALKTHROUGH":
            return {...state,recordBookWalkthroughDone:action.payload}
        case "SET_BOOK_PODCAST_WALKTHROUGH":
            return {...state,bookPodcastWalkthroughDone:action.payload}
        case "SET_ORIGINAL_PODCAST_WALKTHROUGH":
            return {...state,originalPodcastWalkthroughDone:action.payload}       
        case "SET_ADD_FLIP_WALKTHROUGH":
            return {...state,addFlipWalkthroughDone:action.payload}
        case "SET_FLIP_PREVIEW_WALKTHROUGH":
            return {...state,flipPreviewWalkthroughDone:action.payload}
        case "SET_AUDIO_FLIP_WALKTHROUGH":
            return {...state,audioFlipWalkthroughDone:action.payload}
        case "SHOW_MUSIC_PLAYER_TOOLTIP":
            return {...state,showMusicPlayerTooltip : action.payload}
        case "SET_BUILD_VERSION":
            return {...state,buildVersion : action.payload}
        case "SET_MUSIC_PREFERENCES_MAP":
            var tempMusicPreferencesMap = {}
            for(var i=0;i<state.musicPreferencesArray.length;i++)
                tempMusicPreferencesMap[state.musicPreferencesArray[i]] = true;
            return {...state,musicPreferences:tempMusicPreferencesMap}
        case "SET_MUSIC_PREFERENCES_ARRAY":
            return {...state,musicPreferencesArray:action.payload}
        case "ADD_MUSIC_PREFERENCE":
            var localMapPreferences = state.musicPreferences;
            localMapPreferences[action.payload] = true;
            return {...state,musicPreferences:localMapPreferences}
        case "REMOVE_MUSIC_PREFERENCE":
            var localMapPreferencesRemove = state.musicPreferences;
            localMapPreferencesRemove[action.payload] = false;
            return {...state,musicPreferences:localMapPreferencesRemove}
        case "SET_HANDLE_URL_FUNC_REF":
            return {...state,handleOpenUrlFuncRef:action.payload}
        case "SET_MUSIC_ENABLE_NOTIFICATION":
            return {...state,musicEnabledNotificationSeen:action.payload}
        case "SET_IS_MUSIC_ENABLED":
            return {...state,isMusicEnabled:action.payload}
        case "SET_PODCAST_UPLOAD_SUCCESS":
            console.log("uploadPodcastSuccess : ",action.payload);
            return {...state,uploadPodcastSuccess:action.payload}
        case "SET_ADMIN_USER":
            console.log("isAdmin : ",action.payload);
            return {...state,isAdmin:action.payload}
        case "SET_LAST_PLAYING_CURRENT_TIME":
            console.log("lastPlayingCurrentTime : ",action.payload);
            return {...state,lastPlayingCurrentTime:action.payload}
        case "SET_LAST_PLAYING_PODCASTID":
            console.log("lastPlayingPodcastID : ",action.payload);
            return {...state,lastPlayingPodcastID:action.payload}
        case "SET_LIKES_COUNT_ARRAY":
            console.log("[REDUX] likesCountArray: ",action.payload);
            return {...state,likesCountArray:action.payload}
        case "CLEAR_LIKES_COUNT_ARRAY":
            return {...state,likesCountArray:[]}
        case "SET_BOOKMARKS_COUNT_ARRAY":
            console.log("[REDUX] bookmarksCountArray: ",action.payload);
            return {...state,bookmarksCountArray:action.payload}
        case "CLEAR_BOOKMARKS_COUNT_ARRAY":
            return {...state,bookmarksCountArray:[]}
        case "SET_NAV_BAR_HEIGHT":
            console.log("state.navBarHeight: ",action.payload);
            return {...state,navBarHeight:action.payload}
        case "PODCAST_ID_FROM_EXTERNAL_LINK":
            console.log("REDUX EXTERNAL_PODCAST_ID: ",action.payload);
            return {...state,externalPodcastID:action.payload}
        case "FLIP_ID_FROM_EXTERNAL_LINK":
            console.log("REDUX EXTERNAL_FLIP_ID: ",action.payload);
            return {...state,externalFlipID:action.payload}
        case "SET_ALGOLIA_API_KEY":
            return {...state,algoliaAPIKey:action.payload}
        case "SET_ALGOLIA_APP_ID":
            return {...state,algoliaAPPID:action.payload}
        case "SET_USER_LANUAGES":
            return {...state,userLanguages:action.payload}
        case "SET_OTHER_PRIVATE_USER_ITEM":
            return {...state,otherPrivateUserItem:action.payload}
        case "ADD_NAVIGATION":
            return {...state,navigation:action.payload}
        case "SET_USER_PREFERENCES":
            return {...state,userPreferences:action.payload}
        case "ADD_NUM_NOTIFICATIONS":
            return {...state,numNotifications:action.payload}
        case "CHANGE_EMAIL":
            return {...state,email:action.payload}
        case "SET_SIGNUP_MAIL":
            return {...state,signupEmail:action.payload}
        case "SET_ALGOLIA_QUERY":
            return {...state,algoliaQuery:action.payload}
        case "ADD_BOOK":
            return {...state,bookAdded:action.payload}
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
        case "SET_FLIPS_LIKED":
            let flip_liker_list = action.payload;
            let length_flip_liker_list = flip_liker_list.length;
            for (i = 0; i < length_flip_liker_list; i++) {
                state.isFlipLiked[flip_liker_list[i]] = true;
                }
            return state;
        case "SET_PODCASTS_BOOKMARKED":
            let bookmark_list_podcasts = action.payload;
            let length_bookmark_list_podcasts = bookmark_list_podcasts.length;
            for (i = 0; i < length_bookmark_list_podcasts; i++) {
                state.isPodcastBookmarked[bookmark_list_podcasts[i]] = true;
                }
            return state;
        case "SET_BOOKS_BOOKMARKED":
            let bookmark_list_books = action.payload;
            let length_bookmark_list_books = bookmark_list_books.length;
            for (i = 0; i < length_bookmark_list_books; i++) {
                state.isBookBookmarked[bookmark_list_books[i]] = true;
                }
            return state;
        case "SET_CHAPTERS_BOOKMARKED":
            let bookmark_list_chapters = action.payload;
            let length_bookmark_list_chapters = bookmark_list_chapters.length;
            for (i = 0; i < length_bookmark_list_chapters; i++) {
                state.isChapterBookmarked[bookmark_list_chapters[i]] = true;
                }
            return state;
        case "ADD_TO_PODCASTS_LIKED":
            state.isPodcastLiked[action.payload] = true;
            return state;
        case "REMOVE_FROM_PODCASTS_LIKED":
            state.isPodcastLiked[action.payload] = false;
            return state;
        case "ADD_TO_FLIPS_LIKED":
            state.isFlipLiked[action.payload] = true;
            return state;
        case "REMOVE_FROM_FLIPS_LIKED":
            state.isFlipLiked[action.payload] = false;
            return state;
        case "ADD_TO_PODCASTS_BOOKMARKED":
            state.isPodcastBookmarked[action.payload] = true;
            return state;
        case "ADD_TO_BOOKS_BOOKMARKED":
            state.isBookBookmarked[action.payload] = true;
            return state;
        case "ADD_TO_CHAPTERS_BOOKMARKED":
            state.isChapterBookmarked[action.payload] = true;
            return state;
        case "REMOVE_FROM_PODCASTS_BOOKMARKED":
            state.isPodcastBookmarked[action.payload] = false;
            return state; 
        case "REMOVE_FROM_BOOKS_BOOKMARKED":
            state.isBookBookmarked[action.payload] = false;
            return state;
        case "REMOVE_FROM_CHAPTERS_BOOKMARKED":
            state.isChapterBookmarked[action.payload] = false;
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
        case "CLEAR_FOLLOWING_MAP":
            state.isUserFollowing = {};
            state.numFollowing = 0;
            return state;
        case "ADD_TO_FOLLOWING_MAP":
            state.isUserFollowing[action.payload] = true;
            state.numFollowing = state.numFollowing + 1;
            return state;
        case "REMOVE_FROM_FOLLOWING_MAP":
            state.isUserFollowing[action.payload] = false;
            state.numFollowing = state.numFollowing - 1;
            return state;
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
        case "ADD_NUM_CREATED_ORIGINAL_PODCASTS":
            return {...state,numCreatedOriginalPodcasts: action.payload};
        case "INCREMENT_NUM_CREATED_BOOK_PODCASTS":
            return {...state,numCreatedBookPodcasts: state.numCreatedBookPodcasts + 1};
        case "INCREMENT_NUM_CREATED_CHAPTER_PODCASTS":
            return {...state,numCreatedChapterPodcasts: state.numCreatedChapterPodcasts + 1};
        case "INCREMENT_NUM_CREATED_ORIGINAL_PODCASTS":
            return {...state,numCreatedOriginalPodcasts: state.numCreatedOriginalPodcasts + 1};
        case "DECREMENT_NUM_CREATED_BOOK_PODCASTS":
            return {...state,numCreatedBookPodcasts: state.numCreatedBookPodcasts - 1};
        case "DECREMENT_NUM_CREATED_CHAPTER_PODCASTS":
            return {...state,numCreatedChapterPodcasts: state.numCreatedChapterPodcasts - 1};
        case "DECREMENT_NUM_CREATED_ORIGINAL_PODCASTS":
            return {...state,numCreatedOriginalPodcasts: state.numCreatedOriginalPodcasts - 1};
        case "UPDATE_TOTAL_MINUTES_RECORDED":
            return {...state,totalMinutesRecorded: action.payload};
        case "CLEAR_FOLLOWING_MAP":
            return {...state,isUserFollowing:{}}
        case "CLEAR_PODCASTS_LIKED":
            return {...state,isPodcastLiked:{}}
        case "CLEAR_FLIPS_LIKED":
            return {...state,isFlipLiked:{}}
        case "CLEAR_PODCASTS_BOOKMARKED":
            return {...state,isPodcastBookmarked:{}}
        case "CLEAR_BOOKS_BOOKMARKED":
            return {...state,isBookBookmarked:{}}
        case "CLEAR_CHAPTERS_BOOKMARKED":
            return {...state,isChapterBookmarked:{}}
        default:
            return state;
    }
  };
  
  
  export default userReducer;
  
  