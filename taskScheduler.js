var common = require('./common.js');

function scheduleTasks(cache){

	//fetch cachable data on server start synchronously
	fetchAllCountryInfo(cache,function(){
		fetchNewestLoans(cache,function(){
			fetchAllPartners(cache);
		});
	});
	
	var cronJob = require('cron').CronJob;

  	var kivaNewestLoans = new cronJob('0 0 * * *', function(){ 
    	//daily at midnight
    	fetchNewestLoans(cache);
    	fetchAllPartners(cache);

  	},null, true);

}

function fetchAllCountryInfo(cache,callback){

	var commonKeys = Object.keys(common.kivaSupportedCountries); 

	makeCountryRequest(0);

	function makeCountryRequest(i){

		if (i > commonKeys.count-1){
			return;
		}

		var countryCode = commonKeys[i];
		var country = require('./countryStats.js');
		var countryRequest = Object.create(country.CountryRequest);
		var request = require('request');
		request.url = '/countries/?countrycode='+ countryCode;
		
		countryRequest.makeRequest(request,null,countryCode,null,cache,function(){
			console.log('country request back for code '+countryCode);
			makeCountryRequest(i+1);
		});

	}

}

function fetchNewestLoans(cache,callback){

	var kivaFeeds = require('./kivaFeeds.js');
    var kivaNewestRequest = Object.create(kivaFeeds.newestRequest);
    var request = require('request');
    request.url = '/kiva/newest/';

	kivaNewestRequest.makeRequest(request,null,cache,null);
}

function fetchAllPartners(cache,callback){

	//no partner id 0
	partnerRequest(1);

	//synchronously request the partners, prevent flooding with requests
	function partnerRequest(i){
		
		if (i>=300){
			return;
		}

		var kivaFeeds = require('./kivaFeeds.js');
		var kivaPartnerIdRequest = Object.create(kivaFeeds.partnerIdRequest);
		var request = require('request');
	    request.url = '/kiva/partners/?partnerid='+i.toString();

	    kivaPartnerIdRequest.makeRequest(request,null,cache,i.toString(),function(){
       		partnerRequest(i+1);
     	});
	}

}

exports.scheduleTasks = scheduleTasks;