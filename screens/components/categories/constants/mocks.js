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
const products = [
  {
    id: 1,
    name: "Computability theory",
    description:
      "Many problems in mathematics have been shown to be undecidable after these initial examples were established. Not every set of natural numbers is computable. The halting problem, which is the set of (descriptions of) Turing machines that halt on input 0, is a well-known example of a noncomputable set. The existence of many noncomputable sets follows from the facts that there are only countably many Turing machines, and thus only countably many computable sets, but according to the Cantors theorem, there are uncountably many sets of natural numbers",
    tags: ["recursion theory", "subrecursive hierarchies", "Church–Turing thesis"],
    images: [
      require("../../../../assets/images/plants_1.png"),
      require("../../../../assets/images/plants_2.png"),
      require("../../../../assets/images/plants_3.png"),
      // showing only 3 images, show +6 for the rest
      require("../../../../assets/images/plants_1.png"),
      require("../../../../assets/images/plants_2.png"),
      require("../../../../assets/images/plants_3.png"),
      require("../../../../assets/images/plants_1.png"),
      require("../../../../assets/images/plants_2.png"),
      require("../../../../assets/images/plants_3.png")
    ]
  }
];




const profile = {
  account:"+917001841303",
  username: 'khaled_Housseini',
  location: 'Europe',
  email: 'kyhsseini@gmail.com',
  avatar: require('../../../../assets/khaled.jpeg'),
  budget: 1000,
  monthly_cap: 5000,
  notifications: true,
  newsletter: false,
  website :'www.papyruspodcasts.com', 
  Bio : "I read books about Mystery, Science Fiction, Biographies"
};

export {
  categories,
  profile,products
}