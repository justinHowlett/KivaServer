var http  = require('http');
var cache = require('memory-cache');
var url   = require('url');
var tasks = require('./taskScheduler.js');

var dbConfig = require('./dbconfig.js');

/* prepare the cache, cron jobs and database, while also running the test suite */
tasks.scheduleTasks(cache);
dbConfig.configureDatabase()

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
      countryRequest.makeRequest(request,serverResponse,queryString.countrycode,cache);

    }else if (endPoint == '/kiva/newest/'){
      
      var kivaFeeds = require('./kivaFeeds.js');
      var kivaNewestRequest = Object.create(kivaFeeds.NewestRequest);
      kivaNewestRequest.makeRequest(request,serverResponse,cache);

    }else if (endPoint == '/kiva/partners/'){
      
      var kivaFeeds = require('./kivaFeeds.js');
      var queryString = url.parse(request.url, true).query;

      if (queryString){
        var kivaPartnerIdRequest = Object.create(kivaFeeds.PartnerIdRequest);
        kivaPartnerIdRequest.makeRequest(request,serverResponse,cache,queryString.partnerid);
      }else{
        var kivaPartnersRequest = Object.create(kivaFeeds.PartnerRequest);
        kivaPartnersRequest.makeRequest(request,serverResponse,cache);
      }

      
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