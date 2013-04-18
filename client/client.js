// subscriptions:
Meteor.subscribe("topics");
Meteor.subscribe("userData");
Meteor.subscribe("allUserData");

/* Global Helpers */
Handlebars.registerHelper("is_owner", function() {
    if (this.owner == Meteor.userId()) {
        return true;
    } else if (Meteor.user() !== null && Meteor.user() !== undefined) {
        return Meteor.user().admin;
    } else {
        return false;
    }
});

Handlebars.registerHelper("is_admin", function() {
    if (Meteor.user() !== null && Meteor.user() !== undefined) {
        return Meteor.user().admin;
    }
    return false;
});

/* Templates */

Template.page_controller.display_page = function () {
    var path = window.location.href.split("/");
    var page_index = path[path.length - 1];
    if (page_index != "") {
        console.log("page_index:" + String(page_index));
        return Template[page_index]();
    }
    return Template["/"]();
};

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

Template.userslist.users = function() {
    console.log("looking up users...")
    var re = new RegExp(Session.get('searchQuery'), 'i');
    return Meteor.users.find({emails: {$elemMatch: {address: re}}});
};

Template.userslist.events = {
    "click #show_userlist": function() {
        $("#show_userlist").hide();
        $("#hide_userlist").show();
        $("#userlist").show();
    },
    "click #hide_userlist": function() {
        $("#show_userlist").show();
        $("#hide_userlist").hide();
        $("#userlist").hide();
    },
    "click .trusted": function () {
        var trusted = ! this.trusted;
        Meteor.users.update({_id:this._id}, {$set:{"trusted":trusted}});
    },
    "click #search-button": function (e) {
        event.preventDefault(); // prevent the form from actually submitting
        console.log("setting session value: " + e.target.value);
        Session.set('searchQuery', e.target.value);
    },
}

Template.user.admin = function() {
    var ret = this.admin == true;
    return ret;
};

Template.user.trusted = function() {
    var ret = this.trusted || false;
    return ret
};

Template.user.email = function() {
    return this.emails[0]["address"];
};

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
