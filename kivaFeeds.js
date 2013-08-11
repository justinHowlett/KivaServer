var newestLoansBaseUrl       = "http://api.kivaws.org/v1/loans/newest.json";
var numberOfNewestLoans      = 20
var kivaAppId                = "com.justinhowlett.kiva";
var msPerDay                 = 86400000;
var newestcacheLengthDays    = 1; 

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

exports.NewestRequest = NewestRequest;