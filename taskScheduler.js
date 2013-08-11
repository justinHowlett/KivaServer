 var kivaSupportedCountries = ['AF', 'AL', 'AM', 'AZ', 'BA', 'BD', 'BF', 'BG', 'BI', 'BJ', 'BO', 'BW', 'BZ', 'CD', 'CG', 'CI', 'CL', 'CM', 'CO', 'CR', 'DO', 'EC', 'GE', 'GH', 'GT', 'GZ', 'HN', 'HT', 'ID', 'IL', 'IN', 'IQ', 'JO', 'KE', 'KG', 'KH', 'LB', 'LK', 'LR', 'MD', 'ML', 'MN', 'MW', 'MX', 'MZ', 'NA', 'NG', 'NI', 'NP', 'PA', 'PE', 'PH', 'PK', 'PS', 'PY', 'QS', 'RW', 'SL', 'SN', 'SO', 'SR', 'SV', 'TD', 'TG', 'TH', 'TJ', 'TL', 'TR', 'TZ', 'UA', 'UG', 'US', 'VN', 'WS', 'XK', 'YE', 'ZA', 'ZM', 'ZW'];
// var kivaSupportedCountries = ['AF', 'AL'];

function scheduleTasks(cache){

	fetchAllCountryInfo(cache);

// 	var cronJob = require('cron').CronJob;
// 	var job = new cronJob('00 30 11 * * 1-5', function(){
//     // Runs every weekday (Monday through Friday)
//     // at 11:30:00 AM. It does not run on Saturday
//     // or Sunday.
//     console.log('cron running');
//   	}, function () {
//     // This function is executed when the job stops
//     console.log('cron ran');
//  	 }, 
//   	true /* Start the job right now */,
//   "America/Los_Angeles" /* Time zone of this job. */
// );
	
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