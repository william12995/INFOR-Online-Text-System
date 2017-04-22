

//var mongodb = require('./db');
// var fs = require('fs');
var pdfParser = require("pdf2json");

var fs = require('fs');
var mongoose = require('mongoose');

var txtSchema = new mongoose.Schema({
  name: String,
  post: Array,
  ans: Array,
  subject: String
}, {
  collection: 'txt'
});

var txtModel = mongoose.model('Txt', txtSchema);

function TXT(filename, ansname, subject) {
  this.name = filename;
  this.ans = ansname;
  this.post = [];
  this.subject = subject;
}
;


module.exports = TXT;




TXT.prototype.SaveEnglish = function(filename, callback) {
  filename = "./public/images/" + filename + ".txt";

  //console.log(filename);


  fs.readFile(filename, 'utf8', (err, data) => {
    if (err)
      throw err;
    var TxtData_2 = data;

    TxtData_2 = TxtData_2.split(/-+Page \([\d+]\) Break-+/).join();
    var extract = /10\s*\d[\s\S]*?-\s*.\s*-|第\s*\d\s*頁[\s\S]*?-\s*.\s*-|。|大[\s\S]*?算|二[\s\S]*?算|三[\s\S]*?算|四[\s\S]*?算|第貳[\s\S]*/g;
    TxtData_2 = TxtData_2.replace(extract, "");
    //console.log(TxtData_2);

    var extract_one = /(\d*\s*\d+\.[\s\S]*?\(\s*D\s*\)\s*.+)/g;


    var txt_1 = TxtData_2.split(extract_one);
    for (var i = 0; i <= 14; i++) {
      txt_1[i] = txt_1[2 * i + 1];
    }
    txt_1 = txt_1.slice(0, 15);
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

    var AllData = txt_1.concat(txt_16, txt_20, txt_26, txt_30, txt_41, txt_45, txt_49, txt_53);

    //this.post = AllData;
    console.log("this.name: " + this.name);
    EnglishAnswer(this.name, this.ans, this.subject, AllData);

    fs.writeFile(filename, AllData);
    console.log("Extract Done\n");

    callback(null);
  });
}


TXT.prototype.SaveChinese = function(filename, callback) {
  filename = "./public/images/" + filename + ".txt";
  //console.log(filename);


  fs.readFile(filename, 'utf8', (err, data) => {
    if (err)
      throw err;

    var TxtData_2 = data;

    var extract = /10\s*\d+\s*年[\s\S]*?-\s*.\s*-|第[\s+\d+\s+]*?頁|二\s*、[\s\S]*?算。|第\s*壹[\s\S]*?算\s*。|第\s*貳[\s\S]*|-+Page \([\d+]\) Break-+|大學入\s*[\s\S]*?-\s*.\s*-/g;
    TxtData_2 = TxtData_2.replace(extract, "");

    var extract_2 = /(\d+-\d+為題組[\s\S]*?\(\s*D\s*\)[\s\S]*?\(\s*D\s*\)\D+)|(\d*\s*\d*\s*\.[\s\S]*?\(\s*D\s*\)\s*[\s\S]*?\D+)/g;

    let m;
    var AllData = [];
    while ((m = extract_2.exec(TxtData_2)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === extract_2.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      AllData.push(m[0]);
      console.log(AllData);
    }

    ChineseAnswer(this.name, this.ans, this.subject, AllData);

    fs.writeFile(filename, AllData);

    console.log("Extract Done\n");
    callback(null);

  });
}



TXT.prototype.SaveMath = function(filename, callback) {
  filename = "./public/images/" + filename + ".txt";
  //console.log(filename);


  fs.readFile(filename, 'utf8', (err, data) => {
    if (err)
      throw err;

    var TxtData_2 = data;

    // var extract = /10\s*\d+\s*年[\s\S]*?-\s*.\s*-|第[\s+\d+\s+]*?頁|二\s*、[\s\S]*?算。|第\s*壹[\s\S]*?算\s*。|第\s*貳[\s\S]*|-+Page \([\d+]\) Break-+|大學入\s*[\s\S]*?-\s*.\s*-/g;
    // TxtData_2 = TxtData_2.replace(extract, "");

    console.log(TxtData_2);

    fs.writeFile(filename, TxtData_2);

    console.log("Extract Done\n");

  });
}


TXT.prototype.SaveScience = function(filename, callback) {
  filename = "./public/images/" + filename + ".txt";
  //console.log(filename);


  fs.readFile(filename, 'utf8', (err, data) => {

    if (err)
      throw err;

    var TxtData_2 = data;

    var extract = /10\s*\d+\s*年[\s\S]*?-\s*.*\s*-\s|第[\s+\d+\s+]*?頁|二\s*、[\s\S]*?算。|三\s*、[\s\S]*?算。|第\s*壹[\s\S]*?算\s*。|第\s*貳[\s\S]*?計\s*。|-+Page \([\d]*\) Break-+|大學入\s*[\s\S]*?-\s*.\s*-|單選[\s\S]*?算\s*。/g;
    TxtData_2 = TxtData_2.replace(extract, "");



    //console.log(TxtData_2);

    fs.writeFile(filename, TxtData_2);

    console.log("Extract Done\n");

  });
}


TXT.prototype.SaveSocial = function(filename, callback) {
  filename = "./public/images/" + filename + ".txt";
  //console.log(filename);


  fs.readFile(filename, 'utf8', (err, data) => {
    if (err)
      throw err;

    var TxtData_2 = data;

    var extract = /10\s*\d+\s*年[\s\S]*?-\s*.*\s*-\s|第[\s+\d+\s+]*?頁|二\s*、[\s\S]*?算。|第\s*壹[\s\S]*?算\s*。|第\s*貳[\s\S]*|-+Page \([\d]*\) Break-+|大學入\s*[\s\S]*?-\s*.\s*-|單選[\s\S]*?算\s*。/g;
    TxtData_2 = TxtData_2.replace(extract, "");

    var extract_2 = /(\d+-\d+為題組[\s\S]*?\(\s*D\s*\)[\s\S]*?\(\s*D\s*\)\D+)|(\d*\s*\d*\s*\.[\s\S]*?\(\s*D\s*\)\s*[\s\S]*?\D+\s+)/g;

    let m;
    var AllData = [];
    while ((m = extract_2.exec(TxtData_2)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === extract_2.lastIndex) {
        extract_2.lastIndex++;
      }
      AllData.push(m[0]);
    }

    SocialAnswer(this.name, this.ans, this.subject, AllData);

    fs.writeFile(filename, AllData);

    console.log("Extract Done\n");
    callback(null);
  });
}


TXT.get = function(name, callback) {

  txtModel.findOne({
    name: name
  }, function(err, data) {
    if (err) {
      console.log(err);
      return callback(err)
    }
    callback(null, data);
  });
};

TXT.compare = function(filename, user_ans, callback) {
  txtModel.findOne({
    name: filename
  }, function(err, doc) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    var result = Object.keys(user_ans).map(function(e) {

      if (user_ans[e].length > 1) {
        var merge = '';
        for (var i = 0; i < user_ans[e].length; i++) {
          merge = merge + user_ans[e][i];
        }
        user_ans[e] = merge;
      }
      return user_ans[e];
    });

    //console.log(doc.ans);
    //console.log(result);
    var error_ans = [];
    //if (result.length != doc.ans.length) callback('Array Length Error');
    for (var i = 0; i < doc.ans.length; i++) {
      if (result[i] !== doc.ans[i]) {
        error_ans.push(i);
      }
    }
    //console.log(error_ans);
    //console.log(docs + "321");
    callback(null, error_ans);
  });
}

TXT.getList = function(name, callback) {
  var query = name;

  txtModel.find(query).sort({
    time: -1,
  }).exec(function(err, docs) {
    if (err) {
      return callback(err);
    }
    //console.log(docs + "321");
    callback(null, docs);
  });
}


TXT.edit = function(filename, p, post, ans, callback) {

  txtModel.findOne({
    name: filename
  }, function(err, data) {
    data.post[p] = post ;
    var newpost = data.post;

    txtModel.update({
      "name": filename
    }, {
      $set: {
        "post": newpost,
        "ans": ans
      }
    }, function(err) {
      if (err) {
        return callback(err);
      }
      callback(null);
    });

  });
};

TXT.remove = function(filename, p, callback) {

  txtModel.findOne({
    name: filename
  }, function(err, data) {
    console.log("p: " + p);
    data.post.splice(p, 1);
    var newpost = data.post;
    console.log(newpost);
    var ans = data.ans
    txtModel.update({
      "name": filename
    }, {
      $set: {
        "post": newpost,
        "ans": ans
      }
    }, function(err) {
      if (err) {
        return callback(err);
      }
      callback(null);
    });

  });
};

var EnglishAnswer = function(txtname, ansname, subject, postData) {
  var filename = "./public/images/" + ansname + ".txt";
  //console.log(filename);


  fs.readFile(filename, 'utf8', (err, data) => {
    if (err)
      throw err;

    var TxtData_2 = data;

    var extract = /10+[\s\S]*?案|題號 答案|-+Page\s*\([\d]\)\s*Break-+/g;
    var extract_2 = /([A-Z])/g;
    TxtData_2 = TxtData_2.replace(extract, "");

    let m;
    var AllData = [];
    var one = [];
    var two = [];
    var three = [];
    while ((m = extract_2.exec(TxtData_2)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === extract_2.lastIndex) {
        extract_2.lastIndex++;
      }
      AllData.push(m[0]);
    }
    //console.log(TxtData_2);

    for (var i = 0; i < 48; i++) {
      if (i % 3 == 0) one.push(AllData[i]);
      if (i % 3 == 1) two.push(AllData[i]);
      if (i % 3 == 2) three.push(AllData[i]);
    }

    for (var i = 48; i < 56; i++) {
      if (i % 2 == 0) one.push(AllData[i]);
      if (i % 2 == 1) two.push(AllData[i]);
    }
    AllData = one.concat(two, three);
    //console.log("AllData: "+AllData);

    var content = {
      name: txtname,
      post: postData,
      ans: AllData,
      subject: subject
    };

    console.log(content);
    var newTxt = new txtModel(content);

    newTxt.save(function(err) {
      if (err) {
        console.log(err);
        return;
      }
    });

    fs.writeFile(filename, TxtData_2);

    console.log("Extract answer Done\n");
    return;

  });
}

var ChineseAnswer = function(txtname, ansname, subject, postData) {
  var filename = "./public/images/" + ansname + ".txt";
  //console.log(filename);


  fs.readFile(filename, 'utf8', (err, data) => {
    if (err)
      throw err;

    var TxtData_2 = data;

    var extract = /10+[\s\S]*?[答案]+|題號 答案|-+Page\s*\([\d]\)\s*Break-+/g;
    var extract_2 = /([A-Z])+/g;
    TxtData_2 = TxtData_2.replace(extract, "");

    let m;
    var AllData = [];
    var one = [];
    var two = [];
    while ((m = extract_2.exec(TxtData_2)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === extract_2.lastIndex) {
        extract_2.lastIndex++;
      }
      AllData.push(m[0]);
    }
    //console.log(TxtData_2);

    for (var i = 0; i < 6; i++) {
      if (i % 2 == 0) one.push(AllData[i]);
      if (i % 2 == 1) two.push(AllData[i]);

    }

    for (var i = 6; i < 23; i++) {
      one.push(AllData[i]);
    }
    AllData = one.concat(two);
    //console.log("AllData: "+AllData);

    var content = {
      name: txtname,
      post: postData,
      ans: AllData,
      subject: subject
    };

    //console.log(content);
    var newTxt = new txtModel(content);

    newTxt.save(function(err) {
      if (err) {
        console.log(err);
        return;
      }
    });

    fs.writeFile(filename, TxtData_2);

    console.log("Extract answer Done\n");
    return;

  });
}

var SocialAnswer = function(txtname, ansname, subject, postData) {
  var filename = "./public/images/" + ansname + ".txt";
  //console.log(filename);


  fs.readFile(filename, 'utf8', (err, data) => {
    if (err)
      throw err;

    var TxtData_2 = data;

    var extract = /10+[\s\S]*?案|題號 答案|-+Page\s*\([\d]\)\s*Break-+/g;
    var extract_2 = /([A-Z])/g;
    TxtData_2 = TxtData_2.replace(extract, "");

    let m;
    var AllData = [];
    var one = [];
    var two = [];
    var three = [];
    var four = [];
    while ((m = extract_2.exec(TxtData_2)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === extract_2.lastIndex) {
        extract_2.lastIndex++;
      }
      AllData.push(m[0]);
    }
    //console.log(TxtData_2);

    for (var i = 0; i < 48; i++) {
      if (i % 4 == 0) one.push(AllData[i]);
      if (i % 4 == 1) two.push(AllData[i]);
      if (i % 4 == 2) three.push(AllData[i]);
      if (i % 4 == 3) four.push(AllData[i]);
    }

    for (var i = 48; i < 72; i++) {
      if (i % 3 == 0) one.push(AllData[i]);
      if (i % 3 == 1) two.push(AllData[i]);
      if (i % 3 == 2) three.push(AllData[i]);
    }
    AllData = one.concat(two, three, four);
    //console.log("AllData: "+AllData);

    var content = {
      name: txtname,
      post: postData,
      ans: AllData,
      subject: subject
    };

    //console.log(content);
    var newTxt = new txtModel(content);

    newTxt.save(function(err) {
      if (err) {
        console.log(err);
        return;
      }
    });

    fs.writeFile(filename, TxtData_2);

    console.log("Extract answer Done\n");
    return;

  });
}
