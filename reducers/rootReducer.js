const INITIAL_STATE = {
  podcast: null,//{"audioFileLink": "https://firebasestorage.googleapis.com/v0/b/papyrus-fa45c.appspot.com/o/podcasts%2Faudio%2FnXPsUkiuQnb8SVze93oezAWMDCr2__2020-08-16T15%3A18%3A52%2B05%3A30.m4a?alt=media&token=f258be14-cb4a-45cb-8924-822252330d01", "createdOn": "2020-08-16T15:18:55+05:30", "duration": 3, "genres": ["Travel", "Artificial Intelligence", "Psychedelics"], "isExploreSection1": true, "isExploreSection2": true, "isOriginalPodcast": true, "language": "English", "lastAddedToExplore1": "2020-08-16T15:35:19+05:30", "lastAddedToExplore2": "2020-08-16T15:36:07+05:30", "lastEditedOn": "2020-08-16T16:01:20+05:30", "numUsersLiked": 1, "numUsersRetweeted": 1, "podcastDescription": "I have attached my resume for your reference as I am currently working on the website and I have no idea what I am doing here but I have attached my resume for your reference as I am currently working", "podcastID": "9wGJfKCbjFD7Cis27UIH", "podcastName": "The First Flight 2", "podcastPictures": ["https://firebasestorage.googleapis.com/v0/b/papyrus-fa45c.appspot.com/o/podcasts%2Fimages%2FnXPsUkiuQnb8SVze93oezAWMDCr2__2020-08-16T15%3A18%3A10%2B05%3A30.jpg?alt=media&token=8ad1a98f-ed28-4358-8db9-7774e90d5e6f"], "podcasterDisplayPicture": "https://firebasestorage.googleapis.com/v0/b/papyrus-fa45c.appspot.com/o/users%2FnXPsUkiuQnb8SVze93oezAWMDCr2_2020-08-04T00%3A46%3A16%2B05%3A30.jpg?alt=media&token=e1c59ebd-8690-46fe-b1af-8e2253e79cd0", "podcasterID": "nXPsUkiuQnb8SVze93oezAWMDCr2", "podcasterName": "Swayamsiddha Dutta 1", "tags": ["Tag1", "Tag"]}, 
  volume: 80, 
  rate: 1,
  currentTime:0.0,
  paused: true,
  duration: 0.0, 
  isMiniPlayer:false,
  numLikes: 0,
  numRetweets: 0,
  loadingPodcast: false,
  screenChanged: 0,
  isPodcastPlaying : false,
  lastPlayingPodcast : null
};

function rootReducer(state = INITIAL_STATE, action)  {
  switch (action.type) {
    case "SET_LAST_PLAYING_PODCAST_ITEM":
      return {...state,lastPlayingPodcast:action.payload}
    case "CHANGE_SCREEN": // CHANGE_SCREEN is called so as to rerender components when we navigate to an already mounted screen.
      return {...state,screenChanged:state.screenChanged + 1}
    case "SET_LOADING_PODCAST":
      console.log("SET_LOADING_PODCAST")
        return {...state, loadingPodcast:action.payload}
    case "SET_MINI_PLAYER_FALSE":
      return {...state, isMiniPlayer: false}
    case "TOGGLE_MINI_PLAYER":
      console.log("TOGGLE_MINI_PLAYER")
        return {...state, isMiniPlayer:!state.isMiniPlayer}
    case "SET_PODCAST":
      console.log("SET_PODCAST" + " " + action.payload)
      if(state.podcast !== null){
        state.lastPlayingPodcast = state.podcast
      }
      if(action.payload !== null)
        state.isPodcastPlaying = true;
      else
        state.isPodcastPlaying = false;
      //state.podcast = action.payload; 
      if(state.podcast!== null && action.payload!==null && state.podcast.podcastID == action.payload.podcastID)
        return state;
      return {...state,podcast:action.payload}
    case "SET_VOLUME":
        return {...state, volume:action.payload}
    case "SET_RATE":
      console.log("SET_RATE"+" " +action.payload)
        return {...state,rate:((action.payload)>2.0? 1.0 :(action.payload) )}
    case "SET_NUM_LIKES":
        return {...state, numLikes:action.payload}
    case "SET_NUM_RETWEETS":
      return {...state, numRetweets:action.payload}
    case "SET_CURRENT_TIME":
        console.log("SET_CURRENT_TIME_ACTION"+" " +action.payload)
        return {...state, currentTime:(action.payload)}
    case "SET_DURATION":
      console.log("SET_DURATION_ACTION"+ " " + action.payload)
      return {...state, duration:action.payload}
    case "SET_PAUSED":
        return {...state, paused:action.payload}
    case "TOGGLE_PLAY_PAUSED":
        console.log("SET_TOGGLE_PLAY_PAUSED_ACTION"+ " " + action.payload)
        return {...state, paused:!state.paused}
      default:
          return state;
  }
};


export default rootReducer;

