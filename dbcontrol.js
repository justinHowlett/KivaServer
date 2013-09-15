var common = require('./common.js');
var MongoClient = require('mongodb').MongoClient
var format = require('util').format;  
var liveDb = null;

var DatabaseSetup = {

  configureDatabase: function(callback){

    var globalThis = this;

    globalThis.startDatabase(function(){
        globalThis.populateCollections(function(){
          console.log('liveDb is '+liveDb);
          callback(liveDb);
        });
    });
  },

  startDatabase: function(callback){
    
    MongoClient.connect('mongodb://nodejitsu:326bb80e236ab9b9f6d80f2f1413b971@paulo.mongohq.com:10005/nodejitsudb4355791853', function(err, db) {
    
      if(err) throw err;

      liveDb = db;

      callback();
      
    });
  },

  populateCollections: function(callback){

    var countryCollection = liveDb.collection(common.countryDetailsCollection);
      // start from scratch every time the server starts 
      countryCollection.remove(function(err, result) {
        
        liveDb.createCollection(common.countryDetailsCollection, function(err, collection){
          
          callback();

        });
      });
  }
}

exports.database = function() { return liveDb; };
exports.DatabaseSetup = DatabaseSetup;
