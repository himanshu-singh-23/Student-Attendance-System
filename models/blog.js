var db=require('mongoose'),
	comments=require('./comments'),
	replys=require('./reply');
var blogSchema=new db.Schema({
	title:String,
	date:{type:Date,default:Date.now},
	content:String,
	author:{
		type:db.Schema.Types.ObjectId,
		ref:'user'
	},
	comments:[{
		type:db.Schema.Types.ObjectId,
		ref:'comment'
	}],
	imgUri:String,
	likes:{type:Number,default:0},
	likedby:[{
		type:db.Schema.Types.ObjectId,
		ref:'user'
	}],
	tags:[{type:String}]
});

module.exports=db.model('blog',blogSchema);