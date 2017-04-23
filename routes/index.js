var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var multer = require('multer');
var fs = require('fs');
var passport = require('passport');
var session = require('express-session');
var settings = require('../setting');
var MongoStore = require('connect-mongo')(session);
var User = require('../models/user');
var Post = require('../models/post');
var Txt = require('../models/TXT');
var Comment = require('../models/comment');
var Pdf = require('../pdfreader/parse');



/* GET home page. */
router.get('/', checkLogin);
router.get('/', function(req, res, next) {
  //console.log(req.session.user);
  if (req.session.user) {
    if (!req.session.user.isVerified) {
      req.flash('error', "請認證email");
    //   console.log('not verified');
    }
  }
  var page = req.query.p ? parseInt(req.query.p) : 1;

  Post.getTen(null, page, function(err, posts, total) {
    if (err) {
      console.log(err);
      posts = {};
    }
    total = parseInt(total / 10) + 1;
    // console.log("posts: "+JSON.stringify(posts));
    //console.log('posts: ', posts);
    res.render('index', {
      title: 'Home',
      user: req.session.user,
      posts: posts,
      page: page,
      total: total,
      isFirstPage: (page - 1) == 0,
      isLastPage: page == total,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
    });
  });
});



router.get('/signup', checkBeenLogin);
router.get('/signup', function(req, res) {
  res.render('signup', {
    title: 'Register',
    user: null,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.get('/form', function(req, res) {
  res.render('form', {
    title: 'Form test',
    user: null,
  });
});


router.get('/login', checkBeenLogin);
router.get('/login', function(req, res) {
  res.render('login', {
    title: '登入',
    user: null,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

// router.get('/profile', checkLogin);
// router.get('/profile',function(req, res){
//  	res.render('profile',{
//  		title: 'Profile',
//  		user: req.session.user,
//   		success: req.flash('success').toString(),
//   		error: req.flash('error').toString()
//  	});
// });


router.post('/signup', checkBeenLogin);
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/', // redirect to the secure profile section
  failureRedirect: '/signup', // redirect back to the signup page if there is an error
  failureFlash: true, // allow flash messages
  session: false
}));

router.post('/login', checkBeenLogin);
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/', // redirect to the secure profile section
  failureRedirect: '/login', // redirect back to the signup page if there is an error
  failureFlash: true, // allow flash messages
  session: false

}));


router.get('/verify', function(req, res) {

  User.update({
    'verifyId': req.query.id
  }, {
    'isVerified': true
  }, function(err) {

    if (err) {

      console.log('Something went wrong: ' + err);
      res.redirect('/');
    } else {
      User.findOne({
        'verifyId': req.query.id
      }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err) {
          console.log(err);
        }

        req.session.user = user;
        console.log('verified');
        req.flash('email 認證成功');
        res.redirect('/');
      });
    }
  });
})


// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook-login', {
  scope: 'email'
}));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback', passport.authenticate('facebook-login',
  {
    successRedirect: '/',
    failureRedirect: '/login',
    session: false
  }));

router.get('/post', checkLogin);
router.get('/post', function(req, res) {
  //console.log("HEY");
  res.render('post', {
    title: '發表',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.post('/post', checkLogin);
router.post('/post', function(req, res) {
  var currentUser = req.session.user;
  //console.log(currentUser);
  var tags = (req.body.tags + '#end').split(/\s*#/);

  tags.splice(0, 1);
  tags.splice(tags.length - 1, 1);

  var post = new Post(currentUser.name, currentUser.head, req.body.title, tags, req.body.editor1, {});
  post.save(function(err) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }

    req.flash('success', '發布成功!');
    res.redirect('/');
  });
});

router.get('/logout', checkLogin);
router.get('/logout', function(req, res) {
  req.session.user = null ;
  req.flash('success', '登出成功!');
  res.redirect('/');
});


var storage = multer.diskStorage({
  destination: function(req, file, cb) {

    var destDir = './public/images/' + req.session.user.name;

    fs.stat(destDir, (err) => {
      if (err) {

        fs.mkdir(destDir, (err) => {
          if (err) {
            cb(err);
          } else {
            cb(null, destDir);
          }
        });
      } else {

        cb(null, destDir);
      }
    });
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024
  }
});

router.post('/upload', checkLogin);
router.post('/upload', upload.array('photos', 12), function(req, res) {

  req.flash('success', '檔案上傳成功');
  res.redirect('/');
});


var PDFstorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var PDFupload = multer({
  storage: PDFstorage
});

router.get('/pdfUpload', checkLogin);
router.get('/pdfUpload', function(req, res) {
  res.render('pdfUpload', {
    title: 'PDF上傳',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  })
});

var txt_name;
var ans_name;

var english_flag,
  chinese_flag,
  social_flag,
  math_flag,
  science_flag;

router.post('/pdfUpload', checkLogin);

router.post('/pdfUpload', PDFupload.array('pdf', 12), function(req, res) {

  var str_1 = req.files[0].filename;
  var str_2 = req.files[1].filename;

  var name_1 = str_1.split(".")[0];
  var name_2 = str_2.split(".")[0];

  txt_name = name_1;
  ans_name = name_2;

  var newPDF = new Pdf(name_1);
  var newPDF_2 = new Pdf(name_2);

  newPDF.convert(name_1);
  newPDF_2.convert(name_2);

  if (req.body.subject == 'english')
    english_flag = true;
  if (req.body.subject == 'chinese')
    chinese_flag = true;
  if (req.body.subject == 'social')
    social_flag = true;
  if (req.body.subject == 'math')
    math_flag = true;
  if (req.body.subject == 'science')
    science_flag = true;
  //console.log(req.files[0].filename);
  req.flash('success', 'PDF上傳成功');
  res.redirect('/');
});

router.get('/txt', checkLogin);
router.get('/txt', function(req, res) {

  if (english_flag) {
    var newTXT = new Txt(txt_name, ans_name, 'english');
    newTXT.SaveEnglish(txt_name, function(err) {
      req.flash('success', '題目已抓取，請檢查');
      res.redirect('/txt/' + txt_name);
    })
  }
  if (chinese_flag) {
    var newTXT = new Txt(txt_name, ans_name, 'chinese');
    newTXT.SaveChinese(txt_name, function(err) {
      req.flash('success', '題目已抓取，請檢查');
      res.redirect('/txt/' + txt_name);
    })
  }
  if (social_flag) {
    var newTXT = new Txt(txt_name, ans_name, 'social');
    newTXT.SaveSocial(txt_name, function(err) {
      req.flash('success', '題目已抓取，請檢查');
      res.redirect('/txt/' + txt_name);
    })
  }
  if (math_flag) {
    var newTXT = new Txt(txt_name, ans_name, 'math');
    newTXT.SaveMath(txt_name, function(err) {
      req.flash('success', '題目已抓取，請檢查');
      res.redirect('/txt/' + txt_name);
    })
  }
  if (science_flag) {
    var newTXT = new Txt(txt_name, ans_name, 'science');
    newTXT.SaveScience(txt_name, function(err) {
      req.flash('success', '題目已抓取，請檢查');
      res.redirect('/txt/' + txt_name);
    })
  }
});

router.get('/txt/:txtname', checkLogin);
router.get('/txt/:txtname', function(req, res) {

  var page = req.query.p ? parseInt(req.query.p) : 0;

  Txt.get(req.params.txtname, function(err, data) {
    res.render('txt', {
      title: req.params.txtname,
      content: data.post,
      Answers: data.ans,
      data_length: data.post.length,
      page: page,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString(),
    });
  });
});



router.post('/txt/:txtname', checkLogin);
router.post('/txt/:txtname', function(req, res) {

  var page = req.query.p ? parseInt(req.query.p) : 0;

  Txt.edit(req.params.txtname, page, req.body.post, req.body.ans, function(err, data) {
    var url = encodeURI('/txt/' + req.params.txtname + '?p=' + page);
    if (err) {
      console.log(err);
      req.flash('error', err);
      return res.redirect(url);
    }

    req.flash('success', '修改成功!');
    res.redirect(url);
  });
});

router.get('/txt/remove/:txtname', checkLogin);
router.get('/txt/remove/:txtname', function(req, res) {
  var page = req.query.p ? parseInt(req.query.p) : 0;

  Txt.remove(req.params.txtname, page, function(err, data) {
    var url = encodeURI('/txt/' + req.params.txtname + '?p=' + page);
    if (err) {
      console.log(err);
      req.flash('error', err);
      return res.redirect(url);
    }

    req.flash('success', '刪除成功!');
    res.redirect(url);
  });
});
router.get('/history', checkLogin);
router.get('/history', function(req, res) {

  Post.getArchive(function(err, posts) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    //console.log(posts);
    res.render('history', {
      title: 'History',
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

// router.get('/tags', function(req, res) {
//
//   Post.getTags(function(err, posts) {
//     if (err) {
//       req.flash('error', err);
//       return res.redirect('/');
//     }
//
//     res.render('tags', {
//       title: '標籤',
//       posts: posts,
//       user: req.session.user,
//       success: req.flash('success').toString(),
//       error: req.flash('error').toString()
//     });
//   });
// });

router.get('/tags/:tag', function(req, res) {

  Post.getTag(req.params.tag, function(err, posts) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }

    res.render('tag', {
      title: 'TAG: ' + req.params.tag,
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});
router.get('/test', checkLogin);
router.get('/test', function(req, res) {

  Txt.getList({}, function(err, docs) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }

    res.render('test', {
      title: 'Test List',
      docs: docs,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});
router.get('/test/:txtname', checkLogin);
router.get('/test/:txtname', function(req, res) {

  Txt.get(req.params.txtname, function(err, doc) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    var ejs;
    if (doc.subject == 'english')
      ejs = 'english';
    if (doc.subject == 'chinese')
      ejs = 'chinese';
    if (doc.subject == 'social')
      ejs = 'social';

    res.render(ejs, {
      title: doc.name,
      doc: doc,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.post('/test/:txtname', checkLogin);
router.post('/test/:txtname', function(req, res) {

  Txt.compare(req.params.txtname, req.body, function(err, error_ans) {
    console.log(error_ans);
  })

  res.render('/', {
    title: doc.name,
    doc: doc,
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
//});
});
router.get('/search', checkLogin);
router.get('/search', function(req, res) {

  Post.search(req.query.keyword, function(err, posts) {

    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    console.log("Search:" + posts);
    res.render('search', {
      title: req.query.keyword,
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/u/:name', function(req, res) {
  var page = req.query.p ? parseInt(req.query.p) : 1;

  User.get(req.params.name, function(err, user) {
    if (err) {
      req.flash('error', "用戶不存在");
      return res.redirect('/');
    }

    Post.getTen(user.name, page, function(err, posts, total) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }

      res.render('user', {
        title: user.name,
        posts: posts,
        user: req.session.user,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * 10 + posts.length) == total,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
});

router.get('/u/:name/:day/:title', function(req, res) {
  Post.getOne(req.params.name, req.params.day, req.params.title, function(err, post) {
    if (err) {
      console.log(err);
      req.flash('error', err);
      return res.redirect('/');
    }

    res.render('article', {
      title: req.params.title,
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.post('/u/:name/:day/:title', function(req, res) {
  var date = new Date;
  var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "" + date.getHours() + ":"
  + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());

  var md5 = crypto.createHash('md5');
  var email_MD5 = md5.update(req.session.user.email.toLowerCase()).digest('hex');
  var head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
  var head = req.session.user.head;

  var comment = {
    name: req.session.user.name,
    head: head,
    email: req.session.user.email,
    time: time,
    content: req.body.content
  };
  var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);

  newComment.save(function(err) {
    if (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
    req.flash('success', '留言成功');
    res.redirect('back');
  });
});

router.get('/rm_comment/:name/:day/:title/:content', checkLogin);
router.get('/rm_comment/:name/:day/:title/:content', function(req, res) {
  var currentUser = req.session.user;

  Comment.remove(req.params.name, req.params.day, req.params.title, req.params.content, function(err, post) {
    if (err) {
      req.flash('error', err);
      return res.redirect('back');
    }

    req.flash('success', '刪除留言成功');
    res.redirect('back');
  });
});

router.get('/edit/:name/:day/:title', checkLogin);
router.get('/edit/:name/:day/:title', function(req, res) {
  var currentUser = req.session.user;

  Post.edit(currentUser.name, req.params.day, req.params.title, function(err, post) {
    if (err) {
      req.flash('error', err);
      return res.redirect('back');
    }

    res.render('edit', {
      title: '編輯',
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()

    });
  });
});

router.post('/edit/:name/:day/:title', checkLogin);
router.post('/edit/:name/:day/:title', function(req, res) {
  var currentUser = req.session.user;

  Post.update(currentUser.name, req.params.day, req.params.title, req.body.editor1, function(err) {
    var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
    if (err) {
      req.flash('error', err);
      return res.redirect(url);
    }

    req.flash('success', '修改成功!');
    res.redirect(url);
  });
});

router.get('/remove/:name/:day/:title', checkLogin);
router.get('/remove/:name/:day/:title', function(req, res) {
  var currentUser = req.session.user;

  Post.remove(currentUser.name, req.params.day, req.params.title, function(err) {
    if (err) {
      req.flash('error', err);
      return res.redirect('back');
    }

    req.flash('success', '刪除成功!');
    res.redirect('/');
  });
});

router.get('/reprint/:name/:day/:title', checkLogin);
router.get('/reprint/:name/:day/:title', function(req, res) {
  Post.edit(req.params.name, req.params.day, req.params.title, function(err, post) {
    if (err) {
      req.flash('error', err);
      return res.render('back');
    }

    var currentUser = req.session.user;
    var reprint_from = {
      name: post.name,
      day: post.time.day,
      title: post.title
    };
    var reprint_to = {
      name: currentUser.name,
      head: currentUser.head
    };

    // console.log(reprint_from);
    // console.log(reprint_to);
    Post.reprint(reprint_from, reprint_to, function(err, post) {
      if (err) {
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
      }

      var reprint_post = new Post(post.name, post.head, post.title, post.tags, post.post, post.reprint_info);
      reprint_post.ReprintSave(function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/');
        }

        req.flash('success', '轉載成功');
        //var url = encodeURI('/u/' + post.name +'/'+ post.time.day +'/'+ post.title);

        res.redirect('/');
      });
    });
  });
});

router.post('/uploadfile', function(req, res) {
  //console.log(req.busboy);
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {
    console.log("Uploading: " + filename);
    fstream = fs.createWriteStream('./public/files/' + filename);
    file.pipe(fstream);
    fstream.on('close', function() {
      req.flash('success', 'success');
      res.redirect('/');
    });
  });
});

function checkLogin(req, res, next) {
  //console.log(req.session);
  if (req.session.user == null) {
    req.flash('error', '未登錄!');
    return res.redirect('/login');
  }
  next();
}

function checkBeenLogin(req, res, next) {
  if (req.session.user !== null && req.session.user) {
    req.flash('error', '已登錄!');
    return res.redirect('back');
  }
  next();
}


module.exports = router;
