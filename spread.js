// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "topics".

Topics = new Meteor.Collection("topics");


Topics.allow({
    insert: function (userId, topic) {
        var user = Meteor.users.findOne({_id: userId});
        if (user !== null) {
            // return user.organization == 'skinnycorp'
            return true;
        }
        return false;
    },
    update: function (userId, topic, fields, modifier) {
        var allow = false;
        var user = Meteor.users.findOne({_id: userId});

        if (userId == topic.owner || user.admin == true) {
            allow = true;
        }

        /*
          Disallowing voting updates, these should go through the Meteor methods:
          - upvote_topic
          - unvote_topic
          - downvote_topic
        */
        if (_.contains(fields, "votes") || _.contains(fields, "voters")) {
            allow = false;
        }

        return allow;
    },
    remove: function (userId, topic) {
        var user = Meteor.users.findOne({_id: userId});
        return (userId == topic.owner || user.admin == true);
    },
    //fetch: ['owner']
});


Meteor.users.allow({
    insert: function (userId, user) {
        return false;
    },
    update: function (userId, user, fields, modifier) {
        var user = Meteor.users.findOne({_id: userId});
        var allow = (userId == user._id || user.admin == true);
        return allow;
    },
    remove: function (userId, user) {
        return false;
    }
});


/* TODO: add permission checks here */
Meteor.methods({
    is_admin: function(topic) {
        var user = Meteor.user();
        return (user.admin == true);
    },
    upvote_topic: function(topic) {
        var userId = Meteor.userId();
        var voter_key = "voters."+userId;
        var search_key = {_id: topic._id}
        search_key[voter_key] = {$exists: 0}
        var set_value = {}
        set_value[voter_key] = 1
        Topics.update(search_key, {$set: set_value, $inc: {votes: 1}})
    },
    unvote_topic: function(topic) {
        var userId = Meteor.userId();
        var voter_key = "voters."+userId;
        var search_key = {_id: topic._id}
        search_key[voter_key] = {$exists: 1}

        var unset_value = {}
        unset_value[voter_key] = 1
        var vote = 0;
        if (_.has(topic, "voters")) {
            vote = topic["voters"][userId];
        }
        vote = vote * -1;
        Topics.update(search_key, {$inc: {"votes": vote}, $unset: unset_value})
    },
    downvote_topic: function(topic) {
        var userId = Meteor.userId();
        var voter_key = "voters."+userId;

        var search_key = {_id: topic._id}
        search_key[voter_key] = {$exists: 0}
        var set_value = {}
        var vote = -1;
        set_value[voter_key] = vote;
        Topics.update(search_key, {$set: set_value, $inc: {votes: vote}})
    },
})
