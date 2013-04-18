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

Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'admin': 1}});
});

Meteor.publish("allUserData", function () {
    return Meteor.users.find({},
                             {fields: {"admin": 1,
                                      "trusted": 1,
                                      "emails": 1}}
                            );
});

Meteor.startup(function () {
});

Accounts.onCreateUser(function(options, user) {
    user.admin = false;
    user.trusted = false;
    // We still want the default hook's 'profile' behavior.
    if (options.profile)
        user.profile = options.profile;
    return user;
});
