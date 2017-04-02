var LOG = require("./lib/LOG.js").toggle(false);
var PdfReader = require("./index.js").PdfReader;
var Rule = require("./Rule.js");
var fs = require('fs');

function PDF(filename) {
  this.name = filename;
};

module.exports = PDF;

function printRawItems(filename, callback){
  var pdf = new PdfReader(this,1);
  pdf.parseFileItems(filename, function(err, item){
    //console.log(item);
    if (err)
      callback(err);
    else if (!item)
      callback();
    else if (item.file)
      console.log("file =", item.file.path);
    else if (item.page)
      console.log("page =", item.page);
    else if (item.x){
      //console.log([item.x, item.y, item.oc, item.A, Math.floor(item.w), item.text].join("\t"));
    
    //console.log([item.text].join("\t"));
     
        
    }else
      console.warn(item);
  });

  
}

function parseData(filename, callback){
  function displayValue(value){

    var name = filename.split(".")[1];
    console.log(name+"YOU");

    fs.writeFile("."+ name + ".txt", value);
    console.log('It saved');

    console.log("extracted value:", value);
  }
  function displayTable(table){
    for (var i=0; i<table.length; ++i)
      console.log(table[i].join("\t"));
  }
  var rules = [
    //Rule.on(/[^\u4E00-\u9FA5]/).extractRegexpValues().then(displayValue),
    Rule.on(/[\u4E00-\u9FA5。－：-]/g).accumulateFromSameX().then(displayValue),
    //Rule.on(/^[\u4e00-\u9fa5]/).parseNextItemValue().then(displayValue),
    //Rule.on(/^[\u4e00-\u9fa5]/).parseTable(3).then(displayTable),
    //Rule.on(/[\u4E00-\u9FA5。－：-]/).accumulateAfterHeading().then(displayValue),
    //Rule.on(/\n/).accumulateAfterHeading().then(displayValue),
  ];
  var processItem = Rule.makeItemProcessor(rules);
  var pdf = new PdfReader();
  pdf.parseFileItems(filename, function(err, item){
    if (err)
      callback(err);
    else {
      processItem(item);
      if (!item)
        callback(err, item);

    }
  });

  
}


PDF.prototype.convert = function(filename){
//var filename = process.argv[2];
var PDFfilename = "./public/images/" + filename + ".pdf";
var TXTfilename = "./public/images/"+filename +".txt";
if (!PDFfilename) {
  console.error("please provide the name of a PDF file");
}
else {
  // console.warn("printing raw items from file:", filename, "...");
  printRawItems(PDFfilename, function(){
    console.warn("done.");
  });
}


  // console.log("\ntest 2: parse values from sample.pdf\n");
  // console.log(PDFfilename);
  // console.log(typeof(filename));
  // parseData(PDFfilename,function(){
  //   console.log("\n done.\n");
  // });  
}
