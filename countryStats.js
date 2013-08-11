var wbIndicators = ['SP.POP.TOTL','SL.UEM.TOTL.ZS','NY.GDP.MKTP.KD.ZG','NY.GDP.PCAP.CD','SE.SEC.ENRR','SE.ADT.1524.LT.ZS','SH.DYN.MORT','EG.ELC.ACCS.ZS','SL.TLF.0714.WK.MA.ZS','SL.TLF.0714.WK.MA.ZS','IS.ROD.PAVE.ZS','SP.DYN.LE00.IN','SH.TBS.INCD','SH.STA.MALN.ZS','SP.DYN.LE00.IN','SH.TBS.INCD','SH.STA.MALN.ZS','SH.DYN.AIDS.ZS','SH.MLR.INCD'];
var worldBankBaseURL            = 'http://api.worldbank.org/countries/';
var worldBankIndicatorsEndpoint = '/indicators/';
var defaultDataRange 			      = '2010:2010';
var msPerDay 				            = 86400000;
var cacheLengthDays				      = 15; 

var fetchCountry = function(request, serverResponse, countryCode, cache) {
	
	var completedRequests = 0;
    var concatResponse = [];

    for (var i in wbIndicators){
    	var indicator  = wbIndicators[i];
    	var requestUrl = worldBankBaseURL+countryCode+worldBankIndicatorsEndpoint+indicator+'?date='+defaultDataRange+'&format=json';
    	var wbRequest = require('request');

   		wbRequest(requestUrl, function(error, response, body) {
   			concatResponse.push(body);
   			completedRequests ++;
   			if (completedRequests == wbIndicators.length-1){

   				var jsonResponse = JSON.stringify(concatResponse);
   				cache.put(request.url, jsonResponse, cacheLengthDays*msPerDay); 
   				serverResponse.end(jsonResponse);
   			}
  			
  		});
    }
};


exports.fetchCountry = fetchCountry;