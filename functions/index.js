const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const algoliasearch = require('algoliasearch');
const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const ALGOLIA_INDEX_NAME = 'rock-paper-sissors';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
console.log(ALGOLIA_ID)
const index = client.initIndex(ALGOLIA_INDEX_NAME);
//update index when new user created/deleted
exports.onUserCreated = functions.firestore.document('Users/{userId}').onCreate((snap, context) => {
    // Get the note document
    const note = snap.data();
  
    // Add an 'objectID' field which Algolia requires
    note.objectID = context.params.userId;
  
    // Write to the algolia index

    return index.saveObject(note);
  });

  exports.onUserDeleted = functions.firestore.document('Users/{userId}')
  .onDelete(snapshot => 
      index.deleteObject(snapshot.id)
  );

  // [END update_index_function]
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
