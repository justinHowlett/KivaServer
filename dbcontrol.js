var common = require('./common.js');
var s3Feeds = require('./s3Feeds.js');
var MongoClient = require('mongodb').MongoClient, format = require('util').format;    
var liveDatabase;

function configureDatabase(){

  startDatabase(function(){
    s3Feeds.parseToDatabase();
  });
}

function startDatabase(callback){
  
  MongoClient.connect('mongodb://nodejitsu:326bb80e236ab9b9f6d80f2f1413b971@paulo.mongohq.com:10005/nodejitsudb4355791853', function(err, db) {
  
    if(err) throw err;

    var collection = db.collection('countyImageDetails');

    // start from scratch every time the server starts 
    collection.remove(function(err, result) {
      console.log("database setup complete");
      liveDatabase = db;
      callback();
    });
  });
}

function addCountryObjectToDatabase(countryObject,callback){

  var collection = liveDatabase.collection('countyImageDetails');

  var document = {
    name:countryObject.name, 
    countryCode:countryObject.countryCode,
    attribution:countryObject.attribution,
    link:countryObject.link,
    imageBase64:countryObject.base64Image
  };

  collection.insert(document, function(err, records) {
    if (err) throw err;
    callback();
  });

}

function findCountryByCountryCode(countryCode,callback){

  var collection = liveDatabase.collection('countyImageDetails');

  collection.find({countryCode:countryCode}).nextObject(function(err, doc) {        
    if (err) throw err;    
    
    var countryObject = countryObjectForMongoDoc(doc);
    callback(countryObject);

  });
}

  function findCountryByCountryName(countryName,callback){

  var collection = liveDatabase.collection('countyImageDetails');

  collection.find({countryCode:countryName}).nextObject(function(err, doc) {        
    if (err) throw err;    
    console.log("country image url is "+doc["imageUrl"]);

    var countryObject = countryObjectForMongoDoc(doc);
    callback(countryObject);

  });

}

function countryObjectForMongoDoc(doc){

  var countryObject = new Object();
  countryObject.name = doc["name"];
  countryObject.countryCode = doc["countryCode"];
  countryObject.base64Image = doc["base64Image"];
  countryObject.attribution = doc["attribution"];
  countryObject.link = doc["link"];

  return countryObject;

}

exports.database = liveDatabase;
exports.configureDatabase = configureDatabase;
exports.addCountryObjectToDatabase = addCountryObjectToDatabase;
exports.findCountryByCountryCode = findCountryByCountryCode;
exports.findCountryByCountryName = findCountryByCountryName;