// subscriptions:
Meteor.subscribe("topics");
Meteor.subscribe("userData");

Template.controls.events({
    'click #add_topic': function(event) {
        $("#new_topic_form").show();
        $("#add_topic").hide();
    },
   'click #create_topic': function(event) {
        event.preventDefault(); // prevent the form from actually submitting
        var new_title = document.getElementById("new_title");
        var desc = document.getElementById("description");
        Topics.insert({title: new_title.value,
                       votes: 0,
                       voters: {},
                       description: desc.value,
                       owner: Meteor.userId()
                      });
        $("#new_topic_form").hide();
        $("#add_topic").show();
    },
    'click #cancel_create_topic': function(event) {
        $("#new_topic_form").hide();
        $("#add_topic").show();
    }
});

Template.topic.color_class = function() {
    if (this.votes >= 10) {
        return 'badge-info';
    } else if (this.votes >= 5) {
        return 'badge-success';
    } else if (this.votes > 0) {
        return '';
    } else if (this.votes <= -5 ) {
        return 'badge-important';
    } else if (this.votes < 0) {
        return 'badge-warning';
    } else {
        return 'badge-inverse';
    }
};

Template.topic.highlight_upvoted = function() {
    var userId = Meteor.userId();
    var voter_key = "voters."+userId;
    var search_key = {_id: this._id};
    search_key[voter_key] = {$exists: 1};
    var projection = {}
    projection[voter_key] = 1;
    var voters = this["voters"];
    var vote = undefined;
    if (voters !== undefined && voters !== null) {
        vote = this["voters"][userId];
    }

    // $inc: {votes: vote.votes[userId] * -1}
    if (vote === undefined) {
        return "";
    } else {
        if (vote > 0) {
            return "btn-success voted";
        } else {
            return "";
        }
    }
};

Template.topic.highlight_downvoted = function() {
    var userId = Meteor.userId();
    var voter_key = "voters."+userId;
    var search_key = {_id: this._id};
    search_key[voter_key] = {$exists: 1};
    var projection = {}
    projection[voter_key] = 1;
    var voters = this["voters"];
    var vote = undefined;
    if (voters !== undefined && voters !== null) {
        vote = this["voters"][userId];
    }

    // $inc: {votes: vote.votes[userId] * -1}
    if (vote === undefined) {
        return "";
    } else {
        if (vote > 0) {
            return "";
        } else {
            return "btn-danger voted";
        }
    }
};

Template.topic.is_owner = function() {
    if (this.owner == Meteor.userId() ||
        Meteor.user().admin == true) {
        return true;
    }
    return false;
};

Template.topic.is_admin = function() {
    if (Meteor.user().admin == true) {
        return true;
    }
    return false;
};

Template.topics.topics = function() {
    return Topics.find({}, {sort: {votes: -1}});
};

Template.topics.events({
    'click .up': function() {
        Meteor.call("unvote_topic", this);
        Meteor.call("upvote_topic", this);
    },
    'click .up.voted': function() {
        Meteor.call("unvote_topic", this);
    },
    'click .down': function() {
        Meteor.call("unvote_topic", this);
        Meteor.call("downvote_topic", this);
    },
    'click .down.voted': function() {
        Meteor.call("unvote_topic", this);
    },
    'click .delete': function() {
        Topics.remove(this._id);
    },
    'click .edit_topic': function() {
        $("#edit_topic_form_"+this._id).toggle();
        $("#accordion_"+this._id).collapse("show");
    },
    'click .save_topic': function() {
        event.preventDefault(); // prevent the form from actually submitting
        var edit_title = document.getElementById("edit_title_"+this._id);
        var desc = document.getElementById("edit_description_"+this._id);
        Topics.update({_id: this._id},
                      {$set: {title: edit_title.value,
                       description: desc.value,
                      }});
        $("#edit_topic_form_"+this._id).hide();
    },
    'click .cancel_edit_topic': function(event) {
        event.preventDefault();
        $("#edit_topic_form_"+this._id).hide();
        $("#accordion_"+this._id).collapse("hide");
    }
});
