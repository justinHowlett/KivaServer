var common = require('./common.js');

function parseToDatabase(){
	prepareS3Requests(true);
}

function prepareS3Requests(shouldSave){
	var supportedCountries = common.kivaSupportedCountries;

	for (var i in common.kivaSupportedCountries){

		var countryName = sanitizedString(common.kivaSupportedCountries[i].toString());
		
		var imageUrl = 'https://kiva_images.s3.amazonaws.com/'+countryName+'/original.jpg';
		var attributionUrl = 'https://kiva_images.s3.amazonaws.com/'+countryName+'/attribution.txt';
		var linkUrl = 'https://kiva_images.s3.amazonaws.com/'+countryName+'/url.txt';

		makeS3Request(imageUrl,shouldSave);
		makeS3Request(attributionUrl,shouldSave);
		makeS3Request(linkUrl,shouldSave);
	}
}

function makeS3Request(requestUrl,shouldSave){
	var s3Request = require('request');
   
    s3Request(requestUrl, function(error, response, body) {

    	if (error) {
    		//retry, prob connection closed on s3 end
    		makeS3Request(requestUrl);
  		}else if (response.statusCode != 200){
  			console.log('invalid s3 request '+requestUrl+' status code is '+response.statusCode);
  		}else if (shouldSave){
  			//save to DB
  			// console.log(' url body is '+body);
  		}
    });
}

function sanitizedString(string)
{
	var capitalisedString = string.charAt(0).toUpperCase() + string.slice(1);
    return capitalisedString.replace(/ /g,"_"); //space to underscore
}

exports.parseToDatabase = parseToDatabase;