var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var multer = require('multer');
var User = require('../models/user');
var Post = require('../models/post');
/* GET home page. */
router.get('/', function(req, res, next) {
	Post.get(null, function(err, posts){
		if(err){
			posts = {};
		}

		res.render('index', { 
			title: '主頁',
		  	user: req.session.user,
		  	Posts: posts,
		  	success: req.flash('success').toString(),
		  	error: req.flash('error').toString()
  	});
  });
});

router.post('/',function(req, res){
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');

	User.get(req.body.name , function(err , user){
		if(!user){
			req.flash('error','用戶不存在!');
			return res.redirect('/login');
		}

		if(user.password != password){
			req.flash('error','密碼錯誤!');
			return res.redirect('/login');
		}

		req.session.user = user ;
		req.flash('success','登入成功!');
		res.redirect('/');
	});

});

//router.get('/reg', checkBeenLogin);
router.get('/reg',function(req, res){
 	res.render('reg',{
 		title: '註冊',
 		user: null,
  		success: req.flash('success').toString(),
  		error: req.flash('error').toString()
 	});
});

//router.post('/reg', checkBeenLogin);
router.post('/reg',function(req, res){
	var name = req.body.name;
	var password = req.body.password;
	var password_repeat = req.body['password-repeat'];

	if (password != password_repeat){
		req.flash('error','密碼不一致!');
		return res.redirect('/reg');
	}
	
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');

	var newUser = new User({
		name : req.body.name,
		password : password,
		email : req.body.email
	});
	
	User.get(newUser.name, function(err, user){
		if(user){
			
			req.flash('error','用戶已存在');
			return res.redirect('/reg');
		}

		newUser.save(function(err , user){
			if(err){
				
				req.flash('error',err);
				return res.redirect('/reg');
			}
			
			req.session.user = user;
			req.flash('success', '註冊成功');
			res.redirect('/');

		});
	});
});

//router.get('/login', checkBeenLogin);
router.get('/login',function(req, res){
 	res.render('login',{
 		title: '登入',
 		user: null,
  		success: req.flash('success').toString(),
  		error: req.flash('error').toString()
 	});
});

//router.post('/login', checkBeenLogin);
router.post('/login',function(req, res){
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');

	User.get(req.body.name , function(err , user){
		if(!user){
			req.flash('error','用戶不存在!');
			return res.redirect('/login');
		}

		if(user.password != password){
			req.flash('error','密碼錯誤!');
			return res.redirect('/login');
		}

		req.session.user = user ;
		req.flash('success','登入成功! ');
		res.redirect('/');
	});
});

//router.get('/post', checkLogin);
router.get('/post',function(req, res){
	console.log("HEY");
 	res.render('post',{
 		title: '發表',
 		user: req.session.user,
  		success: req.flash('success').toString(),
  		error: req.flash('error').toString()
 	});
});

//router.post('/post', checkLogin);
router.post('/post',function(req, res){
	var currentUser = req.session.user;
	var post = new Post(currentUser.name ,req.body.title, req.body.post );

	post.save(function(err){
		if(err){
			req.flash('error',err);
			return res.redirect('/');
		}

		req.flash('success','發布成功!');
		res.redirect('/');
	});
});

//router.get('/logout', checkLogin);
router.get('/logout',function(req, res){
	req.session.user = null ;
	req.flash('success','登出成功!');
	res.redirect('/');
});

//router.get('/upload',checkLogin);
router.get('/upload',function(req,res){
	res.render('upload', {
		title: '檔案上傳',
 		user: req.session.user,
  		success: req.flash('success').toString(),
  		error: req.flash('error').toString()
	})
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname );
  }
});
 
var upload = multer({ 
	storage: storage ,
	limits: { fileSize: 1024 * 1024 }
});

//router.post('/upload',checkLogin);
router.post('/upload', upload.array('photos', 12), function(req,res){
	req.flash('success','檔案上傳成功');
	res.redirect('/upload');
});

function checkLogin(res, req ,next){
	if( req.session.user == null){
		req.flash('error','未登錄!');
		return redirect('/login');
	}
	next();
}

function checkBeenLogin(res , req , next){
	if(req.session.user !== null ){
		req('error','已登錄!');
		return redirect('back');
	}
	next();
}


module.exports = router;
