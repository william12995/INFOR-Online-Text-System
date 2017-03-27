var mongodb = require('./db');
var markdown = require('markdown').markdown;

function Post(name, title, tags, post) {
	this.name = name;
	this.title = title;
	this.post = post;
	this.tags = tags;
}

module.exports = Post;

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
		title: this.title,
		tags: this.tags,
		post: this.post,
		time: time,
		comments:[]
	};

	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}

		db.collection('posts', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.insert(post, {
				safe: true
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);

			});
		});
	});
};

Post.getTen = function(name, page, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('posts',function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			var query = {};

			if(name){
				query.name = name;
			}
			collection.count(query, function(err ,total){
				collection.find(query,{
					skip: (page-1)*10 ,
					limit: 10
				}).sort({
					time: -1
				}).toArray(function(err, docs){
					mongodb.close();
					if(err){
						return callback(err);
					}
					docs.forEach(function(doc){
						doc.post = markdown.toHTML(doc.post);
					});
					callback(null, docs, total);
				});
			});
		});
	});
};

Post.getOne = function(name, day, title, callback){
	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('posts',function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}


			collection.findOne({
				"name": name,
				"time.day": day,
				"title": title 
			},function(err, doc){
				mongodb.close();
				if(err){
					return callback(err);
				}
				if(doc){
					doc.post = markdown.toHTML(doc.post);
					doc.comments.forEach(function(comment){
						comment.content =  markdown.toHTML(comment.content);
					});
				}
				
				callback(null,doc);
			});
		});
	});
};

Post.edit = function(name, day, title, callback){
	mongodb.open(function(err, db){
		if (err){
			return callback(err);
		}

		db.collection('posts' , function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.findOne({
				"name": name,
				"time.day": day,
				"title": title
			},function(err, doc){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, doc);
			});
		});
	});
};


Post.update = function(name, day, title, post, callback){
	mongodb.open(function(err, db){
		if (err){
			return callback(err);
		}

		db.collection('posts' , function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.update({
				"name": name,
				"time.day": day,
				"title": title
			},{
				$set:{post: post}
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	});
};

Post.remove = function(name, day, title, callback){
	mongodb.open(function(err, db){
		if (err){
			return callback(err);
		}

		db.collection('posts' , function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.remove({
				"name": name,
				"time.day": day,
				"title": title
			},{
				w: 1
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	});
};

Post.getArchive = function(callback){
	mongodb.open(function(err, db){
		if (err){
			return callback(err);
		}

		db.collection('posts' , function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.find({},{
				"name": 1,
				"time": 1,
				"title": 1
			}).sort({
				time: -1
			}).toArray(function(err, docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, docs);
			});
		});
	});
};

Post.getTags = function(callback){
	mongodb.open(function(err, db){
		if (err){
			return callback(err);
		}

		db.collection('posts' , function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.distinct("tags",function(err, docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, docs);
			});
		});
	});
};

Post.getTag = function( tag, callback){
	mongodb.open(function(err, db){
		if (err){
			return callback(err);
		}

		db.collection('posts' , function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.find({
				"tags": tag
			},{
				"name": 1,
				"time": 1,
				"title": 1
			}).sort({
				time: -1
			}).toArray(function(err, docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, docs);
			});
		});
	});
};