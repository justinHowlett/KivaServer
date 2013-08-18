KivaServer
==========

This API serves to proxy, cache and optimize responses from Kiva.org and the World Bank API for use within the Kiva Easy Lend iPhone app.

API Methods:

<Base URL>/countries/?countrycode=ca

Server Organization:

main.js runs the following on start:

-Naive script-live cron jobs within taskScheduler.js
  -Kiva's newest loans are requested and cached, scheduled every night at midnight EST
  -All country requests are made and cached for the length of the script 
  
-Database setup 
  -DBConfig.js runs S3Feeds.js (will expand to handle images)
     -S3Feeds.js runs to validate the file structure on Amazon S3 (where the initial database ingest files are stored)
     -S3Feeds.js then purges the DB and ingests the files into a database to remove the need for an additional network request

-The API is run within main.js where it captures the endpoint and passes the options (if applicable) as well as reference to the global in-memory cache and the server response to the appropriate module.
It is the reponsibility of the chosen module to cache and end the server response.
  -Country development indicators are provided by the World Bank API within countryStats.js
  -Kiva.org caching and proxying is provided by the Kiva.org API within kivaFeeds.js

common.js is provided as a file to contain common in memory data structures such as a list of all countries in which Kiva.org operates.

tests.js is run by nodeunit/Travis-CI as specified in package.json before being deployed to the server 


