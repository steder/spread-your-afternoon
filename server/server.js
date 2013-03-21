// On server startup, maybe create some data if the db is empty:


/*
 publish topics:

 Here we can define any rules we want for what data
 is visible to our users.
*/
Meteor.publish("topics", function () {
    if (this.userId === null) {
        return [];
    }
    return Topics.find();
});

Meteor.startup(function () {
});
