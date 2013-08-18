var s3Feeds = require('./s3Feeds.js');

function configureDatabase(){
	s3Feeds.parseToDatabase();
}

exports.configureDatabase = configureDatabase;