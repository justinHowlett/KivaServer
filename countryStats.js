var s3Feeds = require('./s3Feeds.js');
var common = require('./common.js');

var wbIndicators = ['SP.POP.TOTL','SL.UEM.TOTL.ZS','NY.GDP.MKTP.KD.ZG','NY.GDP.PCAP.CD','SE.SEC.ENRR','SE.ADT.1524.LT.ZS','SH.DYN.MORT','EG.ELC.ACCS.ZS','SL.TLF.0714.WK.MA.ZS','SL.TLF.0714.WK.MA.ZS','IS.ROD.PAVE.ZS','SP.DYN.LE00.IN','SH.TBS.INCD','SH.STA.MALN.ZS','SP.DYN.LE00.IN','SH.TBS.INCD','SH.STA.MALN.ZS','SH.DYN.AIDS.ZS','SH.MLR.INCD'];
var worldBankBaseURL            = 'http://api.worldbank.org/countries/';
var worldBankIndicatorsEndpoint = '/indicators/';
var defaultDataRange 			      = '2010:2010';
var msPerDay 				            = 86400000;
var cacheLengthDays				      = 10; 

var CountryRequest = {
  
  makeRequest: function (request,serverResponse,countryCode,cache) {
  
    var completedRequests = 0;
    var concatResponse = [];
    
    for (var i in wbIndicators){

      var indicator  = wbIndicators[i];
      var requestUrl = worldBankBaseURL+countryCode+worldBankIndicatorsEndpoint+indicator+'?date='+defaultDataRange+'&format=json';
      var tempRequestUrl = request.url; //If we access request.url directly it's always the last one in the array.

      var wbRequest = require('request');
   
      wbRequest(requestUrl, function(error, response, body) {
       
        var indicatorResponseObject = JSON.parse(body);
        //indicatorResponseObject[0]; is paging info, to be discarded
        //indicatorResponseObject[1]; is the actual indicator response
        var indicatorResponse = indicatorResponseObject[1];

        concatResponse.push(JSON.stringify(indicatorResponse));
        completedRequests ++;
        
        if (completedRequests == wbIndicators.length-1){

          console.log('request complete for code  '+countryCode);

          // var countryName = common.kivaSupportedCountriesDict[countryCode];
          //get background image and associated info from S3 in form of an Object 
          s3Feeds.makeRequestsForCountry('Albania','AL',function(countryImage){
            concatResponse.unshift(countryImage);

            console.log('country att is '+countryImage.attribution);
            console.log('country link is '+countryImage.link);

            var jsonResponse = JSON.stringify(concatResponse);
            cache.put(tempRequestUrl, jsonResponse); //store forever
          
            console.log('jsonResponse is '+jsonResponse);

            if (serverResponse != null){
              serverResponse.end(jsonResponse);
            }

         });
          
        }
        
      });
    }
  }
};

exports.CountryRequest = CountryRequest;