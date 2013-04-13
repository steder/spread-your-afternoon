// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "topics".

Topics = new Meteor.Collection("topics");


Topics.allow({
    insert: function (userId, topic) {
        return true;
    },
    update: function (userId, topic, fields, modifier) {
        return true;
    },
    remove: function (userId, topic) {
        return true;
    },
    //fetch: ['owner']
});


if (Meteor.isClient) {
}


if (Meteor.isServer) {
}
