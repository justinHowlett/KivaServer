var kivaSupportedCountries = ['AF', 'AL', 'AM', 'AZ', 'BA', 'BD', 'BF', 'BG', 'BI', 'BJ', 'BO', 'BW', 'BZ', 'CD', 'CG', 'CI', 'CL', 'CM', 'CO', 'CR', 'DO', 'EC', 'GE', 'GH', 'GT', 'GZ', 'HN', 'HT', 'ID', 'IL', 'IN', 'IQ', 'JO', 'KE', 'KG', 'KH', 'LB', 'LK', 'LR', 'MD', 'ML', 'MN', 'MW', 'MX', 'MZ', 'NA', 'NG', 'NI', 'NP', 'PA', 'PE', 'PH', 'PK', 'PS', 'PY', 'QS', 'RW', 'SL', 'SN', 'SO', 'SR', 'SV', 'TD', 'TG', 'TH', 'TJ', 'TL', 'TR', 'TZ', 'UA', 'UG', 'US', 'VN', 'WS', 'XK', 'YE', 'ZA', 'ZM', 'ZW'];
var time = require('time');

function scheduleTasks(cache){

	//go and get all the country info
	fetchAllCountryInfo(cache);
	
	//schedule the country info to be refreshed monthly
	var cronJob = require('cron').CronJob;
	var job = new cronJob('00 00 1 * *', function(){ 
    	//first day of every month
    	fetchAllCountryInfo(cache);

  	},null, true,"America/New_York");

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

exports.scheduleTasks = scheduleTasks;