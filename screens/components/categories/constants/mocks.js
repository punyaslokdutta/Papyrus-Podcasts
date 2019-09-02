const categories = [
  {
    id: 'plants',
    name: 'Art & History',
    tags: ['products', 'inspirations'],
    count: 147,
    image: require('../../../../assets/icons/plants.png')
  },
  {
    id: 'seeds',
    name: 'Comics',
    tags: ['products', 'shop'],
    count: 16,
    image: require('../../../../assets/icons/seeds.png')
  },
  {
    id: 'flowers',
    name: 'Biographies',
    tags: ['products', 'inspirations'],
    count: 68,
    image: require('../../../../assets/icons/flowers.png')
  },
  {
    id: 'sprayers',
    name: 'Classic Novels',
    tags: ['products', 'shop'],
    count: 17,
    image: require('../../../../assets/icons/sprayers.png')
  },
  {
    id: 'pots',
    name: 'Science & Technology ',
    tags: ['products', 'shop'],
    count: 47,
    image: require('../../../../assets/icons/pots.png')
  },
  {
    id: 'fertilizers',
    name: 'Literature',
    tags: ['products', 'shop'],
    count: 47,
    image: require('../../../../assets/icons/fertilizers.png')
  },
];



const profile = {
  username: 'react-ui-kit',
  location: 'Europe',
  email: 'contact@react-ui-kit.com',
  avatar: require('../../../../assets/images/avatar.png'),
  budget: 1000,
  monthly_cap: 5000,
  notifications: true,
  newsletter: false,
};

export {
  categories,
  profile,
}