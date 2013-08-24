var newestLoansBaseUrl       = "http://api.kivaws.org/v1/loans/newest.json";
var partnersBaseUrl          = "http://api.kivaws.org/v1/partners.json";
var numberOfNewestLoans      = 20
var kivaAppId                = "com.justinhowlett.kiva";
var msPerDay                 = 86400000;
var newestcacheLengthDays    = 1; 
var partnerCacheLengthDays   = 10;

var newestRequest = {
  
  makeRequest: function (request,serverResponse,cache,callback) {
  
    var requestUrl = newestLoansBaseUrl+'?app_id='+kivaAppId+'&per_page='+numberOfNewestLoans;
    var wbRequest = require('request');
 
    wbRequest(requestUrl, function(error, response, body) {

      cache.put(request.url, body, newestcacheLengthDays*msPerDay); 

      if (callback){
          callback();
      }
      
      if (serverResponse != null){
          serverResponse.end(body);
      }
      
    });
  }
};

var partnersRequest = {
  
  makeRequest: function (request,serverResponse,cache,callback) {

    var requestUrl = partnersBaseUrl+'?app_id='+kivaAppId;
    var partnerRequest = require('request');
 
    partnerRequest(requestUrl, function(error, response, body) {
      
      cache.put(request.url, body, partnerCacheLengthDays*msPerDay); 
      
      if (callback){
          callback();
      }
    
      if (serverResponse != null){
          serverResponse.end(body);
      }
      
    });
  }
};

var partnerIdRequest = {
  
  makeRequest: function (request,serverResponse,cache,partnerId,callback) {

    var requestUrl = partnersBaseUrl+'?app_id='+kivaAppId;
    var partnerRequest = require('request');
    partnerRequest.test = request.url;
 
    partnerRequest(requestUrl, function(error, response, body) {
      
      var fullResponse = JSON.parse(body);
      var individualPartnerJson;

      for (var i in fullResponse['partners']){
       
        var partner = fullResponse['partners'][i];

        var tempPartnerId = partnerId;
        if (partner['id'] == partnerId){
           individualPartnerJson = JSON.stringify(partner);
        }
      }
      
      cache.put(request.url, individualPartnerJson, partnerCacheLengthDays*msPerDay); 
   
      if (callback){
          callback();
      }
      
      if (serverResponse != null){
          serverResponse.end(individualPartnerJson);
      }
      
    });
  }
};

exports.partnerIdRequest  = partnerIdRequest;
exports.partnersRequest   = partnersRequest;
exports.newestRequest     = newestRequest;