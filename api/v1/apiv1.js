var url   		= require('url');


var api = {

	/* prepare the database from S3 files on completion populate the cache and scheduled the cron jobs  */
	// dbControl.configureDatabase(function(){
	//   console.log('db ready');
	// })

	handleApiRequest: function (request,serverResponse,cache,database,endPoint) {

		switch (endPoint){

			case '/v1/countries/':
				var country = require('./countryStats.js');
		      	var queryString = url.parse(request.url, true).query;
		     	var countryRequest = Object.create(country.CountryRequest);

		      	var countryCode = queryString.countrycode.toUpperCase();

		      	console.log('queryString.base64 is '+queryString.base64);
		      	countryRequest.makeRequest(request,serverResponse,countryCode,queryString.base64,cache,database,null);
			break;

			case '/v1/kiva/newest/':
				var kivaFeeds = require('./kivaFeeds.js');
			    var kivaNewestRequest = Object.create(kivaFeeds.newestRequest);
			    kivaNewestRequest.makeRequest(request,serverResponse,cache,null);
			break;

			case '/v1/kiva/partners/':
				var kivaFeeds = require('./kivaFeeds.js');
			    var queryString = url.parse(request.url, true).query;

			    if (queryString.partnerid != null && typeof queryString.partnerid !== 'undefined'){
			        //partner by id
			    	var kivaPartnerIdRequest = Object.create(kivaFeeds.partnerIdRequest);
			        kivaPartnerIdRequest.makeRequest(request,serverResponse,cache,queryString.partnerid,null);
			    }else{
			        //all partners 
			        var kivaPartnersRequest = Object.create(kivaFeeds.partnersRequest);
			        kivaPartnersRequest.makeRequest(request,serverResponse,cache,null);
			    }
			break;

			case '/v1/kiva/stats/':
				var kivaFeeds = require('./kivaFeeds.js');
			    var kivaStatsRequest = Object.create(kivaFeeds.statsRequest);
			    kivaStatsRequest.makeRequest(request,serverResponse,cache,null);
			break;

			case '/v1/image/blur/':
				var imageHandler = require('./image.js');
			    var queryString = url.parse(request.url, true).query;

			    var imageProcess = Object.create(imageHandler.imageProcess);

			    if (request.method === 'POST'){

			      	var imagedata = ''
				    request.setEncoding('binary')

				    request.on('data', function(chunk){
				        imagedata += chunk
				    })

   					request.on('end', function() {
       					imageProcess.processRequest(serverResponse,null,imagedata,cache)
    				});

			    }else if (request.method === 'GET'){

			      	var imageUrl = queryString.imageurl;
			      	imageProcess.processRequest(serverResponse,imageUrl,null,cache)
			    }
			break;
		}
	}

}

exports.api = api;