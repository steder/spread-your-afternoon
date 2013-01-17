
/*
 * GET home page.
 */

var url = require('url');

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;


var connectionUri = url.parse(process.env.MONGOHQ_URL);
var dbName = connectionUri.pathname.replace(/^\//, '');

console.log(connectionUri);

var server = new Server(connectionUri.hostname, parseInt(connectionUri.port), {auto_reconnect: true});
db = new Db(dbName, server, {safe:true});
db.open(function(err, db) {
    if(!err) {
            console.log("Connected to 'afternoondb' database");
            db.collection('afternoons', {safe:true}, function(err, collection) {
                if (err) {
                    console.log("The 'afternoons' collection doesn't exist. Creating it with sample data...");
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
