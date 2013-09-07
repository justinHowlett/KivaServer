var im    	= require('imagemagick');
var path  	= require('path');
var fs    	= require('fs');
var os 	  	= require('os');
var crypto 	= require('crypto');


var imageProcess = {

	processRequest: function(serverResponse,imageUrl,imageBinary,cache){

		var blurredImage;

		if (imageBinary != null && typeof imageBinary !== 'undefined'){
			blurImage(imageBinary,function(imageData){
				blurredImage = imageData;
				serverResponse.writeHead(200, {'Content-Type': 'image/jpeg'});
  				serverResponse.end(blurredImage);
			});
		}else if (imageUrl != null && typeof imageUrl !== 'undefined'){

			requestSettings = {
           		method: 'GET',
           		uri: imageUrl,
           		encoding: null
    		}
			
			var imageRequest = require('request');
     		imageRequest(requestSettings, function(error, response, body) {

     			if (error){
     				serverResponse.writeHead(500, {'Content-Type': 'image/jpeg'});
  					serverResponse.end();
  					return;
     			}

     			blurImage(body,function(imageData){
					blurredImage = imageData;
					serverResponse.writeHead(200, {'Content-Type': 'image/jpeg'});
	  				serverResponse.end(blurredImage);
				});

     		});
		}
	}
}

function blurImage(imageBinary,callback){
		
		var md5sum = crypto.createHash('md5');
		md5sum.update(imageBinary);
		var md5String = md5sum.digest('hex');
		
		fs.writeFile(path.resolve(__dirname,md5String+'.jpg'), imageBinary, 'binary',function(err){
			im.convert([path.resolve(__dirname, md5String+'.jpg'), '-blur', '0x8','-quality','75%', path.resolve(__dirname, md5String+'blur.jpg')],function(err, metadata){
  				fs.readFile(path.resolve(__dirname,md5String+'blur.jpg'),function(err,data){
  					//clean up
  					fs.unlinkSync(path.resolve(__dirname, md5String+'.jpg'));
  					fs.unlinkSync(path.resolve(__dirname, md5String+'blur.jpg'));
  					callback(data);
  				});
			});
        });
}

exports.imageProcess = imageProcess;