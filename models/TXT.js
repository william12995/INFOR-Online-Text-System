

var mongodb = require('./db');
// var fs = require('fs');
var pdfParser = require("pdf2json");

var fs = require('fs');




function TXT(filename) {
	this.name = filename;
};

module.exports = TXT;




TXT.prototype.save = function(filename, callback){
	filename = __dirname + '/public/images/' + filename +".txt";
	//console.log(filename);


	fs.readFile(filename, 'utf8', (err, data) => {
	  if (err) throw err;
	  var TxtData_2 = data ;

	  TxtData_2 = TxtData_2.split(/-+Page \([\d+]\) Break-+/).join();
	  var extract = /10\s*\d[\s\S]*?-\s*.\s*-|第\s*\d\s*頁[\s\S]*?-\s*.\s*-|。|大[\s\S]*?算|二[\s\S]*?算|三[\s\S]*?算|四[\s\S]*?算|第貳[\s\S]*/g;
	  TxtData_2 = TxtData_2.replace(extract, "");
	  //console.log(TxtData_2);

	  var extract_one = /(\d*\s*\d+\.[\s\S]*?\(\s*D\s*\)\s*.+)/g;


	  var txt_1 = TxtData_2.split(extract_one);
	  for (var i = 0; i <=14; i++) {
	  	txt_1[i] = txt_1[2*i+1];
	  }
	  txt_1 = txt_1.slice(0,15);
	  //console.log(one);


	  var pattern = new RegExp("第", "g");
	  var multiple = TxtData_2.split(pattern);

	  var txt_16 = multiple[1];

	  var txt_20 = multiple[2];

	  var txt_26 = multiple[3];

	  var txt_30 = multiple[4];

	  var txt_41 = multiple[5];

	  var txt_45 = multiple[6];

	  var txt_49 = multiple[7];

	  var txt_53 = multiple[8];

	  var AllData = txt_1.concat(txt_16,txt_20,txt_26,txt_30,txt_41,txt_45,txt_49,txt_53);

	  var content = {
		name: this.name,
		post: AllData
	};

	  mongodb.open(function(err , db){
	  	if(err){
	  		return callback(err);
	  	}

	  	db.collection('txt',function(err, collection){
	  		if (err){
	  			mongodb.close();
	  			return callback(err);
	  		}

	  		collection.insert(content,{
	  			safe: true
	  		},function(err){
	  			mongodb.close();
	  			if(err){
	  				return callback(err);
	  			}
	  			callback(null, AllData.length);
	  		});
	  	});
	  });


	  fs.writeFile(filename, AllData);

	  console.log("Extract Done\n");

	 });
}

TXT.get = function(name ,callback){

	mongodb.open(function(err , db){
		if (err){
			return callback(err);
		}
		db.collection('txt',function(err , collection){
			if (err){
				mongodb.close();
				return callback(err);
			}

			collection.findOne({
				name: name
			},function(err , data){
				mongodb.close();
				if(err){
					return callback(err)
				}

				callback(null, data);
			});
		});
	});
};
