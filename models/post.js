//var mongodb = require('./db');
//var markdown = require('markdown').markdown;

var mongoose = require('mongoose');


var postSchema = new mongoose.Schema({
  name: String,
  title: String,
  post: String,
  tags: Array,
  head: String,
  time: {},
  reprint_info: {
    reprint_from: {
      "name": String,
      "day": String,
      "title": String,
    },
    reprint_to: {
      type: Array,
      "default": []
    }
  },
  pv: Number,
}, {
  collection: 'posts'
});


var postModel = mongoose.model('Post', postSchema);

function Post(name, head, title, tags, post, info) {
  this.name = name;
  this.title = title;
  this.post = post;
  this.tags = tags;
  this.head = head;
  this.reprint_info = info;
}

Post.prototype.save = function(callback) {
  var date = new Date();

  var time = {
    'date': date,
    'year': date.getFullYear(),
    'month': date.getFullYear() + "-" + (date.getMonth() + 1),
    'day': date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    'minute': date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "" + date.getHours() + ":"
      + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  }
  var post = {
    name: this.name,
    head: this.head,
    title: this.title,
    tags: this.tags,
    post: this.post,
    time: time,
    reprint_info: {},
    pv: 0
  };

  var newPost = new postModel(post);
  // console.log(newPost);
  newPost.save(function(err) {

    if (err) {
      console.log(err);
      return callback(err);

    }
    console.log("SAVE POST");
    callback(null);
  });

};

Post.getTen = function(name, page, callback) {

  var query = {};

  if (name) {
    query.name = name;
  }
  postModel.count(query, function(err, total) {
    postModel.find({}).sort({
      time: -1
    }).skip((page - 1) * 10).limit(10).exec(function(err, docs) {
      if (err) {
        return callback(err);
      }
      // console.log(docs +"321");
      callback(null, docs, total);
    });
  });

};

Post.getLength = () => {
    postModel.count({}, (err, count) => {
        // console.log('docs: ', count);
        return count;
    });
}

Post.getOne = function(name, day, title, callback) {

  postModel.findOne({
    "name": name,
    "time.day": day,
    "title": title
  }, function(err, doc) {

    if (err) {
      return callback(err);
    }
    if (doc) {
      postModel.update({
        "name": name,
        "time.day": day,
        "title": title
      }, {
        $inc: {
          "pv": 1
        }
      }, function(err) {
        if (err) {
          return callback(err);
        }
      });
      callback(null, doc);
    }
  });


};

Post.edit = function(name, day, title, callback) {

  postModel.findOne({
    "name": name,
    "time.day": day,
    "title": title
  }, function(err, doc) {
    if (err) {
      return callback(err);
    }
    callback(null, doc);
  });


};


Post.update = function(name, day, title, post, callback) {
  console.log(post);
  postModel.update({
    "name": name,
    "time.day": day,
    "title": title
  }, {
    $set: {
      post: post
    }
  }, function(err) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    console.log("update save");
    callback(null);
  });
};



Post.remove = function(name, day, title, callback) {

  postModel.findOne({
    "name": name,
    "time.day": day,
    "title": title
  }, function(err, doc) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    console.log("doc" + doc);
    var reprint_from = "";
    if (doc.reprint_info.reprint_from != null) {
      reprint_from = doc.reprint_info.reprint_from;
    }
    if (reprint_from != "") {

      postModel.update({
        "name": reprint_from.name,
        "time.day": reprint_from.day,
        "title": reprint_from.title
      }, {
        $pull: {
          "reprint_info.reprint_to": {
            "name": name,
            "day": day,
            "title": title
          }
        }
      }, function(err) {
        if (err) {
          console.log("pull error: " + err);
          return callback(err);
        }
      });
    }


    postModel.remove({
      "name": name,
      "time.day": day,
      "title": title
    }, function(err, result) {
      if (err) {
        console.log("remove err: " + err);
        return callback(err);
      }
      //console.log(result);
      console.log("remove ok");
      callback(null);
    });

  })


};

Post.getArchive = function(callback) {
  console.log("ININ");
  postModel.find({}, {
    "name": true,
    "time": true,
    "title": true
  }).sort({
    time: -1
  }).exec(function(err, docs) {
    if (err) {
      return callback(err);
    }
    // console.log(docs);
    callback(null, docs);
  });

};


Post.getTags = function(callback) {

  postModel.distinct("tags", function(err, docs) {
    if (err) {
      return callback(err);
    }
    callback(null, docs);
  });


};

Post.getTag = function(tag, callback) {

  postModel.find({
    "tags": tag
  }, {
    "name": 1,
    "time": 1,
    "title": 1
  }).sort({
    time: -1
  }).exec(function(err, docs) {
    if (err) {
      return callback(err);
    }
    callback(null, docs);
  });

};

Post.search = function(keyword, callback) {

  var pattern = new RegExp(keyword, "i");
  postModel.find({
    "title": pattern
  }, {
    "name": 1,
    "time": 1,
    "title": 1
  }).sort({
    time: -1
  }).exec(function(err, docs) {
    if (err) {
      return callback(err);
    }
    callback(null, docs);
  });

};

Post.reprint = function(reprint_from, reprint_to, callback) {


  postModel.findOne({
    "name": reprint_from.name,
    "time.day": reprint_from.day,
    "title": reprint_from.title
  }, function(err, doc) {

    if (err) {
      return callback(err);
    }

    delete doc._id;

    doc.name = reprint_to.name;
    doc.head = reprint_to.head;

    doc.title = (doc.title.search(/[轉載]/) > -1) ? doc.title : "[轉載]" + doc.title;
    doc.reprint_info = {
      "reprint_from": reprint_from
    };
    doc.pv = 0 ;

    var date = new Date();

    var time = {
      'date': date,
      'year': date.getFullYear(),
      'month': date.getFullYear() + "-" + (date.getMonth() + 1),
      'day': date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      'minute': date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "" + date.getHours() + ":"
        + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }

    postModel.update({
      "name": reprint_from.name,
      "time.day": reprint_from.day,
      "title": reprint_from.title
    }, {
      $push: {
        "reprint_info.reprint_to": {
          "name": doc.name,
          "day": time.day,
          "title": doc.title
        }
      }
    }, function(err) {
      if (err) {
        console.log("reprint update err");
        return callback(err);
      }
    });
    callback(null, doc);
  });
};


Post.prototype.ReprintSave = function(callback) {
  var date = new Date();

  var time = {
    'date': date,
    'year': date.getFullYear(),
    'month': date.getFullYear() + "-" + (date.getMonth() + 1),
    'day': date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    'minute': date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "" + date.getHours() + ":"
      + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  }
  var post = {
    name: this.name,
    head: this.head,
    title: this.title,
    tags: this.tags,
    post: this.post,
    time: time,
    reprint_info: this.reprint_info,
    pv: 0
  };

  var newPost = new postModel(post);
  // console.log(newPost);
  newPost.save(function(err) {

    if (err) {
      console.log(err);
      return callback(err);

    }
    console.log("SAVE POST");
    callback(null);
  });

};

module.exports = Post;
