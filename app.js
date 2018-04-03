   var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

app.use(bodyParser.json({
 limit: '10mb',
 extended: true
}));
app.use(bodyParser.urlencoded({
 limit: '10mb',
 extended: true
}));

var dbPath = "mongodb://localhost/app";

db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {
 console.log("database connection open sucess.");
})

//adding moongoose schema models.
var Blog = require('./blogModel.js');
var Comment = require('./CommentModel.js');
var blogModel = mongoose.model('Blog');
var commentModel = mongoose.model('Comment');

var middleware = require('./middlewares');

//displaying request information in console.
app.use(function(req, res, next) {
 console.log('----------');
 console.log('Time of request:', Date.now());
 console.log('Request url is ', req.originalUrl);
 console.log('Request ip address is ', req.ip);
 next();
});


//routes start

app.get('/', function(req, res) {
 res.send('This is a blog application');
});

//route to get all blogs.
app.get('/blogs', function(req, res) {
 blogModel.find(function(err, result) {
  if (err) {
   res.send(err)
  } else {
   res.send(result)
  }
 });
});

//route to create new blog.
app.post('/blog/create', middleware.checkLogin, function(req, res) {
 var newBlog = new blogModel({
  title: req.body.title,
  subTitle: req.body.subTitle,
  blogBody: req.body.blogBody,
  location: req.body.location
 });

 var today = new Date;
 newBlog.created = today;

 var allTags = (req.body.allTags != undefined && req.body.allTags != null) ? req.body.allTags.split(',') : '';
 newBlog.tags = allTags;

 var authorInfo = {
  fullName: req.body.authorFullName,
  email: req.body.auhorEmail
 };

 newBlog.authorInfo = authorInfo;

 newBlog.permalink = "/blogs/" + today.getYear() + "/" + today.getMonth() + "/" + req.body.title + ".html";

 newBlog.comments = "/comments/" + newBlog._id;

 newBlog.save(function(error) {
  if (error) {
   console.log(err);
   res.send(error);
  } else {
   res.send(newBlog);
  }
 });
});

//route to create new comment on a blog.
app.post('/comment/create/:blogId/', middleware.checkLogin, function(req, res) {
 var newComment = new commentModel({
  blogId: req.params.blogId,
  commentBody: req.body.commentBody,
  userName: req.body.userName
 });

 var today = Date.now();
 newComment.created = today;

 newComment.save(function(error) {
  if (error) {
   console.log(err);
   res.send(error);
  } else {
   res.send(newComment);
  }
 });

});

//route to get comments on particular blog
app.get('/comments/:blogId', function(req, res) {
 commentModel.find({
  'blogId': req.params.blogId
 }, function(err, result) {
  if (err) {
   res.send(err)
  } else {
   res.send(result)
  }
 });
});

//route to get single blog using blog id.
app.get('/blogs/:id', function(req, res) {
 blogModel.findOne({
  '_id': req.params.id
 }, function(err, result) {
  if (err) {
   console.loog("some error");
   res.send(err);
  } else {
   res.send(result);
  }
 });
});

//route to edit particular blog using blog id.
app.put('/blogs/:id/edit', middleware.checkLogin, function(req, res) {
 var update = req.body;
 var today = new Date;
 update.lastModified = today;
 blogModel.findOneAndUpdate({'_id': req.params.id}, update, {new: true, upsert: true}, function(err, result) {
  if (err) {
   console.log("some error");
   res.send(err);
  } else {
   res.send(result);
  }
 });
});

//route to delete particular blog using blod id.
app.post('/blogs/:id/delete', middleware.checkLogin, function(req, res) {
 blogModel.remove({'_id': req.params.id}, function(err, result) {
  if (err) {
   console.log("some error");
   res.send(err)
  } else {
   res.send(result)
  }
 });
});

app.get('*', function(res, res, next) {
 res.status = 404;
 next("path not found");
});

//routes end


//error handler middleware
app.use(function(err, req, res, next) {
 console.log("error handler was used.");
 if (res.status == 404) {
  res.send("I have not created this page.")
 } else {
  res.send(err);
  console.log(err)
 }
});

app.listen(3000, function() {
 console.log('Blog app listening on port 3000');
});