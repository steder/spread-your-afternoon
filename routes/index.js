
/*
 * GET home page.
 */

var url = require('url');

//var mongo = require('mongodb');
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
//    Server = require('mongodb').Server,
//    ReplSetServers = require('mongodb').ReplSetServers,
//    ObjectID = require('mongodb').ObjectID,
//    Binary = require('mongodb').Binary,
//    GridStore = require('mongodb').GridStore,
//    Code = require('mongodb').Code,
//    BSON = require('mongodb').pure().BSON,
//    assert = require('assert');
    assert = require('assert');
//var Server = mongo.Server,
//    Db = mongo.Db,
//    BSON = mongo.BSONPure;

var connectionUri = url.parse(process.env.MONGOHQ_URL);
var dbName = connectionUri.pathname.replace(/^\//, '');

console.log(connectionUri);

db = undefined;

MongoClient.connect(process.env.MONGOHQ_URL, function(err, new_db) {
    assert.equal(null, err);
    assert.ok(new_db != null);

    db = new_db;
    //console.log(db);

    console.log("Connected to 'afternoondb' database");
    db.collection('afternoons', {safe:true}, function(err, collection) {
        if (err) {
            console.log("The 'afternoons' collection doesn't exist. Creating it with sample data...");
        }
        else {
            console.log("The 'afternoons' collection already exists.");
        }
    });

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
