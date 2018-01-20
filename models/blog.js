var db=require('mongoose');

var blogSchema=new db.Schema({
	// title:String,
	date:{type:Date,default:Date.now},
	// content:String,
	img: { data: Buffer, contentType: String },
	// author:{
	// 	type:db.Schema.Types.ObjectId,
	// 	ref:'user'
	// }
});

module.exports=db.model('blog',blogSchema);