
/*
 * GET home page.
 */

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('afternoondb', server, {safe:true});

var populateDB = function() {
    var afternoons = [
        {
            name: 'talk about nodejs',
            description: 'nodejs was used to make this site',
            score: 3
        },
        {
            name: 'talk about age gates',
            description: 'talk about our mutual love for not allowing people to use our site',
            score: -2
        }];

    db.collection('afternoons', function(err, collection) {
        collection.insert(afternoons, {safe:true}, function(err, result) {
            console.log("inserted placeholder afternoons");
        });
    });
};

db.open(function(err, db) {
    if(!err) {
            console.log("Connected to 'afternoondb' database");
            db.collection('afternoons', {safe:true}, function(err, collection) {
                        if (err) {
                                        console.log("The 'afternoons' collection doesn't exist. Creating it with sample data...");
                                        populateDB();
                                    }
                else {
                    console.log("The 'afternoons' collection already exists.");
                    }
                    });
        }
});


exports.index = function(req, res){
    db.collection('afternoons', function(err, collection) {
        collection.find().toArray(function(err, items) {
            //res.send(items);
            res.render('index', { title: 'Spread Your Afternoon',
                                  topics: items
                                }
                      );
        });
    });

};
