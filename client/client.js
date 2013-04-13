// subscriptions:
Meteor.subscribe("topics");

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

Template.topics.topics = function() {
    return Topics.find({}, {sort: {votes: -1}});
};

Template.topics.events({
    'click #add_topic': function() {
        $("#new_topic_form").show();
        $("#add_topic").hide();
    },
    'click #create_topic': function() {
        console.log("Creating topic...");
        var new_title = document.getElementById("new_title");
        var desc = document.getElementById("description");
        console.log("New Title:" + new_title.value);
        Topics.insert({title: new_title.value,
                       votes: 0,
                       description: desc.value,
                      });
        $("#new_topic_form").hide();
        $("#add_topic").show();
    },
    'click .up': function() {
        Topics.update(this._id, {$inc: {votes: 1}});
    },
    'click .down': function() {
        Topics.update(this._id, {$inc: {votes: -1}});
    }
});
