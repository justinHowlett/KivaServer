var http  = require('http');
var cache = require('memory-cache');
var url   = 'http://api.worldbank.org/countries/SZ/indicators/SH.DYN.AIDS.ZS?format=json&date=2010:2010';
var wbIndicators = ['SP.POP.TOTL','SL.UEM.TOTL.ZS','NY.GDP.MKTP.KD.ZG','NY.GDP.PCAP.CD','SE.SEC.ENRR','SE.ADT.1524.LT.ZS','SH.DYN.MORT','EG.ELC.ACCS.ZS','SL.TLF.0714.WK.MA.ZS','SL.TLF.0714.WK.MA.ZS','IS.ROD.PAVE.ZS','SP.DYN.LE00.IN','SH.TBS.INCD','SH.STA.MALN.ZS','SP.DYN.LE00.IN','SH.TBS.INCD','SH.STA.MALN.ZS','SH.DYN.AIDS.ZS','SH.MLR.INCD'];
var worldBankBaseURL            = 'http://api.worldbank.org/countries/';
var worldBankIndicatorsEndpoint = '/indicators/';
var defaultDataRange 			= '2010:2010';
var msPerDay 					    = 86400000;
var cacheLengthDays				= 15; 

http.createServer(function (request, serverResponse) {

    serverResponse.writeHead(200, {'Content-Type': 'application/json'});

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

var kivaString = 'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' + '\n' 
+ 'MM MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' + '\n'
+ 'MMM.MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' + '\n'
+ 'MMMM.MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' + '\n'
+ 'MMMMM.MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' + '\n'
+ 'MMMMMM MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' + '\n'
+ 'MMMMMM  MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' + '\n'
+ 'MMMMMMM .MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' + '\n'
+ 'MMMMMMM$  MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' + '\n'
+ 'MMMMMMMM  .MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' + '\n'
+ 'MMMMMMMMZ  DMMMMMMMMMMMMMMMM. MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM.  DMMMMMMMM' + '\n'
+ 'MMMMMMMMM   MMMMMMMMMM. .    DMMMMMM  ,MMM   MMMMMMMMMMMM   MMMMM          MMMMM' + '\n'
+ 'MMMMMMMMM    MMMMMM         MMMMMMMM  ,MMM   MMMMMMMMMMM.  MMMM.  ,MMMMM?   MMMM' + '\n'
+ 'MMMMMMMMMM   MMMMM.        MMMMMMMMM  ,MMMM  .MMMMMMMMMM  +MMMZ  7MMMMMMMM.  MMM' + '\n'
+ 'MMMMMMMMMM.  .MMM.      ,MMMMMMMMMMM  ,MMMMZ  NMMMMMMMM. .MMMM   MMMMMMMMMD  MMM' + '\n'
+ 'MMMMMMMMMM.   MMM .   MMMMMMMMMMMMMM  ,MMMMM   MMMMMMMM  MMMMM  .MMMMMMMMMM  MMM' + '\n'
+ 'MMMMMMMMMM$   .~?MMMMMMMMMMMMMMMMMMM  ,MMMMMM  NMMMMMM.  MMMMM  .MMMMMMMMMM  MMM' + '\n'
+ 'MMMMMMMMMMM    .MMMMMMMMMMMMMMMMMMMM  ,MMMMMM   MMMMM=  MMMMMM   MMMMMMMMMM  MMM' + '\n'
+ 'MMMMMMMMMMM    +M.DMMMMMMMMMMMMMMMMM  ,MMMMMMM  :MMMM   MMMMMM               MMM' + '\n'
+ 'MMMMMMMMMMM     MM       MMMMMMMMMMM  ,MMMMMMM.  MMM   MMMMMMM  .MMMMMMMMMM  MMM' + '\n'
+ 'MMMMMMMMMMM.    MM          MMMMMMMM  ,MMMMMMMM.  MM  OMMMMMMM  .MMMMMMMMMM  MMM' + '\n'
+ 'MMMMMMMMMMM     MMM          .MMMMMM  ,MMMMMMMMM  M  .MMMMMMMM  .MMMMMMMMMM  MMM' + '\n'
+ 'MMMMMMMMMMM     8MMM           IMMMM  ,MMMMMMMMM    .MMMMMMMMM  .MMMMMMMMMM  MMM' + '\n'
+ 'MMMMMMMMMMM.    .MMMMD          .MMM  ,MMMMMMMMMM   .MMMMMMMMM  .MMMMMMMMMM  MMM' + '\n'
+ 'MMMMMMMMMMMMMMMMMMMMMMMMM, ...   MMMZZ8MMMMMMMMMMZZZMMMMMMMMMM$$$MMMMMMMMMM$$MMM' + '\n'
+ 'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM. MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' + '\n'
+ 'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM' + '\n'
+ 'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM';

console.log('Server Start complete' + '\n' + '\n' + '\n' + kivaString);