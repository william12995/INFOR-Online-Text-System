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
