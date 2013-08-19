var common = require('./common.js');
var dbControl = require('./dbcontrol.js');

function parseToDatabase(){
	console.log("parsing s3 feeds to db");
	prepareS3Requests(true);
}

function prepareS3Requests(shouldSave){
	var supportedCountries = common.kivaSupportedCountries;

	for (var i in common.kivaSupportedCountries){

		var countryName = sanitizedString(common.kivaSupportedCountries[i].toString());

		makeRequestsForCountry(countryName,i);
	}
}

function makeRequestsForCountry(countryname,countryCode){

	var imageUrl = 'https://kiva_images.s3.amazonaws.com/'+countryname+'/original.jpg';
	var attributionUrl = 'https://kiva_images.s3.amazonaws.com/'+countryname+'/attribution.txt';
	var linkUrl = 'https://kiva_images.s3.amazonaws.com/'+countryname+'/url.txt';

	var imageBase64;
	var linkText;
	var attributionText;

	makeS3Request(imageUrl,true,function(responseBody){
		//response body in this case is a buffer when passing true for binaryresponse, we then turn the buffer into a base64 string
		imageBase64 = responseBody.toString('base64');
		validateCountry(countryname,countryCode,imageBase64,attributionText,linkText);
	});
	makeS3Request(attributionUrl,false,function(responseBody){
		attributionText = responseBody;
		validateCountry(countryname,countryCode,imageBase64,attributionText,linkText);
	});
	makeS3Request(linkUrl,false,function(responseBody){
		linkText = responseBody;
		validateCountry(countryname,countryCode,imageBase64,attributionText,linkText);
	});
}

function validateCountry(countryname,countryCode,imageBase64,attribution,link){

	if (attribution != null && imageBase64 != null && link!= null){
		console.log('country valid for name' +countryname+' saving to db');
		saveCountryToDatabase(countryname,countryCode,imageBase64,attribution,link);
	}
}

function saveCountryToDatabase(countryname,countryCode,imageBase64,attribution,link){

	var countryObject = new Object();
    countryObject.name = countryname;
    countryObject.countryCode = countryCode;
    countryObject.attribution = attribution;
    countryObject.link = link;
    countryObject.base64Image = imageBase64;

    dbControl.addCountryObjectToDatabase(countryObject,null);
}

function makeS3Request(requestUrl,binaryresponse,callback){

	var s3Request = require('request');

    var requestSettings;

    if (binaryresponse){
    	requestSettings = {
           method: 'GET',
           uri: requestUrl,
    	};
    }else{
    	requestSettings = {
           method: 'GET',
           uri: requestUrl,
           encoding: null,
    	};
    } 

    s3Request(requestSettings, function(error, response, body) {

    	if (error) {
    		//retry, prob connection closed on s3 end
    		makeS3Request(requestUrl);
  		}else if (response.statusCode != 200){
  			//this should have been caught by the unit tests
  			console.log('invalid s3 request '+requestUrl+' status code is '+response.statusCode);
  		}else {
  			if (callback){
  				callback(body);
  			}
  			
  		}
    });
}

function sanitizedString(string)
{
	var capitalisedString = string.charAt(0).toUpperCase() + string.slice(1);
    return capitalisedString.replace(/ /g,"_"); //space to underscore
}

exports.parseToDatabase = parseToDatabase;