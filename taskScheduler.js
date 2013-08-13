var kivaSupportedCountries = ['AF', 'AL', 'AM', 'AZ', 'BA', 'BD', 'BF', 'BG', 'BI', 'BJ', 'BO', 'BW', 'BZ', 'CD', 'CG', 'CI', 'CL', 'CM', 'CO', 'CR', 'DO', 'EC', 'GE', 'GH', 'GT', 'GZ', 'HN', 'HT', 'ID', 'IL', 'IN', 'IQ', 'JO', 'KE', 'KG', 'KH', 'LB', 'LK', 'LR', 'MD', 'ML', 'MN', 'MW', 'MX', 'MZ', 'NA', 'NG', 'NI', 'NP', 'PA', 'PE', 'PH', 'PK', 'PS', 'PY', 'QS', 'RW', 'SL', 'SN', 'SO', 'SR', 'SV', 'TD', 'TG', 'TH', 'TJ', 'TL', 'TR', 'TZ', 'UA', 'UG', 'US', 'VN', 'WS', 'XK', 'YE', 'ZA', 'ZM', 'ZW'];

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

	console.log('fetching all country info');

	for (var i in kivaSupportedCountries){

		var country = require('./countryStats.js');
		var countryCode = kivaSupportedCountries[i];

		var request = require('request');
		request.url = '/countries/?countrycode='+ countryCode;
		
		var countryRequest = Object.create(country.CountryRequest);

      	countryRequest.makeRequest(request,null,countryCode,cache);

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