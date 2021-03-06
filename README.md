[![Build Status](https://travis-ci.org/justinHowlett/KivaServer.png)](https://travis-ci.org/justinHowlett/KivaServer)

KivaServer
==========

<h3>This API serves to proxy, cache and optimize responses from Kiva.org and the World Bank API for use within the Kiva Easy Lend iPhone app.</h3>

<h3>Base URL</h3>
`justindhowlett-kivaserver.jit.su`

<h3>API Methods:</h3>

GET Country Statistics:
`<Base URL>/countries/?countrycode=ZM&base64=true`
<br/> (base 64 is optional and includes the provided country image as inline base64 instead of a link)


GET Kiva's Newest Loans:
`<Base URL>/kiva/newest/`

GET Kiva's Status:
`<Base URL>/kiva/stats/`

GET Kiva.org all partners 
`<Base URL>/kiva/partners/`

GET Kiva.org partner by id
`<Base URL>/kiva/partners/?partnerid=16`

<h2>Server Organization:</h2>

<h3>main.js runs the following on start:</h3>

<h3>Cron jobs</h3>
Naive script-live cron jobs within taskScheduler.js
  -Kiva stats, newest loans and partner requests are requested and cached, scheduled every night at midnight EST
  -All country requests are made and cached for the length of the script 
  
<h3>Database setup</h3>
Although some references to a database exist they are currently disabled. This functionality will roll out as required.

<h3>API</h3>
The API version is captured within main.js where it then forwards the request and response to the appropriate version. The version of the api then sends the endpoint and passes the options (if applicable) as well as reference to the global in-memory cache and the server response to the appropriate module.
It is the reponsibility of the chosen module to cache and end the server response.
  -Country development indicators are provided by the World Bank API within countryStats.js
  -Kiva.org caching and proxying is provided by the Kiva.org API within kivaFeeds.js

common.js is provided as a file to contain common in memory data structures such as a list of all countries in which Kiva.org operates.

<h2>CI and Unit Testing</h2>
tests.js is run by nodeunit/Travis-CI as specified in package.json before being deployed to the server 


