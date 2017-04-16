//var mongodb = require('./db');
//var markdown = require('markdown').markdown;

var mongoose = require('mongoose');


var postSchema = new mongoose.Schema({
			name   : String,
      title  : String,
      post   : String,
      tags   : String,
    	head   : String,
			time   : {},
			reprint_info: {
				reprint_from :{
					 "name": String,
					 "day": String,
					 "title": String,
				 },
				reprint_to :{
						"name": String,
						"day": String,
						"title": String,
				}
			},
			pv     : Number,
},{
		collection: 'posts'
});


var postModel = mongoose.model('Post', postSchema);

function Post(name, head, title, tags, post) {
	this.name = name;
	this.title = title;
	this.post = post;
	this.tags = tags;
	this.head = head;
}

Post.prototype.save = function(callback){
	var date = new Date();

	var time = {
		'date': date,
		'year': date.getFullYear(),
		'month': date.getFullYear()+ "-" + (date.getMonth() + 1),
		'day': date.getFullYear()+ "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		'minute': date.getFullYear()+ "-" + (date.getMonth() + 1) + "-" + date.getDate() + "" + date.getHours() + ":"
		+(date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes())
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
	newPost.save(function(err){

		if(err){
			console.log(err);
			return callback(err);

		}
		console.log("SAVE POST");
		callback(null);
	});

};

Post.getTen = function(name, page, callback){

			var query = {};

			if(name){
				query.name = name;
			}
			postModel.count(query, function(err ,total){
				postModel.find({}).sort({
					time: -1
				}).skip((page-1)*10).limit(10).exec(function(err, docs){
					if(err){
						return callback(err);
					}
					// console.log(docs +"321");
					callback(null, docs, total);
				});
			});

};

Post.getOne = function(name, day, title, callback){

			postModel.findOne({
				"name": name,
				"time.day": day,
				"title": title
			},function(err, doc){

				if(err){
					return callback(err);
				}
				if(doc){
					postModel.update({
						"name": name,
						"time.day": day,
						"title": title
					},{
						$inc: {"pv": 1}
					},function(err){
						if(err){
							return callback(err);
						}
					});
					callback(null,doc);
				}
			});


};

Post.edit = function(name, day, title, callback){

			collection.findOne({
				"name": name,
				"time.day": day,
				"title": title
			},function(err, doc){
				if(err){
					return callback(err);
				}
				callback(null, doc);
			});


};


Post.update = function(name, day, title, post, callback){

			postModel.update({
				"name": name,
				"time.day": day,
				"title": title
			},{
				$set:{post: post}
			},function(err){
				if(err){
					return callback(err);
				}
				callback(null);
			});
};



Post.remove = function(name, day, title, callback) {

      postModel.findOne({
        "name": name,
        "time.day": day,
        "title": title
      }, function (err, doc) {
        if (err) {
          return callback(err);
        }

        var reprint_from = "";
        if (doc.reprint_info.reprint_from) {
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
            }}
          }, function (err) {
            if (err) {
              return callback(err);
            }
          });
        }


        postModel.remove({
          "name": name,
          "time.day": day,
          "title": title
        }, {
          w: 1
        }, function (err) {
          if (err) {
            return callback(err);
          }
          callback(null);
        });
      });


};

Post.getArchive = function(callback){
	console.log("ININ");
			postModel.find({},{
				"name": true,
				"time": true,
				"title": true
			}).sort({
				time: -1
			}).exec(function(err, docs){
				if(err){
					return callback(err);
				}
				// console.log(docs);
				callback(null, docs);
			});

};


Post.getTags = function(callback){

			postModel.distinct("tags",function(err, docs){
				if(err){
					return callback(err);
				}
				callback(null, docs);
			});


};

Post.getTag = function( tag, callback){

			postModel.find({
				"tags": tag
			},{
				"name": 1,
				"time": 1,
				"title": 1
			}).sort({
				time: -1
			}).exec(function(err, docs){
				if(err){
					return callback(err);
				}
				callback(null, docs);
			});

};

Post.search = function( keyword, callback){

			var pattern = new RegExp( keyword, "i");
			postModel.find({
				"title": pattern
			},{
				"name": 1,
				"time": 1,
				"title": 1
			}).sort({
				time: -1
			}).exec(function(err, docs){
				if(err){
					return callback(err);
				}
				callback(null, docs);
			});

};

Post.reprint = function( reprint_from, reprint_to, callback){


			postModel.findOne({
				"name": reprint_from.name,
				"time.day": reprint_from.day,
				"title": reprint_from.title
			},function(err, doc){

				if(err){
					return callback(err);
				}
				var date = new Date();

				var time = {
					'date': date,
					'year': date.getFullYear(),
					'month': date.getFullYear()+ "-" + (date.getMonth() + 1),
					'day': date.getFullYear()+ "-" + (date.getMonth() + 1) + "-" + date.getDate(),
					'minute': date.getFullYear()+ "-" + (date.getMonth() + 1) + "-" + date.getDate() + "" + date.getHours() + ":"
					+(date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes())
						}

				delete doc._id;

				doc.name = reprint_to.name;
				doc.head = reprint_to.head;
				doc.time = time;
				doc.title = (doc.title.search(/[轉載]/) > -1 ) ? doc.title : "[轉載]" + doc.title ;
				doc.reprint_info = {"reprint_from" : reprint_from};
				doc.pv = 0 ;

				postModel.update({
					"name": reprint_from.name,
					"time.day": reprint_from.day,
					"title": reprint_from.title
				},{
					$push: {
						"reprint_info.reprint_to": {
							"name": doc.name,
							"day": time.day,
							"title": doc.title
						}}
				},function(err){
					if(err){
						return callback(err);
					}
				});
				var newPost = new postModel(doc);

				newPost.save(function( err, post){
					if(err){
						return callback(err);
					}
					//console.log(post);
					callback(null, post.ops[0]);
				});
			});


};

module.exports = Post;
