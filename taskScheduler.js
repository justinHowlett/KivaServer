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

	var commonKeys = Object.keys(common.kivaSupportedCountries); 

	makeCountryRequest(0);

	function makeCountryRequest(i){

		if (i > commonKeys.count-1){
			return;
		}

		var countryCode = commonKeys[i];

		var country = require('./countryStats.js');
		var request = require('request');

		request.url = '/countries/?countrycode='+ countryCode;
		var countryRequest = Object.create(country.CountryRequest);
		countryRequest.makeRequest(request,null,countryCode,null,cache,function(){
			console.log('country request back for code '+countryCode);
			makeCountryRequest(i+1);
		});

	}

}

function fetchNewestLoans(cache){

	var kivaFeeds = require('./kivaFeeds.js');
    var kivaNewestRequest = Object.create(kivaFeeds.newestRequest);
    var request = require('request');
    request.url = '/kiva/newest/';

	kivaNewestRequest.makeRequest(request,null,cache,null);
}

function fetchAllPartners(cache){
	
	//no partner id 0
	partnerRequest(1);

	//synchronously request the partners, prevent flooding with requests
	function partnerRequest(i){
		
		if (i>=300){
			return;
		}

		console.log('partner request for iterator '+i);

		var kivaFeeds = require('./kivaFeeds.js');
		var request = require('request');
		
	    request.url = '/kiva/partners/?partnerid='+i.toString();
		var kivaPartnerIdRequest = Object.create(kivaFeeds.partnerIdRequest);
		kivaPartnerIdRequest.url = request.url;
	    kivaPartnerIdRequest.makeRequest(request,null,cache,i.toString(),function(){
       		partnerRequest(i+1);
     	});
	}

}

exports.scheduleTasks = scheduleTasks;