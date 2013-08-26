var dbControl = require('./dbcontrol.js');
var url   = require('url');

var api = {

	/* prepare the database from S3 files on completion populate the cache and scheduled the cron jobs  */
	// dbControl.configureDatabase(function(){
	//   console.log('db ready');
	// })

	handleApiRequest: function (request,serverResponse,cache,endPoint) {

		if (endPoint == '/v1/countries/'){
	      
	      var country = require('./countryStats.js');
	      var queryString = url.parse(request.url, true).query;
	      var countryRequest = Object.create(country.CountryRequest);

	      console.log('queryString.base64 is '+queryString.base64);
	      countryRequest.makeRequest(request,serverResponse,queryString.countrycode,queryString.base64,cache,null);

	    }else if (endPoint == '/v1/kiva/newest/'){
	      
	      var kivaFeeds = require('./kivaFeeds.js');
	      var kivaNewestRequest = Object.create(kivaFeeds.newestRequest);
	      kivaNewestRequest.makeRequest(request,serverResponse,cache,null);

	    }else if (endPoint == '/v1/kiva/partners/'){
	      
	      var kivaFeeds = require('./kivaFeeds.js');
	      var queryString = url.parse(request.url, true).query;

	      if (queryString.partnerid != null && typeof queryString.partnerid !== "undefined"){
	        //partner by id
	        var kivaPartnerIdRequest = Object.create(kivaFeeds.partnerIdRequest);
	        kivaPartnerIdRequest.makeRequest(request,serverResponse,cache,queryString.partnerid,null);
	      }else{
	        //all partners 
	        var kivaPartnersRequest = Object.create(kivaFeeds.partnersRequest);
	        kivaPartnersRequest.makeRequest(request,serverResponse,cache,null);
	      }
	  
	    }else if (endPoint == '/v1/kiva/stats/'){
	      var kivaFeeds = require('./kivaFeeds.js');
	      var kivaStatsRequest = Object.create(kivaFeeds.statsRequest);
	      kivaStatsRequest.makeRequest(request,serverResponse,cache,null);

	    }

	}

}

exports.api = api;