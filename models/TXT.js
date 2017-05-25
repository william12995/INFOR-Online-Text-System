

//var mongodb = require('./db');
// var fs = require('fs');
var pdfParser = require("pdf2json");

var fs = require('fs');
var mongoose = require('mongoose');

var txtSchema = new mongoose.Schema({
  name: String,
  username: String,
  post: Object,
  ans: Array,
  subject: String,
  choice: Array,
  TextInform: Array,
  UserRank: Array
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

    // var regex_post = /(\d+\.[\s\S]*?)\(\s*A|(第[\s\S]*?)\d+\./g;
    // var regex_ans = /[A-Za-z]\s*\)([\s\S]*?)[\d\.\(\r第]+/g;


    var newtest = {
      test: AllData,
      choice: []
    };

    console.log("this.name: " + this.name);
    EnglishAnswer(this.name, this.ans, this.subject, newtest);

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

    var newtest = {
      test: AllData,
      choice: []
    };

    ChineseAnswer(this.name, this.ans, this.subject, newtest);

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

    var newtest = {
      test: AllData,
      choice: []
    };

    SocialAnswer(this.name, this.ans, this.subject, newtest);

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

TXT.Rankget = function(name, callback) {
  txtModel.findOne({
    name: name
  }, function(err, data) {
    if (err) {
      console.log(err);
      return callback(err)
    }

    var userRank = data.UserRank;

    userRank.sort(function(a, b) {
      return b.correct - a.correct;
    });
    callback(null, userRank, data);
  });
};

TXT.compare = function(filename, user_ans, username, callback) {
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

    var user_error_ans = [];
    var correct_ans = [];

    //if (result.length != doc.ans.length) callback('Array Length Error');
    for (var i = 0; i < doc.ans.length; i++) {
      for (var k = 0; k < doc.ans[i].length; k++) {
        var merge = '';

        for (var j = 0; j < doc.ans[i][k].length; j++) {

          if (doc.ans[i][k].length > 1) {

            merge = merge + doc.ans[i][k][j];

          } else {
            merge = doc.ans[i][k][j]
          }

        }
        correct_ans.push(merge);
      }
    }
    for (var i = 0; i < correct_ans.length; i++) {
      if (result[i] !== correct_ans[i]) {
        user_error_ans.push(i + 1);
      }
    }

    console.log("回答的答案(result): " + result);
    console.log("正確答案(correct_ans): " + correct_ans);
    //console.log("錯的題號(user_error_ans): " + user_error_ans);

    var newresult = [];
    var newcorrect_ans = [];
    for (var i = 0; i < result.length; i++) {

      if (result[i].length > 1) {
        var split = result[i].match(/\d/g);
        newresult.push(split);
      } else {
        var split = result[i].match(/\d/g)[0];
        newresult.push([split]);
      }
      if (correct_ans[i].length > 1) {
        var split_ans = correct_ans[i].match(/\d/g);
        newcorrect_ans.push(split_ans);
      } else {
        var split_ans = correct_ans[i].match(/\d/g)[0];
        newcorrect_ans.push([split_ans]);
      }
    }
    //console.log("newResult: " + JSON.stringify(newresult));
    //console.log("newcorrect_ans: " + JSON.stringify(newcorrect_ans));

    var error_index = [];
    var correct_index = [];
    for (var i = 0; i < newcorrect_ans.length; i++) {
      if (newcorrect_ans[i].length > 1) {
        error_index.push([]);
        correct_index.push([]);
      } else {
        error_index.push([""]);
        correct_index.push([""]);
      }
    }
    for (var i = 0; i < newcorrect_ans.length; i++) {
      var error_flag = true;
      var correct_flag = true;
      if (newcorrect_ans[i].length > 1) {
        //先處理少寫的答案
        for (var k = 0; k < newcorrect_ans[i].length; k++) {
          var index = newresult[i].indexOf(newcorrect_ans[i][k]);
          if (index == -1) {
            error_flag = false;
            error_index[i].push(newcorrect_ans[i][k]);
          } else {
            correct_flag = false;
            correct_index[i].push(newcorrect_ans[i][k]);
          }
        }
        //在處理多寫的答案
        for (var j = 0; j < newresult[i].length; j++) {
          if (newresult[i].length > 1) {
            var index = newcorrect_ans[i].indexOf(newresult[i][j]);
            if (index == -1) {
              error_flag = false;
              error_index[i].push(newresult[i][j]);
            }
          } else {
            var index = newcorrect_ans[i].indexOf(newresult[i][j]);
            if (index == -1) {
              error_flag = false;
              error_index[i].push(newresult[i][j]);
            }
          }
        }

        if (error_flag) {
          error_index[i].push("");
        }
        if (correct_flag) {
          correct_index[i].push("");
        }
      } else {
        if (newcorrect_ans[i][0] !== newresult[i][0]) {
          error_index[i] = newresult[i];
          correct_index[i] = newcorrect_ans[i];
        }
      }
    }
    var newerror_index = [];
    var newcorrect_index = [];
    // console.log("tes.len: " + test[0].length);
    for (var i = 0; i < error_index.length; i++) {
      if (error_index[i][0].length > 0) {
        newerror_index.push(error_index[i]);
        newcorrect_index.push(correct_index[i]);
      }
    }
    // console.log("err_index: " + JSON.stringify(error_index));
    // console.log("correct_index: " + JSON.stringify(correct_index));
    console.log("newerr_index: " + JSON.stringify(newerror_index));
    console.log("newcorrect_index: " + JSON.stringify(newcorrect_index));
    var allsum_array = []; //每個大題的小題數的陣列
    var big_array = []; //錯在第幾大題
    var small_array = []; //第幾大題裡的第幾小題
    for (var i = 0; i < doc.choice.length; i++) {
      allsum_array.push(doc.choice[i].length);
    }
    //console.log("每個大題裡的小題數(allsum_array): " + allsum_array);

    user_error_ans.forEach(function(error_sum) {
      var allsum = 0;
      var check_i = 0;
      while (error_sum > allsum) {
        // console.log("error_sum: " + error_sum);
        // console.log("allsum: " + allsum);
        allsum = allsum + allsum_array[check_i];
        check_i = check_i + 1;
      }
      if (error_sum == 1) {
        big_array.push(check_i);
        small_array.push(0);
      } else {
        big_array.push(check_i);
        var sum = allsum - error_sum;
        var final = (allsum_array[check_i - 1] - sum - 1);
        small_array.push(final);
      }
    })
    var ans_sum = correct_ans.length; //ans_sum 是總小題數
    var date = new Date();

    var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    var userrank = {
      username: username,
      testsum: ans_sum,
      correct: ans_sum - user_error_ans.length,
      day: time
    }
    txtModel.update({
      "name": filename
    }, {
      $push: {
        "UserRank": userrank,
      }
    }, function(err) {
      if (err) {
        return callback(err);
      }
    });
    console.log("big_array: " + big_array);
    console.log("small_array: " + small_array);
    callback(null, user_error_ans, small_array, big_array, allsum_array, newerror_index, newcorrect_index, ans_sum, doc);
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
    data.post.test[p] = post ;

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

TXT.testedit = function(filename, p, post, ans, ans_array, TextInform, callback) {

  txtModel.findOne({
    name: filename
  }, function(err, data) {
    var anskey = Object.keys(ans);
    // console.log("ans: " + JSON.stringify(ans));
    // console.log(anskey);
    // console.log("p: " + p);
    // console.log("data.post: " + data.post);
    data.post.test[p] = post ;
    if (data.choice[p].length > 1) {
      for (var i = 0; i < data.choice[p].length; i++) {

        Object.keys(data.post.choice[p][i]).forEach(function(key, index) {
          //console.log(typeof (ans[anskey[index]]));
          if ((ans[anskey[index]]).length > 1) {
            //console.log("ans value: " + ans[anskey[index]][i]);
            data.post.choice[p][i][key] = ans[anskey[index]][i];
          } else {
            //console.log("ans single value: " + ans[anskey[index]]);
            data.post.choice[p][i][key] = ans[anskey[index]][0];
          }

        });
      }
    } else {
      Object.keys(data.post.choice[p][0]).forEach(function(key, index) {
        data.post.choice[p][0][key] = ans[anskey[index]][0];
      });
    }
    // console.log("p: " + p);
    // console.log(data.post.choice[p]);
    var newpost = data.post.test;
    var newchoice = data.post.choice;

    data.ans[p] = ans_array;
    data.TextInform[p] = TextInform;
    txtModel.update({
      "name": filename
    }, {
      $set: {
        post: {
          "test": newpost,
          "choice": newchoice
        },
        ans: data.ans,
        TextInform: data.TextInform
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
    // console.log("p: " + p);
    data.post.splice(p, 1);
    var newpost = data.post;
    // console.log(newpost);
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
    var choice = [];
    var single = ["single"];
    var qus = {
      "1": "",
      "2": "",
      "3": "",
      "4": ""
    }
    for (var i = 0; i < postData.test.length; i++) {

      choice.push(single);
      postData.choice.push([qus]);
    }

    var content = {
      name: txtname,
      post: postData,
      ans: AllData,
      subject: subject,
      choice: choice
    };

    // console.log(content);
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

    var choice = [];
    var single = ["single"];
    var multiple = ["multiple"];

    var qus = {
      "1": "",
      "2": "",
      "3": "",
      "4": ""
    }

    for (var i = 0; i < postData.test.length - 8; i++) {

      choice.push(single);
      postData.choice.push([qus]);
    }
    for (var i = 15; i < 23; i++) {
      choice.push(multiple);
      postData.choice.push([qus]);
    }


    var content = {
      name: txtname,
      post: postData,
      ans: AllData,
      subject: subject,
      choice: choice
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
    var choice = [];
    var single = ["single"];
    var qus = {
      "1": "",
      "2": "",
      "3": "",
      "4": ""
    }
    for (var i = 0; i < postData.test.length; i++) {
      choice.push(single);
      postData.choice.push([qus]);
    }

    var content = {
      name: txtname,
      post: postData,
      ans: AllData,
      subject: subject,
      choice: choice
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

TXT.choice = function(filename, index, choice, callback) {
  txtModel.findOne({
    name: filename
  }, function(err, data) {
    data.choice[index].push(choice);
    var newchoice = data.choice;

    var qus = {
      '1': "",
      '2': "",
      '3': "",
      '4': ""
    }
    data.post.choice[index].push(qus);
    var newAnschoice = data.post.choice;

    var null_ans = [[""]];
    data.ans[index].push(null_ans);

    var null_textinform = "小標題";
    data.TextInform[index].push(null_textinform);
    txtModel.update({
      "name": filename
    }, {
      $set: {
        "choice": newchoice,
        "post": {
          choice: newAnschoice,
          test: data.post.test
        },
        "ans": data.ans,
        "TextInform": data.TextInform
      }

    }, function(err) {
      if (err) {
        return callback(err);
      }
      callback(null);
    });

  });
}

TXT.removechoice = function(filename, index, allsum, callback) {
  txtModel.findOne({
    name: filename
  }, function(err, data) {
    data.choice[index].splice(allsum, 1) ;
    var newchoice = data.choice;

    // console.log("allsum: " + allsum);
    data.post.choice[index].splice(allsum, 1)
    var newAnschoice = data.post.choice;

    data.ans[index].splice(allsum, 1);
    data.TextInform[index].splice(allsum, 1);
    txtModel.update({
      "name": filename
    }, {
      $set: {
        "choice": newchoice,
        "post": {
          choice: newAnschoice,
          test: data.post.test
        },
        "ans": data.ans,
        "TextInform": data.TextInform
      }
    }, function(err) {
      if (err) {
        return callback(err);
      }
      callback(null);
    });

  });
}

TXT.newtest = function(filename, subject, username, callback) {
  var postData = {
    test: ["大標題\n"],
    choice: [[{
      '1': "",
      '2': "",
      '3': "",
      '4': ""
    }]]
  };
  var newans = [[[[""]]]];
  var choice = [["single"]]
  var newTextInform = [[["小標題"]]];
  var content = {
    name: filename,
    username: username,
    post: postData,
    ans: newans,
    subject: subject,
    choice: choice,
    TextInform: newTextInform
  };

  var newTxt = new txtModel(content);

  newTxt.save(function(err) {
    if (err) {
      console.log(err);
      return;
    }
    callback(null);
  });
}


TXT.insert = function(filename, index, callback) {

  txtModel.findOne({
    name: filename
  }, function(err, data) {
    var newtype = ["single"];
    var postchoice = [{
      '1': "",
      '2': "",
      '3': "",
      '4': ""
    }];
    var newindex = Number(index) + 1;
    console.log("newindex: " + newindex);
    data.choice.splice(newindex, 0, newtype);
    var newchoice = data.choice;

    data.post.choice.splice(newindex, 0, postchoice);
    var newAnschoice = data.post.choice;

    var insertTest = "大標題\n";
    data.post.test.splice(newindex, 0, insertTest);

    var null_ans = [[""]];
    data.ans.splice(newindex, 0, null_ans);

    var null_textinform = ["小標題"];
    data.TextInform.splice(newindex, 0, null_textinform);
    txtModel.update({
      "name": filename
    }, {
      $set: {
        choice: newchoice,
        post: {
          choice: newAnschoice,
          test: data.post.test
        },
        ans: data.ans,
        TextInform: data.TextInform
      }
    }, function(err) {
      if (err) {
        return callback(err);
      }
      callback(null);
    });

  });
};


TXT.testremove = function(filename, index, callback) {

  txtModel.findOne({
    name: filename
  }, function(err, data) {

    var newindex = Number(index);
    console.log(newindex);
    data.choice.splice(newindex, 1);
    var newchoice = data.choice;

    data.post.choice.splice(newindex, 1);
    var newAnschoice = data.post.choice;
    data.post.test.splice(newindex, 1);

    data.ans.splice(newindex, 1);
    txtModel.update({
      "name": filename
    }, {
      $set: {
        choice: newchoice,
        post: {
          choice: newAnschoice,
          test: data.post.test
        },
        ans: data.ans
      }
    }, function(err) {
      if (err) {
        return callback(err);
      }
      callback(null);
    });

  });
};

TXT.insertOption = function(filename, index, allsum, callback) {
  txtModel.findOne({
    name: filename
  }, function(err, data) {
    var newoption = data.post.choice[index][allsum];
    var optionindex = Object.keys(newoption);
    var optionLegth = optionindex.length;
    var key = String(optionLegth + 1);
    newoption[key] = "";
    data.post.choice[index][allsum] = newoption;

    txtModel.update({
      "name": filename
    }, {
      $set: {
        post: {
          choice: data.post.choice,
          test: data.post.test
        }
      }
    }, function(err) {
      if (err) {
        return callback(err);
      }
      callback(null);
    });

  });
}

TXT.removeOneOption = function(filename, index, allsum, optionindex, callback) {
  txtModel.findOne({
    name: filename
  }, function(err, data) {
    var newoption = data.post.choice[index][allsum];
    var optionarray = Object.keys(newoption);
    var optionLegth = optionarray.length;
    var optionwhere = optionarray.indexOf(String(Number(optionindex) + 1));
    // console.log(String(Number(optionindex) + 1));
    // console.log(optionwhere);
    var key = optionarray[optionindex];
    delete newoption[key];
    optionarray.splice(optionwhere, 1);
    //console.log(optionarray);
    var finaloption = {};
    for (var i = 0; i < optionLegth - 1; i++) {
      finaloption[String((i + 1))] = newoption[optionarray[i]];
    }
    data.post.choice[index][allsum] = finaloption;

    var answhere = data.ans[index][allsum].indexOf(String(Number(optionindex) + 1));
    data.ans[index][allsum].splice(answhere, 1);

    txtModel.update({
      "name": filename
    }, {
      $set: {
        post: {
          choice: data.post.choice,
          test: data.post.test
        },
        ans: data.ans
      }
    }, function(err) {
      if (err) {
        return callback(err);
      }
      callback(null);
    });

  });
}

TXT.convertOption = function(filename, index, sum, type, callback) {
  txtModel.findOne({
    name: filename
  }, function(err, data) {
    data.choice[index][sum] = String(type);
    txtModel.update({
      "name": filename
    }, {
      $set: {
        choice: data.choice
      }
    }, function(err) {
      if (err) {
        return callback(err);
      }
      callback(null);
    });

  });
}
