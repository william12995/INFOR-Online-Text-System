

//var mongodb = require('./db');
// var fs = require('fs');
var pdfParser = require("pdf2json");

var fs = require('fs');
var mongoose = require('mongoose');

var txtSchema = new mongoose.Schema({
			name: String,
			post: String,
},{
	collection: 'txt'
});

var txtModel = mongoose.model('Txt',txtSchema);

function TXT(filename) {
	this.name = filename;
};

module.exports = TXT;




TXT.prototype.SaveEnglish = function(filename, callback){
	filename = "./public/images/"+filename +".txt";

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

		var newTxt = new txtModel(content);

		newTxt.save(function(err){
			if(err){
				return callback(err);
			}
			callback(null, AllData.length);
		});

	  fs.writeFile(filename, AllData);

	  console.log("Extract Done\n");

	 });
}


TXT.prototype.SaveChinese = function(filename, callback){
	filename = "./public/images/"+filename +".txt";
	//console.log(filename);


	fs.readFile(filename, 'utf8', (err, data) => {
	  if (err) throw err;

	  var TxtData_2 = data ;

	  var extract = /10\s*\d+\s*年[\s\S]*?-\s*.\s*-|第[\s+\d+\s+]*?頁|二\s*、[\s\S]*?算。|第\s*壹[\s\S]*?算\s*。|第\s*貳[\s\S]*|-+Page \([\d+]\) Break-+|大學入\s*[\s\S]*?-\s*.\s*-/g;
	  TxtData_2 = TxtData_2.replace(extract, "");

	  var extract_2 = /([\d*\s*\d*\s*-\s*\d\s*\d*\d*\s*\d+\s*\.\s\S]*?\(\s*D\s*\)\s*[\s\S]*?\D+)/g;
	  TxtData_2 = TxtData_2.split(extract_2);

	  for (var i = 0; i < TxtData_2.length; i++) {
	  	TxtData_2[i] = TxtData_2[2*i+1];
	  }
	  TxtData_2 = TxtData_2.slice(0,23);

	  //console.log(TxtData_2);
	  var content = {
		name: this.name,
		post: TxtData_2
	};

	var newTxt = new txtModel(content);

	newTxt.save(function(err){
		if(err){
			return callback(err);
		}
		callback(null, AllData.length);
	});

	  fs.writeFile(filename, TxtData_2);

	  console.log("Extract Done\n");

	 });
}



TXT.prototype.SaveMath = function(filename, callback){
	filename = "./public/images/"+filename +".txt";
	//console.log(filename);


	fs.readFile(filename, 'utf8', (err, data) => {
	  if (err) throw err;

	  var TxtData_2 = data ;

	  // var extract = /10\s*\d+\s*年[\s\S]*?-\s*.\s*-|第[\s+\d+\s+]*?頁|二\s*、[\s\S]*?算。|第\s*壹[\s\S]*?算\s*。|第\s*貳[\s\S]*|-+Page \([\d+]\) Break-+|大學入\s*[\s\S]*?-\s*.\s*-/g;
	  // TxtData_2 = TxtData_2.replace(extract, "");





	  console.log(TxtData_2);

	  fs.writeFile(filename, TxtData_2);

	  console.log("Extract Done\n");

	 });
}


TXT.prototype.SaveScience = function(filename, callback){
	filename = "./public/images/"+filename +".txt";
	//console.log(filename);


	fs.readFile(filename, 'utf8', (err, data) => {

	    if (err) throw err;

	    var TxtData_2 = data ;

	    var extract = /10\s*\d+\s*年[\s\S]*?-\s*.*\s*-\s|第[\s+\d+\s+]*?頁|二\s*、[\s\S]*?算。|三\s*、[\s\S]*?算。|第\s*壹[\s\S]*?算\s*。|第\s*貳[\s\S]*?計\s*。|-+Page \([\d]*\) Break-+|大學入\s*[\s\S]*?-\s*.\s*-|單選[\s\S]*?算\s*。/g;
	    TxtData_2 = TxtData_2.replace(extract, "");





	    //console.log(TxtData_2);

	    fs.writeFile(filename, TxtData_2);

	    console.log("Extract Done\n");

	 });
}


TXT.prototype.SaveSocial = function(filename, callback){
	filename = "./public/images/"+filename +".txt";
	//console.log(filename);


	fs.readFile(filename, 'utf8', (err, data) => {
	  if (err) throw err;

	  var TxtData_2 = data ;

	  var extract = /10\s*\d+\s*年[\s\S]*?-\s*.*\s*-\s|第[\s+\d+\s+]*?頁|二\s*、[\s\S]*?算。|第\s*壹[\s\S]*?算\s*。|第\s*貳[\s\S]*|-+Page \([\d]*\) Break-+|大學入\s*[\s\S]*?-\s*.\s*-|單選[\s\S]*?算\s*。/g;
	  TxtData_2 = TxtData_2.replace(extract, "");

	  var extract_2 = /([\d*\s*\d*\s*-\s*\d\s*\d*\d*\s*\d+\s*\.\s\S]*?\(\s*D\s*\)\s*[\s\S]*?\D+)/g;
	  TxtData_2 = TxtData_2.split(extract_2);

	  for (var i = 0; i < TxtData_2.length; i++) {
	  	TxtData_2[i] = TxtData_2[2*i+1];
	  }
	  TxtData_2 = TxtData_2.slice(0,72);


	  //console.log(TxtData_2);

	  var content = {
		name: this.name,
		post: TxtData_2
	};

	var newTxt = new txtModel(content);

	newTxt.save(function(err){
		if(err){
			return callback(err);
		}
		callback(null, AllData.length);
	});


	  fs.writeFile(filename, TxtData_2);

	  console.log("Extract Done\n");

	 });
}


TXT.get = function(name ,callback){

		txtModel.findOne({
			name: name
		},function(err , data){
			if(err){
				return callback(err)
			}
			callback(null, data);
		});


};


TXT.edit = function(filename, p, post,callback){

			txtModel.findOne({
				name: filename
			},function(err , data){
				data.post[p] = post ;

				var newpost = data.post ;

				txtModel.update({
					"name": filename
				},{$set:{"post" : newpost}
				},function(err){
					if(err){
						return callback(err);
					}
					callback(null);
				});

			});
};
