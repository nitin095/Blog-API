var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
	title  : {type:String,default:'',required:true},
	subTitle : {type:String,default:''},
	blogBody : {type:String,default:''},
	tags : [],
	location : {type:String,default:''},
	permalink : {type:String,default:''},
	created : {type:Date,default:null},
	lastModified : {type:Date,default:null},
	authorInfo : {},
	comments : {type:String,default:''}
});

mongoose.model('Blog',blogSchema);