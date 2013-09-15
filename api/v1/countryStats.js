var s3Feeds = require('./s3Feeds.js');
var common = require('../../common.js');
var dbControl = require('../../dbControl.js');

var wbIndicators = ['SP.POP.TOTL','SL.UEM.TOTL.ZS','NY.GDP.MKTP.KD.ZG','NY.GDP.PCAP.CD','SE.SEC.ENRR','SE.ADT.1524.LT.ZS','SH.DYN.MORT','EG.ELC.ACCS.ZS','SL.TLF.0714.WK.MA.ZS','SL.TLF.0714.WK.MA.ZS','IS.ROD.PAVE.ZS','SP.DYN.LE00.IN','SH.TBS.INCD','SH.STA.MALN.ZS','SP.DYN.LE00.IN','SH.TBS.INCD','SH.STA.MALN.ZS','SH.DYN.AIDS.ZS','SH.MLR.INCD'];
var worldBankBaseURL            = 'http://api.worldbank.org/countries/';
var worldBankIndicatorsEndpoint = '/indicators/';
var defaultDataRange 			      = '2010:2010';
var msPerDay 				            = 86400000;
var cacheLengthDays				      = 10; 

var CountryRequest = {

  makeRequest: function (request,serverResponse,countryCode,inlineImage,cache,database,callback) {

    var collection = database.collection(common.countryDetailsCollection);
    collection.find({'countryCode':countryCode}).nextObject(function(err, doc) {            
        
        console.log("caching country response at "+request.url);
        var jsonResponse = JSON.stringify(doc);
        cache.put(request.url, doc); //store in api response
        
        if (serverResponse != null){
              serverResponse.end(jsonResponse);
        }
    });
  }

};


var CountryConstruct = {
  
  createCountry: function (countryCode,callback) {

    //pass the country as the param for callback
    var completedRequests = 0;
    var concatResponse = [];

    for (var i in wbIndicators){

      var indicator  = wbIndicators[i];
      var requestUrl = worldBankBaseURL+countryCode+worldBankIndicatorsEndpoint+indicator+'?date='+defaultDataRange+'&format=json';
      var wbRequest = require('request');
   
      wbRequest(requestUrl, function(error, response, body) {
      

        var indicatorResponseObject = JSON.parse(body);
        //indicatorResponseObject[0]; is paging info, to be discarded
        //indicatorResponseObject[1]; is the actual indicator response
        var indicatorResponse = indicatorResponseObject[1];

        concatResponse.push(indicatorResponse);
        completedRequests ++;
        
        if (completedRequests == wbIndicators.length-1){

          var countryName = common.kivaSupportedCountries[countryCode];
          //get background image and associated info from S3 in form of an Object 
          s3Feeds.makeRequestsForCountry(countryName,countryCode,false,function(country){
            var country = {countryCode: countryCode, countryShape: 'not supported', countryImage: country.countryImage, indicators: concatResponse, countryDescription: country.countryDescription, name: country.countryName};
            callback(country);
         });
          
        }
        
      });
    }
  }

}

exports.CountryConstruct = CountryConstruct;
exports.CountryRequest = CountryRequest;