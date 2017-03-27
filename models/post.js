var mongodb = require('./db');
var markdown = require('markdown').markdown;

function Post(name, title, post) {
	this.name = name;
	this.title = title;
	this.post = post;
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
		post: this.post,
		time: time,
		comments:[{ name: 'william12995',
  email: 'rino881209@gmail.com',
  website: '/u/william12995',
  time: '2017-3-2622:13',
  content: 'QWWQWQWQWWWWWQQ' }
]
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

