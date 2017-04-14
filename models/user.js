var crypto = require('crypto');

var mongodb = require('./db');

function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
	this.verifyId = user.verifyId;
	this.isVerified = user.isVerified;
};

module.exports = User;

User.prototype.save = function(callback){
	var md5 = crypto.createHash('md5');
	var email_MD5 = md5.update(this.email.toLowerCase()).digest('hex');
	var head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";

	var user = {
		'name' :	this.name,
		'password' : this.password,
		'email' : this.email,
		'head': head,
		'verifyId': this.verifyId,
        'isVerified' : this.isVerified,
	};

	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		db.collection('user',function(err , collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.insert(user, {
				safe : true
			},function(err , user){
				mongodb.close();
				if (err){
					return callback(err);
				}
				callback(null, user);
			});
		});
  	});
};

User.get = function(name ,callback){

	mongodb.open(function(err , db){
		if (err){
			return callback(err);
		}
		db.collection('user',function(err , collection){
			if (err){
				mongodb.close();
				return callback(err);
			}

			collection.findOne({
				name: name
			},function(err , user){
				mongodb.close();
				if(err){
					return callback(err)
				}

				callback(null, user);
			});
		});
	});
};

User.verify = function(id,callback){
	mongodb.open(function(err , db){
		if (err){
			return callback(err);
		}
		db.collection('user',function(err , collection){
			if (err){
				mongodb.close();
				return callback(err);
			}

			collection.update({
				"verifyId": id
			},{
				$set:{isVerified: true}
			},function(err , done){
				if(err){
					return callback(err)
				}
				//console.log(done.result.ok);
				if(done.result.ok == 1){
					collection.findOne({
						"verifyId": id
					},function(err , user){
						mongodb.close();
						if(err){
							return callback(err)
						}
						//console.log(user);
						callback(null, user);
					});
				}
			});
		});
	});
}

// checking if password is valid
User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};