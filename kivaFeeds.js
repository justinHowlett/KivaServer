var newestLoansBaseUrl       = "http://api.kivaws.org/v1/loans/newest.json";
var partnersBaseUrl          = "http://api.kivaws.org/v1/partners.json";
var numberOfNewestLoans      = 20
var kivaAppId                = "com.justinhowlett.kiva";
var msPerDay                 = 86400000;
var newestcacheLengthDays    = 1; 
var partnerCacheLengthDays   = 10;

var NewestRequest = {
  
  makeRequest: function (request,serverResponse,cache) {
  
    var requestUrl = newestLoansBaseUrl+'?app_id='+kivaAppId+'&per_page='+numberOfNewestLoans;
    var wbRequest = require('request');
 
    wbRequest(requestUrl, function(error, response, body) {

      cache.put(request.url, body, newestcacheLengthDays*msPerDay); 
    
      if (serverResponse != null){
          serverResponse.end(body);
      }
      
    });
  }
};

var PartnersRequest = {
  
  makeRequest: function (request,serverResponse,cache) {
  
    var requestUrl = partnersBaseUrl+'?app_id='+kivaAppId;
    var wbRequest = require('request');
 
    wbRequest(requestUrl, function(error, response, body) {
      console.log('partners: '+body);
      cache.put(request.url, body, partnerCacheLengthDays*msPerDay); 
    
      if (serverResponse != null){
          serverResponse.end(body);
      }
      
    });
  }
};

var PartnerIdRequest = {
  
  makeRequest: function (request,serverResponse,cache,partnerId) {
  
    var requestUrl = partnersBaseUrl+'?app_id='+kivaAppId;
    var wbRequest = require('request');
 
    wbRequest(requestUrl, function(error, response, body) {
      
      var fullResponse = JSON.parse(body);
      var individualPartnerJson;

      for (var i in fullResponse['partners']){
        var partner = fullResponse['partners'][i];

        if (partner['id'] == partnerId){
           individualPartnerJson = JSON.stringify(partner);
        }
      }
      
      console.log('indie is ' +individualPartnerJson);
      
      cache.put(request.url, individualPartnerJson, partnerCacheLengthDays*msPerDay); 
    
      if (serverResponse != null){
          serverResponse.end(individualPartnerJson);
      }
      
    });
  }
};

exports.PartnerIdRequest  = PartnerIdRequest;
exports.PartnersRequest   = PartnersRequest;
exports.NewestRequest     = NewestRequest;