//var mongodb = require('./db');
var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  name: String,
  day: {},
  title: String,
  comment: {}
}, {
  collection: 'posts'
})

var commentModel = mongoose.model('Comment', commentSchema);

function Comment(name, day, title, comment) {
  this.name = name;
  this.day = day;
  this.title = title;
  this.comment = comment;
}

module.exports = Comment;

Comment.prototype.save = function(callback) {

  var name = this.name;
  var day = this.day;
  var title = this.title;
  var comment = this.comment;

  commentModel.update({
    "name": name,
    "time.day": day,
    "title": title
  }, {
    $push: {
      comments: comment
    }
  }, {
    strict: false,
    safe: true,
    upsert: true
  }, function(err) {

    if (err) {
      console.log(err);
      return callback(err);
    }
    callback(null);
  });
};

Comment.remove = function(name, day, title, comment, callback) {

  commentModel.update({
    "name": name,
    "time.day": day,
    "title": title
  }, {
    $pull: {
      comments: {
        content: comment
      }
    }
  }, {
    strict: false,
    safe: true,
    upsert: true,
    multi: false
  }, function(err) {

    if (err) {
      console.log(err);
      return callback(err);
    }
    console.log("yes");
    callback(null);
  });
}

Comment.star = function(name, day, title, username, index, callback) {

  commentModel.findOne({
    "name": name,
    "time.day": day,
    "title": title
  }, {
    strict: false,
    safe: true,
    upsert: true,
    multi: false
  }, function(err, doc) {

    if (err) {
      console.log(err);
      return callback(err);
    }
    console.log("comment: " + doc.comments)
    var newcomment = doc.comments;
    newcomment[index].starname.push(username);
    newcomment[index].star = newcomment[index].star + 1;
    if (doc) {
      postModel.update({
        "name": name,
        "time.day": day,
        "title": title
      }, {
        $set: {
          comments: newcomment
        }
      }, {
        strict: false,
        safe: true,
        upsert: true,
        multi: false
      }, function(err) {
        if (err) {
          return callback(err);
        }

      });
      callback(null);
    }
  })
};
