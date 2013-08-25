var http  = require('http');
var cache = require('memory-cache');
var url   = require('url');
var tasks = require('./taskScheduler.js');

var dbControl = require('./dbcontrol.js');

/* prepare the database from S3 files on completion populate the cache and scheduled the cron jobs  */
// dbControl.configureDatabase(function(){
//   console.log('db ready');
// })

tasks.scheduleTasks(cache);

http.createServer(function (request, serverResponse) {

    serverResponse.writeHead(200, {'Content-Type': 'application/json'});

    var cachedItem = cache.get(request.url);
    if (cachedItem){
      console.log('returning cached item for url '+request.url);
    	serverResponse.end(cachedItem);
    	return;
    }

    console.log('missed cached item for url '+request.url);

    var endPoint = url.parse(request.url, true).pathname;

    if (endPoint == '/countries/'){
      
      var country = require('./countryStats.js');
      var queryString = url.parse(request.url, true).query;
      var countryRequest = Object.create(country.CountryRequest);

      console.log('queryString.base64 is '+queryString.base64);
      countryRequest.makeRequest(request,serverResponse,queryString.countrycode,queryString.base64,cache,null);

    }else if (endPoint == '/kiva/newest/'){
      
      var kivaFeeds = require('./kivaFeeds.js');
      var kivaNewestRequest = Object.create(kivaFeeds.newestRequest);
      kivaNewestRequest.makeRequest(request,serverResponse,cache,null);

    }else if (endPoint == '/kiva/partners/'){
      
      var kivaFeeds = require('./kivaFeeds.js');
      var queryString = url.parse(request.url, true).query;

      if (queryString.partnerid != null && typeof queryString.partnerid !== "undefined"){
        //partner by id
        var kivaPartnerIdRequest = Object.create(kivaFeeds.partnerIdRequest);
        kivaPartnerIdRequest.makeRequest(request,serverResponse,cache,queryString.partnerid,null);
      }else{
        //all partners 
        var kivaPartnersRequest = Object.create(kivaFeeds.partnersRequest);
        kivaPartnersRequest.makeRequest(request,serverResponse,cache,null);
      }
  
    }else if (endPoint == '/kiva/stats/'){
      var kivaFeeds = require('./kivaFeeds.js');
      var kivaStatsRequest = Object.create(kivaFeeds.statsRequest);
      kivaStatsRequest.makeRequest(request,serverResponse,cache,null);

    }else if (endPoint == '/loaderio-cd1a021f6ca4d51049205bf21227fe8d/'){
      //auth token for load testing
      serverResponse.end('loaderio-cd1a021f6ca4d51049205bf21227fe8d');

    }else{
      serverResponse.writeHead(404, {'Content-Type': 'application/json'});
      serverResponse.end();
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