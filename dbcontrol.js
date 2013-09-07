var common = require('./common.js');
var MongoClient = require('mongodb').MongoClient, format = require('util').format;  
var liveDatabase;
var setupCallback

function configureDatabase(callback){

  startDatabase(function(){
      callback();
  });
}

function startDatabase(callback){
  
  MongoClient.connect('mongodb://nodejitsu:326bb80e236ab9b9f6d80f2f1413b971@paulo.mongohq.com:10005/nodejitsudb4355791853', function(err, db) {
  
    if(err) throw err;

    var collection = db.collection('kivaUserInfo');
    // start from scratch every time the server starts 
    collection.remove(function(err, result) {
      console.log("database setup complete");
      liveDatabase = db;
      callback();
    });
  });
}


exports.database = liveDatabase;
exports.configureDatabase = configureDatabase;
