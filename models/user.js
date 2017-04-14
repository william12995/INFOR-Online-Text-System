var crypto = require('crypto');

var mongodb = require('./db');

function User(user) {
	this.name = user.local.name;
	this.password = user.local.password;
	this.email = user.local.email;
	this.verifyId = user.local.verifyId;
	this.isVerified = user.local.isVerified;

	this.fb_name = user.facebook.name;
	this.fb_id = user.facebook.id;
	this.fb_token = user.facebook.token;
	this.fb_email = user.facebook.email;
	this.fb_gender = user.facebook.gender;
	this.fb_photo = user.facebook.photo;
};

module.exports = User;

User.prototype.save = function(callback){
	
	
	if(this.name != null){
		var md5 = crypto.createHash('md5');
		var email_MD5 = md5.update(this.email.toLowerCase()).digest('hex');
		var head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";

		var user = {
			
				'name' :	this.name,
				'password' : this.password,
				'email' : this.email,
				'head': head,
				'verifyId': this.verifyId,
		        'isVerified' : this.isVerified
			
		}
	}else if(this.fb_name != null){
		var user = {
	            'id'      : this.fb_id,
	            'token'   : this.fb_token,
	            'name'    : this.fb_name,
	            'email'   : this.fb_email,
	            'gender'  : this.fb_gender,
	            'photo' : this.fb_photo
	        
		};
		//console.log(JSON.stringify(user) +"UUuuuser");
	};

	mongodb.open(function(err, db){
		if(err){
			return callback(err);
		}
		//console.log("user save mongodb open");
		db.collection('user',function(err , collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			//console.log("user save db collection open")
			collection.insert(user, {
				safe : true
			},function(err , user){
				mongodb.close();
				//console.log("user save insert user success");
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
				};
			});
		});
	});
}

// checking if password is valid
User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};