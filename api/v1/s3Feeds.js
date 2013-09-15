var common = require('../../common.js');

function makeRequestsForCountry(countryName,countryCode,requestInlineImage,callback){

  //replace spaces with underscore and capitalize first character
  countryName = formattedString(countryName.toString());

	var imageUrl = 'https://kiva_images.s3.amazonaws.com/'+countryName+'/original.jpg';
	var attributionUrl = 'https://kiva_images.s3.amazonaws.com/'+countryName+'/attribution.txt';
	var linkUrl = 'https://kiva_images.s3.amazonaws.com/'+countryName+'/url.txt';
  var descriptionUrl = 'https://kiva_resources.s3.amazonaws.com/country_descriptions/'+countryName.toLowerCase()+'.txt';

  var country = {}
  country.countryName = countryName;
  country.countryCode = countryCode;
  country.countryImage = {};
  country.countryImage.imageUrl = 'https://kiva_images.s3.amazonaws.com/'+countryName+'/original.jpg';

  if (requestInlineImage != null && typeof requestInlineImage !== 'undefined' && requestInlineImage == 'true'){
    console.log('inline image request');
    makeS3Request(imageUrl,true,function(responseBody){
    //response body in this case is a buffer when passing true for binaryresponse, we then turn the buffer into a base64 string
      country.countryImage.imageBase64 = responseBody.toString('base64');
      validateCountry(country,requestInlineImage);
    });
  }
  //attribution name
	makeS3Request(attributionUrl,false,function(responseBody){
		country.countryImage.attributionName = responseBody;
		validateCountry(country,requestInlineImage,callback);
	});

  //attribution url 
	makeS3Request(linkUrl,false,function(responseBody){
		country.countryImage.attributionLink = responseBody;
		validateCountry(country,requestInlineImage,callback);
	});

  //description
  makeS3Request(descriptionUrl,false,function(responseBody){
    country.countryDescription = responseBody;
    validateCountry(country,requestInlineImage,callback);
  });
}

function validateCountry(country,requestInlineImage,callback){

	if (country.countryImage.attributionName != null && country.countryImage.attributionLink != null && country.countryDescription != null){
    
    if (typeof requestInlineImage !== 'undefined' && requestInlineImage != null && requestInlineImage == 'true' && country.countryImage.imageBase64 == null)
      return false;

    if (callback != null){
      callback(country);
    }
	}

  return false;
}


function makeS3Request(requestUrl,binaryresponse,callback){

	var s3Request = require('request');

    var requestSettings;

    if (binaryresponse){
    	requestSettings = {
           method: 'GET',
           uri: requestUrl,
           encoding: null
    	};
    }else{
    	requestSettings = {
           method: 'GET',
           uri: requestUrl
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

function formattedString(string)
{
	  var capitalisedString = string.charAt(0).toUpperCase() + string.slice(1);
    return capitalisedString.replace(/ /g,"_"); //space to underscore
}

exports.makeRequestsForCountry = makeRequestsForCountry;