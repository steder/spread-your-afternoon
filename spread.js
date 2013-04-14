// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "topics".

Topics = new Meteor.Collection("topics");


Topics.allow({
    insert: function (userId, topic) {
        var user = Meteor.users.findOne({_id: userId});
        if (user !== null) {
            return user.organization == 'skinnycorp'
        }
        return false;
    },
    update: function (userId, topic, fields, modifier) {
        var allow = false;
        var user = Meteor.users.findOne({_id: userId});

        if (userId == topic.owner || user.admin == true) {
            allow = true;
        }

        if (_.contains(fields, "votes") || _.contains(fields, "voters")) {
            allow = false;
        }

        return allow;
    },
    remove: function (userId, topic) {
        return userId == topic.owner;
    },
    //fetch: ['owner']
});


Meteor.methods({
    upvote_topic: function(topic) {
        var userId = Meteor.userId();
        Topics.update( {_id: topic._id, voters: {$nin: [userId]}}, {$addToSet: {voters: userId}, $inc: {votes: 1}});
    },
    downvote_topic: function(topic) {
        var userId = Meteor.userId();
        Topics.update( {_id: topic._id, voters: {$in: [userId]}}, {$pull: {voters: userId}, $inc: {votes: -1}});
    },
})
