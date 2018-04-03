var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	blogId : {type:String,default:''},
	commentBody : {type:String,required:true,default:''},
	created : {type:Date,default:null},
	userName : {type:String,required:true,default:''}
});

mongoose.model('Comment',commentSchema);