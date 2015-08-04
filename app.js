/*
dnsimple-sample
Moncho Pena
2015-08-04
*/

//config.js

var config=require('./config.js');

//Dependences
var async = require('async');
var request = require('request');
var fs=require('fs');
var CronJob=require('cron').CronJob;
var dnsimple=require('dnsimple')({ domainToken: config.domainToken })

//Some vars
var domain=config.domain;
var record_id=config.record_id;
var url='http://api.ipify.org';
var filename='ip.txt';
var oldIP='';
var newIP='';
var now = new Date();

//we need update?
var update=0;

//A CronJob every minute
new CronJob('00 * * * * *', function() {

	now = new Date();
  console.log('You will see this message every minute - '+now);

  async.series([

	//first we have a IP?
	function(next) {
		fs.exists(filename, function(exists) {
		  if (exists) {
		    oldIP=fs.readFileSync(filename, 'utf8');
		    next();
		  } else {
				console.log('No file');
		    next();
		  }
		});
	},

	function(next) {
		request(url, function (err, response, body) {
			if (!err && response.statusCode == 200) {
	    		newIP=body;
				next();
	  		} else {
		  		if (response.statusCode != 200) {
			  		next('Bad code: '+response.statusCode);
		  		} else {
			  		next(err);
		  		}
	  		}
		});
	},

	function(next) {
		if ( newIP!=='' && ((newIP!==oldIP) || oldIP=='')) {
			fs.writeFile(filename, newIP, function(err) {
				if (err) {
					next(err);
				} else {
					console.log('Writing file');
					update=1;
					next();
				}
			});
		} else {
			update=0;
			console.log('Same IP');
			next();
		}
	},

	function(next) {
		if ( update===1 ) {
			console.log('oldIP: '+oldIP);
			console.log('newIP: '+newIP);
			var input = {
			  record: {
			    content: newIP
			  }
			};
			//updating
			dnsimple ('PUT', '/domains/'+domain+'/records/'+record_id, input, function (err, data) {
				if (err) {
					next(err);
				} else {
					console.log ('Record \'%s\' update for %s', data.record.name, data.record.domain_id);
					next();
				}
			});
		} else {
			next();
		}
	}

	], function(err) {
		if (err) {
			fs.appendFile('log.txt', err+'\n', function () {
			 console.log('Error!');
			});
		} else {
			console.log('Ok');
		}
	}
);

}, null, true, 'Europe/Berlin');
