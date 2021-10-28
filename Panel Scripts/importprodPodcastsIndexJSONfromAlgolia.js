const algoliasearch = require('algoliasearch');

const client = algoliasearch('J5BIEVR9OI', '6a6f9473bd2d2dbfe45e2983d8164f56');
const index = client.initIndex('prod_podcasts');

const fs = require('fs');

let hits = [];

index.browseObjects({
  batch: objects => (hits = hits.concat(objects))
}).then(() => {
  console.log('Finished!');
  console.log('We got %d hits', hits.length);
  fs.writeFile('algoliaProdPodcasts.json', JSON.stringify(hits, null, 2), 'utf-8', err => {
    if (err) throw err;
    console.log('Your index - prod_podcasts - has been exported!');
  });
});