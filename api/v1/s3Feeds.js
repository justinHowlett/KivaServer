var common = require('../../common.js');
var dbControl = require('./dbcontrol.js');


function makeRequestsForCountry(countryname,countryCode,inlineImage,callback){

  //replace spaces with underscore and capitalize first character
  countryname = formattedString(countryname.toString());

	var imageUrl = 'https://kiva_images.s3.amazonaws.com/'+countryname+'/original.jpg';
	var attributionUrl = 'https://kiva_images.s3.amazonaws.com/'+countryname+'/attribution.txt';
	var linkUrl = 'https://kiva_images.s3.amazonaws.com/'+countryname+'/url.txt';

	var imageBase64;
	var linkText;
	var attributionText;

  if (inlineImage != null && typeof inlineImage !== 'undefined' && inlineImage == 'true'){
    console.log('inline image request');
    makeS3Request(imageUrl,true,function(responseBody){
    //response body in this case is a buffer when passing true for binaryresponse, we then turn the buffer into a base64 string
      imageBase64 = responseBody.toString('base64');
      validateCountry(countryname,countryCode,imageBase64,attributionText,linkText,callback,inlineImage);
    });
  }
  //attribution name
	makeS3Request(attributionUrl,false,function(responseBody){
		attributionText = responseBody;
		validateCountry(countryname,countryCode,imageBase64,attributionText,linkText,callback,inlineImage);
	});

  //attribution url 
	makeS3Request(linkUrl,false,function(responseBody){
		linkText = responseBody;
		validateCountry(countryname,countryCode,imageBase64,attributionText,linkText,callback,inlineImage);
	});
}

function validateCountry(countryname,countryCode,imageBase64,attribution,link,callback,inlineImage){

	if (attribution != null && link != null){
    
    if (typeof inlineImage !== 'undefined' && inlineImage != null && inlineImage == 'true' && imageBase64 == null)
      return;

    var countryImage = {};
    countryImage.name = countryname;
    countryImage.imageBase64 = imageBase64;
    countryImage.attributionName = attribution;
    countryImage.attributionLink = link;
    countryImage.imageUrl = 'https://kiva_images.s3.amazonaws.com/'+countryname+'/original.jpg';

    callback(countryImage);

	}
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