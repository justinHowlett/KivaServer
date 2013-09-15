var common = require('./common.js');
var dbControl = require('./dbcontrol.js')

function scheduleTasks(cache,database,callback){

	//fetch cachable data on server start synchronously to prevent flooding with network requests. 
	console.log('fetching country info');
	fetchAllCountryInfo(cache,database,function(){
		//Country info is the only required dataset before the api starts. Thes rest just fill the cache.
		if (callback != null){
			callback();
		}
		console.log('fetching newest kiva loans');
		fetchNewestLoans(cache,function(){
			console.log('fetching kiva partner list');
			fetchAllPartners(cache,function(){
				console.log('fetching kiva stats');
				fetchKivaStats(cache,function(){
				
				});
			});
		});
	});
	
	var cronJob = require('cron').CronJob;

  	var kivaNewestLoans = new cronJob('0 0 * * *', function(){ 
    	//daily at midnight
    	fetchNewestLoans(cache);
    	fetchAllPartners(cache);

  	},null, true);

}

function fetchAllCountryInfo(cache,database,callback){

	requestAndStoreCountryDetails(0);

	function requestAndStoreCountryDetails(i){

		var commonKeys = Object.keys(common.kivaSupportedCountries); 

		if (i > commonKeys.length-1){
			callback();
			return;
		}

		var countryCode = commonKeys[i];
		var countryModule = require('./api/v1/countryStats.js');

		var countryConstruct = Object.create(countryModule.CountryConstruct);

		countryConstruct.createCountry(countryCode,function(country){
	
			var collection = database.collection(common.countryDetailsCollection);

	 		collection.insert(country,function(err, doc) {     
	        	requestAndStoreCountryDetails(i+1);
	        });
		});

	}

}

function fetchNewestLoans(cache,callback){

	var kivaFeeds = require('./api/v1/kivaFeeds.js');
    var kivaNewestRequest = Object.create(kivaFeeds.newestRequest);
    var request = require('request');
    request.url = '/v1/kiva/newest/';

	kivaNewestRequest.makeRequest(request,null,cache,function(){
		callback();
	});
}

function fetchKivaStats(cache,callback){

	var kivaFeeds = require('./api/v1/kivaFeeds.js');
    var kivaStatsRequest = Object.create(kivaFeeds.statsRequest);
    var request = require('request');
    request.url = '/v1/kiva/stats/';

	kivaStatsRequest.makeRequest(request,null,cache,function(){
		callback();
	});
}


function fetchAllPartners(cache,callback){

	//no partner id 0
	partnerRequest(1);

	//synchronously request the partners, prevent flooding with requests
	function partnerRequest(i){
		
		if (i>=common.numberOfKivaPartners){
			callback();
			return;
		}

		var kivaFeeds = require('./api/v1/kivaFeeds.js');
		var kivaPartnerIdRequest = Object.create(kivaFeeds.partnerIdRequest);
		var request = require('request');
	    request.url = '/v1/kiva/partners/?partnerid='+i.toString();

	    kivaPartnerIdRequest.makeRequest(request,null,cache,i.toString(),function(){
	    	console.log('partner request done for partner '+i.toString());
       		partnerRequest(i+1);
     	});
	}

}

exports.scheduleTasks = scheduleTasks;