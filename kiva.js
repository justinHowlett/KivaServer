var http = require('http');
var cache = require('memory-cache');
var url  = 'http://api.worldbank.org/countries/SZ/indicators/SH.DYN.AIDS.ZS?format=json&date=2010:2010';
var wbIndicators = ['SP.POP.TOTL','SL.UEM.TOTL.ZS','NY.GDP.MKTP.KD.ZG','NY.GDP.PCAP.CD','SE.SEC.ENRR','SE.ADT.1524.LT.ZS','SH.DYN.MORT','EG.ELC.ACCS.ZS','SL.TLF.0714.WK.MA.ZS','SL.TLF.0714.WK.MA.ZS','IS.ROD.PAVE.ZS','SP.DYN.LE00.IN','SH.TBS.INCD','SH.STA.MALN.ZS','SP.DYN.LE00.IN','SH.TBS.INCD','SH.STA.MALN.ZS','SH.DYN.AIDS.ZS','SH.MLR.INCD'];
var worldBankBaseURL            = 'http://api.worldbank.org/countries/';
var worldBankIndicatorsEndpoint = '/indicators/';
var defaultDataRange 			= '2010:2010';
var msPerDay 					= 86400000;
var cacheLengthDays				= 15; 

http.createServer(function (request, serverResponse) {
    serverResponse.writeHead(200, {'Content-Type': 'text/plain'});

    if (request.url != '/'){
    	serverResponse.end(null);
    	return;
    }

    var cachedItem = cache.get(request.url);
    if (cachedItem){
    	serverResponse.end(cachedItem);
    	console.log('cache found '+cachedItem);
    	return;
    }
    	
    var completedRequests = 0;
    var concatResponse = [];

    for (var i in wbIndicators){
    	var indicator  = wbIndicators[i];
    	var requestUrl = worldBankBaseURL+'SZ'+worldBankIndicatorsEndpoint+indicator+'?date='+defaultDataRange+'&format=json';
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

}).listen(8080);

console.log('Server started');