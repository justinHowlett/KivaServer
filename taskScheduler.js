var common = require('./common.js');

function scheduleTasks(cache){

	//fetch cachable data on server start synchronously
	fetchAllCountryInfo(cache,function(){
		fetchNewestLoans(cache,function(){
			fetchAllPartners(cache,function(){
				fetchKivaStats(cache,function(){
					console.log('server setup caching complete');
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

function fetchAllCountryInfo(cache,callback){

	makeCountryRequest(0);

	function makeCountryRequest(i){

		var commonKeys = Object.keys(common.kivaSupportedCountries); 

		if (i > commonKeys.length-1){
			callback();
			return;
		}

		var countryCode = commonKeys[i];
		var country = require('./countryStats.js');
		var countryRequest = Object.create(country.CountryRequest);
		var request = require('request');
		request.url = '/countries/?countrycode='+ countryCode;
		
		countryRequest.makeRequest(request,null,countryCode,null,cache,function(){
			
			makeCountryRequest(i+1);
		});

	}

}

function fetchNewestLoans(cache,callback){

	var kivaFeeds = require('./kivaFeeds.js');
    var kivaNewestRequest = Object.create(kivaFeeds.newestRequest);
    var request = require('request');
    request.url = '/kiva/newest/';

	kivaNewestRequest.makeRequest(request,null,cache,function(){
		callback();
	});
}

function fetchKivaStats(cache,callback){

	var kivaFeeds = require('./kivaFeeds.js');
    var kivaStatsRequest = Object.create(kivaFeeds.statsRequest);
    var request = require('request');
    request.url = '/kiva/stats/';

	kivaStatsRequest.makeRequest(request,null,cache,function(){
		callback();
	});
}


function fetchAllPartners(cache,callback){

	//no partner id 0
	partnerRequest(1);

	//synchronously request the partners, prevent flooding with requests
	function partnerRequest(i){
		
		if (i>=300){
			callback();
			return;
		}

		var kivaFeeds = require('./kivaFeeds.js');
		var kivaPartnerIdRequest = Object.create(kivaFeeds.partnerIdRequest);
		var request = require('request');
	    request.url = '/kiva/partners/?partnerid='+i.toString();

	    kivaPartnerIdRequest.makeRequest(request,null,cache,i.toString(),function(){
	    	console.log('partner request done for partner '+i.toString());
       		partnerRequest(i+1);
     	});
	}

}

exports.scheduleTasks = scheduleTasks;