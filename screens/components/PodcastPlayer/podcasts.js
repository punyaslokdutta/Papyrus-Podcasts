// @flow
/* eslint-disable global-require */

/*export type Podcast = {
  id: string,
  thumbnail: ImageSourcePropType,
  video: ImageSourcePropType,
  title: string,
  username: string,
  avatar: ImageSourcePropType,
  views: number,
  published: Moment,
};
*/


//import Moment from 'react-moment';
//import ImageSourcePropType  from 'react-native/Libraries/Image/ImageSourcePropType';

const podcasts= [
    {
        id: '1',
        thumbnail: require('../../../assets/images/illustration_2.png'),
        podcast: require('../../../assets/images/illustration_2.png'),
        title: 'Permissions in React Native for absolute beginners',
        username: 'Punyaslok Dutta',
        preview: 'https://images.unsplash.com/photo-1458906931852-47d88574a008?auto=format&fit=crop&w=800&q=80',
        saved: false,
        date: "12/7/2019",
        location: 'Loutraki, Greece',
        //avatar: require('../assets/avatars/1.png'),
        //listens: 273,
        //published: moment().subtract(31, 'days'),
      },
  {
    id: '2',
    thumbnail: require('../../../assets/images/illustration_2.png'),
    podcast: require('../../../assets/images/illustration_2.png'),
    title: 'Permissions in React Native for absolute beginners',
    username: 'Punyaslok Dutta',
    preview: 'https://images.unsplash.com/photo-1458906931852-47d88574a008?auto=format&fit=crop&w=800&q=80',
    saved: false,
    date: "12/7/2019",
    location: 'Loutraki, Greece',
    //avatar: require('../assets/avatars/1.png'),
    //listens: 273,
    //published: moment().subtract(31, 'days'),
  },
  {
    id: '3',
    thumbnail: require('../../../assets/images/illustration_2.png'),
    podcast: require('../../../assets/images/illustration_2.png'),
    title: 'Permissions in React Native for absolute beginners',
    username: 'Punyaslok Dutta',
    preview: 'https://images.unsplash.com/photo-1458906931852-47d88574a008?auto=format&fit=crop&w=800&q=80',
    saved: true,
    date: "12/7/2019",
    location: 'Loutraki, Greece',
    //avatar: require('../assets/avatars/1.png'),
    //listens: 273,
    //published: moment().subtract(31, 'days'),
  },
  {
    id: '4',
    thumbnail: require('../../../assets/images/illustration_2.png'),
    podcast: require('../../../assets/images/illustration_2.png'),
    title: 'Permissions in React Native for absolute beginners',
    username: 'Punyaslok Dutta',
    preview: 'https://images.unsplash.com/photo-1458906931852-47d88574a008?auto=format&fit=crop&w=800&q=80',
    saved: true,
    date: "12/7/2019",
    location: 'Loutraki, Greece',
    //avatar: require('../assets/avatars/1.png'),
    //listens: 273,
    //published: moment().subtract(31, 'days'),
  },
];

export default podcasts;
