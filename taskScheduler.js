var common = require('./common.js');

function scheduleTasks(cache){

	//fetch cachable data on server start
	fetchAllCountryInfo(cache);
	fetchNewestLoans(cache);
	
	var cronJob = require('cron').CronJob;

  	var kivaNewestLoans = new cronJob('0 0 * * *', function(){ 
    	//daily at midnight
    	fetchNewestLoans(cache);

  	},null, true);

}


function fetchAllCountryInfo(cache){

	for (var i in common.kivaSupportedCountries){

		console.log('fetching country info for '+i);

		var country = require('./countryStats.js');

		var request = require('request');
		request.url = '/countries/?countrycode='+ i;
		
		var countryRequest = Object.create(country.CountryRequest);

      	countryRequest.makeRequest(request,null,i,cache);
	}

}

function fetchNewestLoans(cache){

	var kivaFeeds = require('./kivaFeeds.js');
    var kivaNewestRequest = Object.create(kivaFeeds.NewestRequest);
    var request = require('request');
    request.url = '/kiva/newest/';

	kivaNewestRequest.makeRequest(request,null,cache);
}

exports.scheduleTasks = scheduleTasks;