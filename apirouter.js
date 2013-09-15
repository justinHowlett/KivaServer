var http  = require('http');
var url   = require('url');

var isListening = false;

// API Versions
var apiV1 = require('./api/v1/apiv1.js')

var Api = {
	
	beginListening: function(cache,database){
		
		http.createServer(function (request, serverResponse) {

			isListening = true;

		    serverResponse.writeHead(200, {'Content-Type': 'application/json'});

		    var cachedContent = cache.get(request.url)

		    if (cachedContent !==null && typeof cachedContent !== 'undefined'){
		      serverResponse.end(JSON.stringify(cachedContent));
		      return;
		    }

		    console.log('missed cached item for url '+request.url);

		    var endPoint = url.parse(request.url, true).pathname;

		    if (endPoint.indexOf("/v1") == 0){
		      //version 1 api request
		      var v1Api = Object.create(apiV1.api);
		      v1Api.handleApiRequest(request,serverResponse,cache,database,endPoint);

		    }else if (endPoint == '/loaderio-cd1a021f6ca4d51049205bf21227fe8d/'){
		      //auth token for load testing
		      serverResponse.end('loaderio-cd1a021f6ca4d51049205bf21227fe8d');

		    }else if (endPoint == '/health-check'){

		    	var apiStatus = {};

		    	if (database != null && cache != null){
		    		apiStatus.status = 'OK';
		    	}else{
		    		serverResponse.writeHead(500, {'Content-Type': 'application/json'});
		    		apiStatus.status = 'fail';
		    	}

		    	serverResponse.end(JSON.stringify(apiStatus));

		    }else{
		      serverResponse.writeHead(404, {'Content-Type': 'application/json'});
		      serverResponse.end();
		    }
	  
		}).listen(process.env.PORT || 8080)
	}

}

exports.Api 		= Api;
exports.isListening = isListening;