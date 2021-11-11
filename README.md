# Papyrus-Podcasts
Ad-free interactive video podcasting platform. (Open sourced)

<a href="https://play.google.com/store/apps/details?id=com.papyrus_60&hl=en_US&gl=US"><img src="https://user-images.githubusercontent.com/13198518/141263871-11309952-0029-4d33-ac5e-14604afc63a6.png" alt="drawing" width="100"/></a>

<img src="https://user-images.githubusercontent.com/13198518/141271045-23322764-395f-496b-810b-b18a7e61ba2c.jpeg" alt="drawing" width="1200" height="300"/></a>



### MVP Features ###

1. Ad-free articles and podcasts to satisfy universal daily curiosity. Podcasts are
inherently a focus developing medium where listeners try to increase their
attention span and at the same time can enjoy stories while multitasking.
2. Micro-blogging of Books to create a platform where people can voice their book
notes, abstract thoughts, mindful quotes with shorter audio formats called audio
flips (140seconds Podcasts).
3. Social Collaboration project where editors, writers and narrators can collaborate to
produce quality content faster and monetize on the network.
4. Real-time Content sequence Editing with AI based feed recommendations for
pushing quality content for our listeners
5. Interactive Video Podcast based Social network for sharing insights from books, documentaries, research papers, video lectures, articles.


![Final Papyrus Architecture](https://user-images.githubusercontent.com/13198518/139237551-74bffc16-b384-4430-8610-c08664949f13.jpg)

 ### Primary Tech Stack ###
 
1. Javascript based framework React for our web solutions
2. React Native for Android
3. Redux State management
4. Firebase Serverless Architecture
5. Firebase Cloud Functions for Serverless Compute.
6. Algolia Indexing for user search functionalities.
7. Hosted NoSQL solution Cloud Firestore Database.
8. Firebase Authentication (Security Rules)
9. Pytorch, Keras for training generative audio model
10. Agora Sdk Integration for Group Live Calls.





### TIMELINE GENERATION ARCHITECTURE ###

![FeedTimeline](https://user-images.githubusercontent.com/13198518/141256102-388abab7-29b4-4562-ad15-8f232b6b20af.png)

What if we improve the performance with in memory cache?
1. Keep follow feed list for every active user in cache, when userX wants follow feed, fetch from cache rather than db, e.g. {userX: [py0, py1, py2 …]}, where py0 and py2 are posted by userY1, py1 is posted by userY2
2. When userY does a post, find all active followers of userY, append userY’s post to head of their follow feed in cache

Cache eviction: most inactive user’s follow feed will be removed if cache is full
Cache writing: after db writes, so that db is always the source of truth

What if userZ is a celebrity and has 10 million active followers? Does it mean a single post of userZ should be copied 10 million times in cache? No, let’s keep those super stars in a separate db table & cache.
1. Celebrities are stored in a separate table from user table
2. Celebrity profile feed stored in a separate cache table from follow feed cache table, e.g. {userZ: [pz0, pz1, pz2, …]}, where pz0, pz1, pz2 are all posts of userZ.
3. Celebrity post are first written into db, and then append to the head of celebrity feed in cache, same as what we do to posts by normal users.
When userX requests follow feed, find all celebrities that he/she follows, fetch those celebrity feeds from cache, merge into his/her existing follow feed.

![PostTimeline](https://user-images.githubusercontent.com/13198518/141256329-4ab72ffe-f0a5-42b5-b9b8-7764aa196cee.png)

1.create_post(user_id, image, text, timestamp) -> success/failure
assume every post has an image, and optional text
2. comment_post(user_id, post_id, comment, timestamp) -> success/failure
assume you can comment on a post, but not on another comment
3. like_post(user_id, post_id, timestamp) -> success/failure
assume you can like a post, but not a comment




### FURTHER SCALING ###

//MessageBrokerService
//Data Partitioning
//Round Robin Load Balancer
//Click Stream Analyis
//Google Analytics Dashboard
//Demo Link
//Data Model
//System Api Specifications
//Client and server side security measures 
//Capacity estimation 
//Payment integration (Stripe API)


