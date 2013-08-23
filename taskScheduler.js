var common = require('./common.js');

function scheduleTasks(cache){

	//fetch cachable data on server start
	fetchAllCountryInfo(cache);
	fetchNewestLoans(cache);
	fetchAllPartners(cache);
	
	var cronJob = require('cron').CronJob;

  	var kivaNewestLoans = new cronJob('0 0 * * *', function(){ 
    	//daily at midnight
    	fetchNewestLoans(cache);
    	fetchAllPartners(cache);

  	},null, true);

}


function fetchAllCountryInfo(cache){

	for (var i in common.kivaSupportedCountries){

		console.log('fetching country info for '+i);

		var country = require('./countryStats.js');

		var request = require('request');
		request.url = '/countries/?countrycode='+ i;
		
		var countryRequest = Object.create(country.CountryRequest);

      	countryRequest.makeRequest(request,null,i,null,cache);
	}

}

function fetchNewestLoans(cache){

	var kivaFeeds = require('./kivaFeeds.js');
    var kivaNewestRequest = Object.create(kivaFeeds.newestRequest);
    var request = require('request');
    request.url = '/kiva/newest/';

	kivaNewestRequest.makeRequest(request,null,cache);
}

function fetchAllPartners(cache){


	// for (var i=0; i<300; i++){

	// 	var kivaFeeds = require('./kivaFeeds.js');
	// 	var request = require('request');
		
	//     request.url = '/kiva/partners/?partnerid='+i.toString();
	//     console.log('request url is '+request.url);
	// 	var kivaPartnerIdRequest = Object.create(kivaFeeds.partnerIdRequest);
	// 	kivaPartnerIdRequest.url = request.url;
	//     kivaPartnerIdRequest.makeRequest(request,null,cache,i.toString());
	// }
}

exports.scheduleTasks = scheduleTasks;