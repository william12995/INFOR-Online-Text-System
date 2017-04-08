var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var multer = require('multer');
var session = require('express-session');
var settings = require('../setting');
var MongoStore = require('connect-mongo')(session);
var User = require('../models/user');
var Post = require('../models/post');
var Txt = require('../models/TXT');
var Comment = require('../models/comment');
var Pdf = require('../pdfreader/parse');
//var zerorpc = require('zerorpc/index');



/* GET home page. */
router.get('/', function(req, res, next) {

	var page = req.query.p ? parseInt(req.query.p) : 1 ;

	Post.getTen(null, page,function(err, posts, total){
		if(err){
			posts = {};
		}
		console.log('posts: ', posts);
		res.render('index', {
			title: 'Home',
		  	user: req.session.user,
		  	posts: posts ,
		  	page: page,
		  	isFirstPage: (page-1) == 0 ,
		  	isLastPage: ( (page-1)*10 + posts.length ) == total ,
		  	success: req.flash('success').toString(),
		  	error: req.flash('error').toString()
  	});
  });

});

// router.post('/',function(req, res){
// 	var md5 = crypto.createHash('md5');
// 	var password = md5.update(req.body.password).digest('hex');
//
// 	User.get(req.body.name , function(err , user){
// 		if(!user){
// 			req.flash('error','用戶不存在!');
// 			return res.redirect('/login');
// 		}
//
// 		if(user.password != password){
// 			req.flash('error','密碼錯誤!');
// 			return res.redirect('/login');
// 		}
//
// 		req.session.user = user ;
// 		req.flash('success','登入成功!');
// 		res.redirect('/');
// 	});
//
// });

router.get('/', checkBeenLogin);
router.get('/signup',function(req, res){
 	res.render('signup',{
 		title: 'Register',
 		user: null,
  		success: req.flash('success').toString(),
  		error: req.flash('error').toString()
 	});
});

router.post('/signup', checkBeenLogin);
router.post('/signup',function(req, res){
	var name = req.body.name;
	var password = req.body.password;
	var password_repeat = req.body['password-repeat'];

	if (password != password_repeat){
		req.flash('error','密碼不一致!');
		return res.redirect('/signup');
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
			return res.redirect('/signup');
		}

		newUser.save(function(err , user){
			if(err){

				req.flash('error',err);
				return res.redirect('/signup');
			}

			req.session.user = user;
			req.flash('success', '註冊成功');
			res.redirect('/');

		});
	});
});

router.get('/login', checkBeenLogin);
router.get('/login',function(req, res){
 	res.render('login',{
 		title: '登入',
 		user: null,
  		success: req.flash('success').toString(),
  		error: req.flash('error').toString()
 	});
});

router.get('/profile', checkLogin);
router.get('/profile',function(req, res){
 	res.render('profile',{
 		title: 'Profile',
 		user: req.session.user,
  		success: req.flash('success').toString(),
  		error: req.flash('error').toString()
 	});
});

router.post('/login', checkBeenLogin);
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

router.get('/post', checkLogin);
router.get('/post',function(req, res){
	console.log("HEY");
 	res.render('post',{
 		title: '發表',
 		user: req.session.user,
  		success: req.flash('success').toString(),
  		error: req.flash('error').toString()
 	});
});

router.post('/post', checkLogin);
router.post('/post',function(req, res){
	var currentUser = req.session.user;
	//console.log(currentUser);
	var tags = [req.body.tag1, req.body.tag2, req.body.tag3];
	var post = new Post(currentUser.name , currentUser.head, req.body.title, tags, req.body.post );
	post.save(function(err){
		if(err){
			req.flash('error',err);
			return res.redirect('/');
		}

		req.flash('success','發布成功!');
		res.redirect('/');
	});
});

router.get('/logout', checkLogin);
router.get('/logout',function(req, res){
	req.session.user = null ;
	req.flash('success','登出成功!');
	res.redirect('/');
});

// router.get('/upload',checkLogin);
// router.get('/upload',function(req,res){
// 	res.render('upload', {
// 		title: '檔案上傳',
//  		user: req.session.user,
//   		success: req.flash('success').toString(),
//   		error: req.flash('error').toString()
// 	})
// });

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

router.post('/upload',checkLogin);
router.post('/upload', upload.array('photos', 12), function(req,res){
	req.flash('success','檔案上傳成功');
	res.redirect('/');
});

router.get('/pdfUpload',checkLogin);
router.get('/pdfUpload',function(req,res){
	res.render('pdfUpload', {
		title: 'PDF上傳',
 		user: req.session.user,
  		success: req.flash('success').toString(),
  		error: req.flash('error').toString()
	})
});
var txt_name;
router.post('/pdfUpload',checkLogin);
router.post('/pdfUpload', upload.array('pdf', 12), function(req,res){
    var str = req.files[0].filename;

    var name = str.split(".")[0];
    txt_name = name;
    var newPDF = new Pdf(name);

    newPDF.convert(name);

	//console.log(req.files[0].filename);
	req.flash('success','PDF上傳成功');
	res.redirect('/txt');
});

router.get('/txt', checkLogin);
router.get('/txt', function(req, res){

	var newTXT = new Txt(txt_name);
	newTXT.save(txt_name,function(err , data_length){

		req.flash('success','題目已抓取，請檢查');
		res.redirect('/txt/'+txt_name);

	});

});

router.get('/txt/:txtname',checkLogin);
router.get('/txt/:txtname',function(req, res){

	var page = req.query.p ? parseInt(req.query.p) : 0 ;

	Txt.get(req.params.txtname ,function(err , data){
		res.render('txt', {
			title: data.name,
			content: data.post,
			data_length:data.post.length,
			page: page,
	 		user: req.session.user,
	  		success: req.flash('success').toString(),
	  		error: req.flash('error').toString()
		});
	});
});

router.get('/history', function(req ,res){
	Post.getArchive(function(err, posts){
		if(err){
			req.flash('error', err);
			return res.redirect('/');
		}
		//console.log(posts);
		res.render('history', {
			title: 'History',
			posts:posts,
	 		user: req.session.user,
	  		success: req.flash('success').toString(),
	  		error: req.flash('error').toString()
		});
	});
});

// router.get('/tags', function(req, res){
//
// 	Post.getTags(function(err, posts){
// 		if (err){
// 			req.flash('error', err);
// 			return res.redirect('/');
// 		}
//
// 		res.render('tags', {
// 			title: '標籤',
// 			posts:posts,
// 	 		user: req.session.user,
// 	  		success: req.flash('success').toString(),
// 	  		error: req.flash('error').toString()
// 		});
// 	});
// });

router.get('/tags/:tag', function(req, res){

	Post.getTag( req.params.tag, function(err, posts){
		if (err){
			req.flash('error', err);
			return res.redirect('/');
		}

		res.render('tag', {
			title: 'TAG: '+req.params.tag,
			posts:posts,
	 		user: req.session.user,
	  		success: req.flash('success').toString(),
	  		error: req.flash('error').toString()
		});
	});
});

router.get('/search', function(req, res){

	Post.search( req.query.keyword, function(err, posts){

		if (err){
			req.flash('error', err);
			return res.redirect('/');
		}

		res.render('search', {
			title: req.query.keyword,
			posts:posts,
	 		user: req.session.user,
	  		success: req.flash('success').toString(),
	  		error: req.flash('error').toString()
		});
	});
});

router.get('/u/:name', function(req, res){
	var page = req.query.p ? parseInt(req.query.p) : 1 ;

	User.get(req.params.name, function(err, user){
		if(err){
			req.flash('error', "用戶不存在");
			return res.redirect('/');
		}

		Post.getTen(user.name, page,function(err, posts, total){
			if(err){
				req.flash('error', err);
				return res.redirect('/');
			}

			res.render('user', {
				title: user.name,
		 		posts: posts,
		 		user: req.session.user,
		 		page: page,
			  	isFirstPage: (page-1) == 0 ,
			  	isLastPage: ( (page-1)*10 + posts.length ) == total ,
		  		success: req.flash('success').toString(),
		  		error: req.flash('error').toString()
			});
		});
	});
});

router.get('/u/:name/:day/:title', function(req, res){
	Post.getOne(req.params.name, req.params.day, req.params.title , function(err, post){
		if(err){
			console.log(err);
			req.flash('error', err);
			return res.redirect('/');
		}

		res.render('article', {
			title: req.params.title,
			post: post,
			user:req.session.user,
			success: req.flash('success').toString(),
		  	error: req.flash('error').toString()
		});
	});
});

router.post('/u/:name/:day/:title', function(req, res){
	var date = new Date;
	var time = date.getFullYear()+ "-" + (date.getMonth() + 1) + "-" + date.getDate() + "" + date.getHours() + ":"
		+(date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes());

	var md5 = crypto.createHash('md5');
	var email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex');
	var head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";

	var comment = {
		name: req.body.name,
		head: head,
		email: req.body.email,
		website: req.body.website,
		time: time,
		content: req.body.content
	};
	var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);

	newComment.save(function(err){
		if (err){
			req.flash('error',err);
			return res.redirect('back');
		}
		req.flash('success','留言成功');
		res.redirect('back');
	});
});

router.get('/edit/:name/:day/:title', checkLogin);
router.get('/edit/:name/:day/:title', function(req, res){
	var currentUser = req.session.user;

	Post.edit(currentUser.name, req.params.day, req.params.title, function(err, post){
		if(err){
			req.flash('error',err);
			return res.redirect('back');
		}

		res.render('edit', {
			title: '編輯',
			post: post,
			user:req.session.user,
			success: req.flash('success').toString(),
		  	error: req.flash('error').toString()

		});
	});
});

router.post('/edit/:name/:day/:title', checkLogin);
router.post('/edit/:name/:day/:title', function(req, res){
	var currentUser = req.session.user;

	Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function(err){
		var url = encodeURI('/u/' + req.params.name +'/'+ req.params.day +'/'+ req.params.title);
		if(err){
			req.flash('error',err);
			return res.redirect(url);
		}

		req.flash('success', '修改成功!');
		res.redirect(url);
	});
});

router.get('/remove/:name/:day/:title', checkLogin);
router.get('/remove/:name/:day/:title', function(req, res){
	var currentUser = req.session.user;

	Post.remove(currentUser.name, req.params.day, req.params.title, function(err){
		if(err){
			req.flash('error',err);
			return res.redirect('back');
		}

		req.flash('success', '刪除成功!');
		res.redirect('/');
	});
});

router.get('/reprint/:name/:day/:title', checkLogin);
router.get('/reprint/:name/:day/:title', function( req, res){
	Post.edit( req.params.name, req.params.day, req.params.title, function( err, post){
		if(err){
			req.flash( 'error', err);
			return res.render('back');
		}

		var currentUser = req.session.user;
		var reprint_from = { name: post.name , day : post.time.day , title: post.title };
		var reprint_to = { name: currentUser.name , head : currentUser.head };

		// console.log(reprint_from);
		// console.log(reprint_to);
		Post.reprint( reprint_from, reprint_to, function( err, post){
			if(err){
				req.flash('error', err);
				return res.redirect('back');
			}

			req.flash('success', '轉載成功');
			var url = encodeURI('/u/' + post.name +'/'+ post.time.day +'/'+ post.title);

			res.redirect(url);
		});
	});
});

router.use(session({
	secret : settings.cookieSecret,
	key : settings.db,
	resave: true,
    saveUninitialized: true,
	cookie : {
		maxAge : 1000*60*60*24*30 //30天
	},
	store : new MongoStore({
		db : settings.db,
		host : settings.host,
		port : settings.port,
		url : 'mongodb://localhost:27017/blog'
	})
}));

function checkLogin(req, res ,next){
	//console.log(req.session);
	if( req.session.user == null){
		req.flash('error','未登錄!');
		return res.redirect('/login');
	}
	next();
}

function checkBeenLogin(req , res , next){
	if(req.session.user !== null && req.session.user){
		req.flash('error','已登錄!');
		return res.redirect('back');
	}
	next();
}


module.exports = router;
